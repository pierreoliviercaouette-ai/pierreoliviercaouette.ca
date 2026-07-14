import {
  FUND_CATALOG,
  getProfileHoldingsResolved,
  PORTFOLIO_PROFILE_LIST,
} from '../data/portfolioProfiles';
import { wealthSeriesForSnapshot } from './portfolioGrowth';
import { parseFundFichePdf } from './portfolioFicheParse';
import { loadPortfolioFundPerfMap } from './portfolioFundPerf';

const STORAGE_BUCKET = 'fund-fiches';

function publicUrlForPath(supabase, path) {
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data?.publicUrl || null;
}

/**
 * Upload PDF + upsert calendar returns on fund metadata.
 */
export async function applyFundFicheImports(supabase, files) {
  const results = [];
  let fundsUpdated = 0;
  const errors = [];

  for (const file of files) {
    try {
      const parsed = await parseFundFichePdf(file);
      if (!parsed.ok) {
        errors.push(`${file.name}: ${parsed.error}`);
        results.push({ filename: file.name, ok: false, error: parsed.error });
        continue;
      }

      const fuCode = parsed.fuCode;
      const storagePath = `${fuCode}.pdf`;
      const pdfBlob =
        file instanceof Blob
          ? file
          : new Blob([await file.arrayBuffer()], { type: 'application/pdf' });

      let uploadError = null;
      const uploadOpts = {
        contentType: 'application/pdf',
        cacheControl: '3600',
      };
      const first = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, pdfBlob, { ...uploadOpts, upsert: true });
      uploadError = first.error;
      // Repli : supprimer puis re-uploader (si policy upsert/update absente)
      if (uploadError) {
        await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
        const second = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(storagePath, pdfBlob, { ...uploadOpts, upsert: false });
        uploadError = second.error;
      }

      if (uploadError) {
        // Bucket manquant / RLS : on sauvegarde quand même les rendements année civile
        errors.push(`${fuCode}: stockage PDF — ${uploadError.message}`);
      }

      const fichePublicUrl = uploadError ? null : publicUrlForPath(supabase, storagePath);
      const catalogName = FUND_CATALOG[fuCode]?.name || fuCode;

      const { data: existing } = await supabase
        .from('funds')
        .select('id, name, metadata')
        .eq('external_code', fuCode)
        .maybeSingle();

      const prevMeta = existing?.metadata && typeof existing.metadata === 'object' ? existing.metadata : {};
      const metadata = {
        ...prevMeta,
        fiche_code: fuCode,
        calendar_returns: parsed.calendarReturns,
        calendar_series: parsed.seriesLabel || prevMeta.calendar_series || 'Classique 75/75',
        fiche_imported_at: new Date().toISOString(),
        fiche_filename: file.name,
        ...(fichePublicUrl
          ? { fiche_storage_path: storagePath, fiche_public_url: fichePublicUrl }
          : {}),
      };

      const payload = {
        external_code: fuCode,
        name: existing?.name || catalogName,
        source: 'fiche_pdf_import',
        is_active: true,
        metadata,
        updated_at: new Date().toISOString(),
      };

      let error;
      if (existing?.id) {
        ({ error } = await supabase.from('funds').update(payload).eq('id', existing.id));
      } else {
        ({ error } = await supabase.from('funds').insert(payload));
      }

      if (error) {
        errors.push(`${fuCode}: ${error.message}`);
        results.push({ filename: file.name, fuCode, ok: false, error: error.message });
        continue;
      }

      fundsUpdated += 1;
      results.push({
        filename: file.name,
        fuCode,
        ok: true,
        yearCount: parsed.yearCount,
        years: Object.keys(parsed.calendarReturns).sort(),
        seriesLabel: parsed.seriesLabel,
        pdfStored: !uploadError,
      });
    } catch (err) {
      const msg = err?.message || String(err);
      errors.push(`${file.name}: ${msg}`);
      results.push({ filename: file.name, ok: false, error: msg });
    }
  }

  // Rebuild wealth series snapshots for model portfolios
  let portfoliosUpdated = 0;
  try {
    const { perfByCode, asOfIso } = await loadPortfolioFundPerfMap(supabase);
    for (const profile of PORTFOLIO_PROFILE_LIST) {
      const holdings = getProfileHoldingsResolved(profile.key);
      const { wealth_series, growth_meta } = wealthSeriesForSnapshot(
        holdings,
        perfByCode,
        asOfIso
      );
      if (!wealth_series.length) continue;

      const { data: def } = await supabase
        .from('portfolio_definitions')
        .select('id')
        .eq('key', profile.key)
        .maybeSingle();
      if (!def?.id) continue;

      await supabase.from('portfolio_snapshots').insert({
        portfolio_definition_id: def.id,
        as_of_date: asOfIso || new Date().toISOString().slice(0, 10),
        wealth_series,
        meta: {
          source: 'fiche_calendar_year',
          growth: growth_meta,
        },
      });
      portfoliosUpdated += 1;
    }
  } catch (err) {
    errors.push(`Snapshots: ${err?.message || err}`);
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from('portfolio_import_logs').insert({
      imported_by: user?.id || null,
      filename: files.map((f) => f.name).join(', ').slice(0, 240),
      as_of_date: new Date().toISOString().slice(0, 10),
      funds_parsed: files.length,
      funds_updated: fundsUpdated,
      portfolios_updated: portfoliosUpdated,
      missing_codes: [],
      warnings: errors,
      meta: { source: 'fiche_pdf_import', results },
    });
  } catch {
    // migration 011 absente — non bloquant
  }

  return { fundsUpdated, portfoliosUpdated, results, errors };
}

export { STORAGE_BUCKET as FUND_FICHES_BUCKET };

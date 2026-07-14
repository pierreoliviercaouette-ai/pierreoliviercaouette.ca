import {
  FUND_CATALOG,
  normalizeFundExternalCode,
  PORTFOLIO_PROFILE_LIST,
  getProfileHoldingsResolved,
} from '../data/portfolioProfiles';

function stripHtml(value) {
  return String(value || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parsePct(raw) {
  if (raw === null || raw === undefined) return null;
  const cleaned = String(raw).replace(/\*/g, '').replace('%', '').replace(',', '.').replace(/−/g, '-').trim();
  if (!cleaned || cleaned === '-' || cleaned === '—') return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/** Minimal CSV line parser respecting quotes */
function parseCsvLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      cells.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current);
  return cells;
}

/**
 * Parse iA performance-fonds CSV into fund rows keyed by FUxxx.
 */
export function parsePerformanceFundsCsv(text) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter((l) => l.trim().length);
  if (lines.length < 2) {
    throw new Error('Fichier CSV vide ou invalide');
  }

  const header = parseCsvLine(lines[0]).map((h) => stripHtml(h).toLowerCase());
  const idx = (candidates) => {
    for (const c of candidates) {
      const i = header.findIndex((h) => h.includes(c));
      if (i >= 0) return i;
    }
    return -1;
  };

  const iFonds = idx(['fonds']);
  const iCode = idx(['code']);
  const iNav = idx(['valeur unitaire', 'nav']);
  const iYtd = idx(['début de l', 'debut de l', 'depuis le début']);
  const iPrev = idx(['année précédente', 'annee precedente']);
  const i1m = idx(['1 mois']);
  const i3m = idx(['3 mois']);
  const i6m = idx(['6 mois']);
  const i1y = idx(['1 an']);
  const i3y = idx(['3 ans']);
  const i5y = idx(['5 ans']);
  const i10y = idx(['10 ans']);
  const iCat = idx(['catégorie de fonds', 'categorie de fonds']);

  if (iCode < 0 || iYtd < 0) {
    throw new Error('Colonnes Code / rendement AAJ introuvables dans le CSV');
  }

  const funds = [];
  const warnings = [];

  for (let r = 1; r < lines.length; r += 1) {
    const cells = parseCsvLine(lines[r]);
    if (cells.length < 2) continue;
    const fuCode = normalizeFundExternalCode(cells[iCode]);
    if (!fuCode) {
      warnings.push(`Ligne ${r + 1}: code fonds non reconnu (${cells[iCode]})`);
      continue;
    }
    const name = stripHtml(cells[iFonds] || FUND_CATALOG[fuCode]?.name || fuCode);
    funds.push({
      externalCode: fuCode,
      name,
      category: iCat >= 0 ? stripHtml(cells[iCat]) : FUND_CATALOG[fuCode]?.category || null,
      nav: iNav >= 0 ? parsePct(cells[iNav]) : null,
      ytdPct: parsePct(cells[iYtd]),
      prevYearPct: iPrev >= 0 ? parsePct(cells[iPrev]) : null,
      oneMonthPct: i1m >= 0 ? parsePct(cells[i1m]) : null,
      threeMonthPct: i3m >= 0 ? parsePct(cells[i3m]) : null,
      sixMonthPct: i6m >= 0 ? parsePct(cells[i6m]) : null,
      oneYearPct: i1y >= 0 ? parsePct(cells[i1y]) : null,
      threeYearPct: i3y >= 0 ? parsePct(cells[i3y]) : null,
      fiveYearPct: i5y >= 0 ? parsePct(cells[i5y]) : null,
      tenYearPct: i10y >= 0 ? parsePct(cells[i10y]) : null,
    });
  }

  if (!funds.length) {
    throw new Error('Aucun fonds valide trouvé dans le CSV');
  }

  return { funds, warnings };
}

/** Extract as_of ISO date from filename performance-fonds-2026_07_13... */
export function asOfDateFromFilename(filename) {
  const m = String(filename || '').match(/(\d{4})[_-](\d{2})[_-](\d{2})/);
  if (!m) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

function weightedAvg(holdings, perfByCode, field) {
  let sumW = 0;
  let sum = 0;
  const missing = [];
  for (const h of holdings) {
    const perf = perfByCode[h.fuCode];
    const val = perf?.[field];
    if (val === null || val === undefined || Number.isNaN(Number(val))) {
      missing.push(h.fuCode || h.illustrationCode);
      continue;
    }
    sum += Number(val) * Number(h.weightPct);
    sumW += Number(h.weightPct);
  }
  if (sumW <= 0) return { value: null, missing };
  return { value: Math.round((sum / sumW) * 100) / 100, missing };
}

/**
 * Recalculate portfolio KPIs as weighted averages of fund returns.
 */
export function recalculatePortfoliosFromFundPerf(fundRows) {
  const perfByCode = {};
  for (const f of fundRows) {
    perfByCode[f.externalCode] = f;
  }

  const results = [];
  const allMissing = new Set();

  for (const profile of PORTFOLIO_PROFILE_LIST) {
    const holdings = getProfileHoldingsResolved(profile.key);
    const ytd = weightedAvg(holdings, perfByCode, 'ytdPct');
    const prev = weightedAvg(holdings, perfByCode, 'prevYearPct');
    const y3 = weightedAvg(holdings, perfByCode, 'threeYearPct');
    const y5 = weightedAvg(holdings, perfByCode, 'fiveYearPct');
    ytd.missing.forEach((c) => allMissing.add(c));
    prev.missing.forEach((c) => allMissing.add(c));

    results.push({
      key: profile.key,
      name: profile.name,
      ytdPct: ytd.value,
      prevYearPct: prev.value,
      annualized3y: y3.value,
      annualized5y: y5.value,
      missingCodes: [...new Set([...ytd.missing, ...prev.missing, ...y3.missing, ...y5.missing])],
    });
  }

  return { portfolios: results, missingCodes: [...allMissing] };
}

/**
 * Upsert fund performances + sync model_portfolios via Supabase (admin session).
 */
export async function applyPerformanceCsvImport(supabase, { funds, asOfDate }) {
  let fundsUpdated = 0;
  const fundErrors = [];

  for (const fund of funds) {
    const payload = {
      external_code: fund.externalCode,
      name: fund.name,
      category: fund.category,
      source: 'csv_import',
      is_active: true,
      ytd_pct: fund.ytdPct,
      prev_year_pct: fund.prevYearPct,
      one_year_pct: fund.oneYearPct,
      three_year_pct: fund.threeYearPct,
      five_year_pct: fund.fiveYearPct,
      ten_year_pct: fund.tenYearPct,
      nav: fund.nav,
      perf_as_of: asOfDate,
      metadata: {
        ...(FUND_CATALOG[fund.externalCode]?.fichePath
          ? { fiche: FUND_CATALOG[fund.externalCode].fichePath }
          : {}),
        one_month_pct: fund.oneMonthPct,
        three_month_pct: fund.threeMonthPct,
        six_month_pct: fund.sixMonthPct,
      },
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabase
      .from('funds')
      .select('id')
      .eq('external_code', fund.externalCode)
      .maybeSingle();

    let error;
    if (existing?.id) {
      ({ error } = await supabase.from('funds').update(payload).eq('id', existing.id));
    } else {
      ({ error } = await supabase.from('funds').insert(payload));
    }

    if (error) {
      // Colonnes perf absentes (migration 009 non appliquée) → metadata only
      const fallback = {
        external_code: fund.externalCode,
        name: fund.name,
        category: fund.category,
        source: 'csv_import',
        is_active: true,
        metadata: {
          ytd_pct: fund.ytdPct,
          prev_year_pct: fund.prevYearPct,
          one_year_pct: fund.oneYearPct,
          three_year_pct: fund.threeYearPct,
          five_year_pct: fund.fiveYearPct,
          ten_year_pct: fund.tenYearPct,
          nav: fund.nav,
          perf_as_of: asOfDate,
          fiche: FUND_CATALOG[fund.externalCode]?.fichePath || null,
        },
        updated_at: new Date().toISOString(),
      };
      if (existing?.id) {
        ({ error } = await supabase.from('funds').update(fallback).eq('id', existing.id));
      } else {
        ({ error } = await supabase.from('funds').insert(fallback));
      }
      if (error) {
        fundErrors.push(`${fund.externalCode}: ${error.message}`);
        continue;
      }
    }
    fundsUpdated += 1;
  }

  const { portfolios, missingCodes } = recalculatePortfoliosFromFundPerf(funds);
  let portfoliosUpdated = 0;
  const portfolioErrors = [];

  for (const p of portfolios) {
    if (p.ytdPct === null && p.prevYearPct === null) {
      portfolioErrors.push(`${p.key}: rendements insuffisants pour recalcul`);
      continue;
    }
    const update = {
      ytd_2026: p.ytdPct ?? 0,
      year_2025: p.prevYearPct ?? 0,
      annualized_3y: p.annualized3y ?? 0,
      annualized_5y: p.annualized5y ?? 0,
      as_of_date: asOfDate,
    };
    const { error } = await supabase.from('model_portfolios').update(update).eq('key', p.key);
    if (error) {
      portfolioErrors.push(`${p.key}: ${error.message}`);
      continue;
    }
    portfoliosUpdated += 1;

    // Best-effort snapshot insert
    const { data: def } = await supabase
      .from('portfolio_definitions')
      .select('id')
      .eq('key', p.key)
      .maybeSingle();
    if (def?.id) {
      await supabase.from('portfolio_snapshots').insert({
        portfolio_definition_id: def.id,
        as_of_date: asOfDate,
        ytd_pct: p.ytdPct,
        prev_civil_year: asOfDate ? Number(asOfDate.slice(0, 4)) - 1 : new Date().getFullYear() - 1,
        prev_civil_year_pct: p.prevYearPct,
        rolling_3y_pct: p.annualized3y,
        rolling_5y_pct: p.annualized5y,
        meta: { source: 'csv_weighted', missing_codes: p.missingCodes },
      });
    }
  }

  return {
    fundsUpdated,
    portfoliosUpdated,
    portfolios,
    missingCodes,
    fundErrors,
    portfolioErrors,
  };
}

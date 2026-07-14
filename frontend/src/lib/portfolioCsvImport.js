import {
  FUND_CATALOG,
  normalizeFundExternalCode,
  PORTFOLIO_PROFILE_LIST,
  getProfileHoldingsResolved,
} from '../data/portfolioProfiles';
import { wealthSeriesForSnapshot } from './portfolioGrowth';
import { PORTFOLIO_CALENDAR_RETURNS_DEFAULTS } from '../data/portfolioCalendarReturnsDefaults';

function stripHtml(value) {
  return String(value || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parsePct(raw) {
  if (raw === null || raw === undefined) return { value: null, incomplete: false };
  const original = String(raw);
  const incomplete = original.includes('*');
  const cleaned = original.replace(/\*/g, '').replace('%', '').replace(',', '.').replace(/−/g, '-').trim();
  if (!cleaned || cleaned === '-' || cleaned === '—') return { value: null, incomplete };
  const n = Number(cleaned);
  return { value: Number.isFinite(n) ? n : null, incomplete };
}

function pctValue(raw) {
  return parsePct(raw).value;
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
    const ytd = parsePct(cells[iYtd]);
    const prev = iPrev >= 0 ? parsePct(cells[iPrev]) : { value: null, incomplete: false };
    const oneMonth = i1m >= 0 ? parsePct(cells[i1m]) : { value: null, incomplete: false };
    const threeMonth = i3m >= 0 ? parsePct(cells[i3m]) : { value: null, incomplete: false };
    const sixMonth = i6m >= 0 ? parsePct(cells[i6m]) : { value: null, incomplete: false };
    const oneYear = i1y >= 0 ? parsePct(cells[i1y]) : { value: null, incomplete: false };
    const threeYear = i3y >= 0 ? parsePct(cells[i3y]) : { value: null, incomplete: false };
    const fiveYear = i5y >= 0 ? parsePct(cells[i5y]) : { value: null, incomplete: false };
    const tenYear = i10y >= 0 ? parsePct(cells[i10y]) : { value: null, incomplete: false };
    const incompleteFields = [];
    if (ytd.incomplete) incompleteFields.push('ytdPct');
    if (prev.incomplete) incompleteFields.push('prevYearPct');
    if (oneMonth.incomplete) incompleteFields.push('oneMonthPct');
    if (threeMonth.incomplete) incompleteFields.push('threeMonthPct');
    if (sixMonth.incomplete) incompleteFields.push('sixMonthPct');
    if (oneYear.incomplete) incompleteFields.push('oneYearPct');
    if (threeYear.incomplete) incompleteFields.push('threeYearPct');
    if (fiveYear.incomplete) incompleteFields.push('fiveYearPct');
    if (tenYear.incomplete) incompleteFields.push('tenYearPct');

    funds.push({
      externalCode: fuCode,
      name,
      category: iCat >= 0 ? stripHtml(cells[iCat]) : FUND_CATALOG[fuCode]?.category || null,
      nav: iNav >= 0 ? pctValue(cells[iNav]) : null,
      ytdPct: ytd.value,
      prevYearPct: prev.value,
      oneMonthPct: oneMonth.value,
      threeMonthPct: threeMonth.value,
      sixMonthPct: sixMonth.value,
      oneYearPct: oneYear.value,
      threeYearPct: threeYear.value,
      fiveYearPct: fiveYear.value,
      tenYearPct: tenYear.value,
      incompleteFields,
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
  let anyIncompleteHistory = false;
  const totalW = holdings.reduce((acc, h) => acc + Number(h.weightPct || 0), 0);
  for (const h of holdings) {
    const perf = perfByCode[h.fuCode];
    if (Array.isArray(perf?.incompleteFields) && perf.incompleteFields.includes(field)) {
      anyIncompleteHistory = true;
    }
    const val = perf?.[field];
    if (val === null || val === undefined || Number.isNaN(Number(val))) {
      missing.push(h.fuCode || h.illustrationCode);
      continue;
    }
    sum += Number(val) * Number(h.weightPct);
    sumW += Number(h.weightPct);
  }
  if (sumW <= 0) {
    return {
      value: null,
      missing,
      incomplete: anyIncompleteHistory || missing.length > 0 || totalW > 0,
    };
  }
  const incomplete =
    anyIncompleteHistory || missing.length > 0 || (totalW > 0 && sumW < totalW - 0.01);
  return { value: Math.round((sum / sumW) * 100) / 100, missing, incomplete };
}

/**
 * Moyenne pondérée pour toutes les périodes d’un portefeuille (source unique d’affichage).
 * @param {Array} holdings - holdings résolus (fuCode, weightPct)
 * @param {Record<string, object>} perfByCode - perf indexée par FUxxx
 */
export function computeWeightedPeriodReturns(holdings, perfByCode) {
  const fields = [
    ['oneMonth', 'oneMonthPct'],
    ['threeMonth', 'threeMonthPct'],
    ['sixMonth', 'sixMonthPct'],
    ['ytd', 'ytdPct'],
    ['prevYear', 'prevYearPct'],
    ['oneYear', 'oneYearPct'],
    ['threeYear', 'threeYearPct'],
    ['fiveYear', 'fiveYearPct'],
    ['tenYear', 'tenYearPct'],
  ];
  const periodReturns = {};
  const missingByPeriod = {};
  const incompleteByPeriod = {};
  for (const [outKey, field] of fields) {
    const { value, missing, incomplete } = weightedAvg(holdings, perfByCode, field);
    periodReturns[outKey] = value;
    if (missing.length) missingByPeriod[outKey] = missing;
    if (incomplete) incompleteByPeriod[outKey] = true;
  }
  return { periodReturns, missingByPeriod, incompleteByPeriod };
}

/**
 * Recalculate portfolio KPIs as weighted averages of fund returns.
 */
export function recalculatePortfoliosFromFundPerf(fundRows) {
  const perfByCode = {};
  for (const f of fundRows) {
    perfByCode[f.externalCode || f.fuCode] = f;
  }

  const results = [];
  const allMissing = new Set();

  for (const profile of PORTFOLIO_PROFILE_LIST) {
    const holdings = getProfileHoldingsResolved(profile.key);
    const { periodReturns, missingByPeriod, incompleteByPeriod } = computeWeightedPeriodReturns(
      holdings,
      perfByCode
    );
    Object.values(missingByPeriod).forEach((codes) => codes.forEach((c) => allMissing.add(c)));

    results.push({
      key: profile.key,
      name: profile.name,
      ytdPct: periodReturns.ytd,
      prevYearPct: periodReturns.prevYear,
      annualized3y: periodReturns.threeYear,
      annualized5y: periodReturns.fiveYear,
      periodReturns,
      incompleteByPeriod,
      missingCodes: [
        ...new Set(
          Object.values(missingByPeriod)
            .flat()
            .filter(Boolean)
        ),
      ],
    });
  }

  return { portfolios: results, missingCodes: [...allMissing] };
}

/**
 * Upsert fund performances + sync model_portfolios via Supabase (admin session).
 */
export async function applyPerformanceCsvImport(supabase, { funds, asOfDate, filename }) {
  let fundsUpdated = 0;
  const fundErrors = [];

  for (const fund of funds) {
    const { data: existing } = await supabase
      .from('funds')
      .select('id, metadata')
      .eq('external_code', fund.externalCode)
      .maybeSingle();

    const prevMeta =
      existing?.metadata && typeof existing.metadata === 'object' ? existing.metadata : {};

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
        ...prevMeta,
        ...(FUND_CATALOG[fund.externalCode]?.hasFiche
          ? { fiche_code: fund.externalCode }
          : {}),
        one_month_pct: fund.oneMonthPct,
        three_month_pct: fund.threeMonthPct,
        six_month_pct: fund.sixMonthPct,
        incomplete_fields: fund.incompleteFields || [],
        perf_as_of: asOfDate,
        // conserver calendar_returns / fiche_* déjà importés
      },
      updated_at: new Date().toISOString(),
    };

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
          ...prevMeta,
          ytd_pct: fund.ytdPct,
          prev_year_pct: fund.prevYearPct,
          one_year_pct: fund.oneYearPct,
          three_year_pct: fund.threeYearPct,
          five_year_pct: fund.fiveYearPct,
          ten_year_pct: fund.tenYearPct,
          one_month_pct: fund.oneMonthPct,
          three_month_pct: fund.threeMonthPct,
          six_month_pct: fund.sixMonthPct,
          nav: fund.nav,
          perf_as_of: asOfDate,
          fiche_code: FUND_CATALOG[fund.externalCode]?.hasFiche ? fund.externalCode : null,
          incomplete_fields: fund.incompleteFields || [],
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

  // Perf + calendrier fiches pour la courbe (évite d’écraser les années civiles)
  const codes = funds.map((f) => f.externalCode);
  const { data: fundRowsForGrowth } = await supabase
    .from('funds')
    .select('external_code, ytd_pct, metadata')
    .in('external_code', codes);
  const calByCode = Object.fromEntries(
    (fundRowsForGrowth || []).map((row) => [
      row.external_code,
      row.metadata?.calendar_returns || PORTFOLIO_CALENDAR_RETURNS_DEFAULTS[row.external_code] || null,
    ])
  );
  const perfByCodeForGrowth = {};
  for (const f of funds) {
    perfByCodeForGrowth[f.externalCode] = {
      ...f,
      calendarReturns: calByCode[f.externalCode] || PORTFOLIO_CALENDAR_RETURNS_DEFAULTS[f.externalCode] || null,
    };
  }

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
      const holdings = getProfileHoldingsResolved(p.key);
      const { wealth_series, growth_meta } = wealthSeriesForSnapshot(
        holdings,
        perfByCodeForGrowth,
        asOfDate
      );
      await supabase.from('portfolio_snapshots').insert({
        portfolio_definition_id: def.id,
        as_of_date: asOfDate,
        ytd_pct: p.ytdPct,
        prev_civil_year: asOfDate ? Number(asOfDate.slice(0, 4)) - 1 : new Date().getFullYear() - 1,
        prev_civil_year_pct: p.prevYearPct,
        rolling_3y_pct: p.annualized3y,
        rolling_5y_pct: p.annualized5y,
        wealth_series,
        meta: {
          source: 'csv_weighted',
          missing_codes: p.missingCodes,
          growth: growth_meta,
        },
      });
    }
  }

  let importLogId = null;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: logRow, error: logError } = await supabase
      .from('portfolio_import_logs')
      .insert({
        imported_by: user?.id || null,
        filename: filename || null,
        as_of_date: asOfDate,
        funds_parsed: funds.length,
        funds_updated: fundsUpdated,
        portfolios_updated: portfoliosUpdated,
        missing_codes: missingCodes || [],
        warnings: [...fundErrors, ...portfolioErrors],
        meta: { source: 'csv_import' },
      })
      .select('id')
      .maybeSingle();
    if (!logError) importLogId = logRow?.id || null;
  } catch {
    // table absente (migration 011) — non bloquant
  }

  return {
    fundsUpdated,
    portfoliosUpdated,
    portfolios,
    missingCodes,
    fundErrors,
    portfolioErrors,
    importLogId,
  };
}

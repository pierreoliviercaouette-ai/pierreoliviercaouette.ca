import {
  DEFAULT_FUND_PERFORMANCE,
  PORTFOLIO_PROFILE_LIST,
  getDefaultFundPerformance,
  getProfileHoldingsResolved,
} from '../data/portfolioProfiles';
import { computeWeightedPeriodReturns } from './portfolioCsvImport';

function pickPerfField(row, meta, column, metaKey) {
  if (row?.[column] != null && row[column] !== '') return Number(row[column]);
  if (meta?.[metaKey] != null && meta[metaKey] !== '') return Number(meta[metaKey]);
  return null;
}

export function getAllPortfolioFundCodes() {
  const codes = new Set();
  for (const profile of PORTFOLIO_PROFILE_LIST) {
    for (const h of getProfileHoldingsResolved(profile.key)) {
      if (h.fuCode) codes.add(h.fuCode);
    }
  }
  return [...codes];
}

/** Seed perf map from packaged defaults (admin offline fallback). */
export function buildDefaultFundPerfByCode(codes = getAllPortfolioFundCodes()) {
  const perfByCode = {};
  for (const code of codes) {
    const defaults = getDefaultFundPerformance(code) || DEFAULT_FUND_PERFORMANCE[code];
    if (defaults) perfByCode[code] = { ...defaults };
  }
  return perfByCode;
}

/**
 * Merge Supabase fund rows into a perf map (defaults already applied).
 */
export function mergeFundRowsIntoPerfMap(perfByCode, fundRows) {
  const next = { ...perfByCode };
  for (const row of fundRows || []) {
    const meta = row.metadata || {};
    const defaults = getDefaultFundPerformance(row.external_code) || {};
    const incompleteFields = Array.isArray(meta.incomplete_fields)
      ? meta.incomplete_fields
      : defaults.incompleteFields || [];
    next[row.external_code] = {
      ytdPct: pickPerfField(row, meta, 'ytd_pct', 'ytd_pct') ?? defaults.ytdPct ?? null,
      prevYearPct:
        pickPerfField(row, meta, 'prev_year_pct', 'prev_year_pct') ?? defaults.prevYearPct ?? null,
      oneMonthPct: pickPerfField(row, meta, null, 'one_month_pct') ?? defaults.oneMonthPct ?? null,
      threeMonthPct:
        pickPerfField(row, meta, null, 'three_month_pct') ?? defaults.threeMonthPct ?? null,
      sixMonthPct: pickPerfField(row, meta, null, 'six_month_pct') ?? defaults.sixMonthPct ?? null,
      oneYearPct: pickPerfField(row, meta, 'one_year_pct', 'one_year_pct') ?? defaults.oneYearPct ?? null,
      threeYearPct:
        pickPerfField(row, meta, 'three_year_pct', 'three_year_pct') ?? defaults.threeYearPct ?? null,
      fiveYearPct:
        pickPerfField(row, meta, 'five_year_pct', 'five_year_pct') ?? defaults.fiveYearPct ?? null,
      tenYearPct: pickPerfField(row, meta, 'ten_year_pct', 'ten_year_pct') ?? defaults.tenYearPct ?? null,
      incompleteFields,
      perfAsOf: meta.perf_as_of || row.perf_as_of || null,
    };
  }
  return next;
}

/**
 * Load fund performances for all model portfolios (admin session + RLS).
 */
export async function loadPortfolioFundPerfMap(supabase) {
  const codes = getAllPortfolioFundCodes();
  let perfByCode = buildDefaultFundPerfByCode(codes);
  let asOfIso = null;

  if (!codes.length || !supabase) {
    return { perfByCode, asOfIso, codes };
  }

  const { data: fundRows } = await supabase
    .from('funds')
    .select(
      'external_code, ytd_pct, prev_year_pct, one_year_pct, three_year_pct, five_year_pct, ten_year_pct, perf_as_of, metadata'
    )
    .in('external_code', codes);

  if (fundRows?.length) {
    perfByCode = mergeFundRowsIntoPerfMap(perfByCode, fundRows);
    for (const row of fundRows) {
      const candidate = row.perf_as_of || row.metadata?.perf_as_of;
      if (candidate && (!asOfIso || String(candidate) > String(asOfIso))) {
        asOfIso = candidate;
      }
    }
  }

  const { data: mpRows } = await supabase
    .from('model_portfolios')
    .select('as_of_date')
    .order('display_order', { ascending: true })
    .limit(1);
  if (!asOfIso && mpRows?.[0]?.as_of_date) {
    asOfIso = mpRows[0].as_of_date;
  }

  return { perfByCode, asOfIso, codes };
}

/** Build display cards for all profiles from a fund perf map (source unique). */
export function buildWeightedPortfolioCards(perfByCode) {
  return PORTFOLIO_PROFILE_LIST.map((p) => {
    const holdings = getProfileHoldingsResolved(p.key);
    const { periodReturns, incompleteByPeriod } = computeWeightedPeriodReturns(holdings, perfByCode);
    return {
      key: p.key,
      name: p.name,
      href: p.href,
      ytd2026: periodReturns.ytd ?? p.defaults?.ytd ?? null,
      yearPrev: periodReturns.prevYear ?? p.defaults?.prevYear ?? null,
      annualized3y: periodReturns.threeYear ?? p.defaults?.annualized3y ?? null,
      annualized5y: periodReturns.fiveYear ?? p.defaults?.annualized5y ?? null,
      periodReturns,
      incompleteByPeriod,
      ytdIncomplete: Boolean(incompleteByPeriod?.ytd),
      prevIncomplete: Boolean(incompleteByPeriod?.prevYear),
    };
  });
}

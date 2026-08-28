import { PORTFOLIO_PROFILE_LIST, getProfileHoldingsResolved } from '../data/portfolioProfiles';
import {
  KNOWN_INCOMPLETE_FUND_FIELDS,
  getDefaultFundPerformance,
  resolveIncompleteFields,
} from '../data/portfolioFundPerfDefaults';
import { PORTFOLIO_CALENDAR_RETURNS_DEFAULTS } from '../data/portfolioCalendarReturnsDefaults';
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

/**
 * Merge Supabase fund rows into a perf map.
 * @param {Record<string, object>} perfByCode
 * @param {Array} fundRows
 * @param {object} [packagedDefaults] - admin-only optional defaults map
 */
export function mergeFundRowsIntoPerfMap(perfByCode, fundRows, packagedDefaults = {}) {
  const next = { ...perfByCode };
  for (const row of fundRows || []) {
    const meta = row.metadata || {};
    const defaults =
      packagedDefaults[row.external_code] || getDefaultFundPerformance(row.external_code) || {};
    const incompleteFields = resolveIncompleteFields(
      row.external_code,
      meta.incomplete_fields,
      defaults.incompleteFields
    );
    const calendarReturns =
      (meta.calendar_returns && Object.keys(meta.calendar_returns).length
        ? meta.calendar_returns
        : null) ||
      PORTFOLIO_CALENDAR_RETURNS_DEFAULTS[row.external_code] ||
      null;

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
      calendarReturns,
      fichePublicUrl: meta.fiche_public_url || null,
    };
  }
  return ensureIncompleteFlagsOnPerfMap(next);
}

/**
 * Union incomplete flags from CSV metadata, defaults and known iA asterisk periods.
 */
export function ensureIncompleteFlagsOnPerfMap(perfByCode) {
  const next = { ...perfByCode };
  for (const code of Object.keys(KNOWN_INCOMPLETE_FUND_FIELDS)) {
    if (!next[code]) continue;
    next[code] = {
      ...next[code],
      incompleteFields: resolveIncompleteFields(
        code,
        next[code].incompleteFields,
        getDefaultFundPerformance(code)?.incompleteFields
      ),
    };
  }
  return next;
}

/**
 * Load fund performances for model portfolios from Supabase (public or admin).
 * No packaged CSV defaults on the public path — missing data shows as em-dash.
 */
export async function loadPortfolioFundPerfMap(supabase) {
  const codes = getAllPortfolioFundCodes();
  let perfByCode = {};
  let asOfIso = null;
  let loadError = null;

  if (!codes.length || !supabase) {
    return { perfByCode, asOfIso, codes, loadError: 'no_codes' };
  }

  const { data: fundRows, error: fundError } = await supabase
    .from('funds')
    .select(
      'external_code, ytd_pct, prev_year_pct, one_year_pct, three_year_pct, five_year_pct, ten_year_pct, perf_as_of, metadata'
    )
    .in('external_code', codes);

  if (fundError) {
    loadError = fundError.message;
  }

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
    .select('key, name, ytd_2026, year_2025, annualized_3y, annualized_5y, href, as_of_date')
    .order('display_order', { ascending: true });

  if (!asOfIso && mpRows?.[0]?.as_of_date) {
    asOfIso = mpRows[0].as_of_date;
  }

  return { perfByCode, asOfIso, codes, modelPortfolioRows: mpRows || [], loadError };
}

/**
 * KPI sync model_portfolios — RPC public (017) puis select direct.
 * @returns {Promise<{ rows: object[], asOfIso: string|null, error: string|null }>}
 */
export async function loadModelPortfolioKpiRows(supabaseClient) {
  if (!supabaseClient) {
    return { rows: [], asOfIso: null, error: 'no_client' };
  }

  const { data: rpcRows, error: rpcError } = await supabaseClient.rpc(
    'get_public_model_portfolio_kpis'
  );

  if (!rpcError && rpcRows?.length) {
    const asOfIso = rpcRows.find((r) => r.as_of_date)?.as_of_date ?? null;
    return { rows: rpcRows, asOfIso, error: null };
  }

  const { data: rows, error } = await supabaseClient
    .from('model_portfolios')
    .select('key, name, ytd_2026, year_2025, annualized_3y, annualized_5y, href, as_of_date')
    .order('display_order', { ascending: true });

  if (error) {
    return { rows: [], asOfIso: null, error: error.message };
  }

  const asOfIso = rows?.find((r) => r.as_of_date)?.as_of_date ?? null;
  return { rows: rows || [], asOfIso, error: rpcError?.message || null };
}

/** KPI affiché : valeurs sync `model_portfolios` prioritaires sur la pondération fonds. */
export function resolveSyncedPortfolioKpi(syncedValue, weightedValue) {
  if (syncedValue != null && syncedValue !== '') return Number(syncedValue);
  return weightedValue ?? null;
}

/** Build display cards from fund perf map; optional model_portfolios rows as KPI fallback. */
export function buildWeightedPortfolioCards(perfByCode, modelPortfolioRows = []) {
  const byKey = Object.fromEntries((modelPortfolioRows || []).map((r) => [r.key, r]));

  return PORTFOLIO_PROFILE_LIST.map((p) => {
    const holdings = getProfileHoldingsResolved(p.key);
    const { periodReturns, incompleteByPeriod } = computeWeightedPeriodReturns(holdings, perfByCode);
    const legacy = byKey[p.key];
    return {
      key: p.key,
      name: legacy?.name || p.name,
      href: legacy?.href || p.href,
      ytd2026: resolveSyncedPortfolioKpi(legacy?.ytd_2026, periodReturns.ytd),
      yearPrev: resolveSyncedPortfolioKpi(legacy?.year_2025, periodReturns.prevYear),
      annualized3y: resolveSyncedPortfolioKpi(legacy?.annualized_3y, periodReturns.threeYear),
      annualized5y: resolveSyncedPortfolioKpi(legacy?.annualized_5y, periodReturns.fiveYear),
      periodReturns,
      incompleteByPeriod,
      ytdIncomplete: Boolean(incompleteByPeriod?.ytd),
      prevIncomplete: Boolean(incompleteByPeriod?.prevYear),
    };
  });
}

/** Perf map depuis defaults packaged (même pondération que /portefeuilles hors-ligne). */
export function buildPackagedPerfByCode() {
  const codes = getAllPortfolioFundCodes();
  const fakeRows = codes
    .filter((code) => getDefaultFundPerformance(code))
    .map((external_code) => ({ external_code, metadata: {} }));
  return mergeFundRowsIntoPerfMap({}, fakeRows);
}

/** Empty placeholder cards while loading (no packaged returns). */
export function buildEmptyPortfolioCards() {
  return PORTFOLIO_PROFILE_LIST.map((p) => ({
    key: p.key,
    name: p.name,
    href: p.href,
    ytd2026: null,
    yearPrev: null,
    annualized3y: null,
    annualized5y: null,
    periodReturns: {},
    incompleteByPeriod: {},
    ytdIncomplete: false,
    prevIncomplete: false,
  }));
}

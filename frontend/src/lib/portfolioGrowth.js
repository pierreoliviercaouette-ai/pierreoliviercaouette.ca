/**
 * Courbe de croissance à partir des rendements **année civile** des fiches de fonds
 * (Série Classique 75/75), pondérés selon les poids du portefeuille.
 *
 * Rééquilibrage annuel aux poids cibles. Point de départ : 31 déc. de l’année
 * précédant la première année civile disponible. Point YTD optionnel si
 * rendement AAJ CSV présent après la dernière année civile.
 */

import { PORTFOLIO_CALENDAR_RETURNS_DEFAULTS } from '../data/portfolioCalendarReturnsDefaults';

const PRINCIPAL_CAD = 100000;
const MIN_COVERAGE = 0.95;

function parseAsOfParts(asOfIso) {
  if (asOfIso && /^\d{4}-\d{2}-\d{2}$/.test(asOfIso)) {
    const [y, m, d] = asOfIso.split('-').map(Number);
    return { year: y, month: m, day: d, iso: asOfIso };
  }
  const now = new Date();
  const iso = now.toISOString().slice(0, 10);
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate(), iso };
}

function calendarMapForFund(fuCode, perf) {
  const fromPerf = perf?.calendarReturns;
  if (fromPerf && Object.keys(fromPerf).length) return fromPerf;
  return PORTFOLIO_CALENDAR_RETURNS_DEFAULTS[fuCode] || null;
}

function yearReturn(calendarMap, year) {
  const entry = calendarMap?.[String(year)];
  if (!entry || entry.value == null || !Number.isFinite(Number(entry.value))) return null;
  return { value: Number(entry.value), incomplete: Boolean(entry.incomplete) };
}

/**
 * Rendement portefeuille pondéré pour une année civile (rééquilibrage).
 */
function weightedCalendarReturn(holdings, perfByCode, year, totalW) {
  let coveredW = 0;
  let sum = 0;
  let incomplete = false;
  const missing = [];

  for (const h of holdings) {
    const w = Number(h.weightPct || 0);
    if (w <= 0) continue;
    const cal = calendarMapForFund(h.fuCode, perfByCode[h.fuCode]);
    const yr = yearReturn(cal, year);
    if (!yr) {
      missing.push(h.fuCode);
      continue;
    }
    if (yr.incomplete) incomplete = true;
    coveredW += w;
    sum += w * yr.value;
  }

  if (coveredW <= 0) return null;
  const coverage = coveredW / totalW;
  if (coverage < MIN_COVERAGE) return null;

  return {
    value: sum / coveredW,
    incomplete: incomplete || coveredW < totalW - 0.01,
    coverage,
    missing,
  };
}

/**
 * Années civiles exploitables (ordre croissant), bornées à asOf.
 */
function pickCalendarYears(holdings, perfByCode, asOfYear) {
  const yearSet = new Set();
  for (const h of holdings) {
    const cal = calendarMapForFund(h.fuCode, perfByCode[h.fuCode]);
    if (!cal) continue;
    for (const y of Object.keys(cal)) {
      const n = Number(y);
      if (Number.isFinite(n) && n <= asOfYear) yearSet.add(n);
    }
  }
  return [...yearSet].sort((a, b) => a - b);
}

/**
 * @param {Array<{fuCode:string, weightPct:number}>} holdings
 * @param {Record<string, object>} perfByCode
 * @param {string|null} asOfIso
 * @param {number} [principal]
 */
export function buildGrowthSeriesFromCalendarReturns(
  holdings,
  perfByCode,
  asOfIso = null,
  principal = PRINCIPAL_CAD
) {
  if (!Array.isArray(holdings) || !holdings.length || !perfByCode) {
    return { series: [], meta: null };
  }

  const asOf = parseAsOfParts(asOfIso);
  const activeHoldings = holdings.filter((h) => h.fuCode && Number(h.weightPct) > 0);
  const totalW = activeHoldings.reduce((s, h) => s + Number(h.weightPct || 0), 0);
  if (totalW <= 0) return { series: [], meta: null };

  const candidateYears = pickCalendarYears(activeHoldings, perfByCode, asOf.year);
  const usableYears = [];
  let anyIncomplete = false;
  const missingCodes = new Set();

  for (const year of candidateYears) {
    const wr = weightedCalendarReturn(activeHoldings, perfByCode, year, totalW);
    if (!wr) continue;
    if (wr.incomplete) anyIncomplete = true;
    wr.missing.forEach((c) => missingCodes.add(c));
    usableYears.push({ year, returnPct: wr.value });
  }

  if (usableYears.length < 1) {
    return { series: [], meta: null };
  }

  const firstYear = usableYears[0].year;
  const series = [
    {
      year: firstYear - 1,
      label: String(firstYear - 1),
      value: principal,
      month_date: `${firstYear - 1}-12-31`,
    },
  ];

  let value = principal;
  for (const { year, returnPct } of usableYears) {
    value *= 1 + returnPct / 100;
    series.push({
      year,
      label: String(year),
      value: Math.round(value * 100) / 100,
      month_date: `${year}-12-31`,
    });
  }

  // Point AAJ après la dernière année civile complète (ex. as_of 2026-07 → YTD 2026)
  const lastCivilYear = usableYears[usableYears.length - 1].year;
  const ytdCovered = activeHoldings.reduce((s, h) => {
    const ytd = perfByCode[h.fuCode]?.ytdPct;
    return ytd != null && Number.isFinite(Number(ytd)) ? s + Number(h.weightPct || 0) : s;
  }, 0);
  const canAppendYtd = Boolean(asOf.iso) && asOf.year > lastCivilYear;

  if (canAppendYtd && ytdCovered / totalW >= MIN_COVERAGE) {
    let ytdSum = 0;
    let ytdW = 0;
    for (const h of activeHoldings) {
      const ytd = perfByCode[h.fuCode]?.ytdPct;
      if (ytd == null || !Number.isFinite(Number(ytd))) continue;
      ytdW += Number(h.weightPct);
      ytdSum += Number(h.weightPct) * Number(ytd);
    }
    if (ytdW > 0) {
      value *= 1 + ytdSum / ytdW / 100;
      series.push({
        year: asOf.year,
        label: asOf.iso,
        value: Math.round(value * 100) / 100,
        month_date: asOf.iso,
      });
    }
  }

  const horizonYears = usableYears.length;
  let realizedAnnualized = null;
  if (series.length > 1 && horizonYears > 0) {
    const start = series[0].value;
    const endCivil = series.find((p) => p.year === lastCivilYear) || series[series.length - 1];
    if (start > 0 && endCivil?.value > 0) {
      realizedAnnualized =
        Math.round((Math.pow(endCivil.value / start, 1 / horizonYears) - 1) * 10000) / 100;
    }
  }

  return {
    series,
    meta: {
      source: 'fund_calendar_year',
      horizon_years: horizonYears,
      first_year: firstYear,
      last_year: lastCivilYear,
      annualized_pct: realizedAnnualized,
      incomplete: anyIncomplete,
      missing_codes: [...missingCodes],
      principal,
      as_of_date: asOf.iso,
      method:
        'Rééquilibrage annuel aux poids cibles ; rendements année civile des fiches de fonds (Série Classique 75/75).',
    },
  };
}

/** @deprecated Use buildGrowthSeriesFromCalendarReturns */
export function buildGrowthSeriesFromFundReturns(
  holdings,
  perfByCode,
  asOfIso = null,
  principal = PRINCIPAL_CAD
) {
  return buildGrowthSeriesFromCalendarReturns(holdings, perfByCode, asOfIso, principal);
}

/** @deprecated */
export function buildGrowthSeriesFromPeriodReturns() {
  return { series: [], meta: null };
}

export function wealthSeriesForSnapshot(holdings, perfByCode, asOfIso) {
  const { series, meta } = buildGrowthSeriesFromCalendarReturns(holdings, perfByCode, asOfIso);
  return {
    wealth_series: series.map((p) => ({
      year: p.year,
      label: p.label,
      value: p.value,
      month_date: p.month_date,
    })),
    growth_meta: meta,
  };
}

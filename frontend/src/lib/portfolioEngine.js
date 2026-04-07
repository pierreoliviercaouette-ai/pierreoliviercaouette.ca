/**
 * Portfolio time-series engine: align fund monthly returns, blend by weights,
 * compound to wealth, KPIs (YTD, rolling windows, civil years).
 */

/** @param {string} isoDate YYYY-MM-DD */
export function parseIsoMonth(isoDate) {
  const [y, m] = isoDate.split('-').map((x) => parseInt(x, 10));
  return { year: y, month: m };
}

/** First day of month as YYYY-MM-DD */
export function monthKey(year, month) {
  const mm = String(month).padStart(2, '0');
  return `${year}-${mm}-01`;
}

/**
 * Convert a calendar-year total return (%) into 12 geometrically equal monthly returns (%).
 */
export function splitAnnualIntoMonthly(annualPct) {
  const f = 1 + annualPct / 100;
  if (f <= 0) {
    return Array(12).fill(annualPct / 12);
  }
  const m = (f ** (1 / 12) - 1) * 100;
  return Array(12).fill(m);
}

/**
 * Spread YTD % across `monthCount` months (Jan .. monthCount) with geometric compounding.
 */
export function splitYtdIntoYearMonths(ytdPct, monthCount) {
  const n = Math.max(1, Math.min(12, monthCount));
  const f = 1 + ytdPct / 100;
  if (f <= 0) {
    return Array(n).fill(ytdPct / n);
  }
  const m = (f ** (1 / n) - 1) * 100;
  return Array(n).fill(m);
}

/**
 * Build monthly return map from annual figures + YTD for current year.
 * @param {{ [year: number]: number }} annualByYear full calendar year totals (%)
 * @param {number} ytdPct YTD through as-of for the current calendar year
 * @param {string} asOfDateIso
 * @returns {{ month_date: string, return_pct: number }[]}
 */
export function buildMonthlyReturnsFromAnnualAndYtd(annualByYear, ytdPct, asOfDateIso) {
  const d = new Date(`${asOfDateIso}T12:00:00Z`);
  const y = d.getUTCFullYear();
  const monthThrough = d.getUTCMonth() + 1;

  const rows = [];

  const years = Object.keys(annualByYear || {})
    .map((k) => parseInt(k, 10))
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b);

  for (const year of years) {
    if (year >= y) continue;
    const annual = annualByYear[year];
    if (annual === undefined || annual === null) continue;
    const months = splitAnnualIntoMonthly(Number(annual));
    for (let m = 1; m <= 12; m += 1) {
      rows.push({ month_date: monthKey(year, m), return_pct: months[m - 1] });
    }
  }

  const ytdParts = splitYtdIntoYearMonths(ytdPct, monthThrough);
  for (let m = 1; m <= monthThrough; m += 1) {
    rows.push({ month_date: monthKey(y, m), return_pct: ytdParts[m - 1] });
  }

  rows.sort((a, b) => a.month_date.localeCompare(b.month_date));
  return rows;
}

/**
 * @param {Map<string, { month_date: string, return_pct: number }[]>} byFundId
 * @returns {string[]} sorted month keys
 */
export function unionMonthKeys(byFundId) {
  const s = new Set();
  for (const arr of byFundId.values()) {
    for (const r of arr) s.add(r.month_date);
  }
  return [...s].sort();
}

/**
 * Months where every weighted fund has a row (intersection).
 * @param {Record<string, number>} weightsByFundId
 * @param {Map<string, { month_date: string, return_pct: number }[]>} byFundId
 */
export function intersectionMonthKeys(weightsByFundId, byFundId) {
  const fundIds = Object.keys(weightsByFundId).filter((id) => (weightsByFundId[id] || 0) > 0);
  if (fundIds.length === 0) return [];
  let common = null;
  for (const fid of fundIds) {
    const set = new Set((byFundId.get(fid) || []).map((r) => r.month_date));
    common = common ? new Set([...common].filter((x) => set.has(x))) : set;
  }
  return [...(common || [])].sort();
}

function monthIndex(map, fundId, monthDate) {
  const arr = map.get(fundId) || [];
  return arr.find((x) => x.month_date === monthDate);
}

/**
 * Portfolio monthly return = sum(weight * fund_return) with weights as decimals summing to 1.
 */
export function blendMonthlyReturn(weightsByFundId, byFundId, monthDate) {
  let total = 0;
  for (const [fundId, w] of Object.entries(weightsByFundId)) {
    const row = monthIndex(byFundId, fundId, monthDate);
    if (!row) return null;
    total += (w / 100) * row.return_pct;
  }
  return total;
}

/**
 * @param {Record<string, number>} weightsByFundId fund_id -> weight_pct (sum 100)
 * @param {Map<string, { month_date: string, return_pct: number }[]>} byFundId
 */
export function computePortfolioMonthlySeries(weightsByFundId, byFundId) {
  const keys = intersectionMonthKeys(weightsByFundId, byFundId);
  const months = [];
  for (const m of keys) {
    const r = blendMonthlyReturn(weightsByFundId, byFundId, m);
    if (r === null) continue;
    months.push({ month_date: m, return_pct: r });
  }
  return months;
}

export function compoundWealthFromMonthly(monthly, startValue = 100) {
  let v = startValue;
  const wealth = [];
  for (const row of monthly) {
    v *= 1 + row.return_pct / 100;
    wealth.push({ month_date: row.month_date, value: v });
  }
  return wealth;
}

export function sliceMonthsEnding(monthly, endMonthDate, count) {
  const idx = monthly.findIndex((m) => m.month_date === endMonthDate);
  if (idx === -1) return [];
  const start = Math.max(0, idx - count + 1);
  return monthly.slice(start, idx + 1);
}

export function compoundTotalReturn(monthlySlice) {
  let f = 1;
  for (const m of monthlySlice) {
    f *= 1 + m.return_pct / 100;
  }
  return (f - 1) * 100;
}

/**
 * Annualized return over `years` from compound total R_total: (1+R)^(1/years)-1
 */
export function annualizedFromTotal(totalPct, years) {
  if (years <= 0) return null;
  const f = 1 + totalPct / 100;
  if (f <= 0) return null;
  return ((f ** (1 / years)) - 1) * 100;
}

/**
 * KPIs from portfolio monthly series (sorted ascending).
 */
export function computeSnapshotKpis(monthlySorted, asOfMonthDate) {
  const idx = monthlySorted.findIndex((m) => m.month_date === asOfMonthDate);
  if (idx === -1) {
    return {
      anchor_month: null,
      ytd_pct: null,
      prev_civil_year: null,
      prev_civil_year_pct: null,
      rolling_1y_pct: null,
      rolling_3y_pct: null,
      rolling_5y_pct: null,
      rolling_10y_pct: null,
    };
  }

  const asOf = new Date(`${asOfMonthDate}T12:00:00Z`);
  const civilYear = asOf.getUTCFullYear();
  const monthThrough = asOf.getUTCMonth() + 1;

  const ytdMonths = monthlySorted.filter((m) => {
    const [yy, mm] = m.month_date.split('-').map((x) => parseInt(x, 10));
    return yy === civilYear && mm <= monthThrough;
  });
  const ytd_pct = ytdMonths.length ? compoundTotalReturn(ytdMonths) : null;

  const prevYear = civilYear - 1;
  const prevYearMonths = monthlySorted.filter((m) => {
    const d = new Date(`${m.month_date}T12:00:00Z`);
    return d.getUTCFullYear() === prevYear;
  });
  const prev_civil_year_pct =
    prevYearMonths.length === 12 ? compoundTotalReturn(prevYearMonths) : prevYearMonths.length
      ? compoundTotalReturn(prevYearMonths)
      : null;

  const last12 = sliceMonthsEnding(monthlySorted, asOfMonthDate, 12);
  const last36 = sliceMonthsEnding(monthlySorted, asOfMonthDate, 36);
  const last60 = sliceMonthsEnding(monthlySorted, asOfMonthDate, 60);
  const last120 = sliceMonthsEnding(monthlySorted, asOfMonthDate, 120);

  const r1 = last12.length === 12 ? compoundTotalReturn(last12) : null;
  const r3 =
    last36.length === 36 ? annualizedFromTotal(compoundTotalReturn(last36), 3) : null;
  const r5 =
    last60.length === 60 ? annualizedFromTotal(compoundTotalReturn(last60), 5) : null;
  const r10 =
    last120.length === 120 ? annualizedFromTotal(compoundTotalReturn(last120), 10) : null;

  return {
    anchor_month: asOfMonthDate,
    ytd_pct,
    prev_civil_year: prevYear,
    prev_civil_year_pct,
    rolling_1y_pct: r1,
    rolling_3y_pct: r3,
    rolling_5y_pct: r5,
    rolling_10y_pct: r10,
  };
}

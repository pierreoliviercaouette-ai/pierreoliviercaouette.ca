/**
 * Courbe de croissance à partir des rendements annualisés **de chaque fonds**,
 * pondérés selon les poids du portefeuille (mêmes données que l’import CSV).
 *
 * Sans rééquilibrage : chaque manche de fonds compounde à son propre taux
 * annualisé sur l’horizon choisi. Aux jalons 1 / 3 / 5 / 10 ans, on utilise
 * le rendement de cette période pour le fonds lorsqu’il est disponible.
 */

const PRINCIPAL_CAD = 100000;

const HORIZON_FIELDS = [
  { years: 10, field: 'tenYearPct', periodKey: 'tenYear' },
  { years: 5, field: 'fiveYearPct', periodKey: 'fiveYear' },
  { years: 3, field: 'threeYearPct', periodKey: 'threeYear' },
  { years: 1, field: 'oneYearPct', periodKey: 'oneYear' },
];

const EXACT_YEAR_FIELDS = {
  1: 'oneYearPct',
  3: 'threeYearPct',
  5: 'fiveYearPct',
  10: 'tenYearPct',
};

function parseAsOfParts(asOfIso) {
  if (asOfIso && /^\d{4}-\d{2}-\d{2}$/.test(asOfIso)) {
    const [y, m, d] = asOfIso.split('-').map(Number);
    return { year: y, month: m, day: d, iso: asOfIso };
  }
  const now = new Date();
  const iso = now.toISOString().slice(0, 10);
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate(), iso };
}

function fundRatePct(perf, field) {
  const raw = perf?.[field];
  if (raw === null || raw === undefined || Number.isNaN(Number(raw))) return null;
  return Number(raw);
}

/** Pick longest horizon where ≥95 % du poids a un rendement annualisé. */
function pickHorizonYears(holdings, perfByCode) {
  const totalW = holdings.reduce((s, h) => s + Number(h.weightPct || 0), 0);
  if (totalW <= 0) return null;

  for (const { years, field } of HORIZON_FIELDS) {
    const covered = holdings.reduce((s, h) => {
      const rate = fundRatePct(perfByCode[h.fuCode], field);
      return rate != null ? s + Number(h.weightPct || 0) : s;
    }, 0);
    if (covered / totalW >= 0.95) return years;
  }
  return null;
}

/**
 * Facteur de croissance d’un fonds après `yearsElapsed` années.
 * Aux jalons 1/3/5/10, priorise le rendement de cette période ; sinon le taux de l’horizon.
 */
function fundGrowthFactor(perf, yearsElapsed, horizonYears, horizonField) {
  if (yearsElapsed <= 0) return 1;

  const exactField = EXACT_YEAR_FIELDS[yearsElapsed];
  if (exactField) {
    const exactRate = fundRatePct(perf, exactField);
    if (exactRate != null) {
      return (1 + exactRate / 100) ** yearsElapsed;
    }
  }

  const horizonRate = fundRatePct(perf, horizonField);
  if (horizonRate != null) {
    return (1 + horizonRate / 100) ** yearsElapsed;
  }

  // Repli : meilleur taux annualisé plus court disponible
  for (const { years, field } of HORIZON_FIELDS) {
    if (years > horizonYears) continue;
    const rate = fundRatePct(perf, field);
    if (rate != null) {
      return (1 + rate / 100) ** yearsElapsed;
    }
  }
  return null;
}

/**
 * @param {Array<{fuCode:string, weightPct:number}>} holdings
 * @param {Record<string, object>} perfByCode
 * @param {string|null} asOfIso
 * @param {number} [principal]
 */
export function buildGrowthSeriesFromFundReturns(
  holdings,
  perfByCode,
  asOfIso = null,
  principal = PRINCIPAL_CAD
) {
  if (!Array.isArray(holdings) || !holdings.length || !perfByCode) {
    return { series: [], meta: null };
  }

  const horizonYears = pickHorizonYears(holdings, perfByCode);
  if (!horizonYears) {
    return { series: [], meta: null };
  }

  const horizonField = HORIZON_FIELDS.find((h) => h.years === horizonYears)?.field;
  const periodKey = HORIZON_FIELDS.find((h) => h.years === horizonYears)?.periodKey;
  const asOf = parseAsOfParts(asOfIso);
  const startYear = asOf.year - horizonYears;

  const activeHoldings = holdings.filter((h) => h.fuCode && Number(h.weightPct) > 0);
  const totalW = activeHoldings.reduce((s, h) => s + Number(h.weightPct || 0), 0);
  if (totalW <= 0) return { series: [], meta: null };

  let anyIncomplete = false;
  const missingCodes = new Set();
  const series = [];

  for (let year = startYear; year <= asOf.year; year += 1) {
    const yearsElapsed = year - startYear;
    let value = 0;
    let weightUsed = 0;

    for (const h of activeHoldings) {
      const perf = perfByCode[h.fuCode];
      if (Array.isArray(perf?.incompleteFields) && perf.incompleteFields.includes(horizonField)) {
        anyIncomplete = true;
      }
      // Au jalon exact, noter aussi l’incomplet de cette période
      const exactField = EXACT_YEAR_FIELDS[yearsElapsed];
      if (
        exactField &&
        Array.isArray(perf?.incompleteFields) &&
        perf.incompleteFields.includes(exactField)
      ) {
        anyIncomplete = true;
      }

      const factor = fundGrowthFactor(perf, yearsElapsed, horizonYears, horizonField);
      if (factor == null) {
        missingCodes.add(h.fuCode);
        continue;
      }
      const w = Number(h.weightPct) / totalW;
      value += principal * w * factor;
      weightUsed += Number(h.weightPct);
    }

    // Renormaliser si certains fonds manquent pour ce point
    if (weightUsed > 0 && weightUsed < totalW - 0.01) {
      value *= totalW / weightUsed;
      anyIncomplete = true;
    }

    const isLast = year === asOf.year;
    series.push({
      year,
      label: isLast ? asOf.iso : String(year),
      value: Math.round(value * 100) / 100,
      month_date: isLast ? asOf.iso : `${year}-12-31`,
    });
  }

  // Rendement annualisé effectif de la courbe (réellement produit par les fonds)
  let realizedAnnualized = null;
  if (series.length > 1) {
    const start = series[0].value;
    const end = series[series.length - 1].value;
    if (start > 0 && end > 0 && horizonYears > 0) {
      realizedAnnualized =
        Math.round((Math.pow(end / start, 1 / horizonYears) - 1) * 10000) / 100;
    }
  }

  return {
    series,
    meta: {
      source: 'fund_level_annualized',
      horizon_years: horizonYears,
      annualized_pct: realizedAnnualized,
      incomplete: anyIncomplete,
      missing_codes: [...missingCodes],
      principal,
      as_of_date: asOf.iso,
      period_key: periodKey,
      method:
        'Sans rééquilibrage : chaque fonds compounde à son rendement annualisé (jalons 1/3/5/10 ans si disponibles).',
    },
  };
}

/** @deprecated Prefer buildGrowthSeriesFromFundReturns */
export function buildGrowthSeriesFromPeriodReturns(
  periodReturns,
  incompleteByPeriod = {},
  asOfIso = null,
  principal = PRINCIPAL_CAD
) {
  // Conservé pour compat ; non utilisé par l’UI principale.
  void periodReturns;
  void incompleteByPeriod;
  void asOfIso;
  void principal;
  return { series: [], meta: null };
}

export function wealthSeriesForSnapshot(holdings, perfByCode, asOfIso) {
  const { series, meta } = buildGrowthSeriesFromFundReturns(holdings, perfByCode, asOfIso);
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

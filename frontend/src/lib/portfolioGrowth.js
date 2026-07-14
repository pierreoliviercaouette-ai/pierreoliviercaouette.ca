/**
 * Reconstruction d’une courbe de croissance illustrative à partir des rendements
 * annualisés pondérés (mêmes chiffres que l’import CSV / tableaux KPI).
 *
 * Hypothèse : placement initial compoundé à taux annualisé constant sur l’horizon
 * le plus long disponible (10 → 5 → 3 → 1 an). Ce n’est pas le chemin annuel réel.
 */

const PRINCIPAL_CAD = 100000;

const HORIZONS = [
  { years: 10, rateKey: 'tenYear', incompleteKey: 'tenYear' },
  { years: 5, rateKey: 'fiveYear', incompleteKey: 'fiveYear' },
  { years: 3, rateKey: 'threeYear', incompleteKey: 'threeYear' },
  { years: 1, rateKey: 'oneYear', incompleteKey: 'oneYear' },
];

function parseAsOfParts(asOfIso) {
  if (asOfIso && /^\d{4}-\d{2}-\d{2}$/.test(asOfIso)) {
    const [y, m, d] = asOfIso.split('-').map(Number);
    return { year: y, month: m, day: d, iso: asOfIso };
  }
  const now = new Date();
  const iso = now.toISOString().slice(0, 10);
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate(), iso };
}

/**
 * @param {object} periodReturns - clés oneMonth…tenYear (moyenne pondérée)
 * @param {object} [incompleteByPeriod]
 * @param {string|null} asOfIso - YYYY-MM-DD
 * @param {number} [principal]
 */
export function buildGrowthSeriesFromPeriodReturns(
  periodReturns,
  incompleteByPeriod = {},
  asOfIso = null,
  principal = PRINCIPAL_CAD
) {
  if (!periodReturns) {
    return { series: [], meta: null };
  }

  const horizon = HORIZONS.find((h) => {
    const rate = periodReturns[h.rateKey];
    return rate !== null && rate !== undefined && Number.isFinite(Number(rate));
  });

  if (!horizon) {
    return { series: [], meta: null };
  }

  const asOf = parseAsOfParts(asOfIso);
  const rate = Number(periodReturns[horizon.rateKey]) / 100;
  const startYear = asOf.year - horizon.years;
  const series = [];

  for (let year = startYear; year <= asOf.year; year += 1) {
    const yearsElapsed = year - startYear;
    const value = Math.round(principal * (1 + rate) ** yearsElapsed * 100) / 100;
    const isLast = year === asOf.year;
    series.push({
      year,
      label: isLast ? asOf.iso : String(year),
      value,
      month_date: isLast ? asOf.iso : `${year}-12-31`,
    });
  }

  return {
    series,
    meta: {
      source: 'csv_weighted_annualized',
      horizon_years: horizon.years,
      annualized_pct: Number(periodReturns[horizon.rateKey]),
      incomplete: Boolean(incompleteByPeriod?.[horizon.incompleteKey]),
      principal,
      as_of_date: asOf.iso,
    },
  };
}

export function wealthSeriesForSnapshot(periodReturns, incompleteByPeriod, asOfIso) {
  const { series, meta } = buildGrowthSeriesFromPeriodReturns(
    periodReturns,
    incompleteByPeriod,
    asOfIso
  );
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

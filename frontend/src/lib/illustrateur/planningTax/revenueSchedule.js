/**
 * Évolution des revenus : croissance annuelle par ligne et ajustements planifiés.
 */

export const REVENUE_GROWTH_DEFAULTS = {
  salaire: 0.02,
  revenu_immeuble: 0.025,
  revenu_placement: 0.02,
  dividende: 0.02,
  autre: 0.02,
};

export const PERSONAL_REVENUE_TYPES = ['salaire', 'dividende', 'revenu_placement', 'autre'];
export const RENTAL_REVENUE_TYPES = ['revenu_immeuble'];

export function isPersonalRevenueType(type) {
  return PERSONAL_REVENUE_TYPES.includes(type);
}

export function isRentalRevenueType(type) {
  return type === 'revenu_immeuble';
}

export function newAdjustmentId() {
  return `adj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Taux décimal pour la croissance (ex. 0.02 = 2 %). */
export function getDefaultGrowthRate(revenue) {
  const custom = parseFloat(revenue?.annualGrowthPercent);
  if (Number.isFinite(custom)) return custom / 100;
  const type = revenue?.type || 'autre';
  return REVENUE_GROWTH_DEFAULTS[type] ?? REVENUE_GROWTH_DEFAULTS.autre;
}

/** Affichage UI en pourcentage (ex. 2, 2.5). */
export function getDefaultGrowthPercentDisplay(revenue) {
  const custom = parseFloat(revenue?.annualGrowthPercent);
  if (Number.isFinite(custom)) return custom;
  return Math.round(getDefaultGrowthRate(revenue) * 1000) / 10;
}

/** @deprecated Alias — utiliser getDefaultGrowthRate */
export function getDefaultGrowthPercent(revenue) {
  return getDefaultGrowthRate(revenue);
}

/** Applique les ajustements dont effectiveYear === year (remplace monthlyAmount). */
export function applyRevenueAdjustmentsForYear(revenues, year) {
  const y = parseInt(year, 10);
  if (!Number.isFinite(y)) return;
  for (const r of revenues || []) {
    const adjustments = r.adjustments || [];
    for (const adj of adjustments) {
      if (parseInt(adj.effectiveYear, 10) !== y) continue;
      const amt = parseFloat(adj.monthlyAmount);
      if (Number.isFinite(amt)) {
        r.monthlyAmount = Math.max(0, amt);
      }
    }
  }
}

/** Croissance composée annuelle vers l'année suivante. */
export function growRevenuesForYear(revenues) {
  for (const r of revenues || []) {
    const amount = parseFloat(r.monthlyAmount) || 0;
    const rate = getDefaultGrowthRate(r);
    r.monthlyAmount = Math.round(amount * (1 + rate));
  }
}

export function sumRevenueMonthly(revenues, filterFn = null) {
  return (revenues || []).reduce((s, r) => {
    if (filterFn && !filterFn(r)) return s;
    return s + (parseFloat(r.monthlyAmount) || 0);
  }, 0);
}

/**
 * Simule le total mensuel sur l'horizon (à partir des montants actuels du bilan).
 */
export function buildRevenueTimeline(revenues, startYear, horizonYears, options = {}) {
  const filterFn = options.personalOnly
    ? (r) => isPersonalRevenueType(r.type)
    : options.rentalOnly
      ? (r) => isRentalRevenueType(r.type)
      : null;

  const clones = (revenues || [])
    .filter((r) => !filterFn || filterFn(r))
    .map((r) => ({
      ...r,
      monthlyAmount: parseFloat(r.monthlyAmount) || 0,
      adjustments: (r.adjustments || []).map((a) => ({ ...a })),
    }));

  const rows = [];
  const horizon = Math.max(0, parseInt(horizonYears, 10) || 0);

  for (let y = 0; y <= horizon; y++) {
    const year = startYear + y;
    applyRevenueAdjustmentsForYear(clones, year);
    const totalMonthly = sumRevenueMonthly(clones);
    const adjustmentLabels = [];
    for (const r of clones) {
      for (const adj of r.adjustments || []) {
        if (parseInt(adj.effectiveYear, 10) === year && adj.label) {
          adjustmentLabels.push(adj.label);
        }
      }
    }
    rows.push({
      year,
      totalMonthly: Math.round(totalMonthly),
      totalAnnual: Math.round(totalMonthly * 12),
      adjustmentLabels,
    });
    if (y < horizon) {
      growRevenuesForYear(clones);
    }
  }

  return rows;
}

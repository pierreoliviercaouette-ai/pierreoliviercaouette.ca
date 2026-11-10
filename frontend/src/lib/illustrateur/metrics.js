export function formatCad(value) {
  const n = Number(value) || 0;
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatPct(value, digits = 1) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  return `${n.toFixed(digits)} %`;
}

export function summarizeProjection(projection) {
  const data = projection?.data || [];
  if (!data.length) {
    return {
      netWorthNow: 0,
      netWorthEnd: 0,
      totalAssetsEnd: 0,
      totalDebtsEnd: 0,
      cashflowYear0: 0,
      deathNetEstate: null,
      pfiLoanEnd: 0,
      collateralCapacityEnd: 0,
    };
  }
  const first = data[0];
  const last = data[data.length - 1];
  return {
    netWorthNow: first.netWorth || 0,
    netWorthEnd: last.netWorth || 0,
    totalAssetsEnd: last.totalAssets || 0,
    totalDebtsEnd: last.totalDebts || 0,
    cashflowYear0: first.annualCashflowAfterTax || 0,
    deathNetEstate: projection?.deathSummary?.netEstate ?? null,
    pfiLoanEnd: last.pfiLoanBalance || 0,
    collateralCapacityEnd: last.collateralCapacityTotal || 0,
    assuranceDeathEnd: last.assuranceDeathBenefitTotal || 0,
  };
}

export function compareScenarios(projA, projB) {
  const a = summarizeProjection(projA);
  const b = summarizeProjection(projB);
  return {
    a,
    b,
    deltaNetWorthEnd: (b.netWorthEnd || 0) - (a.netWorthEnd || 0),
    deltaCashflow0: (b.cashflowYear0 || 0) - (a.cashflowYear0 || 0),
  };
}

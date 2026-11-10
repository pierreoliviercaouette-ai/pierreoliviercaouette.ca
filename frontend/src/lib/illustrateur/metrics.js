export function formatCad(value) {
  const n = Number(value) || 0;
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatCompactCad(value) {
  const n = Number(value) || 0;
  return new Intl.NumberFormat('fr-CA', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(n);
}

export function formatPct(value, digits = 1) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  return `${n.toFixed(digits)} %`;
}

const ASSET_TYPE_LABELS = {
  reer: 'REER',
  celi: 'CELI',
  non_enregistre: 'Non-enregistré',
  corporatif: 'Corporatif',
  immobilier: 'Immobilier',
  assurance_participative: 'Assurance',
  autre: 'Autre',
};

export function assetTypeLabel(type) {
  return ASSET_TYPE_LABELS[type] || type || 'Autre';
}

export function summarizeProjection(projection) {
  const data = projection?.data || [];
  if (!data.length) {
    return {
      netWorthNow: 0,
      netWorthEnd: 0,
      totalAssetsNow: 0,
      totalAssetsEnd: 0,
      totalDebtsNow: 0,
      totalDebtsEnd: 0,
      cashflowYear0: 0,
      cashflowEnd: 0,
      deathNetEstate: null,
      pfiLoanEnd: 0,
      collateralCapacityEnd: 0,
      assuranceDeathEnd: 0,
      growthCad: 0,
      growthPct: 0,
      debtRatioNow: 0,
      debtRatioEnd: 0,
      years: 0,
    };
  }
  const first = data[0];
  const last = data[data.length - 1];
  const netWorthNow = first.netWorth || 0;
  const netWorthEnd = last.netWorth || 0;
  const totalAssetsNow = first.totalAssets || 0;
  const totalAssetsEnd = last.totalAssets || 0;
  const totalDebtsNow = first.totalDebts || 0;
  const totalDebtsEnd = last.totalDebts || 0;
  const growthCad = netWorthEnd - netWorthNow;
  const years = Math.max(1, data.length - 1);
  const growthPct = netWorthNow !== 0 ? (growthCad / Math.abs(netWorthNow)) * 100 : 0;
  return {
    netWorthNow,
    netWorthEnd,
    totalAssetsNow,
    totalAssetsEnd,
    totalDebtsNow,
    totalDebtsEnd,
    cashflowYear0: first.annualCashflowAfterTax || 0,
    cashflowEnd: last.annualCashflowAfterTax || 0,
    deathNetEstate: projection?.deathSummary?.netEstate ?? null,
    pfiLoanEnd: last.pfiLoanBalance || 0,
    collateralCapacityEnd: last.collateralCapacityTotal || 0,
    assuranceDeathEnd: last.assuranceDeathBenefitTotal || 0,
    growthCad,
    growthPct,
    debtRatioNow: totalAssetsNow > 0 ? (totalDebtsNow / totalAssetsNow) * 100 : 0,
    debtRatioEnd: totalAssetsEnd > 0 ? (totalDebtsEnd / totalAssetsEnd) * 100 : 0,
    years,
  };
}

export function buildNetWorthSeries(projection) {
  return (projection?.data || []).map((row) => ({
    year: row.year,
    netWorth: row.netWorth || 0,
    assets: row.totalAssets || 0,
    debts: -(row.totalDebts || 0),
    debtsAbs: row.totalDebts || 0,
  }));
}

export function buildCashflowSeries(projection) {
  return (projection?.data || []).map((row) => ({
    year: row.year,
    cashflow: row.annualCashflowAfterTax || 0,
    revenue: row.annualRevenueGross || 0,
    tax: row.annualTax || 0,
    premiums: row.annualInsurancePremiums || 0,
  }));
}

export function buildAllocationNow(plan) {
  const byType = {};
  for (const asset of plan?.assets || []) {
    const type = asset.type || 'autre';
    byType[type] = (byType[type] || 0) + (parseFloat(asset.currentBalance) || 0);
  }
  return Object.entries(byType)
    .filter(([, v]) => v > 0)
    .map(([type, value]) => ({
      type,
      name: assetTypeLabel(type),
      value: Math.round(value),
    }))
    .sort((a, b) => b.value - a.value);
}

export function buildAllocationEnd(projection) {
  const last = projection?.data?.[projection.data.length - 1];
  if (!last) return [];
  const types = projection?.assetTypes || [];
  const rows = types
    .map((type) => ({
      type,
      name: assetTypeLabel(type),
      value: Math.round(last[`typeAsset::${type}`] || 0),
    }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value);
  if (rows.length) return rows;
  // fallback: named assets on last row
  return (projection?.assetNames || [])
    .map((name) => ({ type: name, name, value: Math.round(last[name] || 0) }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

export function buildSparkline(projection, key = 'netWorth', points = 12) {
  const data = projection?.data || [];
  if (!data.length) return [];
  const step = Math.max(1, Math.floor(data.length / points));
  const sampled = [];
  for (let i = 0; i < data.length; i += step) sampled.push(data[i][key] || 0);
  if (sampled[sampled.length - 1] !== (data[data.length - 1][key] || 0)) {
    sampled.push(data[data.length - 1][key] || 0);
  }
  return sampled.map((v, i) => ({ i, v }));
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

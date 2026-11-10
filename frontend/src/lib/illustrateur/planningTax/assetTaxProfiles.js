import {
  GROWTH_TAX_DEFERRED_TYPES,
  APPRECIATION_ONLY_TYPES,
  CAPITAL_GAINS_BOOK_TYPES,
} from './constants';

/** Résout le traitement fiscal effectif (ex. autre → non_enregistre). */
export function getEffectiveAssetTaxType(asset) {
  if (!asset?.type) return 'non_enregistre';
  if (asset.type === 'autre') {
    const sub = asset.fiscalTreatment || asset.taxProfile || 'non_enregistre';
    if (['non_enregistre', 'celi', 'immobilier', 'reer'].includes(sub)) return sub;
    return 'non_enregistre';
  }
  return asset.type;
}

export function isGrowthTaxDeferred(asset) {
  const t = getEffectiveAssetTaxType(asset);
  return GROWTH_TAX_DEFERRED_TYPES.has(t);
}

export function isAppreciationOnly(asset) {
  return APPRECIATION_ONLY_TYPES.has(getEffectiveAssetTaxType(asset));
}

export function hasCapitalGainsBook(asset) {
  return CAPITAL_GAINS_BOOK_TYPES.has(getEffectiveAssetTaxType(asset));
}

export function getIncomeYieldFraction(asset) {
  const raw = parseFloat(asset?.incomeYieldPercent);
  if (Number.isFinite(raw) && raw >= 0) return Math.min(100, raw) / 100;
  return 0.5;
}

export function getAssetTaxProfileLabel(type) {
  const labels = {
    reer: 'Croissance à l\'abri · retrait/décès imposables',
    celi: 'Croissance à l\'abri · retraits non imposables',
    non_enregistre: 'PNB/ACB · revenus et gains imposables',
    corporatif: 'Compte corp. · passif/actif · RDTOH simplifié',
    immobilier: 'Appréciation différée · loyers nets − CCA − dépenses',
    assurance_participative: 'VR à l\'abri · capital-décès libre d\'impôt · CDC corp. (100 % CD) · collatéral remboursé au décès',
    autre: 'Traitement configurable (défaut: non-enregistré)',
  };
  return labels[type] || '';
}

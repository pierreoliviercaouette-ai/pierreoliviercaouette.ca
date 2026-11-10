import { buildEntityMap, getMarginalRate } from './helpers';
import {
  isGrowthTaxDeferred,
  isAppreciationOnly,
  getEffectiveAssetTaxType,
  getIncomeYieldFraction,
} from './assetTaxProfiles';
import { isCorporatePassiveAsset, calcCorporatePassiveInvestmentTax } from './corporateTax';

/**
 * Revenus imposables annuels issus des comptes (intérêts / portion revenus du rendement).
 * Les gains en capital non réalisés restent sur PNB jusqu'à vente/décès.
 */
export function computeTaxableInvestmentIncomeByEntity(assets = [], entities = []) {
  const entityMap = buildEntityMap(entities);
  const byEntity = {};

  for (const a of assets) {
    if (isGrowthTaxDeferred(a) || isAppreciationOnly(a)) continue;
    if (a.type === 'assurance_participative') continue;

    const eid = a.entityId;
    if (!eid) continue;
    const balance = parseFloat(a.currentBalance) || 0;
    if (balance <= 0) continue;

    const annualReturn = (parseFloat(a.avgAnnualReturn) || 0) / 100;
    const incomeFrac = getIncomeYieldFraction(a);
    const grossIncome = balance * annualReturn * incomeFrac;

    if (!byEntity[eid]) {
      byEntity[eid] = { gross: 0, passiveGross: 0, tax: 0, net: 0, passiveCorpTax: 0 };
    }
    byEntity[eid].gross += grossIncome;

    if (isCorporatePassiveAsset(a)) {
      byEntity[eid].passiveGross += grossIncome;
      const { tax } = calcCorporatePassiveInvestmentTax(grossIncome);
      byEntity[eid].passiveCorpTax += tax;
      byEntity[eid].tax += tax;
    } else {
      const rate = getMarginalRate(entityMap[eid]);
      byEntity[eid].tax += grossIncome * rate;
    }
  }

  for (const eid of Object.keys(byEntity)) {
    byEntity[eid].net = byEntity[eid].gross - byEntity[eid].tax;
  }

  const totalGross = Object.values(byEntity).reduce((s, v) => s + v.gross, 0);
  const totalTax = Object.values(byEntity).reduce((s, v) => s + v.tax, 0);

  return {
    byEntity,
    totalGross: Math.round(totalGross),
    totalTax: Math.round(totalTax),
    totalNet: Math.round(totalGross - totalTax),
  };
}

export function shouldIncludeInvestmentIncomeInCashflow(asset) {
  return asset.includeInvestmentIncomeInCashflow === true;
}

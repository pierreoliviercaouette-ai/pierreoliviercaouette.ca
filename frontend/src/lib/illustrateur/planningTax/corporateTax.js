import { CORP_PASSIVE_INVESTMENT_TAX_RATE, IMRTD_CREDIT_RATE } from './constants';
import { calcDividendTax } from '../investmentPlanningService';
import { getEffectiveAssetTaxType } from './assetTaxProfiles';

/**
 * Impôt corp. sur revenu de placement passif + crédit RDTOH simplifié à la distribution.
 */
export function calcCorporatePassiveInvestmentTax(grossPassiveIncome) {
  const g = Math.max(0, parseFloat(grossPassiveIncome) || 0);
  if (g <= 0) return { tax: 0, rdohCredit: 0 };
  const tax = g * CORP_PASSIVE_INVESTMENT_TAX_RATE;
  const imrtdCredit = g * IMRTD_CREDIT_RATE;
  return { tax, rdohCredit: imrtdCredit, imrtdCredit };
}

export function applyDividendIntegration(grossDividend, personalEntity, sourceCorpEntity, isEligible = false) {
  const personalRate = parseFloat(personalEntity?.marginalTaxRate) || 53.31;
  const corpRate = parseFloat(sourceCorpEntity?.marginalTaxRate) || 26.5;
  const eligible = isEligible === true;
  const tax = calcDividendTax(grossDividend, personalRate, eligible);
  return {
    gross: grossDividend,
    tax,
    net: Math.max(0, grossDividend - tax),
  };
}

export function isCorporatePassiveAsset(asset) {
  return getEffectiveAssetTaxType(asset) === 'corporatif'
    && (asset.incomeCharacter || 'passif_investissement') === 'passif_investissement';
}

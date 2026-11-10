import { CAPITAL_GAINS_INCLUSION } from '../investmentPlanningService';
import { getAssetAcb } from './helpers';

export function calcCapitalGainsTax(salePrice, acb, marginalRate) {
  const gain = Math.max(0, (parseFloat(salePrice) || 0) - (parseFloat(acb) || 0));
  const rate = (parseFloat(marginalRate) || 0) / 100;
  if (rate > 1) {
    return gain * CAPITAL_GAINS_INCLUSION * (rate / 100);
  }
  return gain * CAPITAL_GAINS_INCLUSION * rate;
}

export function calcSaleTaxFromAsset(salePrice, asset, entity) {
  const acb = getAssetAcb(asset);
  const rate = parseFloat(entity?.marginalTaxRate) || 53.31;
  const tax = calcCapitalGainsTax(salePrice, acb, rate);
  return { gain: Math.max(0, salePrice - acb), tax, netProceeds: salePrice - tax };
}

import { getMarginalRate } from './helpers';
import { calcCapitalGainsTax } from './capitalGains';
import { CAPITAL_GAINS_INCLUSION } from '../investmentPlanningService';

/**
 * Retrait REER : 100 % imposable, réduit le solde.
 * @returns {{ tax: number, taxableIncome: number }}
 */
export function applyReerWithdrawal(asset, amount, entity) {
  const amt = Math.min(parseFloat(amount) || 0, parseFloat(asset?.currentBalance) || 0);
  if (amt <= 0) return { tax: 0, taxableIncome: 0, withdrawn: 0 };
  const rate = getMarginalRate(entity);
  const tax = amt * rate;
  asset.currentBalance = Math.max(0, (parseFloat(asset.currentBalance) || 0) - amt);
  return { tax, taxableIncome: amt, withdrawn: amt };
}

/** Cotisation REER : sortie de trésorerie, pas d'impôt. */
export function applyReerContribution(asset, amount) {
  const amt = Math.max(0, parseFloat(amount) || 0);
  asset.currentBalance = (parseFloat(asset.currentBalance) || 0) + amt;
  return { amount: amt };
}

/** Retrait CELI : non imposable. */
export function applyCeliWithdrawal(asset, amount) {
  const amt = Math.min(parseFloat(amount) || 0, parseFloat(asset?.currentBalance) || 0);
  asset.currentBalance = Math.max(0, (parseFloat(asset.currentBalance) || 0) - amt);
  return { withdrawn: amt, tax: 0 };
}

export function applyCeliContribution(asset, amount) {
  const amt = Math.max(0, parseFloat(amount) || 0);
  asset.currentBalance = (parseFloat(asset.currentBalance) || 0) + amt;
  return { amount: amt };
}

/** Vente / disposition compte à PNB. */
export function applyTaxableAccountSale(asset, salePrice, entity) {
  const price = parseFloat(salePrice) || parseFloat(asset?.currentBalance) || 0;
  const acb = parseFloat(asset?._acb) ?? parseFloat(asset?.acb) ?? price;
  const gain = Math.max(0, price - acb);
  const rate = getMarginalRate(entity);
  const tax = gain * CAPITAL_GAINS_INCLUSION * rate;
  return { gain, tax, netProceeds: price - tax };
}

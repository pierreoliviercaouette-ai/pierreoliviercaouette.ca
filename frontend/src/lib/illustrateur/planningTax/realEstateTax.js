/**
 * Déductions fiscales immobilières par actif (intérêts hypothécaires, CCA, dépenses op.).
 * Le capital remboursé n'est pas déductible — seuls les intérêts le sont (LIR).
 */

import { calcMortgageInterestByEntity } from './interestDeductibility';

export function getAssetCcaAnnual(asset, grossRentalAnnual = 0) {
  const rate = (parseFloat(asset?.ccaRatePercent) || 0) / 100;
  if (rate <= 0) return 0;
  const ucc = parseFloat(asset?.uccBalance);
  const base = Number.isFinite(ucc) && ucc > 0
    ? ucc
    : parseFloat(asset?._acb) || parseFloat(asset?.currentBalance) || 0;
  return Math.max(0, base * rate);
}

export function getAssetOperatingExpenses(asset, grossRentalAnnual = 0) {
  const fixed = parseFloat(asset?.operatingExpensesAnnual);
  if (Number.isFinite(fixed) && fixed > 0) return fixed;
  const pct = (parseFloat(asset?.operatingExpensesPercent) || 0) / 100;
  if (pct > 0 && grossRentalAnnual > 0) return grossRentalAnnual * pct;
  return 0;
}

export function calcMortgageDebtServiceByEntity(debts = []) {
  const result = {};
  for (const d of debts) {
    if (d.type === 'hypotheque' && d.currentBalance > 0) {
      const eid = d.entityId;
      result[eid] = (result[eid] || 0) + (parseFloat(d.monthlyPayment) || 0) * 12;
    }
  }
  return result;
}

/** Déductions immeuble par entité (intérêts hypothécaires + CCA + dépenses liées aux actifs). */
export function calcRealEstateDeductionsByEntity(assets, revenues, debts) {
  const mortgageInterestByEntity = calcMortgageInterestByEntity(debts, assets);
  const rentalByAssetId = {};
  for (const r of revenues) {
    if (r.type !== 'revenu_immeuble') continue;
    const aid = r.linkedAssetId;
    if (!aid) continue;
    rentalByAssetId[aid] = (rentalByAssetId[aid] || 0) + (parseFloat(r.monthlyAmount) || 0) * 12;
  }

  const ccaAndOpexByEntity = {};
  for (const a of assets) {
    if (a.type !== 'immobilier') continue;
    const eid = a.entityId;
    const gross = rentalByAssetId[a.id] || 0;
    const cca = getAssetCcaAnnual(a, gross);
    const opex = getAssetOperatingExpenses(a, gross);
    ccaAndOpexByEntity[eid] = (ccaAndOpexByEntity[eid] || 0) + cca + opex;
  }

  const out = {};
  const entityIds = new Set([
    ...Object.keys(mortgageInterestByEntity),
    ...Object.keys(ccaAndOpexByEntity),
  ]);
  for (const eid of entityIds) {
    out[eid] = (mortgageInterestByEntity[eid] || 0) + (ccaAndOpexByEntity[eid] || 0);
  }
  return out;
}

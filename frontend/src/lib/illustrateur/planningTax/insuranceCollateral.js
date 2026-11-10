/**
 * Assurance participative : capacité collatérale, PFI, CBR simplifié, CDC au décès.
 * Estimations — valider avec un fiscaliste.
 */

import {
  getInsuranceDeathBenefitFromRow,
  getInsuranceScheduleRow,
} from './insuranceScheduleUtils.js';

export const DEFAULT_COLLATERAL_LTV = 90;
export const LEGACY_COLLATERAL_LTV = 80;

export function getPolicyLtvPercent(policy) {
  const raw = parseFloat(policy?.collateralLtvPercent);
  if (Number.isFinite(raw) && raw > 0 && raw <= 100) return raw;
  return DEFAULT_COLLATERAL_LTV;
}

export function getPolicyAdjustedCostBase(policy) {
  const manual = parseFloat(policy?.adjustedCostBase);
  if (Number.isFinite(manual) && manual >= 0) return manual;
  return parseFloat(policy?._computedCbr) || 0;
}

/** Somme des dettes liées à une police (prêts collatéraux, etc.). */
export function sumLinkedDebtOnPolicy(debts, policyId, excludeDebtIds = null) {
  const exclude = excludeDebtIds ? new Set(excludeDebtIds) : null;
  return (debts || []).reduce((acc, d) => {
    if (d.linkedAssetId !== policyId) return acc;
    if (exclude?.has(d.id)) return acc;
    return acc + (parseFloat(d.currentBalance) || 0);
  }, 0);
}

/**
 * Capacité d'emprunt collatéral restante sur une police.
 * @returns {{ surrenderValue, ltvPercent, maxEncumbrance, linkedDebt, availableCapacity }}
 */
export function computeCollateralCapacity(policy, debts, options = {}) {
  const policyId = policy?.id;
  const surrenderValue = parseFloat(policy?.currentBalance) || 0;
  const ltvPercent = options.ltvPercent ?? getPolicyLtvPercent(policy);
  const excludeDebtIds = options.excludeDebtIds;
  const linkedDebt = policyId
    ? sumLinkedDebtOnPolicy(debts, policyId, excludeDebtIds)
    : 0;
  const maxEncumbrance = surrenderValue * (ltvPercent / 100);
  const availableCapacity = Math.max(0, maxEncumbrance - linkedDebt);

  return {
    surrenderValue,
    ltvPercent,
    maxEncumbrance: Math.round(maxEncumbrance),
    linkedDebt: Math.round(linkedDebt),
    availableCapacity: Math.round(availableCapacity),
  };
}

/** CBR simplifié : primes cumulées − estimation CNAP (mortalité 1 % × (CD − VR)). */
export function estimatePolicyCbr(policy, yearIndex = 0) {
  const schedule = policy?.insuranceSchedule;
  if (!schedule?.length) return getPolicyAdjustedCostBase(policy);

  let premiums = 0;
  const idx = Math.min(
    Math.max(0, policy._insuranceIdx ?? policy.insuranceCurrentYearIdx ?? yearIndex),
    schedule.length - 1,
  );
  for (let i = 0; i <= idx; i++) {
    premiums += parseFloat(schedule[i]?.premiumPaid) || 0;
  }
  const row = schedule[idx] || {};
  const vr = parseFloat(row.surrenderValue) || parseFloat(policy.currentBalance) || 0;
  const cd = parseFloat(row.totalInsurance) || parseFloat(policy.totalInsurance) || 0;
  const mortalityFactor = 0.01;
  const cnapEstimate = Math.max(0, cd - vr) * mortalityFactor * (idx + 1);
  return Math.max(0, premiums - cnapEstimate);
}

export function syncPolicyCbr(policy, yearIndex = 0) {
  const manual = parseFloat(policy?.adjustedCostBase);
  if (Number.isFinite(manual) && manual >= 0) {
    policy._computedCbr = manual;
    return manual;
  }
  const est = estimatePolicyCbr(policy, yearIndex);
  policy._computedCbr = est;
  return est;
}

/** Intérêts annuels sur solde de prêts liés à la police. */
export function annualInterestOnLinkedDebts(debts, policyId) {
  return (debts || []).reduce((acc, d) => {
    if (d.linkedAssetId !== policyId) return acc;
    const bal = parseFloat(d.currentBalance) || 0;
    const rate = (parseFloat(d.interestRate) || 0) / 100;
    return acc + bal * rate;
  }, 0);
}

/**
 * Applique une avance sur police (disposition réputée) — réduit VR et CBR.
 * @returns {{ taxableIncome, newBalance, newCbr }}
 */
export function applyPolicyAdvance(policy, amount) {
  const advance = Math.max(0, parseFloat(amount) || 0);
  if (advance <= 0) return { taxableIncome: 0, newBalance: parseFloat(policy.currentBalance) || 0, newCbr: getPolicyAdjustedCostBase(policy) };

  const cbr = syncPolicyCbr(policy);
  const balance = parseFloat(policy.currentBalance) || 0;
  const taxableIncome = Math.max(0, Math.min(advance, balance) - cbr);
  const newBalance = Math.max(0, balance - advance);
  const newCbr = Math.max(0, cbr - advance);

  policy.currentBalance = newBalance;
  policy.adjustedCostBase = newCbr;
  policy._computedCbr = newCbr;

  return {
    taxableIncome: Math.round(taxableIncome),
    newBalance: Math.round(newBalance),
    newCbr: Math.round(newCbr),
  };
}

/** Résumé collatéral / PFI pour une année de projection. */
export function sumPfiLoanBalance(debts) {
  return (debts || []).reduce((acc, d) => {
    if (!d.isPfiLoan) return acc;
    return acc + (parseFloat(d.currentBalance) || 0);
  }, 0);
}

export function summarizeInsuranceCollateralYear(policies, debts) {
  let collateralLoanBalance = 0;
  let annualCollateralInterest = 0;
  let collateralCapacityTotal = 0;
  let assuranceDeathBenefit = 0;

  for (const p of policies || []) {
    if (p.type !== 'assurance_participative') continue;
    const cap = computeCollateralCapacity(p, debts);
    collateralCapacityTotal += cap.availableCapacity;
    collateralLoanBalance += cap.linkedDebt;
    annualCollateralInterest += annualInterestOnLinkedDebts(debts, p.id);
    assuranceDeathBenefit += parseFloat(p._totalInsurance) || parseFloat(p.totalInsurance) || 0;
  }

  return {
    collateralLoanBalance: Math.round(collateralLoanBalance),
    pfiLoanBalance: Math.round(sumPfiLoanBalance(debts)),
    annualCollateralInterest: Math.round(annualCollateralInterest),
    collateralCapacityTotal: Math.round(collateralCapacityTotal),
    assuranceDeathBenefitTotal: Math.round(assuranceDeathBenefit),
  };
}

/** Capital décès pour l'année du scénario (ligne calendrier ou champs actif). */
export function resolveInsuranceDeathBenefit(policy, scheduleOptions = {}) {
  if (policy?.insuranceSchedule?.length) {
    const row = getInsuranceScheduleRow(policy, scheduleOptions);
    return getInsuranceDeathBenefitFromRow(row, policy);
  }
  return parseFloat(policy._totalInsurance) || parseFloat(policy.totalInsurance) || 0;
}

/**
 * CDC et succession nette pour polices corporatives (simplifié).
 * Société : 100 % du capital décès crédite le CDC (le prêt collatéral ne réduit pas le CDC).
 */
export function computeInsuranceDeathSettlement(policy, debts, entity, scheduleOptions = {}) {
  const benefit = resolveInsuranceDeathBenefit(policy, scheduleOptions);
  const cbr = syncPolicyCbr(policy);
  const linkedDebt = sumLinkedDebtOnPolicy(debts, policy.id);
  const isCorp = entity?.type === 'corporation' || entity?.type === 'societe';
  const cdcCredit = isCorp ? Math.max(0, benefit) : 0;
  const netAfterLoan = Math.max(0, benefit - linkedDebt);

  return {
    deathBenefit: Math.round(benefit),
    adjustedCostBase: Math.round(cbr),
    collateralDebtAtDeath: Math.round(linkedDebt),
    cdcCredit: Math.round(cdcCredit),
    netDeathBenefitAfterLoan: Math.round(netAfterLoan),
    isCorporatePolicyholder: isCorp,
  };
}

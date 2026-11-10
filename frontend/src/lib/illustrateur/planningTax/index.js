import { computeRevenueTaxByEntity } from './annualIncomeTax';
import { computeTaxableInvestmentIncomeByEntity } from './investmentIncomeTax';
import {
  computeEntityCashflows,
  annualPremiumForAssuranceCashflow,
  rawAnnualPremiumForAssurance,
} from './entityCashflow';
import { computeDeathTaxSummary, NON_TAXABLE_AT_DEATH_TYPES } from './deathTax';
import { growAssetsWithTax } from './growthTax';
import { calcCapitalGainsTax, calcSaleTaxFromAsset } from './capitalGains';
import { buildEntityMap, getAssetAcb, ensureAssetAcb } from './helpers';
import { getEffectiveAssetTaxType, getAssetTaxProfileLabel } from './assetTaxProfiles';
import {
  GROWTH_TAX_DEFERRED_TYPES,
  APPRECIATION_ONLY_TYPES,
  CAPITAL_GAINS_BOOK_TYPES,
} from './constants';
import { getInsurancePremiumForDebit } from './insuranceScheduleUtils';

export function deductInsurancePremiumsFromLiquidAccounts(assets, cashflowTracker = null, scheduleOptions = {}) {
  for (const pol of assets) {
    if (pol.type !== 'assurance_participative') continue;
    const prem = getInsurancePremiumForDebit(pol, scheduleOptions);
    if (prem <= 0) continue;
    const debitId = pol.premiumDebitAssetId;
    if (!debitId) continue;
    const acct = assets.find((x) => x.id === debitId);
    if (!acct) continue;
    if (acct.type === 'immobilier' || acct.type === 'assurance_participative') continue;
    const bal = parseFloat(acct.currentBalance) || 0;
    const debited = Math.min(bal, prem);
    acct.currentBalance = Math.max(0, bal - debited);
    if (debited > 0) cashflowTracker?.add(acct.id, -debited);
  }
}

export {
  computeAnnualEntityCashflowFromImpacts,
} from './assetCashflowImpact';

export {
  isPastInsuranceScheduleEnd,
  syncInsurancePoliciesForProjectionYear,
  getInsurancePremiumForDebit,
  getEntityInsurancePremiumAnnual,
  isPremiumPaidFromLiquidAccount,
} from './insuranceScheduleUtils';

export {
  GROWTH_TAX_DEFERRED_TYPES,
  APPRECIATION_ONLY_TYPES,
  CAPITAL_GAINS_BOOK_TYPES,
  NON_TAXABLE_AT_DEATH_TYPES,
  growAssetsWithTax,
  computeDeathTaxSummary,
  computeEntityCashflows,
  annualPremiumForAssuranceCashflow,
  rawAnnualPremiumForAssurance,
  computeRevenueTaxByEntity,
  computeTaxableInvestmentIncomeByEntity,
  getEffectiveAssetTaxType,
  getAssetTaxProfileLabel,
  buildEntityMap,
  getAssetAcb,
  ensureAssetAcb,
  calcCapitalGainsTax,
  calcSaleTaxFromAsset,
};

export {
  INTEREST_DEDUCTION_PURPOSES,
  DEFAULT_PLANNING_PROVINCE,
  isDebtInterestDeductible,
  isQuebecJurisdiction,
  calcDebtInterestSplit,
  calcDebtDeductibleInterestWithCap,
  calcInterestTaxShield,
  calcMortgageInterestByEntity,
  createQuebecInterestCapTracker,
  applyQuebecInterestCap,
  resolveDebtInterestPurpose,
  defaultCollateralInterestPurpose,
  normalizeProvince,
} from './interestDeductibility';

export {
  computeCollateralCapacity,
  getPolicyLtvPercent,
  getPolicyAdjustedCostBase,
  sumLinkedDebtOnPolicy,
  syncPolicyCbr,
  applyPolicyAdvance,
  summarizeInsuranceCollateralYear,
  computeInsuranceDeathSettlement,
  resolveInsuranceDeathBenefit,
  sumPfiLoanBalance,
} from './insuranceCollateral';

export {
  newShareholderId,
  normalizeDividendPolicy,
  normalizeCorpTaxAccounts,
  validateShareholderPercents,
  getResolvedShareholders,
  distributeCorporateDividends,
  runAutoDividendPolicy,
  accrueCorporateTaxAccounts,
  applyDistributionToEntityCashflows,
  depositToEntityAssets,
  prepareCorporationsForProjection,
  summarizeCorpTaxBalances,
  accrueCdcFromInsuranceDeath,
  getCorpTaxState,
  DEFAULT_DIVIDEND_ORDER,
  DIVIDEND_CLASSES,
} from './corporateIntegration';

export {
  REVENUE_GROWTH_DEFAULTS,
  PERSONAL_REVENUE_TYPES,
  RENTAL_REVENUE_TYPES,
  isPersonalRevenueType,
  isRentalRevenueType,
  getDefaultGrowthRate,
  getDefaultGrowthPercentDisplay,
  getDefaultGrowthPercent,
  applyRevenueAdjustmentsForYear,
  growRevenuesForYear,
  buildRevenueTimeline,
  sumRevenueMonthly,
  newAdjustmentId,
} from './revenueSchedule';

export {
  isCorpToPersonalFlow,
  isCorpSourcedDividendPipeline,
  processPlannedCorpToPersonalForCorp,
  mergeCorpPersonalDistributionsIntoRevenueTax,
  refreshTaxSnapshotAfterCorpPersonal,
} from './corpPersonalRevenue';

/** @deprecated Alias — utiliser GROWTH_TAX_DEFERRED_TYPES + APPRECIATION_ONLY_TYPES */
export const TAX_SHELTERED_TYPES = new Set([
  ...GROWTH_TAX_DEFERRED_TYPES,
  ...APPRECIATION_ONLY_TYPES,
]);

/**
 * Snapshot fiscal annuel unifié (bilan + projection).
 */
export function computeYearTaxSnapshot({
  entities = [],
  assets = [],
  debts = [],
  revenues = [],
  year = null,
  projectionYearIndex = null,
}) {
  const revenueTax = computeRevenueTaxByEntity({ entities, assets, debts, revenues });
  const investmentIncome = computeTaxableInvestmentIncomeByEntity(assets, entities);
  const entityCashflows = computeEntityCashflows({
    entities,
    assets,
    debts,
    revenues,
    calendarYear: year,
    projectionYearIndex,
  });

  const totalMonthlyRev = revenues.reduce((s, r) => s + (parseFloat(r.monthlyAmount) || 0), 0);
  const totalMonthlyDebt = debts.reduce((s, d) => s + (parseFloat(d.monthlyPayment) || 0), 0);
  const annualInsurancePremiums = Object.values(entityCashflows).reduce(
    (s, cf) => s + (cf.insurancePremiums || 0),
    0,
  );

  const totalAnnualRevGross = totalMonthlyRev * 12;
  const totalAnnualRevAfterTax = revenueTax.totalAfterTax;
  const totalMonthlyRevAfterTax = totalAnnualRevAfterTax / 12;
  const annualTax = revenueTax.totalTax;
  const annualCashflowAfterTax =
    (totalMonthlyRevAfterTax - totalMonthlyDebt) * 12 - annualInsurancePremiums;

  return {
    year,
    totalGrossRevenue: Math.round(totalAnnualRevGross),
    totalRevenueAfterTax: Math.round(totalAnnualRevAfterTax),
    totalTax: Math.round(annualTax),
    investmentIncome,
    revenueTax,
    entityCashflows,
    monthlyRevenue: totalMonthlyRev,
    monthlyRevenueAfterTax: totalMonthlyRevAfterTax,
    monthlyDebtPayment: totalMonthlyDebt,
    monthlyTax: annualTax / 12,
    monthlyCashflowAfterTax: annualCashflowAfterTax / 12,
    annualDebtPayment: Math.round(totalMonthlyDebt * 12),
    annualCashflowAfterTax: Math.round(annualCashflowAfterTax),
    annualInsurancePremiums: Math.round(annualInsurancePremiums),
  };
}

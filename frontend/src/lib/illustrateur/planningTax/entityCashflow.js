import { calcDividendTax } from '../investmentPlanningService';
import { buildEntityMap, getMarginalRate } from './helpers';
import { computeRevenueTaxByEntity } from './annualIncomeTax';
import { computeTaxableInvestmentIncomeByEntity, shouldIncludeInvestmentIncomeInCashflow } from './investmentIncomeTax';
import {
  getEntityInsurancePremiumAnnual,
  getInsurancePremiumForPolicy,
  getInsuranceScheduleRow,
  getInsurancePremiumFromRow,
} from './insuranceScheduleUtils';

/** Prime brute (calendrier / champ annuel), sans tenir compte du toggle trésorerie. */
export function rawAnnualPremiumForAssurance(a, options = {}) {
  if (!a || a.type !== 'assurance_participative') return 0;
  if (a.insuranceSchedule?.length) {
    const row = getInsuranceScheduleRow(a, options);
    return getInsurancePremiumFromRow(row, a);
  }
  return parseFloat(a.annualPremium) || 0;
}

export function annualPremiumForAssuranceCashflow(a, options = {}) {
  if (!a || a.type !== 'assurance_participative') return 0;
  if (a.includePremiumsInCashflow === false) return 0;
  return getInsurancePremiumForPolicy(a, options);
}

/**
 * Trésorerie opérationnelle par entité (alignée sur computeYearTaxSnapshot).
 */
export function computeEntityCashflows({
  entities = [],
  assets = [],
  debts = [],
  revenues = [],
  cashflowDirection = null,
  calendarYear = null,
  projectionYearIndex = null,
}) {
  const scheduleOptions = { calendarYear, projectionYearIndex };
  const entityMap = buildEntityMap(entities);
  const revenueTax = computeRevenueTaxByEntity({ entities, assets, debts, revenues });
  const investmentIncome = computeTaxableInvestmentIncomeByEntity(assets, entities);

  const flows = {};

  for (const e of entities) {
    const eid = e.id;
    const rev = revenueTax.byEntity[eid] || {
      grossImmeuble: 0,
      grossOther: 0,
      grossDividends: 0,
      totalTax: 0,
      totalAfterTax: 0,
    };

    const grossRev =
      (rev.grossImmeuble || 0) + (rev.grossOther || 0) + (rev.grossDividends || 0);

    let taxableAssetIncome = 0;
    let taxableAssetTax = 0;
    const inv = investmentIncome.byEntity[eid];
    if (inv) {
      taxableAssetIncome = inv.gross;
      taxableAssetTax = inv.tax;
    }

    const includeInvInCashflow = assets.some(
      (a) => a.entityId === eid && shouldIncludeInvestmentIncomeInCashflow(a),
    );
    const investmentNetInCashflow = includeInvInCashflow ? (inv?.net || 0) : 0;

    const incomeTax = (rev.totalTax || 0) + (includeInvInCashflow ? taxableAssetTax : 0);
    const treasuryAfterTax = rev.totalAfterTax || 0;
    const netRevenue = treasuryAfterTax + investmentNetInCashflow;

    const debtPayments = debts
      .filter((d) => d.entityId === eid && d.currentBalance > 0)
      .reduce((s, d) => s + (parseFloat(d.monthlyPayment) || 0) * 12, 0);

    const contributions = assets
      .filter((a) => a.entityId === eid && a.type !== 'immobilier' && a.type !== 'assurance_participative')
      .reduce((s, a) => s + (parseFloat(a.monthlyContribution) || 0) * 12, 0);

    const insurancePremiums = assets
      .filter((a) => a.entityId === eid && a.type === 'assurance_participative')
      .reduce((s, a) => s + getEntityInsurancePremiumAnnual(a, scheduleOptions), 0);

    // Répartition trésorerie : revenus d'exploitation seulement (pas le revenu de placement
    // déjà porté par le compte Gestco — évite de réinjecter le rendement via la société).
    const operatingCashflow = treasuryAfterTax - debtPayments - contributions - insurancePremiums;

    flows[eid] = {
      entityName: e.name,
      entityType: e.type,
      grossRevenue: Math.round(grossRev),
      taxableAssetIncome: Math.round(taxableAssetIncome),
      incomeTax: Math.round(incomeTax),
      taxBreakdown: {
        revenueTax: Math.round(rev.totalTax || 0),
        investmentTax: Math.round(includeInvInCashflow ? taxableAssetTax : 0),
        realEstateDeductions: Math.round(rev.realEstateDeductions || 0),
      },
      netRevenue: Math.round(netRevenue),
      debtPayments: Math.round(debtPayments),
      contributions: Math.round(contributions),
      insurancePremiums: Math.round(insurancePremiums),
      operatingCashflow: Math.round(operatingCashflow),
      dividendPaid: 0,
      dividendReceived: 0,
      dividendTax: 0,
      imrtdRefunded: 0,
      corpTaxAccounts: null,
      netCashflow: Math.round(operatingCashflow + investmentNetInCashflow),
    };
  }

  return flows;
}

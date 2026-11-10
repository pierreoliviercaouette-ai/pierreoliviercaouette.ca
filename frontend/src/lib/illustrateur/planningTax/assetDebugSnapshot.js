import { sumLinkedDebtOnPolicy } from './insuranceCollateral';
import {
  buildAssetCashflowDetail,
  calcAssuranceNetCashflowOut,
  cashflowFieldsForAsset,
} from './assetCashflowImpact';
import { calcDebtAnnualInterest } from './debtAmortization';
import { getMarginalRate } from './helpers';
import { createQuebecInterestCapTracker } from './interestDeductibility';
import {
  getInsuranceDeathBenefitFromRow,
  getInsurancePremiumFromRow,
  getInsuranceScheduleRow,
  getInsuranceSurrenderFromRow,
} from './insuranceScheduleUtils';

export { calcDebtAnnualInterest } from './debtAmortization';

/** Métadonnées minimales pour le sélecteur débogage (bilan + actifs créés en planification). */
export function pickAssetCatalogEntry(asset) {
  if (!asset?.id) return null;
  return {
    id: asset.id,
    name: asset.name || `Actif ${asset.id}`,
    type: asset.type || 'autre',
    entityId: asset.entityId,
    insuranceSchedule: asset.insuranceSchedule,
    insuranceCurrentYearIdx: asset.insuranceCurrentYearIdx,
    adjustedCostBase: asset.adjustedCostBase,
    totalInsurance: asset.totalInsurance,
    fromPlanningOnly: !!asset.fromPlanningOnly,
  };
}

export function syncAssetCatalogFromAssets(catalogMap, assets) {
  for (const a of assets || []) {
    if (!a?.id) continue;
    catalogMap.set(a.id, {
      ...pickAssetCatalogEntry(a),
      fromPlanningOnly: catalogMap.get(a.id)?.fromPlanningOnly ?? a.fromPlanningOnly ?? false,
    });
  }
}

/** Fusionne actifs du bilan et catalogue issu de la projection (événements planification). */
export function mergeAssetsForDebug(bilanAssets = [], projectedCatalog = []) {
  const byId = new Map();
  for (const a of bilanAssets || []) {
    if (!a?.id) continue;
    byId.set(a.id, { ...a, fromPlanningOnly: false });
  }
  for (const entry of projectedCatalog || []) {
    if (!entry?.id) continue;
    if (byId.has(entry.id)) {
      const existing = byId.get(entry.id);
      byId.set(entry.id, {
        ...existing,
        insuranceSchedule: existing.insuranceSchedule || entry.insuranceSchedule,
        type: existing.type || entry.type,
      });
    } else {
      byId.set(entry.id, { ...entry, fromPlanningOnly: true });
    }
  }
  return Array.from(byId.values()).sort((a, b) => (a.name || '').localeCompare(b.name || '', 'fr'));
}

export function buildAssetDebugSnapshot(
  assets,
  debts,
  {
    cashflowByAssetId = null,
    revenues = [],
    revenueTax = null,
    entities = [],
    calendarYear = null,
    projectionYearIndex = null,
  } = {},
) {
  const scheduleOptions = { calendarYear, projectionYearIndex };
  const snapshot = {};
  const entityMap = {};
  for (const e of entities || []) {
    if (e?.id) entityMap[e.id] = e;
  }
  const quebecCapTracker = createQuebecInterestCapTracker(entities, assets, revenueTax);

  for (const a of assets || []) {
    if (a.type === 'assurance_participative') {
      const row = getInsuranceScheduleRow(a, scheduleOptions);
      const marginalRate = getMarginalRate(entityMap[a.entityId]);
      const assuranceCf = calcAssuranceNetCashflowOut(
        a,
        debts,
        scheduleOptions,
        assets,
        marginalRate,
        entityMap[a.entityId],
        quebecCapTracker,
      );
      const {
        loanInterest,
        netPremiumAfterInterest,
        totalOutflow,
        deductibleInterest,
        interestTaxShield,
        quebecInterestCapped,
        netCashflowImpact,
      } = assuranceCf;
      const premiumPaid = getInsurancePremiumFromRow(row, a);
      const loanInterestAnnual = loanInterest > 0
        ? loanInterest
        : (debts || [])
          .filter((d) => d.linkedAssetId === a.id)
          .reduce((s, d) => s + calcDebtAnnualInterest(d), 0);
      const premiumPlusInterest = premiumPaid + loanInterestAnnual;
      const cashflowOut = netCashflowImpact ?? -(totalOutflow || 0);
      const surrenderValue = getInsuranceSurrenderFromRow(row, a);
      const collateralLoanBalance = sumLinkedDebtOnPolicy(debts, a.id);
      const cf = cashflowFieldsForAsset(a, entities, cashflowByAssetId?.[a.id] ?? cashflowOut);

      snapshot[a.id] = {
        ...cf,
        type: a.type,
        name: a.name,
        premiumPaid: Math.round(premiumPaid),
        loanInterestAnnual: Math.round(loanInterestAnnual),
        deductibleInterestAnnual: Math.round(deductibleInterest ?? 0),
        interestTaxShield: Math.round(interestTaxShield ?? 0),
        quebecInterestCapped: Math.round(quebecInterestCapped ?? 0),
        netPremiumAfterInterest: Math.round(netPremiumAfterInterest),
        premiumPlusInterest: Math.round(premiumPlusInterest),
        surrenderValue: Math.round(surrenderValue),
        collateralLoanBalance: Math.round(collateralLoanBalance),
        totalInsurance: Math.round(getInsuranceDeathBenefitFromRow(row, a)),
        cashValue: Math.round(parseFloat(a.currentBalance) || surrenderValue || 0),
        cbr: Math.round(parseFloat(a._computedCbr) || parseFloat(a.adjustedCostBase) || 0),
        insurancePremium: Math.round(premiumPaid),
        cashflowImpact: Math.round(cashflowByAssetId?.[a.id] ?? cashflowOut),
        cashflowImpactPersonnel: cf.entityType === 'personnel'
          ? Math.round(cashflowByAssetId?.[a.id] ?? cashflowOut)
          : 0,
        cashflowImpactCorporation: cf.entityType === 'corporation'
          ? Math.round(cashflowByAssetId?.[a.id] ?? cashflowOut)
          : 0,
      };
      continue;
    }

    const cf = cashflowFieldsForAsset(a, entities, cashflowByAssetId?.[a.id] ?? 0);

    if (a.type === 'immobilier') {
      const detail = buildAssetCashflowDetail(a, revenues, debts, revenueTax, scheduleOptions, entityMap) || {};
      snapshot[a.id] = {
        ...cf,
        type: a.type,
        name: a.name,
        balance: Math.round(parseFloat(a.currentBalance) || 0),
        rentalNetAfterTax: Math.round(detail.rentalNetAfterTax || 0),
        debtService: Math.round(detail.debtService || 0),
        cashflowImpact: Math.round(cashflowByAssetId?.[a.id] ?? 0),
      };
    } else {
      const endBal = parseFloat(a.currentBalance) || 0;
      const startBal = parseFloat(a._balanceYearStart);
      const balanceChangeInYear = Number.isFinite(startBal)
        ? Math.round(endBal - startBal)
        : null;
      snapshot[a.id] = {
        ...cf,
        type: a.type || 'autre',
        name: a.name,
        balance: Math.round(endBal),
        balanceChangeInYear,
        cashflowImpact: Math.round(cashflowByAssetId?.[a.id] ?? 0),
      };
    }
  }
  return snapshot;
}

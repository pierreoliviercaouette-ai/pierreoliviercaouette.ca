import { calcDebtAnnualInterest } from './debtAmortization';
import {
  calcDebtDeductibleInterestWithCap,
  calcDebtInterestSplit,
  calcInterestTaxShield,
  calcLinkedDeductibleInterestAnnual,
  calcLinkedNonDeductibleInterestAnnual,
  createQuebecInterestCapTracker,
} from './interestDeductibility';
import {
  getInsurancePremiumForPolicy,
  isPremiumPaidFromLiquidAccount,
} from './insuranceScheduleUtils';
import { getMarginalRate } from './helpers';
import {
  getIncomeYieldFraction,
  isAppreciationOnly,
  isGrowthTaxDeferred,
} from './assetTaxProfiles';
import { isCorporatePassiveAsset, calcCorporatePassiveInvestmentTax } from './corporateTax';
import { shouldIncludeInvestmentIncomeInCashflow } from './investmentIncomeTax';

/** Suivi des flux trésorerie attribuables à un actif pendant une année de projection. */
export function createAssetCashflowTracker() {
  const deltas = {};
  return {
    add(assetId, amount) {
      if (!assetId || !amount) return;
      deltas[assetId] = (deltas[assetId] || 0) + amount;
    },
    toMap() {
      return { ...deltas };
    },
  };
}

function addTo(impacts, assetId, amount) {
  if (!assetId || !amount) return;
  impacts[assetId] = (impacts[assetId] || 0) + amount;
}

/** Revenus locatifs liés à l'immeuble (brut annuel). */
export function getLinkedRentalGrossAnnual(assetId, revenues = []) {
  return (revenues || [])
    .filter((r) => r.type === 'revenu_immeuble' && r.linkedAssetId === assetId)
    .reduce((s, r) => s + (parseFloat(r.monthlyAmount) || 0) * 12, 0);
}

/**
 * Part du revenu net après impôt (immeuble) attribuable à la propriété,
 * au prorata des loyers liés vs total immeuble de l'entité.
 */
export function calcLinkedRentalNetAfterTax(asset, revenues = [], revenueTax = null) {
  const grossRent = getLinkedRentalGrossAnnual(asset.id, revenues);
  if (grossRent <= 0) return 0;

  const eid = asset.entityId;
  const rev = revenueTax?.byEntity?.[eid];
  if (!rev) return grossRent;

  const entityGrossImmeuble = rev.grossImmeuble || 0;
  if (entityGrossImmeuble <= 0) return grossRent;

  const share = grossRent / entityGrossImmeuble;
  const immeubleAfterTax = (rev.grossImmeuble || 0) - (rev.taxImmeuble || 0);
  return immeubleAfterTax * share;
}

/** Répartit le revenu immeuble non lié à un actif entre les immeubles sans ligne de revenu. */
export function distributeUnlinkedRentalNet(assets, revenues, revenueTax, impacts) {
  const immo = (assets || []).filter((a) => a.type === 'immobilier');
  const byEntity = {};
  for (const a of immo) {
    if (!a.entityId) continue;
    if (!byEntity[a.entityId]) byEntity[a.entityId] = [];
    byEntity[a.entityId].push(a);
  }

  for (const [eid, props] of Object.entries(byEntity)) {
    const rev = revenueTax?.byEntity?.[eid];
    if (!rev) continue;

    const entityGross = rev.grossImmeuble || 0;
    const linkedGross = props.reduce((s, a) => s + getLinkedRentalGrossAnnual(a.id, revenues), 0);
    const unlinkedGross = Math.max(0, entityGross - linkedGross);
    if (unlinkedGross <= 0) continue;

    const immeubleAfterTax = (rev.grossImmeuble || 0) - (rev.taxImmeuble || 0);
    const unlinkedNet = entityGross > 0 ? immeubleAfterTax * (unlinkedGross / entityGross) : 0;

    const withoutRent = props.filter((a) => getLinkedRentalGrossAnnual(a.id, revenues) <= 0);
    if (!withoutRent.length) continue;

    const weightSum = withoutRent.reduce(
      (s, a) => s + Math.max(0, parseFloat(a.currentBalance) || 0),
      0,
    );
    for (const a of withoutRent) {
      const w = weightSum > 0
        ? Math.max(0, parseFloat(a.currentBalance) || 0) / weightSum
        : 1 / withoutRent.length;
      addTo(impacts, a.id, unlinkedNet * w);
    }
  }
}

export function calcLinkedDebtServiceAnnual(assetId, debts = []) {
  return (debts || [])
    .filter((d) => d.linkedAssetId === assetId && (parseFloat(d.currentBalance) || 0) > 0)
    .reduce((s, d) => s + (parseFloat(d.monthlyPayment) || 0) * 12, 0);
}

function addInvestmentIncomeInCashflow(impacts, asset, entityMap) {
  if (!shouldIncludeInvestmentIncomeInCashflow(asset)) return;
  if (isGrowthTaxDeferred(asset) || isAppreciationOnly(asset)) return;
  if (asset.type === 'assurance_participative' || asset.type === 'immobilier') return;

  const balance = parseFloat(asset.currentBalance) || 0;
  if (balance <= 0) return;

  const annualReturn = (parseFloat(asset.avgAnnualReturn) || 0) / 100;
  const incomeFrac = getIncomeYieldFraction(asset);
  const grossIncome = balance * annualReturn * incomeFrac;
  if (grossIncome <= 0) return;

  let tax = 0;
  if (isCorporatePassiveAsset(asset)) {
    tax = calcCorporatePassiveInvestmentTax(grossIncome).tax;
  } else {
    tax = grossIncome * getMarginalRate(entityMap?.[asset.entityId]);
  }
  addTo(impacts, asset.id, grossIncome - tax);
}

function applyImmobilierCashflow(impacts, asset, revenues, debts, revenueTax) {
  const rentalNet = calcLinkedRentalNetAfterTax(asset, revenues, revenueTax);
  const debtService = calcLinkedDebtServiceAnnual(asset.id, debts);
  if (rentalNet > 0) addTo(impacts, asset.id, rentalNet);
  if (debtService > 0) addTo(impacts, asset.id, -debtService);
  return { rentalNetAfterTax: rentalNet, debtService };
}

function calcLinkedLoanInterestAnnual(assetId, debts = []) {
  return (debts || [])
    .filter((d) => d.linkedAssetId === assetId)
    .reduce((s, d) => s + calcDebtAnnualInterest(d), 0);
}

/**
 * Sorties de trésorerie police + avantage fiscal sur intérêts déductibles (PFI / collatéral investissement).
 * Les primes ne sont pas déductibles; les intérêts le sont si le prêt finance un revenu (pas les primes seules).
 */
export function calcAssuranceNetCashflowOut(
  asset,
  debts = [],
  scheduleOptions = {},
  assets = [],
  marginalRate = 0,
  entity = null,
  quebecCapTracker = null,
) {
  const prem = getInsurancePremiumForPolicy(asset, scheduleOptions);
  const premiumInAssuranceImpact = isPremiumPaidFromLiquidAccount(asset)
    ? 0
    : Math.max(0, prem);
  const { deductible: deductibleInterest, cappedByQuebec } = calcLinkedDeductibleInterestAnnual(
    asset.id,
    debts,
    assets,
    entity,
    quebecCapTracker,
  );
  const nonDeductibleInterest = calcLinkedNonDeductibleInterestAnnual(asset.id, debts, assets)
    + cappedByQuebec;
  const loanInterest = deductibleInterest + nonDeductibleInterest;
  const interestTaxShield = calcInterestTaxShield(deductibleInterest, marginalRate);

  if (asset?.includePremiumsInCashflow === false) {
    const cashOut = nonDeductibleInterest + deductibleInterest;
    const netImpact = -cashOut + interestTaxShield;
    return {
      premium: prem,
      loanInterest,
      deductibleInterest,
      nonDeductibleInterest,
      interestTaxShield,
      quebecInterestCapped: cappedByQuebec,
      netPremiumAfterInterest: prem - loanInterest,
      totalOutflow: cashOut,
      netCashflowImpact: netImpact,
    };
  }

  const cashOut = Math.max(0, premiumInAssuranceImpact) + Math.max(0, loanInterest);
  const netImpact = -cashOut + interestTaxShield;
  return {
    premium: prem,
    loanInterest,
    deductibleInterest,
    nonDeductibleInterest,
    interestTaxShield,
    quebecInterestCapped: cappedByQuebec,
    netPremiumAfterInterest: prem - loanInterest,
    totalOutflow: cashOut,
    netCashflowImpact: netImpact,
  };
}

function applyAssuranceCashflow(
  impacts,
  asset,
  debts,
  scheduleOptions = {},
  entityMap = {},
  allAssets = [],
  quebecCapTracker = null,
) {
  const ent = entityMap[asset.entityId];
  const marginalRate = getMarginalRate(ent);
  const detail = calcAssuranceNetCashflowOut(
    asset,
    debts,
    scheduleOptions,
    allAssets,
    marginalRate,
    ent,
    quebecCapTracker,
  );
  if (detail.netCashflowImpact !== 0) {
    addTo(impacts, asset.id, detail.netCashflowImpact);
  }
  return {
    insurancePremium: detail.premium,
    loanInterestAnnual: detail.loanInterest,
    deductibleInterestAnnual: detail.deductibleInterest,
    nonDeductibleInterestAnnual: detail.nonDeductibleInterest,
    interestTaxShield: detail.interestTaxShield,
    quebecInterestCapped: detail.quebecInterestCapped,
    netPremiumAfterInterest: detail.netPremiumAfterInterest,
    premiumPlusInterest: detail.premium + detail.loanInterest,
    netCashflowAfterInterestTax: detail.netCashflowImpact,
  };
}

/** Détail optionnel pour le snapshot débogage (immobilier / assurance). */
export function buildAssetCashflowDetail(asset, revenues, debts, revenueTax, scheduleOptions = {}, entityMap = {}) {
  if (asset.type === 'immobilier') {
    return applyImmobilierCashflow({}, asset, revenues, debts, revenueTax);
  }
  if (asset.type === 'assurance_participative') {
    return applyAssuranceCashflow({}, asset, debts, scheduleOptions, entityMap);
  }
  return null;
}

/**
 * Impact net annuel sur la trésorerie par actif (positif = entrée, négatif = sortie).
 * @param {object} [options]
 * @param {Array} [options.revenues]
 * @param {object} [options.revenueTax] — sortie de computeRevenueTaxByEntity
 */
export function buildPerAssetCashflowImpact(
  assets = [],
  debts = [],
  entities = [],
  yearDeltas = {},
  options = {},
) {
  const {
    revenues = [],
    revenueTax = null,
    calendarYear = null,
    projectionYearIndex = null,
  } = options;
  const scheduleOptions = { calendarYear, projectionYearIndex };
  const entityMap = {};
  for (const e of entities || []) {
    entityMap[e.id] = e;
  }

  const impacts = { ...yearDeltas };
  const quebecCapTracker = createQuebecInterestCapTracker(entities, assets, revenueTax);

  for (const a of assets || []) {
    if (!a?.id) continue;

    if (a.type === 'immobilier') {
      applyImmobilierCashflow(impacts, a, revenues, debts, revenueTax);
      continue;
    }

    if (a.type === 'assurance_participative') {
      applyAssuranceCashflow(impacts, a, debts, scheduleOptions, entityMap, assets, quebecCapTracker);
      continue;
    }

    const contrib = (parseFloat(a.monthlyContribution) || 0) * 12;
    if (contrib > 0) addTo(impacts, a.id, -contrib);
    addInvestmentIncomeInCashflow(impacts, a, entityMap);
  }

  distributeUnlinkedRentalNet(assets, revenues, revenueTax, impacts);

  // Dettes liées à placements (hors immeuble / assurance déjà traités)
  for (const d of debts || []) {
    if (!d?.linkedAssetId || (parseFloat(d.currentBalance) || 0) <= 0) continue;
    const linked = assets.find((a) => a.id === d.linkedAssetId);
    if (!linked || linked.type === 'immobilier' || linked.type === 'assurance_participative') continue;
    const annualPay = (parseFloat(d.monthlyPayment) || 0) * 12;
    const ent = entityMap[d.entityId || linked.entityId];
    const split = calcDebtDeductibleInterestWithCap(d, assets, ent, quebecCapTracker);
    const shield = calcInterestTaxShield(split.deductible, getMarginalRate(ent));
    const net = -annualPay + shield;
    if (net) addTo(impacts, d.linkedAssetId, net);
  }

  return impacts;
}

export function isCorporationEntity(entity) {
  return entity?.type === 'corporation';
}

/** Agrège les impacts par sphère (personnel vs société). */
/** Cashflow net entité = somme des impacts par actif (aligné débogage / graphiques). */
export function computeAnnualEntityCashflowFromImpacts(cashflowByEntityType) {
  if (!cashflowByEntityType) return 0;
  if (cashflowByEntityType.total != null) return cashflowByEntityType.total;
  return (cashflowByEntityType.personnel ?? 0) + (cashflowByEntityType.corporation ?? 0);
}

export function summarizeCashflowByEntityType(impacts, assets = [], entities = []) {
  const entityById = {};
  for (const e of entities || []) {
    entityById[e.id] = e;
  }

  let personnel = 0;
  let corporation = 0;
  for (const a of assets || []) {
    if (!a?.id) continue;
    const amount = impacts[a.id] || 0;
    if (!amount) continue;
    if (isCorporationEntity(entityById[a.entityId])) {
      corporation += amount;
    } else {
      personnel += amount;
    }
  }

  return {
    personnel: Math.round(personnel),
    corporation: Math.round(corporation),
    total: Math.round(personnel + corporation),
  };
}

export function cashflowFieldsForAsset(asset, entities, impact) {
  const ent = (entities || []).find((e) => e.id === asset?.entityId);
  const corp = isCorporationEntity(ent);
  const rounded = Math.round(impact || 0);
  return {
    entityId: asset?.entityId || '',
    entityName: ent?.name || '',
    entityType: corp ? 'corporation' : 'personnel',
    cashflowImpact: rounded,
    cashflowImpactPersonnel: corp ? 0 : rounded,
    cashflowImpactCorporation: corp ? rounded : 0,
  };
}

/**
 * Déductibilité des intérêts (LIR / PROJ-20-4 iA).
 * — Intérêts déductibles si emprunt pour gagner un revenu non exonéré.
 * — Non déductibles si prêt sert uniquement à payer des primes d'assurance vie.
 * — PFI / collatéral sur police permanente : intérêts déductibles lorsque les fonds
 *   financent des placements ou une mise de fonds sur immeuble à revenus.
 * — Québec : intérêts de placement déductibles plafonnés aux revenus de placement de l'année.
 */

import { calcDebtAnnualInterest } from './debtAmortization';
import { computeTaxableInvestmentIncomeByEntity } from './investmentIncomeTax';

export const DEFAULT_PLANNING_PROVINCE = 'QC';

/** Valeurs explicites sur la dette (DebtsManager). */
export const INTEREST_DEDUCTION_PURPOSES = {
  REVENU_LOCATION: 'revenu_location',
  REVENU_PLACEMENT: 'revenu_placement',
  MISE_DE_FONDS_IMMEUBLE: 'mise_de_fonds_immeuble',
  /** Prêt dont le produit sert uniquement aux primes — intérêts non déductibles. */
  PRIMES_ASSURANCE: 'primes_assurance',
  AUCUNE: 'aucune',
};

const DEDUCTIBLE_PURPOSES = new Set([
  INTEREST_DEDUCTION_PURPOSES.REVENU_LOCATION,
  INTEREST_DEDUCTION_PURPOSES.REVENU_PLACEMENT,
  INTEREST_DEDUCTION_PURPOSES.MISE_DE_FONDS_IMMEUBLE,
]);

/**
 * But présumé d'un prêt collatéral / PFI lié à une police (stratégie revenu / immeuble).
 */
export function defaultCollateralInterestPurpose(debt) {
  if (debt?.isPfiLoan) return INTEREST_DEDUCTION_PURPOSES.REVENU_PLACEMENT;
  return INTEREST_DEDUCTION_PURPOSES.MISE_DE_FONDS_IMMEUBLE;
}

export function normalizeProvince(value) {
  const raw = (value ?? DEFAULT_PLANNING_PROVINCE).toString().trim().toLowerCase();
  if (!raw) return 'qc';
  if (raw === 'qc' || raw === 'pq' || raw === 'quebec' || raw === 'québec' || raw === 'que') return 'qc';
  return raw;
}

/** Par défaut QC (majorité des clients planification). */
export function isQuebecJurisdiction(entity) {
  if (!entity) return true;
  if (entity.applyQuebecInterestCap === false) return false;
  if (entity.applyQuebecInterestCap === true) return true;
  const p = normalizeProvince(entity.province ?? entity.jurisdiction);
  return p === 'qc';
}

export function resolveDebtInterestPurpose(debt, assets = []) {
  if (debt?.interestDeductionPurpose) return debt.interestDeductionPurpose;
  const linked = (assets || []).find((a) => a.id === debt?.linkedAssetId);
  if (linked?.type === 'assurance_participative' && (debt.isCollateralLoan || debt.isPfiLoan)) {
    return defaultCollateralInterestPurpose(debt);
  }
  if (debt?.type === 'hypotheque') return INTEREST_DEDUCTION_PURPOSES.REVENU_LOCATION;
  return INTEREST_DEDUCTION_PURPOSES.REVENU_PLACEMENT;
}

function isPlacementPurpose(purpose) {
  return purpose === INTEREST_DEDUCTION_PURPOSES.REVENU_PLACEMENT;
}

function isRentalPurpose(purpose) {
  return purpose === INTEREST_DEDUCTION_PURPOSES.REVENU_LOCATION
    || purpose === INTEREST_DEDUCTION_PURPOSES.MISE_DE_FONDS_IMMEUBLE;
}

/**
 * Budget annuel QC par entité pour plafonner les intérêts déductibles.
 * @param {object|null} revenueTax — sortie computeRevenueTaxByEntity
 */
export function createQuebecInterestCapTracker(entities = [], assets = [], revenueTax = null) {
  const investmentByEntity = computeTaxableInvestmentIncomeByEntity(assets, entities).byEntity;
  const placementBudget = {};
  const rentalBudget = {};

  for (const e of entities || []) {
    if (!e?.id || !isQuebecJurisdiction(e)) continue;
    placementBudget[e.id] = Math.max(0, investmentByEntity[e.id]?.gross || 0);
    rentalBudget[e.id] = Math.max(0, revenueTax?.byEntity?.[e.id]?.grossImmeuble || 0);
  }

  return {
    placementBudget,
    rentalBudget,
    /**
     * @returns {{ allowed: number, capped: number, capType: string|null }}
     */
    allocate(entity, requestedDeductible, purpose) {
      const amount = Math.max(0, requestedDeductible || 0);
      if (amount <= 0) return { allowed: 0, capped: 0, capType: null };
      if (!entity || !isQuebecJurisdiction(entity)) {
        return { allowed: amount, capped: 0, capType: null };
      }
      const eid = entity.id;
      if (isPlacementPurpose(purpose)) {
        const remain = placementBudget[eid] ?? 0;
        const allowed = Math.min(amount, remain);
        placementBudget[eid] = remain - allowed;
        return {
          allowed,
          capped: amount - allowed,
          capType: 'placement',
        };
      }
      if (isRentalPurpose(purpose)) {
        const remain = rentalBudget[eid] ?? 0;
        const allowed = Math.min(amount, remain);
        rentalBudget[eid] = remain - allowed;
        return {
          allowed,
          capped: amount - allowed,
          capType: 'rental',
        };
      }
      return { allowed: amount, capped: 0, capType: null };
    },
  };
}

/** Applique le plafond QC à une demande d'intérêts déductibles. */
export function applyQuebecInterestCap(entity, requestedDeductible, purpose, tracker) {
  if (!tracker || requestedDeductible <= 0) {
    return { deductible: requestedDeductible, cappedByQuebec: 0, capType: null };
  }
  const { allowed, capped, capType } = tracker.allocate(entity, requestedDeductible, purpose);
  return { deductible: allowed, cappedByQuebec: capped, capType };
}

/**
 * Détermine si les intérêts du prêt sont déductibles pour réduire l'impôt sur le revenu.
 * @param {object} debt
 * @param {Array} assets — actifs du bilan / projection
 */
export function isDebtInterestDeductible(debt, assets = []) {
  if (!debt || (parseFloat(debt.currentBalance) || 0) <= 0) return false;

  const explicit = debt.interestDeductionPurpose;
  if (explicit === INTEREST_DEDUCTION_PURPOSES.PRIMES_ASSURANCE
    || explicit === INTEREST_DEDUCTION_PURPOSES.AUCUNE) {
    return false;
  }
  if (DEDUCTIBLE_PURPOSES.has(explicit)) return true;

  const linked = (assets || []).find((a) => a.id === debt.linkedAssetId);

  if (debt.type === 'hypotheque' && linked?.type === 'immobilier') return true;

  if (linked?.type === 'immobilier') return true;

  if (linked?.type === 'assurance_participative' && (debt.isCollateralLoan || debt.isPfiLoan)) {
    return true;
  }

  if (debt.type === 'marge' || debt.type === 'pret_investissement') return true;

  return false;
}

export function calcDebtInterestSplit(debt, assets = []) {
  const interest = calcDebtAnnualInterest(debt);
  if (interest <= 0) return { interest: 0, deductible: 0, nonDeductible: 0 };
  if (isDebtInterestDeductible(debt, assets)) {
    return { interest, deductible: interest, nonDeductible: 0 };
  }
  return { interest, deductible: 0, nonDeductible: interest };
}

/** Intérêts annuels déductibles sur les dettes liées à une police (après plafond QC). */
export function calcLinkedDeductibleInterestAnnual(
  policyId,
  debts = [],
  assets = [],
  entity = null,
  quebecCapTracker = null,
) {
  let deductible = 0;
  let cappedByQuebec = 0;
  for (const d of (debts || []).filter((x) => x.linkedAssetId === policyId)) {
    const split = calcDebtInterestSplit(d, assets);
    if (split.deductible <= 0) continue;
    if (quebecCapTracker && entity) {
      const purpose = resolveDebtInterestPurpose(d, assets);
      const capped = applyQuebecInterestCap(entity, split.deductible, purpose, quebecCapTracker);
      deductible += capped.deductible;
      cappedByQuebec += capped.cappedByQuebec;
    } else {
      deductible += split.deductible;
    }
  }
  return { deductible, cappedByQuebec };
}

export function calcLinkedNonDeductibleInterestAnnual(policyId, debts = [], assets = []) {
  return (debts || [])
    .filter((d) => d.linkedAssetId === policyId)
    .reduce((s, d) => s + calcDebtInterestSplit(d, assets).nonDeductible, 0);
}

/** Intérêts hypothécaires annuels par entité (déduction revenus locatifs). */
export function calcMortgageInterestByEntity(debts = [], assets = []) {
  const result = {};
  for (const d of debts || []) {
    if (d.type !== 'hypotheque' || (parseFloat(d.currentBalance) || 0) <= 0) continue;
    if (!isDebtInterestDeductible(d, assets)) continue;
    const eid = d.entityId;
    if (!eid) continue;
    result[eid] = (result[eid] || 0) + calcDebtAnnualInterest(d);
  }
  return result;
}

/**
 * Économie d'impôt sur intérêts déductibles (taux marginal de l'entité emprunteuse).
 */
export function calcInterestTaxShield(deductibleInterest, marginalRate) {
  const rate = Math.max(0, Math.min(1, parseFloat(marginalRate) || 0));
  return Math.max(0, deductibleInterest) * rate;
}

/** Intérêt déductible + plafond QC pour une dette (cashflow placements). */
export function calcDebtDeductibleInterestWithCap(debt, assets, entity, quebecCapTracker) {
  const split = calcDebtInterestSplit(debt, assets);
  if (split.deductible <= 0) {
    return { ...split, cappedByQuebec: 0, capType: null };
  }
  const purpose = resolveDebtInterestPurpose(debt, assets);
  const capped = applyQuebecInterestCap(entity, split.deductible, purpose, quebecCapTracker);
  return {
    interest: split.interest,
    deductible: capped.deductible,
    nonDeductible: split.nonDeductible + capped.cappedByQuebec,
    cappedByQuebec: capped.cappedByQuebec,
    capType: capped.capType,
  };
}

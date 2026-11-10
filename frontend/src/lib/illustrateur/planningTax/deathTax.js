import { CAPITAL_GAINS_INCLUSION } from '../investmentPlanningService';
import { planHasConjoint } from '../planScope';
import { buildEntityMap, getMarginalRate, getAssetAcb } from './helpers';
import {
  getEffectiveAssetTaxType,
  hasCapitalGainsBook,
} from './assetTaxProfiles';
import { NON_TAXABLE_AT_DEATH_TYPES } from './constants';
import { calcCorporatePassiveInvestmentTax } from './corporateTax';
import { isCorporatePassiveAsset } from './corporateTax';
import {
  computeInsuranceDeathSettlement,
  syncPolicyCbr,
  sumLinkedDebtOnPolicy,
} from './insuranceCollateral';

/** Identifiant de la ligne de dépense auto « Impôt au décès ». */
export const DEATH_TAX_EXPENSE_ID = 'auto_impot_deces';

/** Types personnels admissibles au roullement au conjoint (art. 70(6) / 146 LIR — illustration). */
export const SPOUSAL_ROLLOVER_TYPES = new Set([
  'reer',
  'non_enregistre',
  'immobilier',
  'autre',
  'corporatif',
]);

export function isPersonalEntity(entity) {
  return !entity || entity.type === 'personnel';
}

export function isEligibleForSpousalRollover(asset, entity) {
  if (!isPersonalEntity(entity)) return false;
  const taxType = getEffectiveAssetTaxType(asset);
  if (NON_TAXABLE_AT_DEATH_TYPES.has(taxType)) return false;
  return SPOUSAL_ROLLOVER_TYPES.has(taxType) || hasCapitalGainsBook(asset);
}

function asIdSet(list) {
  return new Set((list || []).filter(Boolean));
}

function resolveDeathOptions(deathOptions = {}) {
  return {
    spousalRollover: Boolean(deathOptions.spousalRollover),
    principalResidenceAssetIds: asIdSet(deathOptions.principalResidenceAssetIds),
    noRolloverAssetIds: asIdSet(deathOptions.noRolloverAssetIds),
  };
}

function computeAssetDeathTax(asset, entity, opts, scheduleOptions) {
  const taxType = getEffectiveAssetTaxType(asset);
  const taxRate = getMarginalRate(entity);
  const fmv = parseFloat(asset.currentBalance) || 0;
  const acb = getAssetAcb(asset);
  const eligibleRollover = isEligibleForSpousalRollover(asset, entity);
  const forceTax = opts.noRolloverAssetIds.has(asset.id);
  const rolled =
    opts.spousalRollover && eligibleRollover && !forceTax;
  const principalResidence =
    taxType === 'immobilier' && opts.principalResidenceAssetIds.has(asset.id);

  if (taxType === 'assurance_participative') {
    syncPolicyCbr(asset);
    const settlement = computeInsuranceDeathSettlement(asset, scheduleOptions._debts || [], entity, scheduleOptions);
    return {
      kind: 'assurance',
      tax: 0,
      taxableIncome: 0,
      capitalGain: 0,
      rolled: false,
      principalResidence: false,
      settlement,
      detail: {
        assetId: asset.id,
        name: asset.name,
        type: 'assurance',
        fmv: Math.round(fmv),
        deathBenefit: settlement.deathBenefit,
        adjustedCostBase: settlement.adjustedCostBase,
        collateralDebtAtDeath: settlement.collateralDebtAtDeath,
        cdcCredit: settlement.cdcCredit,
        netAfterLoan: settlement.netDeathBenefitAfterLoan,
        tax: 0,
        treatment: 'Capital-décès libre d’impôt',
        rolled: false,
        principalResidence: false,
      },
    };
  }

  if (NON_TAXABLE_AT_DEATH_TYPES.has(taxType)) {
    return {
      kind: 'exempt',
      tax: 0,
      taxableIncome: 0,
      capitalGain: 0,
      rolled: false,
      principalResidence: false,
      detail: {
        assetId: asset.id,
        name: asset.name,
        type: taxType,
        fmv: Math.round(fmv),
        acb: Math.round(acb),
        gain: 0,
        tax: 0,
        treatment: taxType === 'celi' ? 'CELI — non imposable au décès' : 'Non imposable',
        rolled: false,
        principalResidence: false,
      },
    };
  }

  if (rolled) {
    return {
      kind: taxType === 'reer' ? 'reer' : 'capital',
      tax: 0,
      taxableIncome: 0,
      capitalGain: taxType === 'reer' ? 0 : Math.max(0, fmv - acb),
      rolled: true,
      principalResidence: false,
      detail: {
        assetId: asset.id,
        name: asset.name,
        type: taxType,
        fmv: Math.round(fmv),
        acb: Math.round(acb),
        gain: taxType === 'reer' ? Math.round(fmv) : Math.round(Math.max(0, fmv - acb)),
        tax: 0,
        treatment:
          taxType === 'reer'
            ? 'Roullement REER au conjoint (art. 146 LIR)'
            : 'Roullement au conjoint à l’ACB (art. 70(6) LIR)',
        rolled: true,
        principalResidence: false,
      },
    };
  }

  if (taxType === 'immobilier') {
    const gain = principalResidence ? 0 : Math.max(0, fmv - acb);
    const tax = gain * CAPITAL_GAINS_INCLUSION * taxRate;
    return {
      kind: 'capital',
      tax,
      taxableIncome: gain * CAPITAL_GAINS_INCLUSION,
      capitalGain: gain,
      rolled: false,
      principalResidence,
      detail: {
        assetId: asset.id,
        name: asset.name,
        type: 'immobilier',
        fmv: Math.round(fmv),
        acb: Math.round(acb),
        gain: Math.round(gain),
        tax: Math.round(tax),
        treatment: principalResidence
          ? 'Exemption résidence principale'
          : 'Disposition réputée — gain en capital (½ inclus)',
        rolled: false,
        principalResidence,
      },
    };
  }

  if (taxType === 'reer') {
    const tax = fmv * taxRate;
    return {
      kind: 'reer',
      tax,
      taxableIncome: fmv,
      capitalGain: 0,
      rolled: false,
      principalResidence: false,
      detail: {
        assetId: asset.id,
        name: asset.name,
        type: 'reer',
        fmv: Math.round(fmv),
        acb: 0,
        gain: Math.round(fmv),
        tax: Math.round(tax),
        treatment: 'Inclusion REER au revenu du défunt (sans roullement)',
        rolled: false,
        principalResidence: false,
      },
    };
  }

  if (hasCapitalGainsBook(asset) && !NON_TAXABLE_AT_DEATH_TYPES.has(taxType)) {
    const gain = Math.max(0, fmv - acb);
    let tax;
    let corpTax = 0;
    let treatment = 'Disposition réputée — gain en capital (½ inclus)';
    if (taxType === 'corporatif' && isCorporatePassiveAsset(asset)) {
      const { tax: cTax } = calcCorporatePassiveInvestmentTax(gain);
      corpTax = cTax;
      tax = corpTax + gain * CAPITAL_GAINS_INCLUSION * taxRate * 0.5;
      treatment = 'Compte corporatif — impôt passif + intégration simplifiée';
    } else {
      tax = gain * CAPITAL_GAINS_INCLUSION * taxRate;
    }
    return {
      kind: 'capital',
      tax,
      corpTax,
      taxableIncome: gain * CAPITAL_GAINS_INCLUSION,
      capitalGain: gain,
      rolled: false,
      principalResidence: false,
      detail: {
        assetId: asset.id,
        name: asset.name,
        type: taxType,
        fmv: Math.round(fmv),
        acb: Math.round(acb),
        gain: Math.round(gain),
        tax: Math.round(tax),
        treatment,
        rolled: false,
        principalResidence: false,
      },
    };
  }

  return {
    kind: 'exempt',
    tax: 0,
    taxableIncome: 0,
    capitalGain: 0,
    rolled: false,
    principalResidence: false,
    detail: {
      assetId: asset.id,
      name: asset.name,
      type: taxType,
      fmv: Math.round(fmv),
      acb: Math.round(acb),
      gain: 0,
      tax: 0,
      treatment: 'Aucun impôt illustré',
      rolled: false,
      principalResidence: false,
    },
  };
}

/**
 * Sommaire d’impôt au décès (disposition réputée LIR / QC).
 * @param {object} [scheduleOptions] — options calendrier assurance; peut contenir deathOptions
 * @param {object} [deathOptions] — { spousalRollover, principalResidenceAssetIds, noRolloverAssetIds }
 */
export function computeDeathTaxSummary(assets = [], debts = [], entities = [], scheduleOptions = {}, deathOptions = {}) {
  const entityMap = buildEntityMap(entities);
  const opts = resolveDeathOptions(deathOptions.spousalRollover != null ? deathOptions : scheduleOptions.deathOptions || {});
  const sched = { ...scheduleOptions, _debts: debts };

  let totalCapitalGainsTax = 0;
  let totalReerTax = 0;
  let totalCorpTax = 0;
  let totalDeathBenefit = 0;
  let totalCdcFromInsurance = 0;
  let totalCollateralDebtAtDeath = 0;
  let totalNetDeathBenefitAfterLoan = 0;
  let rolledAssetCount = 0;
  let deferredGain = 0;
  const details = [];
  const insuranceSettlements = [];

  for (const a of assets) {
    const entity = entityMap?.[a.entityId];
    const result = computeAssetDeathTax(a, entity, opts, sched);

    if (result.kind === 'assurance' && result.settlement) {
      insuranceSettlements.push({ name: a.name, ...result.settlement });
      totalDeathBenefit += result.settlement.deathBenefit;
      totalCdcFromInsurance += result.settlement.cdcCredit;
      totalCollateralDebtAtDeath += result.settlement.collateralDebtAtDeath;
      totalNetDeathBenefitAfterLoan += result.settlement.netDeathBenefitAfterLoan;
    }

    if (result.kind === 'reer') totalReerTax += result.tax;
    else if (result.kind === 'capital') {
      totalCapitalGainsTax += result.tax - (result.corpTax || 0);
      totalCorpTax += result.corpTax || 0;
    }

    if (result.rolled) {
      rolledAssetCount += 1;
      deferredGain += result.capitalGain || (result.detail?.gain || 0);
    }

    // Toujours lister pour transparence (sauf solde 0 et sans traitement utile)
    if (result.detail && ((parseFloat(a.currentBalance) || 0) > 0 || result.tax > 0 || result.rolled)) {
      details.push(result.detail);
    }
  }

  const totalAssets = assets.reduce((s, x) => s + (parseFloat(x.currentBalance) || 0), 0);
  const totalDebts = debts.reduce((s, d) => s + (parseFloat(d.currentBalance) || 0), 0);
  const totalTaxAtDeath = totalCapitalGainsTax + totalReerTax + totalCorpTax;
  const netEstate = totalAssets - totalDebts - totalTaxAtDeath + totalNetDeathBenefitAfterLoan;

  return {
    totalAssets: Math.round(totalAssets),
    totalDebts: Math.round(totalDebts),
    capitalGainsTax: Math.round(totalCapitalGainsTax),
    reerTax: Math.round(totalReerTax),
    corpTax: Math.round(totalCorpTax),
    totalTaxAtDeath: Math.round(totalTaxAtDeath),
    deathBenefit: Math.round(totalDeathBenefit),
    cdcFromInsurance: Math.round(totalCdcFromInsurance),
    collateralDebtAtDeath: Math.round(totalCollateralDebtAtDeath),
    netDeathBenefitAfterLoan: Math.round(totalNetDeathBenefitAfterLoan),
    netEstate: Math.round(netEstate),
    insuranceSettlements,
    details,
    spousalRollover: opts.spousalRollover,
    rolledAssetCount,
    deferredGain: Math.round(deferredGain),
  };
}

/** Options de roullement / PRE dérivées du dossier collecte. */
export function deathTaxOptionsFromPlan(plan) {
  const d = plan?.deathNeeds || {};
  const hasSpouse = planHasConjoint(plan);
  const spousalRollover =
    d.spousalRollover == null ? hasSpouse : Boolean(d.spousalRollover) && hasSpouse;

  let principalResidenceAssetIds = d.principalResidenceAssetIds;
  if (!Array.isArray(principalResidenceAssetIds)) {
    principalResidenceAssetIds = (plan?.assets || [])
      .filter((a) => a.principalResidence || /r[eé]sidence/i.test(a.name || ''))
      .map((a) => a.id);
  }

  return {
    spousalRollover,
    principalResidenceAssetIds,
    noRolloverAssetIds: Array.isArray(d.noRolloverAssetIds) ? d.noRolloverAssetIds : [],
  };
}

/** Calcul d’impôt au décès pour le plan SAAS (frais + attainment). */
export function computePlanDeathTax(plan) {
  return computeDeathTaxSummary(
    plan?.assets || [],
    plan?.debts || [],
    plan?.entities || [],
    {},
    deathTaxOptionsFromPlan(plan),
  );
}

/** Fusionne / met à jour la ligne auto d’impôt dans les dépenses au décès. */
export function syncDeathTaxExpense(expenses = [], taxAmount) {
  const amount = Math.round(Math.max(0, parseFloat(taxAmount) || 0));
  const rest = (expenses || []).filter((e) => e.id !== DEATH_TAX_EXPENSE_ID && e.source !== 'death_tax');
  return [
    ...rest,
    {
      id: DEATH_TAX_EXPENSE_ID,
      description: 'Impôt au décès (estimé LIR / QC)',
      amount,
      indexed: false,
      auto: true,
      source: 'death_tax',
    },
  ];
}

export { NON_TAXABLE_AT_DEATH_TYPES, sumLinkedDebtOnPolicy };

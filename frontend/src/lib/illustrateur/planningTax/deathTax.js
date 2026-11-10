import { CAPITAL_GAINS_INCLUSION } from '../investmentPlanningService';
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

export function computeDeathTaxSummary(assets, debts, entities, scheduleOptions = {}) {
  const entityMap = buildEntityMap(entities);
  let totalCapitalGainsTax = 0;
  let totalReerTax = 0;
  let totalCorpTax = 0;
  let totalDeathBenefit = 0;
  let totalCdcFromInsurance = 0;
  let totalCollateralDebtAtDeath = 0;
  let totalNetDeathBenefitAfterLoan = 0;
  const details = [];
  const insuranceSettlements = [];

  for (const a of assets) {
    const taxType = getEffectiveAssetTaxType(a);
    const entity = entityMap?.[a.entityId];
    const taxRate = getMarginalRate(entity);

    if (taxType === 'immobilier') {
      const fmv = parseFloat(a.currentBalance) || 0;
      const acb = getAssetAcb(a);
      const gain = Math.max(0, fmv - acb);
      const tax = gain * CAPITAL_GAINS_INCLUSION * taxRate;
      totalCapitalGainsTax += tax;
      if (gain > 0) {
        details.push({
          name: a.name,
          type: 'immobilier',
          fmv: Math.round(fmv),
          acb: Math.round(acb),
          gain: Math.round(gain),
          tax: Math.round(tax),
        });
      }
    } else if (taxType === 'reer') {
      const balance = parseFloat(a.currentBalance) || 0;
      const tax = balance * taxRate;
      totalReerTax += tax;
      details.push({
        name: a.name,
        type: 'reer',
        fmv: Math.round(balance),
        acb: 0,
        gain: Math.round(balance),
        tax: Math.round(tax),
      });
    } else if (taxType === 'assurance_participative') {
      syncPolicyCbr(a);
      const settlement = computeInsuranceDeathSettlement(a, debts, entity, scheduleOptions);
      insuranceSettlements.push({ name: a.name, ...settlement });
      totalDeathBenefit += settlement.deathBenefit;
      totalCdcFromInsurance += settlement.cdcCredit;
      totalCollateralDebtAtDeath += settlement.collateralDebtAtDeath;
      totalNetDeathBenefitAfterLoan += settlement.netDeathBenefitAfterLoan;
      details.push({
        name: a.name,
        type: 'assurance',
        fmv: Math.round(parseFloat(a.currentBalance) || 0),
        deathBenefit: settlement.deathBenefit,
        adjustedCostBase: settlement.adjustedCostBase,
        collateralDebtAtDeath: settlement.collateralDebtAtDeath,
        cdcCredit: settlement.cdcCredit,
        netAfterLoan: settlement.netDeathBenefitAfterLoan,
        tax: 0,
      });
    } else if (hasCapitalGainsBook(a) && !NON_TAXABLE_AT_DEATH_TYPES.has(taxType)) {
      const fmv = parseFloat(a.currentBalance) || 0;
      const acb = getAssetAcb(a);
      const gain = Math.max(0, fmv - acb);
      let tax;
      if (taxType === 'corporatif' && isCorporatePassiveAsset(a)) {
        const { tax: corpTax } = calcCorporatePassiveInvestmentTax(gain);
        tax = corpTax + gain * CAPITAL_GAINS_INCLUSION * taxRate * 0.5;
        totalCorpTax += corpTax;
      } else {
        tax = gain * CAPITAL_GAINS_INCLUSION * taxRate;
      }
      totalCapitalGainsTax += tax;
      if (gain > 0) {
        details.push({
          name: a.name,
          type: taxType,
          fmv: Math.round(fmv),
          acb: Math.round(acb),
          gain: Math.round(gain),
          tax: Math.round(tax),
        });
      }
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
  };
}

export { NON_TAXABLE_AT_DEATH_TYPES, sumLinkedDebtOnPolicy };

import { calcDividendTax } from '../investmentPlanningService';
import { buildEntityMap, getMarginalRate } from './helpers';
import { calcRealEstateDeductionsByEntity } from './realEstateTax';
import { isCorpSourcedDividendPipeline } from './corpPersonalRevenue';

function taxOrdinaryIncome(amount, rate) {
  return Math.max(0, amount) * rate;
}

function taxDividendRevenue(annualAmount, entity, revenue) {
  if (revenue.dividendClass === 'capital') {
    return { afterTax: annualAmount, tax: 0 };
  }
  const rate = getMarginalRate(entity) * 100;
  const eligible = revenue.dividendClass === 'eligible'
    || revenue.dividendEligible === true
    || revenue.dividendType === 'eligible'
    || revenue.details?.dividendEligible === true;
  const tax = calcDividendTax(annualAmount, rate, eligible);
  return { afterTax: Math.max(0, annualAmount - tax), tax };
}

/**
 * Calcule revenus bruts / nets / impôt par entité pour une année (snapshot bilan ou projection).
 */
export function computeRevenueTaxByEntity({ entities = [], assets = [], debts = [], revenues = [] }) {
  const entityMap = buildEntityMap(entities);
  const realEstateDeductions = calcRealEstateDeductionsByEntity(assets, revenues, debts);

  const byEntity = {};
  let totalGross = 0;
  let totalTax = 0;
  let totalAfterTax = 0;

  for (const r of revenues) {
    const eid = r.entityId;
    if (!eid) continue;
    if (isCorpSourcedDividendPipeline(r, entityMap)) continue;
    if (!byEntity[eid]) {
      byEntity[eid] = {
        grossImmeuble: 0,
        grossOther: 0,
        grossDividends: 0,
        taxImmeuble: 0,
        taxOther: 0,
        taxDividends: 0,
      };
    }
    const annual = (parseFloat(r.monthlyAmount) || 0) * 12;
    totalGross += annual;
    if (r.type === 'revenu_immeuble') {
      byEntity[eid].grossImmeuble += annual;
    } else if (r.type === 'dividende') {
      byEntity[eid].grossDividends += annual;
    } else {
      byEntity[eid].grossOther += annual;
    }
  }

  for (const [eid, rev] of Object.entries(byEntity)) {
    const ent = entityMap[eid];
    const rate = getMarginalRate(ent);

    const deductions = realEstateDeductions[eid] || 0;
    const taxableImmeuble = Math.max(0, rev.grossImmeuble - deductions);
    rev.taxImmeuble = taxOrdinaryIncome(taxableImmeuble, rate);
    const immeubleAfterTax = rev.grossImmeuble - rev.taxImmeuble;

    let otherTax = 0;
    let otherAfterTax = rev.grossOther;
    if (rev.grossOther > 0) {
      otherTax = taxOrdinaryIncome(rev.grossOther, rate);
      otherAfterTax = rev.grossOther - otherTax;
    }
    rev.taxOther = otherTax;

    let divTax = 0;
    let divAfterTax = rev.grossDividends;
    if (rev.grossDividends > 0) {
      const sample = revenues.find((r) => r.entityId === eid && r.type === 'dividende');
      const d = taxDividendRevenue(rev.grossDividends, ent, sample || {});
      divTax = d.tax;
      divAfterTax = d.afterTax;
    }
    rev.taxDividends = divTax;

    const entityTax = rev.taxImmeuble + rev.taxOther + rev.taxDividends;
    const entityAfterTax = immeubleAfterTax + otherAfterTax + divAfterTax;
    rev.totalTax = entityTax;
    rev.totalAfterTax = entityAfterTax;
    rev.realEstateDeductions = deductions;

    totalTax += entityTax;
    totalAfterTax += entityAfterTax;
  }

  return {
    byEntity,
    totalGross: Math.round(totalGross),
    totalTax: Math.round(totalTax),
    totalAfterTax: Math.round(totalAfterTax),
    realEstateDeductions,
  };
}

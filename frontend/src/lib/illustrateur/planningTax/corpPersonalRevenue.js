/**
 * Revenus / dividendes planifiés d'une Inc. vers le personnel :
 * intégration fiscale (CDC, GRIP, remboursement IMRTD) + impôt personnel par taux marginal.
 */

import { buildEntityMap } from './helpers';
import {
  distributeCorporateDividends,
  getResolvedShareholders,
} from './corporateIntegration';
import { getMarginalRate } from './helpers';

export function isCorpToPersonalFlow(revenue, entityMap) {
  const corpId = revenue?.sourceCorpEntityId;
  if (!corpId) return false;
  const corp = entityMap[corpId];
  const recip = entityMap[revenue?.entityId];
  if (!corp || corp.type !== 'corporation') return false;
  if (!recip || recip.type !== 'personnel') return false;
  return true;
}

/** Revenus traités via comptes corporatifs (CDC / GRIP / IMRTD), pas en impôt dividende simplifié. */
export function isCorpSourcedDividendPipeline(revenue, entityMap) {
  if (!isCorpToPersonalFlow(revenue, entityMap)) return false;
  if (revenue.type === 'dividende') return true;
  if (revenue.type === 'revenu_placement') return true;
  return false;
}

export function getCorpSourcedDividendClass(revenue) {
  if (revenue.type === 'dividende') {
    return revenue.dividendClass || (revenue.dividendEligible ? 'eligible' : 'non_eligible');
  }
  if (revenue.type === 'revenu_placement') return 'non_eligible';
  return null;
}

function resolveShareholdersForBeneficiary(corp, entities, beneficiaryEntityId) {
  const all = getResolvedShareholders(corp, entities);
  const match = all.filter((sh) => sh.personEntityId === beneficiaryEntityId);
  if (match.length > 0) {
    const totalPct = match.reduce((s, sh) => s + (sh.ownershipPercent || 0), 0);
    if (totalPct > 0 && Math.abs(totalPct - 100) > 0.02) {
      return match.map((sh) => ({
        ...sh,
        ownershipPercent: (sh.ownershipPercent / totalPct) * 100,
      }));
    }
    return match;
  }
  const person = entities.find((e) => e.id === beneficiaryEntityId);
  if (!person) return all;
  return [{
    id: `direct-${beneficiaryEntityId}`,
    personEntityId: beneficiaryEntityId,
    name: person.name || 'Bénéficiaire',
    ownershipPercent: 100,
    marginalTaxRate: parseFloat(person.marginalTaxRate) || 53.31,
  }];
}

/**
 * Distribue les flux planifiés (onglet Revenus) pour une société donnée.
 * @returns {Array<import('./corporateIntegration').distributeCorporateDividends>} distributions
 */
export function processPlannedCorpToPersonalForCorp({
  revenues = [],
  entities = [],
  corpId,
  getCorpState,
}) {
  const entityMap = buildEntityMap(entities);
  const corp = entityMap[corpId];
  if (!corp || corp.type !== 'corporation') return [];

  const corpState = getCorpState(corp);
  const distributions = [];

  for (const r of revenues) {
    if (r.sourceCorpEntityId !== corpId) continue;
    if (!isCorpSourcedDividendPipeline(r, entityMap)) continue;

    const dividendClass = getCorpSourcedDividendClass(r);
    if (!dividendClass) continue;

    const annual = (parseFloat(r.monthlyAmount) || 0) * 12;
    if (annual <= 0) continue;

    const shareholders = resolveShareholdersForBeneficiary(corp, entities, r.entityId);
    if (!shareholders.length) continue;

    const dist = distributeCorporateDividends({
      corp,
      corpState,
      shareholders,
      amount: annual,
      dividendClass,
      entities,
      applyTax: true,
    });
    dist.corpEntityId = corp.id;
    dist.plannedRevenueId = r.id;
    dist.plannedRevenueName = r.name;
    distributions.push(dist);
  }

  return distributions;
}

function recalcEntityRevenueTotals(rev) {
  const immeubleAfterTax = (rev.grossImmeuble || 0) - (rev.taxImmeuble || 0);
  const otherAfterTax = (rev.grossOther || 0) - (rev.taxOther || 0);
  const divAfterTax = (rev.grossDividends || 0) - (rev.taxDividends || 0);
  rev.taxDividends = rev.taxDividends || 0;
  rev.totalTax = (rev.taxImmeuble || 0) + (rev.taxOther || 0) + (rev.taxDividends || 0);
  rev.totalAfterTax = immeubleAfterTax + otherAfterTax + divAfterTax;
}

/** Ajoute dividendes nets / impôt issus des distributions corp. dans revenueTax. */
export function mergeCorpPersonalDistributionsIntoRevenueTax(revenueTax, distributions = []) {
  if (!revenueTax?.byEntity) return;

  for (const dist of distributions) {
    for (const sh of dist.byShareholder || []) {
      const eid = sh.personEntityId;
      if (!eid) continue;
      if (!revenueTax.byEntity[eid]) {
        revenueTax.byEntity[eid] = {
          grossImmeuble: 0,
          grossOther: 0,
          grossDividends: 0,
          taxImmeuble: 0,
          taxOther: 0,
          taxDividends: 0,
        };
      }
      const rev = revenueTax.byEntity[eid];
      rev.grossDividends = (rev.grossDividends || 0) + (sh.gross || 0);
      rev.taxDividends = (rev.taxDividends || 0) + (sh.tax || 0);
      recalcEntityRevenueTotals(rev);
    }
  }

  let totalGross = 0;
  let totalTax = 0;
  let totalAfterTax = 0;
  for (const rev of Object.values(revenueTax.byEntity)) {
    totalGross += (rev.grossImmeuble || 0) + (rev.grossOther || 0) + (rev.grossDividends || 0);
    totalTax += rev.totalTax || 0;
    totalAfterTax += rev.totalAfterTax || 0;
  }
  revenueTax.totalGross = Math.round(totalGross);
  revenueTax.totalTax = Math.round(totalTax);
  revenueTax.totalAfterTax = Math.round(totalAfterTax);
}

/** Recalcule les agrégats du snapshot après intégration corp. */
export function refreshTaxSnapshotAfterCorpPersonal(taxSnapshot, revenues, debts) {
  const revenueTax = taxSnapshot.revenueTax || {};
  const totalMonthlyRev = revenues.reduce((s, r) => s + (parseFloat(r.monthlyAmount) || 0), 0);
  const totalMonthlyDebt = debts.reduce((s, d) => s + (parseFloat(d.monthlyPayment) || 0), 0);
  const annualInsurancePremiums = Object.values(taxSnapshot.entityCashflows || {}).reduce(
    (s, cf) => s + (cf.insurancePremiums || 0),
    0,
  );

  const totalAnnualRevGross = revenueTax.totalGross ?? totalMonthlyRev * 12;
  const totalAnnualRevAfterTax = revenueTax.totalAfterTax ?? 0;
  const annualTax = revenueTax.totalTax ?? 0;
  const totalMonthlyRevAfterTax = totalAnnualRevAfterTax / 12;
  const annualCashflowAfterTax =
    (totalMonthlyRevAfterTax - totalMonthlyDebt) * 12 - annualInsurancePremiums;

  taxSnapshot.totalGrossRevenue = Math.round(totalAnnualRevGross);
  taxSnapshot.totalRevenueAfterTax = Math.round(totalAnnualRevAfterTax);
  taxSnapshot.totalTax = Math.round(annualTax);
  taxSnapshot.monthlyRevenue = totalMonthlyRev;
  taxSnapshot.monthlyRevenueAfterTax = totalMonthlyRevAfterTax;
  taxSnapshot.monthlyTax = annualTax / 12;
  taxSnapshot.monthlyCashflowAfterTax = annualCashflowAfterTax / 12;
  taxSnapshot.annualCashflowAfterTax = Math.round(annualCashflowAfterTax);
}

/**
 * Salaire / autre versé par une Inc. au personnel : impôt ordinaire au taux marginal du bénéficiaire.
 */
export function taxCorpSourcedOrdinaryRevenue(revenue, entityMap) {
  if (!isCorpToPersonalFlow(revenue, entityMap)) return null;
  if (revenue.type === 'dividende' || revenue.type === 'revenu_placement') return null;

  const person = entityMap[revenue.entityId];
  const annual = (parseFloat(revenue.monthlyAmount) || 0) * 12;
  if (annual <= 0) return null;

  const rate = getMarginalRate(person);
  const tax = Math.max(0, annual * rate);
  return {
    gross: annual,
    tax: Math.round(tax),
    net: Math.round(annual - tax),
  };
}

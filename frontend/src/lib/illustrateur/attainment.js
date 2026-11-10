import { ensureCollectFields } from './planDefaults';

function n(v) {
  const x = parseFloat(v);
  return Number.isFinite(x) ? x : 0;
}

function pack(needs, available, breakdown = {}) {
  const shortfall = Math.max(0, needs - available);
  const pct = needs > 0 ? Math.min(999, Math.round((available / needs) * 100)) : available > 0 ? 100 : 0;
  return { needs, available, shortfall, pct, breakdown };
}

/** PV of annuity-due / ordinary annuity for income replacement capital. */
export function presentValueIncomeGap(annualGap, years, ratePct) {
  const gap = Math.max(0, annualGap);
  const y = Math.max(0, years);
  const r = n(ratePct) / 100;
  if (gap <= 0 || y <= 0) return 0;
  if (Math.abs(r) < 1e-9) return gap * y;
  return gap * ((1 - Math.pow(1 + r, -y)) / r);
}

function annualEmploymentIncome(plan) {
  return (plan.revenues || []).reduce((s, r) => {
    const m = n(r.monthlyAmount);
    if (m > 0) return s + m * 12;
    return s + (n(r.annualAmount) || n(r.amount));
  }, 0);
}

function monthlyNetEstimate(plan) {
  const annual = annualEmploymentIncome(plan);
  // rough QC net ~58% of gross for illustration if no explicit need
  const fromNeeds = n(plan.needs?.revenu_net);
  if (fromNeeds > 0) return fromNeeds;
  return (annual * 0.58) / 12;
}

function sumAssets(plan, ids) {
  const set = new Set(ids || []);
  return (plan.assets || []).reduce((s, a) => (set.has(a.id) ? s + n(a.currentBalance) : s), 0);
}

function sumDebts(plan, ids) {
  const set = new Set(ids || []);
  return (plan.debts || []).reduce((s, d) => (set.has(d.id) ? s + n(d.currentBalance) : s), 0);
}

function lifeInsuranceTotal(plan, collect) {
  const fromPolicies = (collect.deathNeeds.policies || []).reduce((s, p) => s + n(p.amount), 0);
  const fromAssets = (plan.assets || []).reduce((s, a) => {
    if (a.type !== 'assurance_participative') return s;
    return s + (n(a.totalInsurance) || n(a._totalInsurance));
  }, 0);
  const fromNeeds = n(plan.needs?.av_actuelle) + n(plan.needs?.av_groupe);
  return Math.max(fromPolicies, fromAssets, fromNeeds);
}

export function computeNetWorth(plan) {
  const assets = (plan.assets || []).reduce((s, a) => s + n(a.currentBalance), 0);
  const debts = (plan.debts || []).reduce((s, d) => s + n(d.currentBalance), 0);
  return pack(0, assets - debts, { assets, debts, netWorth: assets - debts });
}

export function computeCashflowSummary(plan) {
  const annualIncome = annualEmploymentIncome(plan);
  const annualSavings = (plan.savings || []).reduce(
    (s, e) => s + (n(e.annualAmount) || n(e.monthlyAmount) * 12),
    0,
  );
  const expenses = Math.max(0, annualIncome - annualSavings);
  return {
    annualIncome,
    annualSavings,
    expenses,
    pctSaved: annualIncome > 0 ? Math.round((annualSavings / annualIncome) * 100) : 0,
  };
}

export function computeEmergencyAttainment(plan) {
  const c = ensureCollectFields(plan);
  const e = c.emergency;
  if (e.base === 'aucun') return pack(0, 0, { note: 'Aucun objectif' });

  let monthly = n(e.monthlyAmount);
  if (e.base === 'revenu') {
    monthly = monthlyEmploymentMonthly(plan) || monthly;
  }
  const needs = n(e.months) * monthly;
  const allocated = sumAssets(plan, e.allocatedAssetIds);
  const available = allocated + n(e.creditLine);
  return pack(needs, available, { monthly, months: e.months, allocated, creditLine: n(e.creditLine) });
}

function monthlyEmploymentMonthly(plan) {
  return annualEmploymentIncome(plan) / 12;
}

export function computeDeathAttainment(plan) {
  const c = ensureCollectFields(plan);
  const d = c.deathNeeds;

  const debts = sumDebts(plan, d.repayDebtIds.length ? d.repayDebtIds : (plan.debts || []).map((x) => x.id));
  const expenses = (d.expenses || []).reduce((s, x) => s + n(x.amount), 0);

  const annualGross = annualEmploymentIncome(plan);
  const targetPct = n(d.incomeReplacePct) / 100;
  const targetAnnual =
    d.incomeMode === 'aucun' ? 0 : d.incomeBasis === 'net' ? monthlyNetEstimate(plan) * 12 * targetPct : annualGross * targetPct;
  const availableIncome =
    n(d.survivorPension) + n(d.orphanPension) + n(d.otherIncome);
  const annualGap = Math.max(0, targetAnnual - availableIncome);
  const pv = presentValueIncomeGap(annualGap, n(d.incomeReplaceYears), n(d.discountRate));

  const needs = debts + expenses + pv;
  const insurance = lifeInsuranceTotal(plan, c);
  const liquidated = sumAssets(
    plan,
    d.liquidateAssetIds.length ? d.liquidateAssetIds : [],
  );
  const available = insurance + liquidated + n(d.rrqDeathBenefit);

  return pack(needs, available, {
    debts,
    expenses,
    incomeReplacePv: pv,
    annualGap,
    targetAnnual,
    insurance,
    liquidated,
    rrq: n(d.rrqDeathBenefit),
  });
}

export function computeDisabilityAttainment(plan) {
  const c = ensureCollectFields(plan);
  const d = c.disabilityNeeds;
  const monthlyNet = monthlyNetEstimate(plan);
  const monthlyGross = monthlyEmploymentMonthly(plan);
  const base = d.incomeBasis === 'brut' ? monthlyGross : monthlyNet;
  const needs = d.approach === 'depenses' ? base * 0.7 : base * (n(d.replacePct) / 100);
  const fromPolicies = (d.policies || []).reduce((s, p) => s + n(p.amount), 0);
  const available = fromPolicies + n(d.otherMonthlyIncome);
  return pack(needs, available, {
    needsMonthly: needs,
    availableMonthly: available,
    base,
  });
}

const CI_LEVEL_EXTRA = {
  aucun: 0,
  base: 10000,
  confort: 0, // use extras fields
  superieur: 50000,
};

export function computeCriticalIllnessAttainment(plan) {
  const c = ensureCollectFields(plan);
  const ci = c.criticalIllnessNeeds;
  const incomeNeed =
    n(ci.clientMonthlyIncome || monthlyNetEstimate(plan)) * n(ci.clientMonths) +
    n(ci.caregiverMonthly) * n(ci.caregiverMonths);
  const extras = ci.extras || {};
  let extraSum =
    n(extras.uninsuredTreatment) +
    n(extras.medicalEquipment) +
    n(extras.homeAdapt) +
    n(extras.vehicleAdapt) +
    n(extras.other);
  if (ci.protectionLevel === 'base' && extraSum === 0) extraSum = CI_LEVEL_EXTRA.base;
  if (ci.protectionLevel === 'superieur') extraSum += CI_LEVEL_EXTRA.superieur;
  if (ci.protectionLevel === 'aucun') extraSum = 0;

  const needs = incomeNeed + extraSum;
  let available = (ci.policies || []).reduce((s, p) => s + n(p.amount), 0);
  if (ci.useDisability) {
    available += computeDisabilityAttainment(plan).available * 6;
  }
  if (ci.useEmergency) {
    available += computeEmergencyAttainment(plan).available;
  }
  return pack(needs, available, { incomeNeed, extraSum });
}

export function computeRetirementAttainment(plan) {
  const c = ensureCollectFields(plan);
  const r = c.retirement;
  const annualNet = monthlyNetEstimate(plan) * 12;
  const needs =
    r.incomeUnit === 'cad' && n(r.replaceAmount) > 0
      ? n(r.replaceAmount)
      : annualNet * (n(r.replacePct) / 100);

  const publicIncome = (r.publicPensions || []).reduce((s, p) => s + n(p.annualAmount), 0);
  const dbIncome = (r.definedBenefit || []).reduce((s, p) => s + n(p.annualAmount), 0);
  const allocated = sumAssets(
    plan,
    r.decumulationAssetIds.length
      ? r.decumulationAssetIds
      : (plan.assets || []).filter((a) => a.type === 'reer' || a.type === 'celi').map((a) => a.id),
  );
  // heuristic: 4% withdrawal rule annual
  const drawdown = allocated * 0.04;
  const available = publicIncome + dbIncome + drawdown;
  const years = Math.max(1, 95 - n(r.targetAge));
  const totalDeficit = Math.max(0, needs - available) * Math.min(years, 25);

  return pack(needs, available, {
    publicIncome,
    dbIncome,
    drawdown,
    allocated,
    totalDeficit,
  });
}

export function computeAllAttainments(plan) {
  return {
    netWorth: computeNetWorth(plan),
    cashflow: computeCashflowSummary(plan),
    emergency: computeEmergencyAttainment(plan),
    death: computeDeathAttainment(plan),
    disability: computeDisabilityAttainment(plan),
    criticalIllness: computeCriticalIllnessAttainment(plan),
    retirement: computeRetirementAttainment(plan),
  };
}

export const ATTAINMENT_DOMAIN_LABELS = {
  death: 'Décès',
  disability: 'Invalidité',
  criticalIllness: 'Maladie grave',
  emergency: 'Fonds d’urgence',
  retirement: 'Retraite',
};

import {
  computeCriticalIllnessGap,
  computeDisabilityGap,
  computeLifeNeeds,
} from './needsAnalysis';
import { formatCad } from './metrics';
import { ensurePriorities } from './workflow';

const SEVERITY_RANK = { high: 0, medium: 1, low: 2, info: 3 };

function sumBy(list, pred, field = 'currentBalance') {
  return (list || []).reduce((s, item) => (pred(item) ? s + (parseFloat(item[field]) || 0) : s), 0);
}

function insuranceCoverage(plan) {
  const fromNeeds =
    (parseFloat(plan?.needs?.av_actuelle) || 0) + (parseFloat(plan?.needs?.av_groupe) || 0);
  const fromAssets = (plan?.assets || []).reduce((s, a) => {
    if (a.type !== 'assurance_participative') return s;
    return s + (parseFloat(a.totalInsurance) || parseFloat(a._totalInsurance) || parseFloat(a._coverage) || 0);
  }, 0);
  return Math.max(fromNeeds, fromAssets);
}

function monthlyIncome(plan) {
  const fromNeeds = parseFloat(plan?.needs?.revenu_net) || 0;
  if (fromNeeds > 0) return fromNeeds;
  const monthly = (plan?.revenues || []).reduce((s, r) => {
    const m = parseFloat(r.monthlyAmount);
    if (Number.isFinite(m) && m > 0) return s + m;
    const annual = parseFloat(r.annualAmount) || parseFloat(r.amount) || 0;
    return s + annual / 12;
  }, 0);
  return monthly;
}

function liquidBalances(plan) {
  return sumBy(
    plan?.assets,
    (a) =>
      a.type === 'non_enregistre' ||
      /liquid|caisse|urgence|banque|épargne/i.test(String(a.name || '')),
  );
}

function registeredBalances(plan) {
  return sumBy(plan?.assets, (a) => a.type === 'reer' || a.type === 'celi');
}

function registeredMonthly(plan) {
  return (plan?.assets || []).reduce((s, a) => {
    if (a.type !== 'reer' && a.type !== 'celi') return s;
    return s + (parseFloat(a.monthlyContribution) || 0);
  }, 0);
}

function reeeBalance(plan) {
  return sumBy(plan?.assets, (a) => /reee/i.test(String(a.name || '')) || a.type === 'reee');
}

function realEstateValue(plan) {
  return sumBy(plan?.assets, (a) => a.type === 'immobilier');
}

function mortgageBalance(plan) {
  const fromDebts = sumBy(plan?.debts, (d) => d.type === 'hypotheque');
  const fromNeeds = parseFloat(plan?.needs?.hypotheque) || 0;
  return Math.max(fromDebts, fromNeeds);
}

function totalDebts(plan) {
  return (plan?.debts || []).reduce((s, d) => s + (parseFloat(d.currentBalance) || 0), 0);
}

function totalAssets(plan) {
  return (plan?.assets || []).reduce((s, a) => s + (parseFloat(a.currentBalance) || 0), 0);
}

/**
 * Analyse des gaps selon bonnes pratiques de planification (illustratif).
 * @returns {{ gaps: Array, ordered: Array }}
 */
export function analyzePlanningGaps(plan, projectionSummary = null) {
  const needs = plan?.needs || {};
  const gaps = [];

  const life = computeLifeNeeds(needs);
  const lifeNeed = parseFloat(life.besoin_recommande ?? life.r_total) || 0;
  const coverage = insuranceCoverage(plan);
  const lifeGap = Math.max(0, lifeNeed - coverage);
  if (lifeNeed > 0 || coverage > 0) {
    gaps.push({
      id: 'gap_vie',
      moduleId: 'assurance_vie',
      severity: lifeGap > lifeNeed * 0.35 ? 'high' : lifeGap > 0 ? 'medium' : 'info',
      title: 'Protection vie',
      summary:
        lifeGap > 0
          ? `Couverture insuffisante d’environ ${formatCad(lifeGap)} vs besoin illustratif.`
          : 'Couverture vie alignée ou supérieure au besoin illustratif.',
      metric: lifeGap,
      metricLabel: lifeGap > 0 ? `Trou ${formatCad(lifeGap)}` : 'Couvert',
      suggestedFocus: lifeGap > 0 ? `Cible illustrative ≈ ${formatCad(lifeNeed)}` : null,
      hasGap: lifeGap > 0,
    });
  }

  const disability = computeDisabilityGap(needs);
  if ((parseFloat(needs.invalidite_revenu) || 0) > 0 || disability.trou_mensuel > 0) {
    const trou = disability.trou_mensuel || 0;
    gaps.push({
      id: 'gap_invalidite',
      moduleId: 'invalidite',
      severity: trou > 1500 ? 'high' : trou > 0 ? 'medium' : 'info',
      title: 'Remplacement de revenu (invalidité)',
      summary:
        trou > 0
          ? `Trou mensuel illustratif de ${formatCad(trou)} après collective.`
          : 'Remplacement invalidité illustrativement couvert.',
      metric: trou,
      metricLabel: trou > 0 ? `${formatCad(trou)} / mois` : 'Couvert',
      suggestedFocus: trou > 0 ? `≈ ${formatCad(trou * 12)} / an à remplacer` : null,
      hasGap: trou > 0,
    });
  }

  const ci = computeCriticalIllnessGap(needs);
  const ciTarget = ci.capital_cible || 0;
  if (ciTarget > 0) {
    gaps.push({
      id: 'gap_mg',
      moduleId: 'maladie_grave',
      severity: ciTarget >= 75000 ? 'medium' : 'low',
      title: 'Maladie grave',
      summary: `Capital cible déclaré : ${formatCad(ciTarget)}. Aucune couverture MG modélisée dans le bilan.`,
      metric: ciTarget,
      metricLabel: formatCad(ciTarget),
      suggestedFocus: 'Forfait maladie grave à calibrer avec le client',
      hasGap: true,
    });
  }

  const income = monthlyIncome(plan);
  const targetMonths = 3;
  const liquid = liquidBalances(plan);
  const liquidTarget = income > 0 ? income * targetMonths : 0;
  const liquidGap = Math.max(0, liquidTarget - liquid);
  if (income > 0 || liquid > 0) {
    gaps.push({
      id: 'gap_liquidites',
      moduleId: 'liquidites',
      severity: liquidGap > liquidTarget * 0.5 ? 'high' : liquidGap > 0 ? 'medium' : 'info',
      title: 'Fonds d’urgence',
      summary:
        liquidGap > 0
          ? `Coussin actuel ${formatCad(liquid)} vs cible ~${targetMonths} mois (${formatCad(liquidTarget)}).`
          : `Coussin de liquidités illustrativement suffisant (${formatCad(liquid)}).`,
      metric: liquidGap,
      metricLabel: liquidGap > 0 ? `Manque ${formatCad(liquidGap)}` : 'OK',
      suggestedFocus: liquidGap > 0 ? `${targetMonths} mois de dépenses/revenu net` : null,
      hasGap: liquidGap > 0,
    });
  }

  const regBal = registeredBalances(plan);
  const regMonth = registeredMonthly(plan);
  const horizon = plan?.horizonYears ?? 25;
  if (income > 0 || regBal > 0 || regMonth > 0) {
    const softTargetMonthly = income > 0 ? income * 0.15 : 500;
    const saveGap = Math.max(0, softTargetMonthly - regMonth);
    const severity =
      regMonth <= 0 && income > 0 ? 'high' : saveGap > softTargetMonthly * 0.5 ? 'medium' : regMonth > 0 ? 'low' : 'info';
    gaps.push({
      id: 'gap_placement',
      moduleId: 'placement',
      severity,
      title: 'Épargne & placement',
      summary: `Soldes enregistrés ${formatCad(regBal)} · cotisations ${formatCad(regMonth)}/mois (horizon ${horizon} ans).`,
      metric: saveGap,
      metricLabel: saveGap > 0 ? `Écart ~${formatCad(saveGap)}/mois` : 'Rythme OK',
      suggestedFocus: saveGap > 0 ? 'Automatiser CELI/REER vers ~15 % du revenu net' : 'Maintenir le rythme',
      hasGap: saveGap > 0 || regMonth <= 0,
    });
  }

  if (income > 0 && horizon >= 10) {
    gaps.push({
      id: 'gap_retraite',
      moduleId: 'retraite',
      severity: regBal < income * 12 * 3 ? 'medium' : 'low',
      title: 'Retraite / décaissement',
      summary: 'Vérifier revenu cible à la retraite et ordre de décaissement (illustratif).',
      metric: regBal,
      metricLabel: `Épargne ${formatCad(regBal)}`,
      suggestedFocus: 'Définir revenu cible et horizon de décaissement',
      hasGap: true,
    });
  }

  const immo = realEstateValue(plan);
  const mortgage = mortgageBalance(plan);
  const assets = totalAssets(plan);
  const debts = totalDebts(plan);
  const debtRatio = assets > 0 ? (debts / assets) * 100 : debts > 0 ? 100 : 0;
  if (immo > 0 || mortgage > 0 || debtRatio > 35) {
    gaps.push({
      id: 'gap_immo',
      moduleId: 'immobilier',
      severity: debtRatio > 55 ? 'high' : debtRatio > 40 || mortgage > 0 ? 'medium' : 'low',
      title: 'Immobilier & dettes',
      summary: `Ratio d’endettement illustratif ${debtRatio.toFixed(0)} % · hypothèque ${formatCad(mortgage)}.`,
      metric: mortgage,
      metricLabel: formatCad(mortgage),
      suggestedFocus: mortgage > 0 ? 'Stratégie d’amortissement / assurance hypothécaire' : 'Surveiller le levier',
      hasGap: debtRatio > 40 || mortgage > income * 24,
    });
  }

  const kids = parseFloat(needs.nb_enfants) || 0;
  if (kids > 0) {
    const reee = reeeBalance(plan);
    gaps.push({
      id: 'gap_reee',
      moduleId: 'reee',
      severity: reee <= 0 ? 'medium' : 'low',
      title: 'REEE / famille',
      summary:
        reee > 0
          ? `REEE détecté (~${formatCad(reee)}) pour ${kids} enfant(s).`
          : `${kids} enfant(s) — aucun REEE clairement identifié au bilan.`,
      metric: reee,
      metricLabel: reee > 0 ? formatCad(reee) : 'À ouvrir',
      suggestedFocus: 'Cotisations + SCEE/IQEE illustratives',
      hasGap: reee <= 0,
    });
  }

  const scopeCorp = Boolean(plan?.scope?.corporatif);
  if (scopeCorp) {
    const corpCash = sumBy(plan?.assets, (a) => a.type === 'corporatif');
    gaps.push({
      id: 'gap_corpo',
      moduleId: 'corporatif',
      severity: 'low',
      title: 'Corporatif / Holdco',
      summary: `Trésorerie corporative illustrée ${formatCad(corpCash)}. Optimiser dividendes vs assurance en corpo.`,
      metric: corpCash,
      metricLabel: formatCad(corpCash),
      suggestedFocus: 'Intégration fiscale et assurance corporative',
      hasGap: true,
    });
  }

  const deathBenefit =
    projectionSummary?.assuranceDeathEnd ||
    (plan?.assets || []).reduce(
      (s, a) => s + (parseFloat(a.totalInsurance) || parseFloat(a._totalInsurance) || 0),
      0,
    );
  const passifs = Math.max(debts, mortgage);
  gaps.push({
    id: 'gap_succession',
    moduleId: 'succession',
    severity: deathBenefit + 1 < passifs ? 'medium' : 'info',
    title: 'Succession (objectifs)',
    summary:
      'Signal soft : aligner capital décès / liquidités successorales avec les passifs — pas un simulateur d’impôt public.',
    metric: Math.max(0, passifs - deathBenefit),
    metricLabel:
      deathBenefit + 1 < passifs ? `Écart passifs ${formatCad(passifs - deathBenefit)}` : 'À documenter',
    suggestedFocus: 'Objectifs successoraux et liquidités au décès',
    hasGap: true,
  });

  const ordered = [...gaps].sort((a, b) => {
    const sev = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
    if (sev !== 0) return sev;
    return (b.metric || 0) - (a.metric || 0);
  });

  return { gaps: ordered, ordered };
}

export function gapsForModule(gaps, moduleId) {
  return (gaps || []).filter((g) => g.moduleId === moduleId);
}

export function sortModulesByPriorities(modules, priorities) {
  const prio = ensurePriorities({ priorities });
  const rank = new Map(prio.map((id, i) => [id, i]));
  return [...modules].sort((a, b) => {
    const ra = rank.has(a.id) ? rank.get(a.id) : 100;
    const rb = rank.has(b.id) ? rank.get(b.id) : 100;
    if (ra !== rb) return ra - rb;
    return 0;
  });
}

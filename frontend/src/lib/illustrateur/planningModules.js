import { clonePlan } from './planIo';
import { newId } from './ids';
import { DEFAULT_TAX_RATES } from './investmentPlanningService';
import { formatCad, summarizeProjection } from './metrics';
import { generate25YearProjection } from './projectionEngine';

export const OPTION_LETTERS = ['A', 'B', 'C'];

/** Catalogue des facettes de planification — chacune porte ses options A-B-C. */
export const PLANNING_MODULES = [
  {
    id: 'assurance_vie',
    label: 'Assurance vie',
    short: 'Vie',
    description: 'Couverture, terme, type de produit, primes et valeur de rachat dans le temps.',
  },
  {
    id: 'invalidite',
    label: 'Assurance invalidité',
    short: 'Invalidité',
    description: 'Remplacement de revenu, délai de carence, durée des prestations, collective.',
  },
  {
    id: 'maladie_grave',
    label: 'Maladie grave',
    short: 'MG',
    description: 'Capital forfaitaire, options de remboursement de primes, besoins illustratifs.',
  },
  {
    id: 'placement',
    label: 'Placement / épargne',
    short: 'Placement',
    description: 'REER, CELI, non-enregistré, cotisations et rendements illustratifs.',
  },
  {
    id: 'retraite',
    label: 'Retraite / décaissement',
    short: 'Retraite',
    description: 'Revenu cible, horizon, retraits REER/CELI et ordre de décaissement.',
  },
  {
    id: 'liquidites',
    label: 'Liquidités / fonds d’urgence',
    short: 'Liquidités',
    description: 'Coussin de sécurité, mois de dépenses et rythme d’épargne.',
  },
  {
    id: 'immobilier',
    label: 'Immobilier / hypothèque',
    short: 'Immo',
    description: 'Valeur de propriété, solde hypothécaire, taux et amortissement.',
  },
  {
    id: 'reee',
    label: 'REEE / famille',
    short: 'REEE',
    description: 'Cotisations, enfants, subventions SCEE/IQEE illustratives.',
  },
  {
    id: 'corporatif',
    label: 'Corporatif / Holdco',
    short: 'Corpo',
    description: 'Trésorerie corporative, dividendes et assurance en corporation.',
  },
  {
    id: 'succession',
    label: 'Succession',
    short: 'Succession',
    description: 'Objectifs successoraux illustratifs (pas un simulateur d’impôt public).',
  },
];

export function emptyModulesState() {
  const byModule = {};
  for (const mod of PLANNING_MODULES) {
    byModule[mod.id] = { options: [] };
  }
  return {
    title: 'Proposition de planification',
    baselineLabel: 'Situation actuelle',
    selections: {},
    byModule,
  };
}

export function ensureModules(plan) {
  const base = emptyModulesState();
  const incoming = plan?.modules;
  if (!incoming || typeof incoming !== 'object') return base;
  const byModule = { ...base.byModule };
  for (const mod of PLANNING_MODULES) {
    const src = incoming.byModule?.[mod.id];
    byModule[mod.id] = {
      options: Array.isArray(src?.options) ? src.options : [],
    };
  }
  return {
    title: incoming.title || base.title,
    baselineLabel: incoming.baselineLabel || base.baselineLabel,
    selections: incoming.selections && typeof incoming.selections === 'object' ? { ...incoming.selections } : {},
    byModule,
  };
}

export function nextLetter(options = []) {
  const used = new Set(options.map((o) => o.letter));
  return OPTION_LETTERS.find((l) => !used.has(l)) || null;
}

export function defaultOptionData(moduleId) {
  switch (moduleId) {
    case 'assurance_vie':
      return {
        productType: 'temporaire',
        coverage: 500000,
        termYears: 20,
        issueAge: 40,
        annualPremium: 850,
        ownerType: 'personnel',
        premiumDebit: 'liquidites',
        includePremiumsInCashflow: true,
        pfiEnabled: false,
        pfiAnnualAdvanceAmount: 0,
        pfiInterestRate: 5,
        collateralLtvPercent: 90,
        schedule: [],
      };
    case 'invalidite':
      return {
        revenuMensuel: 8000,
        remplacementPct: 60,
        collectivePct: 0,
        delaiJours: 90,
        dureeAnnees: 5,
        primeAnnuelle: 1800,
      };
    case 'maladie_grave':
      return {
        capital: 100000,
        remboursementPrimes: false,
        primeAnnuelle: 1200,
        dureeAnnees: 20,
      };
    case 'placement':
      return {
        reerSolde: 0,
        reerCotisationMensuelle: 500,
        reerRendement: 6,
        celiSolde: 0,
        celiCotisationMensuelle: 400,
        celiRendement: 5.5,
        nonEnregistreSolde: 0,
        nonEnregistreCotisationMensuelle: 200,
        nonEnregistreRendement: 4,
      };
    case 'retraite':
      return {
        ageRetraite: 65,
        revenuCibleMensuel: 5000,
        retraitReerAnnuel: 0,
        retraitCeliAnnuel: 0,
        anneeDebutDecaissement: new Date().getFullYear() + 20,
      };
    case 'liquidites':
      return {
        soldeActuel: 10000,
        depensesEssentiellesMensuelles: 4000,
        moisCible: 6,
        epargneMensuelle: 300,
        rendement: 2,
      };
    case 'immobilier':
      return {
        valeurPropriete: 450000,
        soldeHypotheque: 280000,
        tauxHypotheque: 4.5,
        paiementMensuel: 1600,
        amortissementRestant: 22,
        appreciation: 3,
      };
    case 'reee':
      return {
        solde: 15000,
        cotisationAnnuelle: 2500,
        nbEnfants: 1,
        rendement: 5,
        anneesRestantes: 12,
      };
    case 'corporatif':
      return {
        tresorerie: 150000,
        rendement: 4,
        dividendeMensuelPersonnel: 1000,
        assuranceVieCouverture: 0,
        assuranceViePrime: 0,
      };
    case 'succession':
      return {
        capitalSouhaite: 0,
        notesObjectifs: '',
        testamentAJour: false,
        procuration: false,
        beneficiarieDesigne: false,
      };
    default:
      return {};
  }
}

export function createModuleOption(moduleId, { letter, name, pitch, recommended = false, data } = {}) {
  const resolved = letter || 'A';
  return {
    id: newId('mopt'),
    letter: resolved,
    name: name || `Option ${resolved}`,
    pitch: pitch || pitchForModule(moduleId, resolved),
    recommended: Boolean(recommended),
    savedAt: new Date().toISOString(),
    data: { ...defaultOptionData(moduleId), ...(data || {}) },
  };
}

function pitchForModule(moduleId, letter) {
  const label = PLANNING_MODULES.find((m) => m.id === moduleId)?.label || moduleId;
  return `Option ${letter} pour ${label.toLowerCase()} — illustration à valider avec le client.`;
}

export function getModuleMeta(moduleId) {
  return PLANNING_MODULES.find((m) => m.id === moduleId) || null;
}

export function getSelectedOption(modules, moduleId) {
  const letter = modules?.selections?.[moduleId];
  if (!letter) return null;
  return (modules?.byModule?.[moduleId]?.options || []).find((o) => o.letter === letter) || null;
}

function findPersonalEntity(plan) {
  return (plan.entities || []).find((e) => e.type === 'personnel') || plan.entities?.[0];
}

function findOrCreateCorp(plan) {
  let corp = (plan.entities || []).find((e) => e.type === 'corporation');
  if (corp) return corp;
  const person = findPersonalEntity(plan);
  corp = {
    id: newId('ent'),
    name: 'Holdco Inc.',
    type: 'corporation',
    province: 'QC',
    marginalTaxRate: DEFAULT_TAX_RATES.corporation,
    shareholders: person
      ? [{ personEntityId: person.id, ownershipPercent: 100, marginalTaxRate: person.marginalTaxRate }]
      : [],
    corpTaxAccounts: { cdcBalance: 0, imrtdBalance: 0, gripBalance: 0 },
  };
  plan.entities = [...(plan.entities || []), corp];
  return corp;
}

function upsertAsset(plan, matchFn, factory) {
  const idx = (plan.assets || []).findIndex(matchFn);
  if (idx >= 0) {
    plan.assets[idx] = { ...plan.assets[idx], ...factory(plan.assets[idx]) };
    return plan.assets[idx];
  }
  const created = factory(null);
  plan.assets = [...(plan.assets || []), created];
  return created;
}

function upsertDebt(plan, matchFn, factory) {
  const idx = (plan.debts || []).findIndex(matchFn);
  if (idx >= 0) {
    plan.debts[idx] = { ...plan.debts[idx], ...factory(plan.debts[idx]) };
    return plan.debts[idx];
  }
  const created = factory(null);
  plan.debts = [...(plan.debts || []), created];
  return created;
}

function buildScheduleFromFlat(data) {
  if (Array.isArray(data.schedule) && data.schedule.length) return data.schedule;
  // Approximate CSV from coverage/premium if permanente/participative
  if (data.productType === 'temporaire') return [];
  const rows = [];
  const years = Math.min(40, Math.max(5, parseInt(data.termYears, 10) || 20));
  const age0 = parseInt(data.issueAge, 10) || 40;
  const prem = parseFloat(data.annualPremium) || 0;
  let csv = 0;
  for (let y = 1; y <= years; y++) {
    csv = Math.round(csv + prem * 0.55 + y * prem * 0.02);
    rows.push({
      year: y,
      age: age0 + y - 1,
      surrenderValue: csv,
      totalInsurance: parseFloat(data.coverage) || 0,
      premiumPaid: prem,
    });
  }
  return rows;
}

function applyAssuranceVie(plan, data) {
  const person = findPersonalEntity(plan);
  const owner =
    data.ownerType === 'corporation' ? findOrCreateCorp(plan) : person;
  const schedule = buildScheduleFromFlat(data);
  const isParticipative =
    data.productType === 'participative' || data.productType === 'permanente' || data.productType === 'universelle';

  const liquid = (plan.assets || []).find(
    (a) => a.entityId === (person?.id) && (a.type === 'non_enregistre' || a.name?.toLowerCase().includes('liquid')),
  );

  upsertAsset(
    plan,
    (a) => a._moduleSource === 'assurance_vie',
    (existing) => ({
      id: existing?.id || newId('ast'),
      name: existing?.name || `Assurance vie · ${data.productType}`,
      type: isParticipative ? 'assurance_participative' : 'autre',
      entityId: owner?.id || person?.id,
      currentBalance: schedule[0]?.surrenderValue || 0,
      monthlyContribution: 0,
      avgAnnualReturn: 0,
      annualPremium: parseFloat(data.annualPremium) || 0,
      totalInsurance: parseFloat(data.coverage) || 0,
      insuranceSchedule: schedule,
      insuranceCurrentYearIdx: 0,
      includePremiumsInCashflow: data.includePremiumsInCashflow !== false,
      premiumDebitAssetId: liquid?.id || null,
      pfiEnabled: Boolean(data.pfiEnabled),
      pfiAnnualAdvanceAmount: parseFloat(data.pfiAnnualAdvanceAmount) || 0,
      pfiInterestRate: parseFloat(data.pfiInterestRate) || 5,
      collateralLtvPercent: parseFloat(data.collateralLtvPercent) || 90,
      _moduleSource: 'assurance_vie',
      _productType: data.productType,
      _termYears: data.termYears,
      _coverage: data.coverage,
    }),
  );

  plan.needs = {
    ...(plan.needs || {}),
    av_actuelle: parseFloat(data.coverage) || plan.needs?.av_actuelle || 0,
  };
}

function applyInvalidite(plan, data) {
  plan.needs = {
    ...(plan.needs || {}),
    invalidite_revenu: parseFloat(data.revenuMensuel) || 0,
    invalidite_remplacement_pct: parseFloat(data.remplacementPct) || 60,
    invalidite_collective_pct: parseFloat(data.collectivePct) || 0,
  };
}

function applyMaladieGrave(plan, data) {
  plan.needs = {
    ...(plan.needs || {}),
    maladie_grave_cible: parseFloat(data.capital) || 0,
  };
}

function applyPlacement(plan, data) {
  const person = findPersonalEntity(plan);
  const eid = person?.id;
  const specs = [
    ['reer', 'REER · module', data.reerSolde, data.reerCotisationMensuelle, data.reerRendement],
    ['celi', 'CELI · module', data.celiSolde, data.celiCotisationMensuelle, data.celiRendement],
    [
      'non_enregistre',
      'Non-enregistré · module',
      data.nonEnregistreSolde,
      data.nonEnregistreCotisationMensuelle,
      data.nonEnregistreRendement,
    ],
  ];
  for (const [type, name, solde, cotis, rend] of specs) {
    upsertAsset(
      plan,
      (a) => a._moduleSource === 'placement' && a.type === type,
      (existing) => ({
        id: existing?.id || newId('ast'),
        name: existing?.name || name,
        type,
        entityId: eid,
        currentBalance: parseFloat(solde) || 0,
        monthlyContribution: parseFloat(cotis) || 0,
        avgAnnualReturn: parseFloat(rend) || 0,
        _moduleSource: 'placement',
      }),
    );
  }
}

function applyRetraite(plan, data) {
  const year = parseInt(data.anneeDebutDecaissement, 10) || new Date().getFullYear() + 20;
  const reer = (plan.assets || []).find((a) => a.type === 'reer');
  const celi = (plan.assets || []).find((a) => a.type === 'celi');
  const events = (plan.events || []).filter((e) => e._moduleSource !== 'retraite');
  if ((parseFloat(data.retraitReerAnnuel) || 0) > 0 && reer) {
    events.push({
      id: newId('evt'),
      name: 'Retrait REER · retraite',
      type: 'retrait_reer',
      year,
      details: { amount: parseFloat(data.retraitReerAnnuel) || 0, assetId: reer.id },
      _moduleSource: 'retraite',
    });
  }
  if ((parseFloat(data.retraitCeliAnnuel) || 0) > 0 && celi) {
    events.push({
      id: newId('evt'),
      name: 'Retrait CELI · retraite',
      type: 'retrait_celi',
      year,
      details: { amount: parseFloat(data.retraitCeliAnnuel) || 0, assetId: celi.id },
      _moduleSource: 'retraite',
    });
  }
  plan.events = events;
  plan._retraiteMeta = {
    ageRetraite: data.ageRetraite,
    revenuCibleMensuel: data.revenuCibleMensuel,
  };
}

function applyLiquidites(plan, data) {
  const person = findPersonalEntity(plan);
  upsertAsset(
    plan,
    (a) => a._moduleSource === 'liquidites' || (a.type === 'non_enregistre' && a.name?.includes('urgence')),
    (existing) => ({
      id: existing?.id || newId('ast'),
      name: existing?.name || 'Fonds d’urgence',
      type: 'non_enregistre',
      entityId: person?.id,
      currentBalance: parseFloat(data.soldeActuel) || 0,
      monthlyContribution: parseFloat(data.epargneMensuelle) || 0,
      avgAnnualReturn: parseFloat(data.rendement) || 2,
      _moduleSource: 'liquidites',
      _moisCible: data.moisCible,
      _depensesEssentielles: data.depensesEssentiellesMensuelles,
    }),
  );
}

function applyImmobilier(plan, data) {
  const person = findPersonalEntity(plan);
  const home = upsertAsset(
    plan,
    (a) => a._moduleSource === 'immobilier' && a.type === 'immobilier',
    (existing) => ({
      id: existing?.id || newId('ast'),
      name: existing?.name || 'Résidence · module',
      type: 'immobilier',
      entityId: person?.id,
      currentBalance: parseFloat(data.valeurPropriete) || 0,
      monthlyContribution: 0,
      avgAnnualReturn: parseFloat(data.appreciation) || 3,
      _acb: parseFloat(data.valeurPropriete) || 0,
      _moduleSource: 'immobilier',
    }),
  );
  upsertDebt(
    plan,
    (d) => d._moduleSource === 'immobilier',
    (existing) => ({
      id: existing?.id || newId('debt'),
      name: existing?.name || 'Hypothèque · module',
      type: 'hypotheque',
      entityId: person?.id,
      currentBalance: parseFloat(data.soldeHypotheque) || 0,
      interestRate: parseFloat(data.tauxHypotheque) || 0,
      monthlyPayment: parseFloat(data.paiementMensuel) || 0,
      amortizationRemaining: parseFloat(data.amortissementRestant) || 25,
      linkedAssetId: home.id,
      _moduleSource: 'immobilier',
    }),
  );
  plan.needs = {
    ...(plan.needs || {}),
    hypotheque: parseFloat(data.soldeHypotheque) || 0,
  };
}

function applyReee(plan, data) {
  const person = findPersonalEntity(plan);
  upsertAsset(
    plan,
    (a) => a._moduleSource === 'reee',
    (existing) => ({
      id: existing?.id || newId('ast'),
      name: existing?.name || 'REEE · module',
      type: 'autre',
      entityId: person?.id,
      currentBalance: parseFloat(data.solde) || 0,
      monthlyContribution: (parseFloat(data.cotisationAnnuelle) || 0) / 12,
      avgAnnualReturn: parseFloat(data.rendement) || 5,
      _moduleSource: 'reee',
      _nbEnfants: data.nbEnfants,
      _anneesRestantes: data.anneesRestantes,
    }),
  );
}

function applyCorporatif(plan, data) {
  const corp = findOrCreateCorp(plan);
  const person = findPersonalEntity(plan);
  upsertAsset(
    plan,
    (a) => a._moduleSource === 'corporatif' && a.type === 'corporatif',
    (existing) => ({
      id: existing?.id || newId('ast'),
      name: existing?.name || 'Trésorerie Holdco · module',
      type: 'corporatif',
      entityId: corp.id,
      currentBalance: parseFloat(data.tresorerie) || 0,
      monthlyContribution: 0,
      avgAnnualReturn: parseFloat(data.rendement) || 4,
      _moduleSource: 'corporatif',
    }),
  );
  if ((parseFloat(data.dividendeMensuelPersonnel) || 0) > 0 && person) {
    const revenues = (plan.revenues || []).filter((r) => r._moduleSource !== 'corporatif');
    revenues.push({
      id: newId('rev'),
      name: 'Dividende Holdco · module',
      type: 'dividende',
      entityId: person.id,
      monthlyAmount: parseFloat(data.dividendeMensuelPersonnel) || 0,
      growthRate: 0,
      dividendClass: 'non_eligible',
      _moduleSource: 'corporatif',
    });
    plan.revenues = revenues;
  }
  if ((parseFloat(data.assuranceVieCouverture) || 0) > 0) {
    upsertAsset(
      plan,
      (a) => a._moduleSource === 'corporatif_vie',
      (existing) => ({
        id: existing?.id || newId('ast'),
        name: existing?.name || 'Vie corporative · module',
        type: 'assurance_participative',
        entityId: corp.id,
        currentBalance: 0,
        monthlyContribution: 0,
        avgAnnualReturn: 0,
        annualPremium: parseFloat(data.assuranceViePrime) || 0,
        totalInsurance: parseFloat(data.assuranceVieCouverture) || 0,
        insuranceSchedule: [],
        includePremiumsInCashflow: true,
        _moduleSource: 'corporatif_vie',
      }),
    );
  }
}

function applySuccession(plan, data) {
  plan._successionMeta = {
    capitalSouhaite: parseFloat(data.capitalSouhaite) || 0,
    notesObjectifs: data.notesObjectifs || '',
    testamentAJour: Boolean(data.testamentAJour),
    procuration: Boolean(data.procuration),
    beneficiarieDesigne: Boolean(data.beneficiarieDesigne),
  };
  if ((parseFloat(data.capitalSouhaite) || 0) > 0) {
    plan.needs = {
      ...(plan.needs || {}),
      legs: parseFloat(data.capitalSouhaite) || 0,
    };
  }
}

const APPLIERS = {
  assurance_vie: applyAssuranceVie,
  invalidite: applyInvalidite,
  maladie_grave: applyMaladieGrave,
  placement: applyPlacement,
  retraite: applyRetraite,
  liquidites: applyLiquidites,
  immobilier: applyImmobilier,
  reee: applyReee,
  corporatif: applyCorporatif,
  succession: applySuccession,
};

/** Strip previously applied module artifacts from a plan clone. */
export function stripModuleArtifacts(plan) {
  const next = clonePlan(plan);
  next.assets = (next.assets || []).filter((a) => !a._moduleSource);
  next.debts = (next.debts || []).filter((d) => !d._moduleSource);
  next.events = (next.events || []).filter((e) => !e._moduleSource);
  next.revenues = (next.revenues || []).filter((r) => !r._moduleSource);
  delete next._retraiteMeta;
  delete next._successionMeta;
  return next;
}

/**
 * Compose baseline dossier + selected module options into a projectable plan.
 */
export function composePlanFromModules(plan) {
  const modules = ensureModules(plan);
  const composed = stripModuleArtifacts(plan);
  delete composed.modules;
  delete composed.proposal;
  delete composed.scenarios;

  for (const mod of PLANNING_MODULES) {
    const selected = getSelectedOption(modules, mod.id);
    if (!selected?.data) continue;
    const apply = APPLIERS[mod.id];
    if (apply) apply(composed, selected.data);
  }
  return composed;
}

function runProjection(planLike) {
  const deathYear =
    planLike.deathScenarioYear != null && planLike.deathScenarioYear !== ''
      ? parseInt(planLike.deathScenarioYear, 10)
      : undefined;
  return generate25YearProjection(
    planLike.assets || [],
    planLike.debts || [],
    planLike.revenues || [],
    planLike.events || [],
    planLike.entities || [],
    {
      horizonYears: planLike.horizonYears ?? 25,
      deathScenarioYear: Number.isFinite(deathYear) ? deathYear : undefined,
    },
  );
}

export function buildModulesBundle(plan) {
  const modules = ensureModules(plan);
  const baselinePlan = stripModuleArtifacts(plan);
  delete baselinePlan.modules;
  let baselineProjection;
  try {
    baselineProjection = runProjection(baselinePlan);
  } catch {
    baselineProjection = { data: [], deathSummary: null };
  }

  const composedPlan = composePlanFromModules(plan);
  let composedProjection;
  try {
    composedProjection = runProjection(composedPlan);
  } catch (err) {
    composedProjection = { data: [], deathSummary: null, error: String(err?.message || err) };
  }

  const sections = PLANNING_MODULES.map((mod) => {
    const options = (modules.byModule[mod.id]?.options || [])
      .slice()
      .sort((a, b) => String(a.letter).localeCompare(String(b.letter)));
    const selectedLetter = modules.selections[mod.id] || null;
    return {
      ...mod,
      options,
      selectedLetter,
      selected: options.find((o) => o.letter === selectedLetter) || null,
      hasOptions: options.length > 0,
    };
  });

  const selectedCount = sections.filter((s) => s.selected).length;

  return {
    title: modules.title,
    baselineLabel: modules.baselineLabel,
    modules,
    sections,
    selectedCount,
    hasSelections: selectedCount > 0,
    baseline: {
      label: modules.baselineLabel,
      plan: baselinePlan,
      projection: baselineProjection,
      summary: summarizeProjection(baselineProjection),
    },
    composed: {
      label: 'Proposition assemblée',
      plan: composedPlan,
      projection: composedProjection,
      summary: summarizeProjection(composedProjection),
    },
  };
}

export function summarizeOptionCard(moduleId, option) {
  const d = option?.data || {};
  switch (moduleId) {
    case 'assurance_vie':
      return [
        `Produit : ${d.productType}`,
        `Couverture : ${formatCad(d.coverage)}`,
        d.productType === 'temporaire' ? `Terme : ${d.termYears} ans` : 'Protection permanente / VR',
        `Prime / an : ${formatCad(d.annualPremium)}`,
      ];
    case 'invalidite':
      return [
        `Revenu : ${formatCad(d.revenuMensuel)}/mois`,
        `Remplacement : ${d.remplacementPct}%`,
        `Délai : ${d.delaiJours} j`,
        `Durée : ${d.dureeAnnees} ans`,
      ];
    case 'maladie_grave':
      return [`Capital : ${formatCad(d.capital)}`, `Prime / an : ${formatCad(d.primeAnnuelle)}`];
    case 'placement':
      return [
        `REER cotis. : ${formatCad(d.reerCotisationMensuelle)}/mois`,
        `CELI cotis. : ${formatCad(d.celiCotisationMensuelle)}/mois`,
      ];
    case 'retraite':
      return [
        `Âge cible : ${d.ageRetraite} ans`,
        `Revenu cible : ${formatCad(d.revenuCibleMensuel)}/mois`,
      ];
    case 'liquidites':
      return [
        `Coussin : ${d.moisCible} mois`,
        `Solde : ${formatCad(d.soldeActuel)}`,
        `Épargne : ${formatCad(d.epargneMensuelle)}/mois`,
      ];
    case 'immobilier':
      return [
        `Propriété : ${formatCad(d.valeurPropriete)}`,
        `Hypothèque : ${formatCad(d.soldeHypotheque)}`,
        `Taux : ${d.tauxHypotheque}%`,
      ];
    case 'reee':
      return [
        `Solde : ${formatCad(d.solde)}`,
        `Cotisation / an : ${formatCad(d.cotisationAnnuelle)}`,
        `Enfants : ${d.nbEnfants}`,
      ];
    case 'corporatif':
      return [
        `Trésorerie : ${formatCad(d.tresorerie)}`,
        `Dividende perso : ${formatCad(d.dividendeMensuelPersonnel)}/mois`,
      ];
    case 'succession':
      return [
        d.testamentAJour ? 'Testament à jour' : 'Testament à revoir',
        d.capitalSouhaite ? `Capital souhaité : ${formatCad(d.capitalSouhaite)}` : 'Objectifs à préciser',
      ];
    default:
      return [];
  }
}

export function buildCompareSeriesFromBundle(bundle) {
  const years = new Set();
  (bundle.baseline.projection?.data || []).forEach((r) => years.add(r.year));
  (bundle.composed.projection?.data || []).forEach((r) => years.add(r.year));
  return Array.from(years)
    .sort((a, b) => a - b)
    .map((year) => {
      const b = (bundle.baseline.projection?.data || []).find((r) => r.year === year);
      const c = (bundle.composed.projection?.data || []).find((r) => r.year === year);
      return {
        year,
        baseline: b?.netWorth ?? null,
        composed: c?.netWorth ?? null,
      };
    });
}

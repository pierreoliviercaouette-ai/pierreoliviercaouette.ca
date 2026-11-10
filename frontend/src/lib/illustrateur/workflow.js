/** Parcours collecte SAAS — sidebar d’étapes. */

export const WORKFLOW_PHASES = [
  { id: 1, label: 'Collecte', short: 'Collecte' },
  { id: 2, label: 'Plan', short: 'Plan' },
  { id: 3, label: 'Rapport', short: 'Rapport' },
];

export const WORKFLOW_STEPS = [
  { id: 'hub', phase: 0, label: 'Accueil', short: 'Accueil', sidebar: false },
  { id: 'personnelles', phase: 1, label: 'Informations personnelles', short: 'Infos perso', sidebar: true },
  { id: 'objectifs', phase: 1, label: 'Objectifs', short: 'Objectifs', sidebar: true },
  { id: 'bilan', phase: 1, label: 'Actifs et passifs', short: 'Actifs/passifs', sidebar: true },
  { id: 'revenus', phase: 1, label: 'Revenu et épargne', short: 'Revenu/épargne', sidebar: true },
  { id: 'budget', phase: 1, label: 'Budget complet', short: 'Budget', sidebar: true },
  { id: 'corporatif', phase: 1, label: 'Corporatif', short: 'Corporatif', sidebar: true },
  { id: 'fiscalite', phase: 1, label: 'Fiscalité', short: 'Fiscalité', sidebar: true },
  { id: 'flux', phase: 1, label: 'Flux / trésorerie', short: 'Flux', sidebar: true },
  { id: 'urgence', phase: 1, label: 'Fonds d’urgence', short: 'Urgence', sidebar: true, attainment: 'emergency' },
  { id: 'deces', phase: 1, label: 'Décès', short: 'Décès', sidebar: true, attainment: 'death' },
  { id: 'invalidite', phase: 1, label: 'Invalidité', short: 'Invalidité', sidebar: true, attainment: 'disability' },
  { id: 'maladie_grave', phase: 1, label: 'Maladie grave', short: 'Maladie grave', sidebar: true, attainment: 'criticalIllness' },
  { id: 'projets', phase: 1, label: 'Projets', short: 'Projets', sidebar: true },
  { id: 'retraite', phase: 1, label: 'Retraite', short: 'Retraite', sidebar: true, attainment: 'retirement' },
  { id: 'recommandations', phase: 2, label: 'Recommandations', short: 'Recommandations', sidebar: true },
  { id: 'modules', phase: 2, label: 'Options A-B-C', short: 'Options', sidebar: true },
  { id: 'rapport', phase: 3, label: 'Rapport', short: 'Rapport', sidebar: true },
];

export const SIDEBAR_STEPS = WORKFLOW_STEPS.filter((s) => s.sidebar);

export function defaultWorkflow() {
  return { step: 'hub' };
}

export function ensureWorkflow(plan) {
  const step = plan?.workflow?.step;
  if (WORKFLOW_STEPS.some((s) => s.id === step)) return { step };
  // migrate legacy steps
  const legacy = {
    profil: 'personnelles',
    besoins: 'deces',
    gaps: 'recommandations',
    lecture: 'rapport',
    dashboard: 'rapport',
    evenements: 'projets',
  };
  if (legacy[step]) return { step: legacy[step] };
  return defaultWorkflow();
}

export function getStepMeta(stepId) {
  return WORKFLOW_STEPS.find((s) => s.id === stepId) || WORKFLOW_STEPS[0];
}

export function getStepIndex(stepId) {
  return WORKFLOW_STEPS.findIndex((s) => s.id === stepId);
}

export function adjacentStep(stepId, delta) {
  const idx = getStepIndex(stepId);
  if (idx < 0) return 'hub';
  const next = WORKFLOW_STEPS[idx + delta];
  return next ? next.id : stepId;
}

export function stepsForPhase(phaseId) {
  return WORKFLOW_STEPS.filter((s) => s.phase === phaseId);
}

export function evaluateDossierReadiness(plan) {
  const hasEntity = (plan?.entities || []).length > 0;
  const hasAsset = (plan?.assets || []).some((a) => (parseFloat(a.currentBalance) || 0) > 0);
  const hasRevenue = (plan?.revenues || []).some(
    (r) => (parseFloat(r.monthlyAmount) || 0) > 0 || (parseFloat(r.annualAmount) || 0) > 0,
  );
  const person = plan?.person || {};
  const hasIdentity = Boolean(
    person.firstName || person.lastName || plan?.meta?.clientLabel || plan?.meta?.name,
  );
  const hasProtection =
    (plan?.deathNeeds?.policies || []).length > 0 ||
    (parseFloat(plan?.needs?.revenu_net) || 0) > 0 ||
    (parseFloat(plan?.deathNeeds?.incomeReplacePct) || 0) > 0;

  const checks = [
    { id: 'identity', label: 'Identité du dossier', ok: hasIdentity },
    { id: 'entity', label: 'Au moins une entité', ok: hasEntity },
    { id: 'balance', label: 'Actif ou revenu renseigné', ok: hasAsset || hasRevenue },
    { id: 'needs', label: 'Protection amorcée', ok: hasProtection || hasRevenue },
  ];
  return { ready: checks.every((c) => c.ok), checks };
}

export function ensurePriorities(plan) {
  const raw = plan?.priorities;
  if (!Array.isArray(raw)) return [];
  return raw.filter((id) => typeof id === 'string').slice(0, 3);
}

export function canAdvanceFromStep() {
  return true;
}

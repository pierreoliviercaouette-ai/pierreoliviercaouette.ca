/** Parcours SAAS local — 3 phases + sous-étapes. */

export const WORKFLOW_PHASES = [
  { id: 1, label: 'Dossier', short: '1 · Dossier' },
  { id: 2, label: 'Plan', short: '2 · Plan' },
  { id: 3, label: 'Présenter', short: '3 · Présenter' },
];

export const WORKFLOW_STEPS = [
  { id: 'hub', phase: 0, label: 'Accueil', short: 'Accueil' },
  { id: 'profil', phase: 1, label: 'Profil client', short: 'Profil' },
  { id: 'bilan', phase: 1, label: 'Bilan', short: 'Bilan' },
  { id: 'revenus', phase: 1, label: 'Revenus', short: 'Revenus' },
  { id: 'evenements', phase: 1, label: 'Événements & horizon', short: 'Événements' },
  { id: 'besoins', phase: 1, label: 'Besoins de protection', short: 'Besoins' },
  { id: 'gaps', phase: 2, label: 'Gaps & priorités', short: 'Gaps' },
  { id: 'modules', phase: 2, label: 'Options A-B-C', short: 'Options' },
  { id: 'lecture', phase: 3, label: 'Lecture simple', short: 'Lecture' },
  { id: 'dashboard', phase: 3, label: 'Dashboard chiffré', short: 'Dashboard' },
];

export function defaultWorkflow() {
  return { step: 'hub' };
}

export function ensureWorkflow(plan) {
  const step = plan?.workflow?.step;
  if (WORKFLOW_STEPS.some((s) => s.id === step)) {
    return { step };
  }
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

/**
 * Checklist « dossier prêt » avant phase 2.
 */
export function evaluateDossierReadiness(plan) {
  const hasEntity = (plan?.entities || []).length > 0;
  const hasAsset = (plan?.assets || []).some((a) => (parseFloat(a.currentBalance) || 0) > 0);
  const hasRevenue = (plan?.revenues || []).some(
    (r) =>
      (parseFloat(r.monthlyAmount) || 0) > 0 ||
      (parseFloat(r.annualAmount) || parseFloat(r.amount) || 0) > 0,
  );
  const hasIdentity = Boolean(plan?.meta?.clientLabel || plan?.meta?.name);
  const needs = plan?.needs || {};
  const hasProtectionInputs =
    (parseFloat(needs.revenu_net) || 0) > 0 ||
    (parseFloat(needs.invalidite_revenu) || 0) > 0 ||
    (parseFloat(needs.hypotheque) || 0) > 0 ||
    (parseFloat(needs.av_actuelle) || 0) > 0;

  const checks = [
    { id: 'identity', label: 'Identité du dossier', ok: hasIdentity },
    { id: 'entity', label: 'Au moins une entité', ok: hasEntity },
    { id: 'balance', label: 'Actif ou revenu renseigné', ok: hasAsset || hasRevenue },
    { id: 'needs', label: 'Besoins de protection amorcés', ok: hasProtectionInputs },
  ];

  const ready = checks.every((c) => c.ok);
  return { ready, checks };
}

export function ensurePriorities(plan) {
  const raw = plan?.priorities;
  if (!Array.isArray(raw)) return [];
  return raw.filter((id) => typeof id === 'string').slice(0, 3);
}

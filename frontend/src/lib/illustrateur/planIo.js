const SESSION_KEY = 'poc_illustrateur_patrimonial_v1';
const PLAN_VERSION = 1;

export function clonePlan(plan) {
  return JSON.parse(JSON.stringify(plan));
}

export function touchPlan(plan) {
  return {
    ...plan,
    meta: {
      ...(plan.meta || {}),
      updatedAt: new Date().toISOString(),
    },
  };
}

export function loadSessionPlan() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.plan || typeof parsed.plan !== 'object') return null;
    return parsed.plan;
  } catch {
    return null;
  }
}

export function saveSessionPlan(plan) {
  try {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ version: PLAN_VERSION, savedAt: new Date().toISOString(), plan }),
    );
  } catch {
    /* quota / private mode */
  }
}

export function clearSessionPlan() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function exportPlanJson(plan, filename) {
  const payload = {
    version: PLAN_VERSION,
    exportedAt: new Date().toISOString(),
    product: 'illustrateur-patrimonial',
    plan,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `illustrateur-${(plan?.meta?.name || 'dossier').replace(/\s+/g, '-').toLowerCase()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function parseImportedPlan(text) {
  const data = JSON.parse(text);
  const plan = data?.plan || data;
  if (!plan || typeof plan !== 'object') {
    throw new Error('Fichier invalide : plan manquant.');
  }
  if (!Array.isArray(plan.entities) || !Array.isArray(plan.assets)) {
    throw new Error('Fichier invalide : entités/actifs manquants.');
  }
  return {
    ...plan,
    debts: plan.debts || [],
    revenues: plan.revenues || [],
    events: plan.events || [],
    scenarios: plan.scenarios || [],
    modules: plan.modules || undefined,
    needs: plan.needs || {},
    priorities: Array.isArray(plan.priorities) ? plan.priorities : [],
    workflow: plan.workflow || { step: 'hub' },
    nextStepsNotes: plan.nextStepsNotes || '',
    person: plan.person,
    objectives: plan.objectives || [],
    contributionRoom: plan.contributionRoom,
    emergency: plan.emergency,
    deathNeeds: plan.deathNeeds,
    disabilityNeeds: plan.disabilityNeeds,
    criticalIllnessNeeds: plan.criticalIllnessNeeds,
    projects: plan.projects || [],
    retirement: plan.retirement,
    recommendations: plan.recommendations || [],
    savings: plan.savings || [],
    horizonYears: plan.horizonYears ?? 25,
    meta: plan.meta || { name: 'Import' },
  };
}

export function readPlanFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(parseImportedPlan(String(reader.result || '')));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Lecture du fichier impossible.'));
    reader.readAsText(file);
  });
}

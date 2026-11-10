import { createDemoPlan, createEmptyPlan } from './demoPlan';
import { analyzePlanningGaps, sortModulesByPriorities } from './planningGaps';
import { PLANNING_MODULES } from './planningModules';
import { evaluateDossierReadiness, adjacentStep, ensurePriorities } from './workflow';

describe('planning gaps & workflow', () => {
  test('demo plan is ready and surfaces priority gaps', () => {
    const plan = createDemoPlan();
    const readiness = evaluateDossierReadiness(plan);
    expect(readiness.ready).toBe(true);

    const { ordered } = analyzePlanningGaps(plan);
    expect(ordered.length).toBeGreaterThan(3);
    const vie = ordered.find((g) => g.moduleId === 'assurance_vie');
    expect(vie).toBeTruthy();
    const invalidite = ordered.find((g) => g.moduleId === 'invalidite');
    expect(invalidite).toBeTruthy();
    expect(invalidite.hasGap).toBe(true);
  });

  test('empty plan fails readiness checklist', () => {
    const plan = createEmptyPlan();
    const readiness = evaluateDossierReadiness(plan);
    expect(readiness.ready).toBe(false);
    expect(readiness.checks.some((c) => !c.ok)).toBe(true);
  });

  test('liquidites gap when income without cushion', () => {
    const plan = createEmptyPlan();
    plan.meta.clientLabel = 'Test';
    plan.needs.revenu_net = 8000;
    plan.needs.hypotheque = 200000;
    plan.assets[0].currentBalance = 1000;
    plan.revenues = [{ id: 'r1', monthlyAmount: 8000, type: 'salaire' }];
    const { ordered } = analyzePlanningGaps(plan);
    const liq = ordered.find((g) => g.moduleId === 'liquidites');
    expect(liq?.hasGap).toBe(true);
    expect(liq.metric).toBeGreaterThan(0);
  });

  test('sortModulesByPriorities puts RDV modules first', () => {
    const sorted = sortModulesByPriorities(PLANNING_MODULES, ['retraite', 'assurance_vie']);
    expect(sorted[0].id).toBe('retraite');
    expect(sorted[1].id).toBe('assurance_vie');
  });

  test('adjacentStep and priorities helpers', () => {
    expect(adjacentStep('profil', 1)).toBe('bilan');
    expect(adjacentStep('dashboard', 1)).toBe('dashboard');
    expect(ensurePriorities({ priorities: ['a', 'b', 'c', 'd'] })).toEqual(['a', 'b', 'c']);
  });
});

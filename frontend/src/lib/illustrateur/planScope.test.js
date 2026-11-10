import { createDemoPlan, createEmptyPlan } from './demoPlan';
import { ensureCollectFields } from './planDefaults';
import { ensureScope } from './planScope';
import {
  adjacentVisibleStep,
  isStepVisible,
  visibleSidebarSteps,
} from './workflow';

describe('plan scope visibility', () => {
  test('empty plan hides corporate tabs', () => {
    const plan = ensureCollectFields(createEmptyPlan());
    expect(ensureScope(plan)).toEqual({ conjoint: false, corporatif: false });
    const ids = visibleSidebarSteps(plan).map((s) => s.id);
    expect(ids).not.toContain('corporatif');
    expect(ids).not.toContain('fiscalite');
    expect(ids).not.toContain('flux');
    expect(ids).toContain('budget');
  });

  test('corporate scope reveals corpo / fiscalité / flux', () => {
    const plan = { ...createEmptyPlan(), scope: { conjoint: false, corporatif: true } };
    const ids = visibleSidebarSteps(plan).map((s) => s.id);
    expect(ids).toContain('corporatif');
    expect(ids).toContain('fiscalite');
    expect(ids).toContain('flux');
  });

  test('adjacentVisibleStep skips hidden corporate steps', () => {
    const plan = { ...createEmptyPlan(), scope: { conjoint: false, corporatif: false } };
    expect(adjacentVisibleStep(plan, 'budget', 1)).toBe('urgence');
    expect(adjacentVisibleStep(plan, 'urgence', -1)).toBe('budget');
  });

  test('demo enables conjoint + corporatif', () => {
    const plan = createDemoPlan();
    expect(ensureScope(plan).conjoint).toBe(true);
    expect(ensureScope(plan).corporatif).toBe(true);
    expect(isStepVisible({ id: 'corporatif', requires: ['corporatif'] }, plan)).toBe(true);
  });

  test('migrates legacy planType conjoint', () => {
    const plan = { person: { planType: 'conjoint' } };
    expect(ensureScope(plan).conjoint).toBe(true);
  });
});

import { createDemoPlan, createEmptyPlan } from './demoPlan';
import {
  buildModulesBundle,
  composePlanFromModules,
  createModuleOption,
  ensureModules,
  nextLetter,
} from './planningModules';

describe('planning modules A-B-C', () => {
  test('nextLetter fills A then B then C', () => {
    expect(nextLetter([])).toBe('A');
    expect(nextLetter([{ letter: 'A' }])).toBe('B');
    expect(nextLetter([{ letter: 'A' }, { letter: 'B' }, { letter: 'C' }])).toBe(null);
  });

  test('demo plan selects modules and composes assets', () => {
    const plan = createDemoPlan();
    const modules = ensureModules(plan);
    expect(modules.selections.assurance_vie).toBe('A');
    expect(modules.byModule.assurance_vie.options.length).toBe(2);

    const composed = composePlanFromModules(plan);
    const vie = composed.assets.find((a) => a._moduleSource === 'assurance_vie');
    expect(vie).toBeTruthy();
    expect(vie._coverage || vie.totalInsurance).toBe(500000);

    const placement = composed.assets.filter((a) => a._moduleSource === 'placement');
    expect(placement.length).toBeGreaterThanOrEqual(2);
  });

  test('bundle exposes baseline vs composed', () => {
    const plan = createDemoPlan();
    const bundle = buildModulesBundle(plan);
    expect(bundle.hasSelections).toBe(true);
    expect(bundle.selectedCount).toBe(2);
    expect(bundle.composed.summary.netWorthEnd).toBeGreaterThan(0);
  });

  test('empty plan has empty modules state', () => {
    const plan = createEmptyPlan();
    const modules = ensureModules(plan);
    expect(modules.byModule.placement.options).toEqual([]);
    expect(Object.keys(modules.selections)).toHaveLength(0);
  });

  test('createModuleOption carries full vie fields', () => {
    const opt = createModuleOption('assurance_vie', {
      letter: 'C',
      data: { productType: 'permanente', coverage: 750000, annualPremium: 2200 },
    });
    expect(opt.data.productType).toBe('permanente');
    expect(opt.data.coverage).toBe(750000);
    expect(opt.data.termYears).toBe(20);
  });
});

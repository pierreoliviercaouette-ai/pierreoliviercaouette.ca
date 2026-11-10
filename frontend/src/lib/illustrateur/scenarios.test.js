import { createDemoPlan } from './demoPlan';
import {
  buildOptionDeltas,
  buildProposalBundle,
  createOptionFromPlan,
  ensureProposal,
  nextLetter,
} from './scenarios';

describe('proposal scenarios A-B-C', () => {
  test('nextLetter fills A then B then C', () => {
    expect(nextLetter([])).toBe('A');
    expect(nextLetter([{ letter: 'A' }])).toBe('B');
    expect(nextLetter([{ letter: 'A' }, { letter: 'B' }])).toBe('C');
    expect(nextLetter([{ letter: 'A' }, { letter: 'B' }, { letter: 'C' }])).toBe(null);
  });

  test('createOptionFromPlan snapshots without proposal nesting', () => {
    const plan = createDemoPlan();
    plan.proposal = ensureProposal(plan);
    plan.proposal.options = [{ id: 'x', letter: 'A', plan: {} }];
    const opt = createOptionFromPlan(plan, { letter: 'B', name: 'Protection + CELI' });
    expect(opt.letter).toBe('B');
    expect(opt.plan.assets.length).toBe(plan.assets.length);
    expect(opt.plan.proposal).toBeUndefined();
  });

  test('buildProposalBundle compares options to baseline', () => {
    const plan = createDemoPlan();
    const optA = createOptionFromPlan(plan, { letter: 'A', name: 'Statu quo+' });
    const richer = createDemoPlan();
    richer.assets = richer.assets.map((a) =>
      a.type === 'celi' ? { ...a, currentBalance: (a.currentBalance || 0) + 80000 } : a,
    );
    const optB = createOptionFromPlan(richer, { letter: 'B', name: 'Boost CELI', recommended: true });
    plan.proposal = {
      title: 'Proposition démo',
      baselineLabel: 'Situation actuelle',
      options: [optA, optB],
    };

    const bundle = buildProposalBundle(plan);
    expect(bundle.hasOptions).toBe(true);
    expect(bundle.options).toHaveLength(2);
    const deltas = buildOptionDeltas(bundle);
    const b = deltas.find((d) => d.letter === 'B');
    expect(b.deltaNetWorthEnd).toBeGreaterThan(50000);
    expect(b.recommended).toBe(true);
  });
});

import fs from 'fs';
import path from 'path';
import { parcoursTextToPlan, parseMoney } from './parcoursPdfImport';

const FIXTURE = path.resolve(
  __dirname,
  '../../../../tools/parcours-pdf-to-plan/fixtures/sample-parcours-extract.txt',
);

describe('parcoursPdfImport', () => {
  test('parseMoney handles FR formatting', () => {
    expect(parseMoney('24 112 $')).toBe(24112);
    expect(parseMoney('80\u00a0000\u00a0$')).toBe(80000);
    expect(parseMoney('-')).toBeNull();
  });

  test('maps sample Mon parcours financier extract', () => {
    if (!fs.existsSync(FIXTURE)) {
      console.warn('skip: fixture PDF extract missing');
      return;
    }
    const text = fs.readFileSync(FIXTURE, 'utf8');
    const { plan, warnings } = parcoursTextToPlan(text);

    expect(plan.person.firstName.toUpperCase()).toContain('PIERRE');
    expect(plan.person.birthYear).toBe(1997);
    expect(plan.person.maritalStatus).toBe('conjoint');
    expect(plan.scope.conjoint).toBe(true);

    expect(plan.revenues[0].monthlyAmount).toBeCloseTo(80000 / 12, 0);
    const reerTotal = plan.assets
      .filter((a) => a.type === 'reer')
      .reduce((s, a) => s + a.currentBalance, 0);
    expect(reerTotal).toBe(24112 + 11490);
    expect(plan.assets.some((a) => a.type === 'immobilier' && a.currentBalance === 290000)).toBe(true);
    expect(plan.debts[0].currentBalance).toBe(210941);

    expect(plan.deathNeeds.policies.reduce((s, p) => s + p.amount, 0)).toBe(450000);
    expect(plan.disabilityNeeds.policies[0].amount).toBe(700);
    expect(plan.criticalIllnessNeeds.policies[0].amount).toBe(50000);
    expect(plan.emergency.creditLine).toBe(8000);
    expect(plan.contributionRoom.celi).toBe(78000);
    expect(plan.retirement.publicPensions.some((p) => p.type === 'RRQ' && p.annualAmount > 0)).toBe(true);
    expect(plan.objectives.length).toBeGreaterThan(3);
    expect(Array.isArray(warnings)).toBe(true);
  });
});

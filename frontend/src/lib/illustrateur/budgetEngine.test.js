import { BUDGET_CATEGORIES, emptyBudgetState } from './budgetCatalog';
import {
  budgetMonthlyExpenses,
  ensureBudget,
  lineAnnual,
  lineMonthly,
  summarizeBudget,
} from './budgetEngine';
import { createDemoPlan, createEmptyPlan } from './demoPlan';

describe('budgetEngine (outil Excel)', () => {
  test('annualize respects Excel-style frequencies', () => {
    expect(lineAnnual(100, 'mensuel')).toBe(1200);
    expect(lineAnnual(100, 'annuel')).toBe(100);
    expect(lineAnnual(50, 'bihebdo')).toBe(1300);
    expect(lineMonthly(1200, 'annuel')).toBe(100);
  });

  test('catalog covers the Excel expense sheets', () => {
    const ids = BUDGET_CATEGORIES.map((c) => c.id);
    expect(ids).toEqual([
      'residence',
      'personnelles',
      'transport',
      'assurance_epargne',
      'dettes',
      'loisirs',
      'diverses',
    ]);
    const lineCount = BUDGET_CATEGORIES.reduce((s, c) => s + c.lines.length, 0);
    expect(lineCount).toBeGreaterThan(50);
  });

  test('summarizeBudget totals categories and gap', () => {
    const budget = emptyBudgetState();
    budget.netIncomeAnnual = 60000;
    budget.lines.hypotheque_bail = { amount: 1500, frequency: 'mensuel' };
    budget.lines.epicerie = { amount: 600, frequency: 'mensuel' };
    budget.lines.voyages = { amount: 2400, frequency: 'annuel' };

    const s = summarizeBudget(budget);
    expect(s.totalAnnual).toBe(1500 * 12 + 600 * 12 + 2400);
    expect(s.totalMonthly).toBe(s.totalAnnual / 12);
    expect(s.gapAnnual).toBe(60000 - s.totalAnnual);
    expect(s.byCategory.find((c) => c.id === 'residence').annual).toBe(18000);
    expect(s.balanced).toBe(s.gapAnnual >= 0);
  });

  test('ensureBudget seeds from needs revenu_net when empty', () => {
    const plan = createEmptyPlan();
    plan.needs = { ...plan.needs, revenu_net: 5000 };
    plan.budget = undefined;
    const b = ensureBudget(plan);
    expect(b.netIncomeAnnual).toBe(60000);
    expect(Object.keys(b.lines).length).toBeGreaterThan(40);
  });

  test('demo plan budget is populated and balanced-ish', () => {
    const plan = createDemoPlan();
    const s = summarizeBudget(ensureBudget(plan));
    expect(s.netIncomeAnnual).toBe(90000);
    expect(s.totalAnnual).toBeGreaterThan(40000);
    expect(budgetMonthlyExpenses(plan)).toBeCloseTo(s.totalMonthly, 5);
  });
});

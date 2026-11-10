import { BUDGET_CATEGORIES, emptyBudgetState, frequencyPerYear } from './budgetCatalog';

function n(v) {
  const x = parseFloat(v);
  return Number.isFinite(x) ? x : 0;
}

export function ensureBudget(plan) {
  const base = emptyBudgetState();
  const incoming = plan?.budget;
  if (!incoming || typeof incoming !== 'object') {
    // seed net income from revenues / needs if available
    const fromNeeds = n(plan?.needs?.revenu_net) * 12;
    const fromRev = (plan?.revenues || []).reduce((s, r) => {
      const m = n(r.monthlyAmount);
      if (m > 0) return s + m * 12;
      return s + n(r.annualAmount);
    }, 0);
    return { ...base, netIncomeAnnual: fromNeeds || fromRev * 0.58 || 0 };
  }
  return {
    ...base,
    ...incoming,
    lines: { ...base.lines, ...(incoming.lines || {}) },
  };
}

/** Annualize a line amount given its frequency (Excel VLOOKUP periods/year). */
export function lineAnnual(amount, frequency) {
  return n(amount) * frequencyPerYear(frequency);
}

export function lineMonthly(amount, frequency) {
  return lineAnnual(amount, frequency) / 12;
}

export function summarizeBudget(budget) {
  const b = budget || emptyBudgetState();
  const byCategory = BUDGET_CATEGORIES.map((cat) => {
    let annual = 0;
    const details = cat.lines.map((line) => {
      const row = b.lines?.[line.id] || {};
      const amt = n(row.amount);
      const freq = row.frequency || line.defaultFreq || 'mensuel';
      const ann = lineAnnual(amt, freq);
      annual += ann;
      return {
        id: line.id,
        label: row.label || line.label,
        amount: amt,
        frequency: freq,
        annual: ann,
        monthly: ann / 12,
      };
    });
    return { id: cat.id, label: cat.label, annual, monthly: annual / 12, details };
  });

  const totalAnnual = byCategory.reduce((s, c) => s + c.annual, 0);
  const totalMonthly = totalAnnual / 12;
  const netIncomeAnnual = n(b.netIncomeAnnual);
  const netIncomeMonthly = netIncomeAnnual / 12;
  const gapAnnual = netIncomeAnnual - totalAnnual;
  const gapMonthly = gapAnnual / 12;
  const pctOfIncome = netIncomeAnnual > 0 ? (totalAnnual / netIncomeAnnual) * 100 : 0;

  return {
    byCategory,
    totalAnnual,
    totalMonthly,
    netIncomeAnnual,
    netIncomeMonthly,
    gapAnnual,
    gapMonthly,
    pctOfIncome,
    balanced: gapAnnual >= 0,
  };
}

/** Sync emergency monthly spend from budget total (optional helper). */
export function budgetMonthlyExpenses(plan) {
  return summarizeBudget(ensureBudget(plan)).totalMonthly;
}

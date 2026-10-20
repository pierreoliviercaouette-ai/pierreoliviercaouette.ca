import { SCENARIO_ROWS } from './assuranceVieActifData';

export const ISSUE_AGE = 32;
export const COLLATERAL_THRESHOLD = 100000;
export const BANK_RATE = 0.055;
export const INSURER_RATE = 0.085;
export const SAFETY_RATIO = 0.8;
export const READ_AGES = [40, 51, 65, 85, 100];

/** Taux qui reproduit l'impôt au rachat des illustrations (impôt ÷ (rachat − coût de base)). */
export const ILLUSTRATION_TAX_RATE = 0.5331;

export const SCENARIOS = [
  {
    id: 's1',
    label: 'Scénario 1',
    name: 'Dépôt modulable',
    color: '#01233f',
    rows: SCENARIO_ROWS.s1,
  },
  {
    id: 's3',
    label: 'Scénario 3',
    name: 'Paiement en 20 ans',
    color: '#064dd9',
    rows: SCENARIO_ROWS.s3,
  },
  {
    id: 's4',
    label: 'Scénario 4',
    name: 'Mise de fonds initiale',
    color: '#756b5f',
    rows: SCENARIO_ROWS.s4,
  },
];

export function scenarioById(id) {
  return SCENARIOS.find((scenario) => scenario.id === id) || SCENARIOS[0];
}

export function rowAtAge(scenario, age) {
  return scenario.rows.find((row) => row.age === age) || null;
}

export function firstCollateralYear(scenario) {
  return scenario.rows.find((row) => row.csv >= COLLATERAL_THRESHOLD) || null;
}

export function illustrateLoan(rows, { startYear, amount, repayment, horizonAge }) {
  const start = rows.find((row) => row.year === startYear);
  const csvAtStart = start ? start.csv : 0;
  const bank = csvAtStart >= COLLATERAL_THRESHOLD;
  const rate = bank ? BANK_RATE : INSURER_RATE;
  const principal = Math.max(0, Number(amount) || 0);
  const annualPayment = Math.max(0, Number(repayment) || 0);

  let balance = 0;
  let maxBalance = 0;
  let breach = null;
  const points = [];

  for (const row of rows) {
    if (row.age > horizonAge) break;

    if (principal > 0 && row.year === startYear) {
      balance = principal;
    } else if (principal > 0 && row.year > startYear) {
      balance = balance * (1 + rate) - annualPayment;
      if (balance < 0) balance = 0;
    } else {
      balance = 0;
    }

    if (balance > maxBalance) maxBalance = balance;
    const ceiling = row.csv * SAFETY_RATIO;
    if (!breach && balance > ceiling && balance > 0) {
      breach = {
        age: row.age,
        year: row.year,
        balance,
        ceiling,
      };
    }

    const loanOpen = principal > 0 && row.year >= startYear;
    points.push({
      age: row.age,
      year: row.year,
      csv: row.csv,
      csvG: row.csvG,
      death: row.death,
      cumulative: row.cumulative,
      balance: loanOpen ? balance : null,
      ceiling,
    });
  }

  return {
    bank,
    rate,
    csvAtStart,
    maxBalance,
    breach,
    points,
    last: points[points.length - 1] || null,
  };
}

/**
 * Taux interne annuel. La prime de l'année k est versée au début de l'année,
 * la valeur terminale est lue à la fin de la dernière année.
 * Cette convention reproduit le « rendement au rachat » des illustrations.
 */
export function policyIrr(rows, terminalKey) {
  const n = rows.length;
  if (!n) return null;
  const terminal = Number(rows[n - 1][terminalKey]) || 0;

  const npv = (rate) => {
    let total = -rows[0].premium;
    for (let i = 1; i < n; i += 1) {
      total -= rows[i].premium / (1 + rate) ** i;
    }
    total += terminal / (1 + rate) ** n;
    return total;
  };

  let low = -0.85;
  let high = 0.4;
  let lowValue = npv(low);
  let highValue = npv(high);
  if (lowValue === 0) return low;
  if (highValue === 0) return high;
  if (lowValue * highValue > 0) return null;

  for (let i = 0; i < 80; i += 1) {
    const mid = (low + high) / 2;
    const value = npv(mid);
    if (Math.abs(value) < 0.01) return mid;
    if (value > 0) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}

/**
 * Rendement imposable qu'un placement taxé chaque année au taux `taxRate`
 * doit produire pour laisser le même rendement net que `rate`.
 * Réservé aux rendements positifs : un taux négatif ne se grossit pas.
 */
export function taxableEquivalent(rate, taxRate) {
  if (!Number.isFinite(rate) || rate <= 0) return null;
  if (!Number.isFinite(taxRate) || taxRate < 0 || taxRate >= 0.95) return null;
  return rate / (1 - taxRate);
}

export function yieldReading(scenario, age, taxRate) {
  const row = rowAtAge(scenario, age);
  if (!row) return null;
  const held = row.irr / 100;
  const slice = scenario.rows.filter((item) => item.year <= row.year);
  const afterExit = policyIrr(slice, 'net');
  const equivalent = taxableEquivalent(held, taxRate);
  const afterExitEquivalent = taxableEquivalent(afterExit, taxRate);
  return {
    held,
    advantage: equivalent == null ? null : equivalent - held,
    equivalent,
    afterExit,
    afterExitEquivalent,
    taxRate,
  };
}

export function formatCad(value, fractionDigits) {
  const n = Number(value) || 0;
  const autoCents = Math.round(Math.abs(n) * 100) % 100 !== 0;
  const digits = fractionDigits == null ? (autoCents ? 2 : 0) : fractionDigits;
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}

export function formatPct(value, digits = 2) {
  return `${new Intl.NumberFormat('fr-CA', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}\u00A0%`;
}

export function formatPoints(value) {
  if (!Number.isFinite(value)) return '—';
  const formatted = new Intl.NumberFormat('fr-CA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value) * 100);
  if (value > 0) return `+${formatted}\u00A0pts`;
  if (value < 0) return `−${formatted}\u00A0pts`;
  return `${formatted}\u00A0pts`;
}

export function formatMultiple(value) {
  if (!Number.isFinite(value)) return '—';
  return `${new Intl.NumberFormat('fr-CA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}\u00A0×`;
}

export function formatCompactCad(value) {
  const n = Number(value) || 0;
  const abs = Math.abs(n);
  if (abs >= 1000000) {
    return `${new Intl.NumberFormat('fr-CA', {
      maximumFractionDigits: 1,
      minimumFractionDigits: abs >= 10000000 ? 0 : 1,
    }).format(n / 1000000)}\u00A0M$`;
  }
  if (abs >= 1000) {
    return `${new Intl.NumberFormat('fr-CA', { maximumFractionDigits: 0 }).format(n / 1000)}\u00A0k$`;
  }
  return formatCad(n);
}

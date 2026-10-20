import { SCENARIO_ROWS } from './assuranceVieActifData';

export const ISSUE_AGE = 32;
export const COLLATERAL_THRESHOLD = 100000;
export const BANK_RATE = 0.055;
export const INSURER_RATE = 0.085;
export const SAFETY_RATIO = 0.8;
export const READ_AGES = [40, 51, 65, 85, 100];

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

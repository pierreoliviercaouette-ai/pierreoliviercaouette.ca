/**
 * Types, constantes et helpers purs pour l'illustrateur patrimonial.
 * Porté depuis ImmoIQ V3 — sans Supabase / CRUD.
 */

export function calcMortgage(balance, annualRate, amortYears, monthlyPayment, solveFor) {
  const r = (parseFloat(annualRate) || 0) / 100;
  const semiRate = r / 2;
  const m = Math.pow(1 + semiRate, 1 / 6) - 1;

  switch (solveFor) {
    case 'payment': {
      const P = parseFloat(balance) || 0;
      const n = (parseFloat(amortYears) || 25) * 12;
      if (P <= 0 || m <= 0 || n <= 0) return 0;
      return (P * (m * Math.pow(1 + m, n))) / (Math.pow(1 + m, n) - 1);
    }
    case 'balance': {
      const PMT = parseFloat(monthlyPayment) || 0;
      const n = (parseFloat(amortYears) || 25) * 12;
      if (PMT <= 0 || m <= 0 || n <= 0) return 0;
      return (PMT * (Math.pow(1 + m, n) - 1)) / (m * Math.pow(1 + m, n));
    }
    case 'amortization': {
      const P = parseFloat(balance) || 0;
      const PMT = parseFloat(monthlyPayment) || 0;
      if (P <= 0 || PMT <= 0 || m <= 0) return 0;
      const ratio = (P * m) / PMT;
      if (ratio >= 1) return 99;
      const n = -Math.log(1 - ratio) / Math.log(1 + m);
      return Math.ceil(n / 12);
    }
    default:
      return 0;
  }
}

export const ENTITY_TYPES = [
  { value: 'personnel', label: 'Personnel' },
  { value: 'corporation', label: 'Corporation / Inc.' },
];

export const DEFAULT_TAX_RATES = {
  personnel: 53.31,
  corporation: 26.5,
};

export const CAPITAL_GAINS_INCLUSION = 0.5;

export const QC_DIVIDEND_TAX = {
  nonEligible: { grossUp: 0.15, dtcRate: 0.145 },
  eligible: { grossUp: 0.38, dtcRate: 0.2074 },
};

export function calcDividendTax(dividendAmount, personalMarginalRate, isEligible = false) {
  if (dividendAmount <= 0) return 0;
  const params = isEligible ? QC_DIVIDEND_TAX.eligible : QC_DIVIDEND_TAX.nonEligible;
  const grossedUp = dividendAmount * (1 + params.grossUp);
  const tax = grossedUp * (personalMarginalRate / 100) - grossedUp * params.dtcRate;
  return Math.max(0, tax);
}

export const ASSET_TYPES = [
  { value: 'reer', label: 'REER' },
  { value: 'celi', label: 'CELI' },
  { value: 'non_enregistre', label: 'Non-enregistré' },
  { value: 'corporatif', label: 'Compte corporatif' },
  { value: 'immobilier', label: 'Immobilier' },
  { value: 'assurance_participative', label: 'Assurance participative' },
  { value: 'autre', label: 'Autre' },
];

export const DEBT_TYPES = [
  { value: 'hypotheque', label: 'Hypothèque' },
  { value: 'marge_credit', label: 'Marge de crédit' },
  { value: 'pret_auto', label: 'Prêt automobile' },
  { value: 'pret_personnel', label: 'Prêt personnel' },
  { value: 'carte_credit', label: 'Carte de crédit' },
  { value: 'autre', label: 'Autre' },
];

export const REVENUE_TYPES = [
  { value: 'salaire', label: 'Salaire / Emploi' },
  { value: 'revenu_immeuble', label: "Revenu d'immeuble" },
  { value: 'revenu_placement', label: 'Revenu de placement' },
  { value: 'dividende', label: 'Dividende' },
  { value: 'autre', label: 'Autre' },
];

export const EVENT_TYPES = [
  { value: 'refinancement', label: 'Refinancement' },
  { value: 'achat', label: 'Nouvel achat' },
  { value: 'vente', label: 'Vente' },
  { value: 'renovation', label: 'Rénovation' },
  { value: 'produit_financier', label: 'Produit financier' },
  { value: 'assurance_participative', label: 'Assurance participative' },
  { value: 'changement_contributions', label: 'Changement des contributions' },
  { value: 'cashflow_direction', label: 'Ajuster la direction du cashflow' },
  { value: 'cotisation_reer', label: 'Cotisation REER' },
  { value: 'retrait_reer', label: 'Retrait REER' },
  { value: 'cotisation_celi', label: 'Cotisation CELI' },
  { value: 'retrait_celi', label: 'Retrait CELI' },
  { value: 'plan_financement_immediat', label: 'Plan financement immédiat (PFI)' },
  { value: 'avance_sur_police', label: 'Avance sur police (imposable)' },
  { value: 'declaration_dividende', label: 'Déclaration de dividende' },
  { value: 'autre', label: 'Autre' },
];

/**
 * Parse un tableau de lignes CSV/Excel déjà normalisées (header + rows).
 * Format attendu: année, âge?, valeur de rachat, assurance vie total, primes versées.
 */
export function parseInsuranceRows(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return [];

  let yearlyData = [];
  const surrenderData = {};
  const insuranceData = {};
  const premiumData = {};

  for (let i = 0; i < raw.length; i++) {
    const row = raw[i];
    if (!row || row.length === 0) continue;
    const rowStr = row.map((c) => String(c || '').toLowerCase()).join('|');
    const hasYear = rowStr.includes('année') || rowStr.includes('annee') || rowStr.includes('year');
    if (!hasYear) continue;

    let yearCol = -1;
    let ageCol = -1;
    let surrenderCol = -1;
    let insuranceCol = -1;
    let premiumCol = -1;
    for (let c = 0; c < row.length; c++) {
      const cell = String(row[c] || '')
        .toLowerCase()
        .trim();
      if (cell === 'année' || cell === 'annee' || cell === 'year') yearCol = c;
      if (cell === 'âge' || cell === 'age') ageCol = c;
      if (cell.includes('valeur de rachat totale') && surrenderCol === -1) surrenderCol = c;
      if (
        (cell.includes('assurance vie total') || cell.includes("d'assurance vie total")) &&
        insuranceCol === -1
      ) {
        insuranceCol = c;
      }
      if (cell.includes('primes') && cell.includes('versées') && premiumCol === -1) premiumCol = c;
      if (cell.includes('valeur de rachat') && !cell.includes('totale') && surrenderCol === -1) {
        surrenderCol = c;
      }
      if ((cell.includes('capital décès') || cell.includes('capital deces')) && insuranceCol === -1) {
        insuranceCol = c;
      }
      if (cell.includes('prime') && premiumCol === -1) premiumCol = c;
    }
    if (yearCol === -1) continue;

    for (let j = i + 1; j < raw.length; j++) {
      const dataRow = raw[j];
      if (!dataRow || dataRow.length === 0) break;
      const yearVal = parseFloat(dataRow[yearCol]);
      if (Number.isNaN(yearVal) || yearVal < 0) break;
      const year = Math.round(yearVal);
      if (surrenderCol !== -1) {
        const val = parseFloat(String(dataRow[surrenderCol]).replace(/[^0-9.-]/g, ''));
        if (!Number.isNaN(val)) surrenderData[year] = val;
      }
      if (insuranceCol !== -1) {
        const val = parseFloat(String(dataRow[insuranceCol]).replace(/[^0-9.-]/g, ''));
        if (!Number.isNaN(val)) insuranceData[year] = val;
      }
      if (premiumCol !== -1) {
        const val = parseFloat(String(dataRow[premiumCol]).replace(/[^0-9.-]/g, ''));
        if (!Number.isNaN(val)) premiumData[year] = val;
      }
      if (ageCol !== -1) {
        const age = parseFloat(dataRow[ageCol]);
        if (!Number.isNaN(age) && !yearlyData.find((d) => d.year === year)) {
          yearlyData.push({ year, age: Math.round(age) });
        }
      }
    }
  }

  const allYears = new Set([
    ...Object.keys(surrenderData).map(Number),
    ...Object.keys(insuranceData).map(Number),
    ...Object.keys(premiumData).map(Number),
    ...yearlyData.map((d) => d.year),
  ]);

  return Array.from(allYears)
    .sort((a, b) => a - b)
    .map((year) => {
      const existing = yearlyData.find((d) => d.year === year) || {};
      return {
        year,
        age: existing.age || null,
        surrenderValue: surrenderData[year] || 0,
        totalInsurance: insuranceData[year] || 0,
        premiumPaid: premiumData[year] || 0,
      };
    });
}

/** Parse CSV text into insurance schedule rows. */
export function parseInsuranceCsv(text) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);
  const raw = lines.map((line) => line.split(/[;,\t]/).map((c) => c.trim()));
  return parseInsuranceRows(raw);
}

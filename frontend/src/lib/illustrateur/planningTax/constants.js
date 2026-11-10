/** Types dont la croissance du solde n'est pas imposée annuellement (abri différé). */
export const GROWTH_TAX_DEFERRED_TYPES = new Set([
  'reer',
  'celi',
  'assurance_participative',
]);

/** Appréciation de valeur sans impôt annuel sur la plus-value non réalisée. */
export const APPRECIATION_ONLY_TYPES = new Set(['immobilier']);

/** Comptes avec PNB/ACB et gains en capital au décès ou à la vente. */
export const CAPITAL_GAINS_BOOK_TYPES = new Set([
  'non_enregistre',
  'corporatif',
  'autre',
  'immobilier',
]);

export const NON_TAXABLE_AT_DEATH_TYPES = new Set(['celi', 'assurance_participative']);

/** Taux combiné simplifié revenu de placement passif en corporation (QC). */
export const CORP_PASSIVE_INVESTMENT_TAX_RATE = 0.5067;

/** Crédit IMRTD / RDTOH sur revenu de placement passif imposé (~30,67 % fédéral). */
export const IMRTD_CREDIT_RATE = 0.3067;

/** Remboursement RTD sur dividendes imposables versés (~38,33 %). */
export const RTD_REFUND_RATE = 0.3833;

/** @deprecated Alias — utiliser RTD_REFUND_RATE */
export const RDTOH_REFUND_RATE = RTD_REFUND_RATE;

/** GRIP : crédit annuel simplifié (% du revenu actif corp. si politique activée). */
export const DEFAULT_GRIP_ACCRUAL_RATE = 0;

export const DEFAULT_PROPERTY_APPRECIATION = 0.03;

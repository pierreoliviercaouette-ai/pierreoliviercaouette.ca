/**
 * Textes et helpers conformité — portefeuilles modèles (fonds distincts).
 * Source de vérité des KPI affichés : moyenne pondérée des rendements nets des fonds.
 */

export const PORTFOLIO_PRODUCT_NOTICE =
  'Produits d’assurance : les fonds distincts sont offerts par contrat d’assurance (pas un dépôt bancaire ni un fonds commun de placement classique). La valeur marchande fluctue et peut être inférieure aux sommes investies.';

export const PORTFOLIO_METHOD_NOTE =
  'Moyenne pondérée interne des rendements nets des fonds (série Classique 75/75), selon les poids du portefeuille modèle. Calcul à titre indicatif seulement — non fourni ni vérifié par l’assureur ; un compte réel peut différer.';

export const PORTFOLIO_BANNER_DISCLAIMER =
  'Fonds distincts (contrat d’assurance) · moyenne pondérée indicative (non officielle assureur) · rendements passés ≠ futurs · ne constitue pas un conseil personnalisé · valeur marchande ≠ garanties contractuelles.';

export const PORTFOLIO_BANNER_PRODUCT_LINE =
  'Contrats d’assurance — valeur marchande ≠ garanties · les rendements passés ne préjugent pas des rendements futurs.';


export const PORTFOLIO_INCOMPLETE_HISTORY_NOTE =
  'Un astérisque (*) indique une période pour laquelle l’historique d’un ou plusieurs fonds est incomplet, ou où des fonds ont été exclus du calcul pondéré.';

export const PORTFOLIO_GUARANTEE_DISCLAIMER =
  'Les fonds distincts peuvent comporter des garanties contractuelles (ex. garantie au décès / à l’échéance selon le contrat et l’option choisie, dont la série Classique 75/75). Ces garanties ne s’appliquent pas à la valeur marchande courante. Les chiffres présentés ici reflètent la valeur marchande / les rendements de placement, pas le paiement garanti.';

export const PORTFOLIO_GENERAL_DISCLAIMER =
  'Illustration de portefeuilles modèles à titre indicatif seulement — ceci ne constitue pas un conseil personnalisé ni une recommandation d’achat. Les rendements passés ne garantissent pas les rendements futurs.';

export const PORTFOLIO_RISK_SCALE_NOTE =
  'Échelle 1–5 : classification indicative du modèle interne seulement — ce n’est pas une cote de risque officielle des fonds, ni une évaluation de votre profil d’investisseur.';

export const PORTFOLIO_MER_NOTE =
  'RFG illustratif du modèle à la date de l’illustration source ; les frais réels d’un contrat (RFG des fonds, frais de garantie, etc.) peuvent différer et évoluer.';

/** Mapping colonnes tableau portefeuille ↔ champs perf fonds */
export const PORTFOLIO_PERIOD_TO_FUND_FIELD = {
  oneMonth: 'oneMonthPct',
  threeMonth: 'threeMonthPct',
  sixMonth: 'sixMonthPct',
  ytd: 'ytdPct',
  oneYear: 'oneYearPct',
  threeYear: 'threeYearPct',
  fiveYear: 'fiveYearPct',
  tenYear: 'tenYearPct',
};

export function formatReturnFr(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  const n = Number(value);
  const sign = n > 0 ? '+' : n < 0 ? '-' : '';
  const abs = Math.abs(n).toFixed(1).replace('.', ',');
  return `${sign}${abs} %`;
}

export function formatReturnWithIncomplete(value, incomplete = false) {
  const base = formatReturnFr(value);
  if (base === '—' || !incomplete) return base;
  return `${base}*`;
}

export function formatIsoDateLabelFr(isoDate) {
  if (!isoDate || typeof isoDate !== 'string') return '';
  const [year, month, day] = isoDate.split('-').map((value) => Number(value));
  if (!year || !month || !day) return '';
  return new Date(year, month - 1, day).toLocaleDateString('fr-CA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

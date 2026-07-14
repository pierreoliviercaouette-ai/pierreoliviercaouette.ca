/**
 * Textes et helpers conformité — portefeuilles modèles (fonds distincts).
 * Source de vérité des KPI affichés : moyenne pondérée des rendements nets des fonds.
 */

export const PORTFOLIO_METHOD_NOTE =
  'Moyenne pondérée des rendements nets des fonds (série Classique 75/75), selon les poids du portefeuille modèle. Méthode indicative — un compte réel peut différer.';

export const PORTFOLIO_BANNER_DISCLAIMER =
  'Indicatif seulement · moyenne pondérée des fonds · rendements passés ≠ futurs · ne constitue pas un conseil personnalisé.';

export const PORTFOLIO_INCOMPLETE_HISTORY_NOTE =
  'Un astérisque (*) indique une période pour laquelle l’historique du fonds est incomplet selon la source iA.';

export const PORTFOLIO_GUARANTEE_DISCLAIMER =
  'Les fonds distincts peuvent comporter des garanties contractuelles (ex. garantie au décès / à l’échéance selon le contrat). Ces garanties ne s’appliquent pas à la valeur marchande courante : celle-ci fluctue et peut être inférieure aux montants investis. Les chiffres présentés ici reflètent la valeur marchande / les rendements de placement, pas le paiement garanti.';

export const PORTFOLIO_GENERAL_DISCLAIMER =
  'Illustration de portefeuilles modèles à titre indicatif seulement — ceci ne constitue pas un conseil personnalisé. Les rendements passés ne garantissent pas les rendements futurs.';

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

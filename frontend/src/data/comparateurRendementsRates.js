import { DEFAULT_MODEL_PORTFOLIOS } from './modelPortfolios';

/** Moyennes illustratives banques (succursale / wrap), 5 ans net — par profil. */
export const BANQUE_5Y_BY_PROFIL = {
  prudent: 4.0,
  modere: 5.2,
  equilibre: 6.3,
  croissance: 8.6,
  audacieux: 11.4,
};

export const PROFIL_RISQUE_LABELS = {
  prudent: 'Prudent',
  modere: 'Modéré',
  equilibre: 'Équilibré',
  croissance: 'Croissance',
  audacieux: 'Audacieux',
};

/** Arrondi 1 décimale pour affichage / comparaison. */
const round1 = (n) => Math.round(Number(n) * 10) / 10;

/**
 * Rendements iA 5 ans net dérivés des portefeuilles modèles (même source que /portefeuilles).
 */
export const IA_5Y_BY_PROFIL = Object.fromEntries(
  DEFAULT_MODEL_PORTFOLIOS.map((p) => [p.key, round1(p.annualized5y)])
);

export function getBanqueAvgForProfil(profil) {
  return BANQUE_5Y_BY_PROFIL[profil] ?? BANQUE_5Y_BY_PROFIL.equilibre;
}

export function getIaPctForProfil(profil) {
  return IA_5Y_BY_PROFIL[profil] ?? IA_5Y_BY_PROFIL.equilibre;
}

export function formatPctFr(n, digits = 1) {
  return Number(n).toFixed(digits).replace('.', ',');
}

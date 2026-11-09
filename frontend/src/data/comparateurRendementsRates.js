export {
  getAllIaPctByProfil,
  getIaPctForProfil,
  getLiveModelPortfolioAsOfLabel,
  setLiveModelPortfolioReturns,
} from '../lib/modelPortfolioReturns';

/**
 * Moyennes illustratives banques (succursale / wrap), 5 ans net — par profil.
 * Source : emails/sources-rendements-institutions.md (compilation nov. 2026, as-of ~30 sept. 2026).
 */
export const BANQUE_5Y_BY_PROFIL = {
  prudent: 3.0,
  modere: 4.4,
  equilibre: 5.7,
  croissance: 8.1,
  audacieux: 10.9,
};

export const PROFIL_RISQUE_LABELS = {
  prudent: 'Prudent',
  modere: 'Modéré',
  equilibre: 'Équilibré',
  croissance: 'Croissance',
  audacieux: 'Audacieux',
};

export function getBanqueAvgForProfil(profil) {
  return BANQUE_5Y_BY_PROFIL[profil] ?? BANQUE_5Y_BY_PROFIL.equilibre;
}

export function formatPctFr(n, digits = 1) {
  return Number(n).toFixed(digits).replace('.', ',');
}

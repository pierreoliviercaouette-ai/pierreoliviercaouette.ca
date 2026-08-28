export {
  getAllIaPctByProfil,
  getIaPctForProfil,
  getLiveModelPortfolioAsOfLabel,
  setLiveModelPortfolioReturns,
} from '../lib/modelPortfolioReturns';

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

export function getBanqueAvgForProfil(profil) {
  return BANQUE_5Y_BY_PROFIL[profil] ?? BANQUE_5Y_BY_PROFIL.equilibre;
}

export function formatPctFr(n, digits = 1) {
  return Number(n).toFixed(digits).replace('.', ',');
}

/**
 * Snapshot jemcee uniquement — portefeuilles modèles iA, 5 ans net.
 * Source : performance-fonds iA Série Classique 75/75 au 30 septembre 2026
 * (pondération = holdings des modèles /portefeuilles).
 *
 * Ne pas utiliser hors /jemcee : le reste du site suit Supabase sync admin.
 */
export const JEMCEE_PORTFOLIOS_AS_OF = '30 septembre 2026';

/** Rendements 5 ans net annualisés (1 décimale), pondérés. */
export const JEMCEE_IA_5Y_BY_PROFIL = {
  prudent: 4.7,
  modere: 7.3,
  equilibre: 9.6,
  croissance: 12.3,
  audacieux: 15.5,
};

export function getJemceeIaPctForProfil(profil) {
  return JEMCEE_IA_5Y_BY_PROFIL[profil] ?? JEMCEE_IA_5Y_BY_PROFIL.equilibre;
}

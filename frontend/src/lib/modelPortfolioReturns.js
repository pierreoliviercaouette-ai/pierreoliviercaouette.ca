/**
 * Source unique des rendements 5 ans net iA pour comparaisons (comparateur, jemcee, etc.).
 * Priorité : cache live Supabase (même calcul que /portefeuilles) → defaults pondérés → statique.
 */

import { DEFAULT_MODEL_PORTFOLIOS } from '../data/modelPortfolios';
import { PORTFOLIO_PROFILE_LIST } from '../data/portfolioProfiles';
import {
  buildPackagedPerfByCode,
  buildWeightedPortfolioCards,
} from './portfolioFundPerf';

const round1 = (n) => Math.round(Number(n) * 10) / 10;

/** Cache alimenté par Supabase via useModelPortfolioReturns / ToolDetail. */
let liveReturnsByProfil = null;
let liveAsOfLabel = null;

/** Defaults pondérés (calculés une fois). */
let packagedReturnsByProfil = null;

function buildPackagedReturnsMap() {
  const cards = buildWeightedPortfolioCards(buildPackagedPerfByCode(), []);
  return Object.fromEntries(
    cards.map((c) => [c.key, c.annualized5y != null ? round1(c.annualized5y) : null])
  );
}

function getPackagedReturnsMap() {
  if (!packagedReturnsByProfil) {
    packagedReturnsByProfil = buildPackagedReturnsMap();
  }
  return packagedReturnsByProfil;
}

function getStaticFallback5y(profil) {
  const row =
    DEFAULT_MODEL_PORTFOLIOS.find((p) => p.key === profil) ||
    DEFAULT_MODEL_PORTFOLIOS.find((p) => p.key === 'equilibre');
  return row?.annualized5y != null ? round1(row.annualized5y) : null;
}

export function setLiveModelPortfolioReturns(cards, asOfLabel) {
  if (!cards?.length) return;
  const next = {};
  for (const card of cards) {
    if (card.annualized5y != null) {
      next[card.key] = round1(card.annualized5y);
    }
  }
  if (Object.keys(next).length) {
    liveReturnsByProfil = next;
    liveAsOfLabel = asOfLabel || null;
  }
}

export function getLiveModelPortfolioAsOfLabel() {
  return liveAsOfLabel;
}

export function clearLiveModelPortfolioReturns() {
  liveReturnsByProfil = null;
  liveAsOfLabel = null;
}

/** Rendement 5 ans net iA pour un profil. */
export function getIaPctForProfil(profil) {
  if (liveReturnsByProfil?.[profil] != null) {
    return liveReturnsByProfil[profil];
  }
  const packaged = getPackagedReturnsMap()[profil];
  if (packaged != null) {
    return packaged;
  }
  return getStaticFallback5y(profil) ?? getStaticFallback5y('equilibre');
}

/** Tous les profils — pour graphiques / selects. */
export function getAllIaPctByProfil() {
  return Object.fromEntries(PORTFOLIO_PROFILE_LIST.map((p) => [p.key, getIaPctForProfil(p.key)]));
}

/** @deprecated Préférer getAllIaPctByProfil(). */
export function getIaReturnsSnapshot() {
  return getAllIaPctByProfil();
}

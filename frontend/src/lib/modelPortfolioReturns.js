/**
 * Source unique des rendements 5 ans net iA pour comparaisons (comparateur, jemcee, etc.).
 * Priorité : KPI sync `model_portfolios` (Supabase) → fallbacks statiques du repo.
 */

import { DEFAULT_MODEL_PORTFOLIOS } from '../data/modelPortfolios';
import { PORTFOLIO_PROFILE_LIST } from '../data/portfolioProfiles';

const round1 = (n) => Math.round(Number(n) * 10) / 10;

/** Cache alimenté par Supabase via useModelPortfolioReturns / ToolDetail. */
let liveReturnsByProfil = null;
let liveAsOfLabel = null;

/** Fallback statique (modelPortfolios.js — aligné admin sync). */
let staticReturnsByProfil = null;

function getStaticReturnsMap() {
  if (!staticReturnsByProfil) {
    staticReturnsByProfil = Object.fromEntries(
      DEFAULT_MODEL_PORTFOLIOS.map((p) => [
        p.key,
        p.annualized5y != null ? round1(p.annualized5y) : null,
      ])
    );
  }
  return staticReturnsByProfil;
}

function getStaticFallback5y(profil) {
  const row =
    DEFAULT_MODEL_PORTFOLIOS.find((p) => p.key === profil) ||
    DEFAULT_MODEL_PORTFOLIOS.find((p) => p.key === 'equilibre');
  return row?.annualized5y != null ? round1(row.annualized5y) : null;
}

/** Alimente le cache depuis les lignes `model_portfolios` (annualized_5y sync). */
export function setLiveFromModelPortfolioRows(rows, asOfLabel) {
  if (!rows?.length) return;
  const next = {};
  for (const row of rows) {
    if (row.annualized_5y != null && row.key) {
      next[row.key] = round1(row.annualized_5y);
    }
  }
  if (Object.keys(next).length) {
    liveReturnsByProfil = next;
    liveAsOfLabel = asOfLabel || null;
  }
}

/** @deprecated Préférer setLiveFromModelPortfolioRows. */
export function setLiveModelPortfolioReturns(cards, asOfLabel) {
  if (!cards?.length) return;
  setLiveFromModelPortfolioRows(
    cards.map((c) => ({ key: c.key, annualized_5y: c.annualized5y })),
    asOfLabel
  );
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
  const staticVal = getStaticReturnsMap()[profil];
  if (staticVal != null) {
    return staticVal;
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

/** Invalide le cache statique (tests). */
export function resetStaticPortfolioReturnsCache() {
  staticReturnsByProfil = null;
}

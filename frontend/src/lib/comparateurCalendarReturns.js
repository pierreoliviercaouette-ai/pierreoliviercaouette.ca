/**
 * Rendements année civile des portefeuilles modèles (pondération holdings + fiches).
 * Utilisé par le mode avancé du comparateur de rendements.
 */

import { PORTFOLIO_CALENDAR_RETURNS_DEFAULTS } from '../data/portfolioCalendarReturnsDefaults';
import { getProfileHoldingsResolved, PORTFOLIO_PROFILES } from '../data/portfolioProfiles';

/** Dernières 10 années civiles complètes (as-of 2026). */
export const COMPARATEUR_CALENDAR_YEARS = [
  2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
];

const MIN_COVERAGE = 0.7;

function yearReturn(calendarMap, year) {
  const entry = calendarMap?.[String(year)];
  if (!entry || entry.value == null || !Number.isFinite(Number(entry.value))) return null;
  return { value: Number(entry.value), incomplete: Boolean(entry.incomplete) };
}

function weightedReturnForYear(holdings, year) {
  const totalW = holdings.reduce((s, h) => s + Number(h.weightPct || 0), 0);
  if (totalW <= 0) return null;

  let coveredW = 0;
  let sum = 0;
  let incomplete = false;

  for (const h of holdings) {
    const w = Number(h.weightPct || 0);
    if (w <= 0 || !h.fuCode) continue;
    const cal = PORTFOLIO_CALENDAR_RETURNS_DEFAULTS[h.fuCode];
    const yr = yearReturn(cal, year);
    if (!yr) continue;
    if (yr.incomplete) incomplete = true;
    coveredW += w;
    sum += w * yr.value;
  }

  if (coveredW <= 0) return null;
  if (coveredW / totalW < MIN_COVERAGE) return null;

  return {
    value: Math.round((sum / coveredW) * 100) / 100,
    incomplete: incomplete || coveredW < totalW - 0.01,
  };
}

function buildIaCalendarMap(profilKey) {
  const holdings = getProfileHoldingsResolved(profilKey);
  const out = {};
  for (const year of COMPARATEUR_CALENDAR_YEARS) {
    const wr = weightedReturnForYear(holdings, year);
    if (wr) out[year] = wr;
  }
  return out;
}

/** Cache statique — mêmes défauts fiche que /portefeuilles. */
const IA_CALENDAR_BY_PROFIL = Object.fromEntries(
  Object.keys(PORTFOLIO_PROFILES).map((key) => [key, buildIaCalendarMap(key)])
);

/**
 * @param {string} profilKey
 * @returns {Record<number, { value: number, incomplete: boolean }>}
 */
export function getIaCalendarReturnsForProfil(profilKey) {
  return IA_CALENDAR_BY_PROFIL[profilKey] || IA_CALENDAR_BY_PROFIL.equilibre || {};
}

export function calendarFieldId(year) {
  return `cal_${year}`;
}

/**
 * Annualisé géométrique à partir de rendements % année civile.
 * @param {number[]} returnsPct
 */
export function geometricAnnualizedPct(returnsPct) {
  const valid = returnsPct.filter((r) => Number.isFinite(r));
  if (!valid.length) return null;
  const product = valid.reduce((acc, r) => acc * (1 + r / 100), 1);
  if (product <= 0) return null;
  return Math.round((Math.pow(product, 1 / valid.length) - 1) * 1000) / 10;
}

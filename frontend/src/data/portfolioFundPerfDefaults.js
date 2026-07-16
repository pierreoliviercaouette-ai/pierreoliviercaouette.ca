/**
 * Fallback perf fonds — chunk / usage admin seulement (import CSV, secours offline).
 * Ne pas importer depuis le chemin d’affichage public.
 */
export const DEFAULT_FUND_PERFORMANCE = {
  FU021: { ytdPct: 0.43, prevYearPct: 2.62, oneMonthPct: 0.21, threeMonthPct: 1.74, sixMonthPct: 1.35, oneYearPct: 2.8, threeYearPct: 4.6, fiveYearPct: 0.46, tenYearPct: 1.0, incompleteFields: [] },
  FU762: { ytdPct: 1.79, prevYearPct: 4.28, oneMonthPct: 0.43, threeMonthPct: 1.77, sixMonthPct: 1.94, oneYearPct: 4.5, threeYearPct: 5.62, fiveYearPct: 2.73, tenYearPct: 3.35, incompleteFields: [] },
  FU530: { ytdPct: 7.87, prevYearPct: 6.23, oneMonthPct: 3.44, threeMonthPct: 9.7, sixMonthPct: 8.81, oneYearPct: 15.98, threeYearPct: 13.52, fiveYearPct: 6.46, tenYearPct: 8.55, incompleteFields: [] },
  FU920: { ytdPct: 7.73, prevYearPct: 9.72, oneMonthPct: 1.8, threeMonthPct: 7.81, sixMonthPct: 8.73, oneYearPct: 15.36, threeYearPct: 12.42, fiveYearPct: 6.16, tenYearPct: 5.73, incompleteFields: ['tenYearPct'] },
  FU870: { ytdPct: 15.08, prevYearPct: 43.45, oneMonthPct: -3.36, threeMonthPct: 4.03, sixMonthPct: 15.46, oneYearPct: 50.08, threeYearPct: 28.6, fiveYearPct: 16.08, tenYearPct: 13.97, incompleteFields: ['threeYearPct', 'fiveYearPct', 'tenYearPct'] },
  FU280: { ytdPct: 3.67, prevYearPct: 14.58, oneMonthPct: -4.75, threeMonthPct: -0.57, sixMonthPct: 4.65, oneYearPct: 16.26, threeYearPct: 11.89, fiveYearPct: 9.44, tenYearPct: 11.34, incompleteFields: [] },
  FU707: { ytdPct: 11.36, prevYearPct: 10.49, oneMonthPct: 2.97, threeMonthPct: 14.09, sixMonthPct: 11.76, oneYearPct: 21.09, threeYearPct: 19.29, fiveYearPct: 11.87, tenYearPct: 10.37, incompleteFields: [] },
  FU705: { ytdPct: 14.97, prevYearPct: 4.96, oneMonthPct: 4.12, threeMonthPct: 20.43, sixMonthPct: 16.45, oneYearPct: 23.47, threeYearPct: 19.26, fiveYearPct: 12.24, tenYearPct: 10.85, incompleteFields: [] },
  FU607: { ytdPct: 38.87, prevYearPct: 18.73, oneMonthPct: 2.28, threeMonthPct: 43.34, sixMonthPct: 43.27, oneYearPct: 65.12, threeYearPct: 43.99, fiveYearPct: 21.81, tenYearPct: null, incompleteFields: ['fiveYearPct', 'tenYearPct'] },
  FU505: { ytdPct: 21.31, prevYearPct: 21.02, oneMonthPct: 1.73, threeMonthPct: 20.87, sixMonthPct: 26.69, oneYearPct: 43.88, threeYearPct: 24.44, fiveYearPct: 5.62, tenYearPct: 10.79, incompleteFields: [] },
  FU310: { ytdPct: 22.49, prevYearPct: 18.4, oneMonthPct: null, threeMonthPct: 22.49, sixMonthPct: 28.81, oneYearPct: 22.49, threeYearPct: 35.32, fiveYearPct: 25.78, tenYearPct: 16.25, incompleteFields: [] },
  FU361: { ytdPct: 3.42, prevYearPct: 5.16, oneMonthPct: null, threeMonthPct: 3.42, sixMonthPct: 6.63, oneYearPct: 3.42, threeYearPct: 7.82, fiveYearPct: 8.29, tenYearPct: null, incompleteFields: ['fiveYearPct', 'tenYearPct'] },
};

/** Périodes marquées * dans le CSV iA (historique incomplet / rendement simulé). */
export const KNOWN_INCOMPLETE_FUND_FIELDS = {
  FU870: ['threeYearPct', 'fiveYearPct', 'tenYearPct'],
  FU920: ['tenYearPct'],
  FU607: ['fiveYearPct', 'tenYearPct'],
  FU361: ['fiveYearPct', 'tenYearPct'],
};

export function getDefaultFundPerformance(fuCode) {
  return DEFAULT_FUND_PERFORMANCE[fuCode] || null;
}

export function resolveIncompleteFields(fuCode, metaIncomplete, defaultsIncomplete) {
  const known = KNOWN_INCOMPLETE_FUND_FIELDS[fuCode] || [];
  const fromMeta = Array.isArray(metaIncomplete) ? metaIncomplete : [];
  const fromDefaults = Array.isArray(defaultsIncomplete) ? defaultsIncomplete : [];
  return [...new Set([...fromMeta, ...fromDefaults, ...known])];
}

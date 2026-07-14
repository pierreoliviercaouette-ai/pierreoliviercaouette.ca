/** Mapping codes illustration iA (3 chiffres) → code fiche/CSV FUxxx */
export const ILLUSTRATION_CODE_TO_FU = {
  '456': 'FU021',
  '450': 'FU762',
  '007': 'FU920',
  '870': 'FU870',
  '422': 'FU707',
  '420': 'FU705',
  '608': 'FU607',
  '780': 'FU280',
  '500': 'FU505',
};

/** Catalogue des fonds utilisés dans les portefeuilles modèles */
export const FUND_CATALOG = {
  FU021: {
    name: 'Obligations de sociétés canadiennes (iA)',
    category: 'Fonds de revenu',
    fichePath: '/fiches-fonds/FU021.pdf',
  },
  FU762: {
    name: "Stratégie d'obligations de sociétés (iA) - SPÉCIALISÉ",
    category: 'Fonds de revenu',
    fichePath: '/fiches-fonds/FU762.pdf',
  },
  FU920: {
    name: 'Fidelity Revenu mensuel mondial',
    category: 'Fonds diversifiés',
    fichePath: '/fiches-fonds/FU920.pdf',
  },
  FU870: {
    name: 'Actions canadiennes à petite capitalisation (iA)',
    category: "Fonds d'actions canadiennes",
    fichePath: '/fiches-fonds/FU870.pdf',
  },
  FU707: {
    name: 'Actions mondiales (iA)',
    category: "Fonds d'actions américaines et internationales",
    fichePath: '/fiches-fonds/FU707.pdf',
  },
  FU705: {
    name: 'Actions américaines (iA)',
    category: "Fonds d'actions américaines et internationales",
    fichePath: '/fiches-fonds/FU705.pdf',
  },
  FU607: {
    name: 'Fidelity Innovations mondiales',
    category: 'Fonds spécialisés',
    fichePath: '/fiches-fonds/FU607.pdf',
  },
  FU280: {
    name: 'Potentiel Canada Fidelity',
    category: "Fonds d'actions canadiennes",
    fichePath: '/fiches-fonds/FU280.pdf',
  },
  FU505: {
    name: 'Asie pacifique (iA)',
    category: 'Fonds spécialisés',
    fichePath: null, // fiche absente du lot fourni
  },
  FU530: {
    name: 'Diversifié mondial (Loomis Sayles)',
    category: 'Fonds diversifiés',
    fichePath: '/fiches-fonds/FU530.pdf',
  },
};

const RISK_ACCENTS = {
  prudent: { accent: '#0d9488', riskLevel: 1 },
  modere: { accent: '#0284c7', riskLevel: 2 },
  equilibre: { accent: '#064dd9', riskLevel: 3 },
  croissance: { accent: '#c2410c', riskLevel: 4 },
  audacieux: { accent: '#b91c1c', riskLevel: 5 },
};

/**
 * Rendements fonds (CSV iA performance-fonds-2026_07_13) — fallback avant import admin.
 * Valeurs en %.
 */
export const DEFAULT_FUND_PERFORMANCE = {
  FU021: { ytdPct: 0.43, prevYearPct: 2.62, oneMonthPct: 0.21, threeMonthPct: 1.74, sixMonthPct: 1.35, oneYearPct: 2.8, threeYearPct: 4.6, fiveYearPct: 0.46, tenYearPct: 1.0 },
  FU762: { ytdPct: 1.79, prevYearPct: 4.28, oneMonthPct: 0.43, threeMonthPct: 1.77, sixMonthPct: 1.94, oneYearPct: 4.5, threeYearPct: 5.62, fiveYearPct: 2.73, tenYearPct: 3.35 },
  FU530: { ytdPct: 7.87, prevYearPct: 6.23, oneMonthPct: 3.44, threeMonthPct: 9.7, sixMonthPct: 8.81, oneYearPct: 15.98, threeYearPct: 13.52, fiveYearPct: 6.46, tenYearPct: 8.55 },
  FU920: { ytdPct: 7.73, prevYearPct: 9.72, oneMonthPct: 1.8, threeMonthPct: 7.81, sixMonthPct: 8.73, oneYearPct: 15.36, threeYearPct: 12.42, fiveYearPct: 6.16, tenYearPct: 5.73 },
  FU870: { ytdPct: 15.08, prevYearPct: 43.45, oneMonthPct: -3.36, threeMonthPct: 4.03, sixMonthPct: 15.46, oneYearPct: 50.08, threeYearPct: 28.6, fiveYearPct: 16.08, tenYearPct: 13.97 },
  FU280: { ytdPct: 3.67, prevYearPct: 14.58, oneMonthPct: -4.75, threeMonthPct: -0.57, sixMonthPct: 4.65, oneYearPct: 16.26, threeYearPct: 11.89, fiveYearPct: 9.44, tenYearPct: 11.34 },
  FU707: { ytdPct: 11.36, prevYearPct: 10.49, oneMonthPct: 2.97, threeMonthPct: 14.09, sixMonthPct: 11.76, oneYearPct: 21.09, threeYearPct: 19.29, fiveYearPct: 11.87, tenYearPct: 10.37 },
  FU705: { ytdPct: 14.97, prevYearPct: 4.96, oneMonthPct: 4.12, threeMonthPct: 20.43, sixMonthPct: 16.45, oneYearPct: 23.47, threeYearPct: 19.26, fiveYearPct: 12.24, tenYearPct: 10.85 },
  FU607: { ytdPct: 38.87, prevYearPct: 18.73, oneMonthPct: 2.28, threeMonthPct: 43.34, sixMonthPct: 43.27, oneYearPct: 65.12, threeYearPct: 43.99, fiveYearPct: 21.81, tenYearPct: null },
  FU505: { ytdPct: 21.31, prevYearPct: 21.02, oneMonthPct: 1.73, threeMonthPct: 20.87, sixMonthPct: 26.69, oneYearPct: 43.88, threeYearPct: 24.44, fiveYearPct: 5.62, tenYearPct: 10.79 },
};

export function getDefaultFundPerformance(fuCode) {
  return DEFAULT_FUND_PERFORMANCE[fuCode] || null;
}

/**
 * Profils modèles — composition / philosophie / allocation (source: illustrations iA, 30 juin 2026)
 * holdings: illustrationCode + weightPct; fuCode dérivé du mapping
 */
export const PORTFOLIO_PROFILES = {
  prudent: {
    key: 'prudent',
    name: 'Prudent',
    href: '/portefeuilles/prudent',
    displayOrder: 1,
    merPct: 2.5,
    riskLevel: RISK_ACCENTS.prudent.riskLevel,
    accent: RISK_ACCENTS.prudent.accent,
    philosophy: {
      summary:
        'Prioriser la préservation du capital et un revenu plus stable, avec une exposition limitée aux actions.',
      bullets: [
        'Horizon typique plus court ou tolérance au risque faible',
        'Accent sur le revenu fixe et la diversification prudente',
        'Convient si la stabilité prime sur la croissance maximale',
      ],
    },
    assetAllocation: [
      { key: 'revenu_fixe', label: 'Revenu fixe', pct: 69 },
      { key: 'actions_ca', label: 'Actions canadiennes', pct: 6 },
      { key: 'actions_us', label: 'Actions américaines', pct: 14 },
      { key: 'actions_intl', label: 'Actions internationales', pct: 8 },
      { key: 'liquidites', label: 'Liquidités', pct: 3 },
    ],
    holdings: [
      { illustrationCode: '456', weightPct: 30 },
      { illustrationCode: '450', weightPct: 30 },
      { illustrationCode: '007', weightPct: 25 },
      { illustrationCode: '870', weightPct: 5 },
      { illustrationCode: '422', weightPct: 5 },
      { illustrationCode: '608', weightPct: 5 },
    ],
    /** KPI illustration PDF au 30 juin 2026 */
    defaults: { ytd: 6.69, prevYear: 8.13, annualized3y: 10.77, annualized5y: 4.99 },
    periodReturns: {
      oneMonth: 0.74,
      threeMonth: 6.08,
      sixMonth: 6.69,
      ytd: 6.69,
      oneYear: 12.84,
      threeYear: 10.77,
      fiveYear: 4.99,
      tenYear: null,
    },
    /** Croissance illustration (base 100 000 $ fin 2017 → fin d'année) */
    growthSeries: [
      { year: 2017, value: 100000 },
      { year: 2018, value: 97440 },
      { year: 2019, value: 107038 },
      { year: 2020, value: 118362 },
      { year: 2021, value: 123227 },
      { year: 2022, value: 110103 },
      { year: 2023, value: 119583 },
      { year: 2024, value: 134651 },
      { year: 2025, value: 145598 },
    ],
  },
  modere: {
    key: 'modere',
    name: 'Modéré',
    href: '/portefeuilles/modere',
    displayOrder: 2,
    merPct: 2.65,
    riskLevel: RISK_ACCENTS.modere.riskLevel,
    accent: RISK_ACCENTS.modere.accent,
    philosophy: {
      summary:
        'Équilibrer protection et croissance modérée : une majorité de revenu fixe, avec une part d’actions pour participer aux marchés.',
      bullets: [
        'Tolérance au risque faible à moyenne',
        'Revenu fixe dominant, actions en soutien',
        'Objectif : progression progressive du capital sans trop de volatilité',
      ],
    },
    assetAllocation: [
      { key: 'revenu_fixe', label: 'Revenu fixe', pct: 52 },
      { key: 'actions_ca', label: 'Actions canadiennes', pct: 11 },
      { key: 'actions_us', label: 'Actions américaines', pct: 21 },
      { key: 'actions_intl', label: 'Actions internationales', pct: 13 },
      { key: 'liquidites', label: 'Liquidités', pct: 3 },
    ],
    holdings: [
      { illustrationCode: '456', weightPct: 20 },
      { illustrationCode: '450', weightPct: 20 },
      { illustrationCode: '007', weightPct: 30 },
      { illustrationCode: '870', weightPct: 10 },
      { illustrationCode: '422', weightPct: 10 },
      { illustrationCode: '608', weightPct: 10 },
    ],
    defaults: { ytd: 10.33, prevYear: 11.56, annualized3y: 14.96, annualized5y: 7.46 },
    periodReturns: {
      oneMonth: 0.86,
      threeMonth: 9.19,
      sixMonth: 10.33,
      ytd: 10.33,
      oneYear: 19.7,
      threeYear: 14.96,
      fiveYear: 7.46,
      tenYear: null,
    },
    growthSeries: [
      { year: 2017, value: 100000 },
      { year: 2018, value: 96060 },
      { year: 2019, value: 108644 },
      { year: 2020, value: 126168 },
      { year: 2021, value: 134117 },
      { year: 2022, value: 118345 },
      { year: 2023, value: 131457 },
      { year: 2024, value: 154318 },
      { year: 2025, value: 172157 },
    ],
  },
  equilibre: {
    key: 'equilibre',
    name: 'Équilibré',
    href: '/portefeuilles/equilibre',
    displayOrder: 3,
    merPct: 2.77,
    riskLevel: RISK_ACCENTS.equilibre.riskLevel,
    accent: RISK_ACCENTS.equilibre.accent,
    philosophy: {
      summary:
        'Chercher un équilibre entre croissance et protection, avec une plus grande part en actions tout en conservant une base de revenu fixe.',
      bullets: [
        'Tolérance au risque moyenne',
        'Mix actions / revenu fixe pour lisser les cycles',
        'Horizon de placement moyen à long terme',
      ],
    },
    assetAllocation: [
      { key: 'revenu_fixe', label: 'Revenu fixe', pct: 34 },
      { key: 'actions_ca', label: 'Actions canadiennes', pct: 20 },
      { key: 'actions_us', label: 'Actions américaines', pct: 27 },
      { key: 'actions_intl', label: 'Actions internationales', pct: 18 },
      { key: 'liquidites', label: 'Liquidités', pct: 1 },
    ],
    holdings: [
      { illustrationCode: '456', weightPct: 20 },
      { illustrationCode: '007', weightPct: 30 },
      { illustrationCode: '870', weightPct: 20 },
      { illustrationCode: '422', weightPct: 20 },
      { illustrationCode: '608', weightPct: 10 },
    ],
    defaults: { ytd: 12.66, prevYear: 16.1, annualized3y: 18.62, annualized5y: 9.71 },
    periodReturns: {
      oneMonth: 0.73,
      threeMonth: 10.65,
      sixMonth: 12.66,
      ytd: 12.66,
      oneYear: 25.91,
      threeYear: 18.62,
      fiveYear: 9.71,
      tenYear: null,
    },
    growthSeries: [
      { year: 2017, value: 100000 },
      { year: 2018, value: 93830 },
      { year: 2019, value: 108777 },
      { year: 2020, value: 129325 },
      { year: 2021, value: 141249 },
      { year: 2022, value: 124045 },
      { year: 2023, value: 139315 },
      { year: 2024, value: 168431 },
      { year: 2025, value: 195549 },
    ],
  },
  croissance: {
    key: 'croissance',
    name: 'Croissance',
    href: '/portefeuilles/croissance',
    displayOrder: 4,
    merPct: 2.81,
    riskLevel: RISK_ACCENTS.croissance.riskLevel,
    accent: RISK_ACCENTS.croissance.accent,
    philosophy: {
      summary:
        'Viser la croissance du capital sur le long terme, avec une forte composante actions et une part moindre de revenu fixe.',
      bullets: [
        'Tolérance au risque moyenne à élevée',
        'Acceptation de la volatilité en échange d’un potentiel de rendement plus élevé',
        'Horizon long terme recommandé',
      ],
    },
    assetAllocation: [
      { key: 'revenu_fixe', label: 'Revenu fixe', pct: 24 },
      { key: 'actions_ca', label: 'Actions canadiennes', pct: 26 },
      { key: 'actions_us', label: 'Actions américaines', pct: 36 },
      { key: 'actions_intl', label: 'Actions internationales', pct: 12 },
      { key: 'liquidites', label: 'Liquidités', pct: 2 },
    ],
    holdings: [
      { illustrationCode: '456', weightPct: 10 },
      { illustrationCode: '450', weightPct: 10 },
      { illustrationCode: '007', weightPct: 10 },
      { illustrationCode: '870', weightPct: 15 },
      { illustrationCode: '780', weightPct: 10 },
      { illustrationCode: '422', weightPct: 10 },
      { illustrationCode: '420', weightPct: 10 },
      { illustrationCode: '608', weightPct: 25 },
    ],
    defaults: { ytd: 17.98, prevYear: 16.61, annualized3y: 23.09, annualized5y: 12.3 },
    periodReturns: {
      oneMonth: 1.06,
      threeMonth: 16.68,
      sixMonth: 17.98,
      ytd: 17.98,
      oneYear: 32.61,
      threeYear: 23.09,
      fiveYear: 12.3,
      tenYear: null,
    },
    growthSeries: [
      { year: 2017, value: 100000 },
      { year: 2018, value: 93190 },
      { year: 2019, value: 111679 },
      { year: 2020, value: 146143 },
      { year: 2021, value: 162000 },
      { year: 2022, value: 138429 },
      { year: 2023, value: 163235 },
      { year: 2024, value: 208157 },
      { year: 2025, value: 242732 },
    ],
  },
  audacieux: {
    key: 'audacieux',
    name: 'Audacieux',
    href: '/portefeuilles/audacieux',
    displayOrder: 5,
    merPct: 2.95,
    riskLevel: RISK_ACCENTS.audacieux.riskLevel,
    accent: RISK_ACCENTS.audacieux.accent,
    philosophy: {
      summary:
        'Maximiser le potentiel de croissance à long terme avec un portefeuille quasi entièrement en actions.',
      bullets: [
        'Tolérance au risque élevée',
        'Peu ou pas de revenu fixe — forte exposition actions',
        'Convient à un horizon long et à une capacité d’absorber les baisses de marché',
      ],
    },
    assetAllocation: [
      { key: 'revenu_fixe', label: 'Revenu fixe', pct: 0 },
      { key: 'actions_ca', label: 'Actions canadiennes', pct: 31 },
      { key: 'actions_us', label: 'Actions américaines', pct: 45 },
      { key: 'actions_intl', label: 'Actions internationales', pct: 24 },
      { key: 'liquidites', label: 'Liquidités', pct: 0 },
    ],
    holdings: [
      { illustrationCode: '870', weightPct: 20 },
      { illustrationCode: '780', weightPct: 10 },
      { illustrationCode: '422', weightPct: 15 },
      { illustrationCode: '420', weightPct: 15 },
      { illustrationCode: '608', weightPct: 30 },
      { illustrationCode: '500', weightPct: 10 },
    ],
    defaults: { ytd: 23.79, prevYear: 20.93, annualized3y: 28.83, annualized5y: 15.03 },
    periodReturns: {
      oneMonth: 1.29,
      threeMonth: 21.73,
      sixMonth: 23.79,
      ytd: 23.79,
      oneYear: 42.72,
      threeYear: 28.83,
      fiveYear: 15.03,
      tenYear: null,
    },
    growthSeries: [
      { year: 2017, value: 100000 },
      { year: 2018, value: 90280 },
      { year: 2019, value: 112751 },
      { year: 2020, value: 158516 },
      { year: 2021, value: 177744 },
      { year: 2022, value: 147172 },
      { year: 2023, value: 178623 },
      { year: 2024, value: 238962 },
      { year: 2025, value: 288976 },
    ],
  },
};

export function resolveFuCode(illustrationCode) {
  return ILLUSTRATION_CODE_TO_FU[String(illustrationCode).padStart(3, '0')]
    || ILLUSTRATION_CODE_TO_FU[String(illustrationCode)]
    || null;
}

export function getProfileHoldingsResolved(profileKey) {
  const profile = PORTFOLIO_PROFILES[profileKey];
  if (!profile) return [];
  return profile.holdings.map((h, index) => {
    const fuCode = resolveFuCode(h.illustrationCode);
    const fund = fuCode ? FUND_CATALOG[fuCode] : null;
    return {
      illustrationCode: h.illustrationCode,
      fuCode,
      weightPct: h.weightPct,
      sortOrder: index + 1,
      name: fund?.name || `Fonds ${h.illustrationCode}`,
      category: fund?.category || null,
      fichePath: fund?.fichePath || null,
    };
  });
}

export function getPortfolioProfile(key) {
  return PORTFOLIO_PROFILES[key] || null;
}

export const PORTFOLIO_PROFILE_LIST = Object.values(PORTFOLIO_PROFILES).sort(
  (a, b) => a.displayOrder - b.displayOrder
);

/** Normalize CSV fund code FU021-P2 → FU021 */
export function normalizeFundExternalCode(raw) {
  if (!raw) return null;
  const cleaned = String(raw).replace(/&nbsp;/gi, ' ').trim().toUpperCase();
  const match = cleaned.match(/FU\d{3}/);
  return match ? match[0] : null;
}

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
    hasFiche: true,
  },
  FU762: {
    name: "Stratégie d'obligations de sociétés (iA) - SPÉCIALISÉ",
    category: 'Fonds de revenu',
    hasFiche: true,
  },
  FU920: {
    name: 'Fidelity Revenu mensuel mondial',
    category: 'Fonds diversifiés',
    hasFiche: true,
  },
  FU870: {
    name: 'Actions canadiennes à petite capitalisation (iA)',
    category: "Fonds d'actions canadiennes",
    hasFiche: true,
  },
  FU707: {
    name: 'Actions mondiales (iA)',
    category: "Fonds d'actions américaines et internationales",
    hasFiche: true,
  },
  FU705: {
    name: 'Actions américaines (iA)',
    category: "Fonds d'actions américaines et internationales",
    hasFiche: true,
  },
  FU607: {
    name: 'Fidelity Innovations mondiales',
    category: 'Fonds spécialisés',
    hasFiche: true,
  },
  FU280: {
    name: 'Potentiel Canada Fidelity',
    category: "Fonds d'actions canadiennes",
    hasFiche: true,
  },
  FU505: {
    name: 'Asie pacifique (iA)',
    category: 'Fonds spécialisés',
    hasFiche: true,
  },
  FU530: {
    name: 'Diversifié mondial (Loomis Sayles)',
    category: 'Fonds diversifiés',
    hasFiche: true,
  },
  FU310: {
    name: 'Indiciel américain DAQ (iA)',
    category: 'Fonds spécialisés',
    hasFiche: true,
  },
  FU361: {
    name: 'Croissance et revenu mondiaux (iA)',
    category: 'Fonds diversifiés',
    hasFiche: false,
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
        'Orientation du modèle : préserver davantage le capital et viser un revenu plus stable, avec une exposition limitée aux actions.',
      bullets: [
        'Profil de modèle associé à un horizon typiquement plus court ou une volatilité plus faible',
        'Accent sur le revenu fixe et une diversification prudente',
        'Description informative seulement — ne constitue pas une recommandation personnalisée',
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
        'Orientation du modèle : articuler protection et croissance modérée — majorité de revenu fixe, avec une part d’actions.',
      bullets: [
        'Profil de modèle à volatilité faible à moyenne',
        'Revenu fixe dominant, actions en complément',
        'Description informative seulement — ne constitue pas une recommandation personnalisée',
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
        'Orientation du modèle : doser croissance et protection, avec une part accrue en actions et une base de revenu fixe.',
      bullets: [
        'Profil de modèle à volatilité moyenne',
        'Mix actions / revenu fixe visant à traverser les cycles de marché',
        'Description informative seulement — ne constitue pas une recommandation personnalisée',
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
        'Orientation du modèle : croissance du capital sur le long terme, forte composante actions et part moindre de revenu fixe.',
      bullets: [
        'Profil de modèle à volatilité moyenne à élevée',
        'Exposition actions dominante ; volatilité potentielle plus importante',
        'Description informative seulement — ne constitue pas une recommandation personnalisée',
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
        'Orientation du modèle : exposition quasi entière aux actions, en vue d’un potentiel de croissance à long terme plus élevé.',
      bullets: [
        'Profil de modèle à volatilité élevée',
        'Peu ou pas de revenu fixe — forte exposition actions',
        'Description informative seulement — ne constitue pas une recommandation personnalisée',
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
      hasFiche: Boolean(fund?.hasFiche),
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

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

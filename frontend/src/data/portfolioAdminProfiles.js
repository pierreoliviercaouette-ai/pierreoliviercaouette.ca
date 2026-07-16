import { FUND_CATALOG } from './portfolioProfiles';

/**
 * Portefeuilles internes (admin seulement) — non listés sur /portefeuilles.
 */
export const ADMIN_PORTFOLIO_PROFILES = {
  'equilibre-2': {
    key: 'equilibre-2',
    name: 'Équilibré #2',
    href: '/admin/portefeuilles/equilibre-2',
    adminOnly: true,
    merPct: 2.8,
    riskLevel: 3,
    accent: '#064dd9',
    philosophy: {
      summary:
        'Variante équilibrée : accent sur le revenu mondial et la croissance diversifiée, avec exposition technologique (Nasdaq) et poche obligataire / petite capitalisation.',
      bullets: [
        'Profil de modèle à volatilité moyenne — usage interne / illustration',
        'Mix fonds diversifiés, indiciel et spécialisés',
        'Document interne admin — ne constitue pas une recommandation personnalisée',
      ],
    },
    assetAllocation: [
      { key: 'revenu_fixe', label: 'Revenu fixe', pct: 36 },
      { key: 'actions_ca', label: 'Actions canadiennes', pct: 15 },
      { key: 'actions_us', label: 'Actions américaines', pct: 29 },
      { key: 'actions_intl', label: 'Actions internationales', pct: 20 },
      { key: 'liquidites', label: 'Liquidités', pct: 0 },
    ],
    holdings: [
      { fuCode: 'FU920', weightPct: 35 },
      { fuCode: 'FU361', weightPct: 25 },
      { fuCode: 'FU310', weightPct: 15 },
      { fuCode: 'FU607', weightPct: 10 },
      { fuCode: 'FU021', weightPct: 7.5 },
      { fuCode: 'FU870', weightPct: 7.5 },
    ],
  },
};

export function getAdminPortfolioProfile(key) {
  return ADMIN_PORTFOLIO_PROFILES[key] || null;
}

export function isAdminPortfolioSlug(key) {
  return Boolean(ADMIN_PORTFOLIO_PROFILES[key]);
}

export function getAdminProfileHoldingsResolved(profileKey) {
  const profile = ADMIN_PORTFOLIO_PROFILES[profileKey];
  if (!profile) return [];
  return profile.holdings.map((h, index) => {
    const fuCode = h.fuCode;
    const fund = fuCode ? FUND_CATALOG[fuCode] : null;
    return {
      illustrationCode: h.illustrationCode || null,
      fuCode,
      weightPct: h.weightPct,
      sortOrder: index + 1,
      name: h.name || fund?.name || fuCode,
      category: fund?.category || null,
      hasFiche: Boolean(fund?.hasFiche),
    };
  });
}

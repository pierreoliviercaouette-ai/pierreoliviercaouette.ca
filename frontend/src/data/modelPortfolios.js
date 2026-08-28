export const DEFAULT_MODEL_PORTFOLIOS_AS_OF = '30 juin 2026';

/** Fallbacks hors-ligne — KPI sync admin (model_portfolios) au 30 juin 2026 */
export const DEFAULT_MODEL_PORTFOLIOS = [
  {
    key: 'prudent',
    name: 'Prudent',
    ytd2026: 6.08,
    year2025: 8.13,
    annualized3y: 9.93,
    annualized5y: 4.58,
    href: '/portefeuilles/prudent',
  },
  {
    key: 'modere',
    name: 'Modéré',
    ytd2026: 9.87,
    year2025: 11.56,
    annualized3y: 13.69,
    annualized5y: 6.99,
    href: '/portefeuilles/modere',
  },
  {
    key: 'equilibre',
    name: 'Équilibré',
    ytd2026: 12.9,
    year2025: 16.1,
    annualized3y: 16.95,
    annualized5y: 9.16,
    href: '/portefeuilles/equilibre',
  },
  {
    key: 'croissance',
    name: 'Croissance',
    ytd2026: 17.79,
    year2025: 15.87,
    annualized3y: 20.43,
    annualized5y: 11.54,
    href: '/portefeuilles/croissance',
  },
  {
    key: 'audacieux',
    name: 'Audacieux',
    ytd2026: 23.76,
    year2025: 20.19,
    annualized3y: 25.48,
    annualized5y: 14.37,
    href: '/portefeuilles/audacieux',
  },
];

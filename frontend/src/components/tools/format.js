export const BRAND_BLUE = '#064dd9';
export const BRAND_NAVY = '#01233f';
export const BRAND_MUTED = '#94a3b8';

export const formatCad = (value) => {
  const n = Number(value);
  if (value === undefined || value === null || Number.isNaN(n)) return '0 $';
  return `${Math.round(n).toLocaleString('fr-CA')} $`;
};

export const formatPct = (value, digits = 1) => {
  const n = Number(value);
  if (value === undefined || value === null || Number.isNaN(n)) return '0 %';
  return `${n.toFixed(digits).replace('.', ',')} %`;
};

export const stripEmoji = (text = '') =>
  String(text)
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

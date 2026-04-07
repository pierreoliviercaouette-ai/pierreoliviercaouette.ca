/**
 * Extract text from a PDF (Morningstar / iA-style reports) and parse portfolio returns.
 * Logic aligned with backend/import_model_portfolios_from_pdf.py
 *
 * pdfjs-dist is loaded dynamically so the main bundle stays smaller for public pages.
 */

// Keep in sync with package.json pdfjs-dist version (worker must match API)
const PDFJS_DIST_VERSION = '4.6.82';

const PROFILE_KEY_MAP = {
  prudent: 'prudent',
  modere: 'modere',
  modéré: 'modere',
  equilibre: 'equilibre',
  équilibré: 'equilibre',
  croissance: 'croissance',
  audacieux: 'audacieux',
};

const PERIOD_LABELS = ['1 mois', '3 mois', '6 mois', 'AAJ', '1 an', '3 ans', '5 ans', '10 ans'];
const PERCENT_RE = /-?\d+(?:,\d+)?%/g;

function normalizeProfileName(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/é/g, 'e')
    .replace(/è/g, 'e')
    .replace(/ê/g, 'e')
    .replace(/à/g, 'a')
    .replace(/â/g, 'a');
}

export function extractProfileKey(text) {
  const lowered = text.toLowerCase();
  for (const [rawName, key] of Object.entries(PROFILE_KEY_MAP)) {
    if (lowered.includes(`profil ${rawName}`)) return key;
    if (lowered.includes(`portefeuille ${rawName}`)) return key;
  }
  const m = text.match(/Profil\s+([A-Za-zÀ-ÿ]+)/i);
  if (m) {
    const profileName = normalizeProfileName(m[1]);
    const key = PROFILE_KEY_MAP[profileName];
    if (key) return key;
    throw new Error(`Profil non pris en charge: ${m[1]}`);
  }
  throw new Error(
    "Impossible de trouver le profil dans le PDF (ex. « Profil prudent » ou « Portefeuille Audacieux »)."
  );
}

function toFloatPercent(token) {
  return parseFloat(token.replace('%', '').replace(',', '.'), 10);
}

/**
 * Tableau « Rend année civile » (souvent fiable). pdf.js regroupe le texte en longues lignes :
 * on cherche dans le texte brut, sans ancrage début de ligne.
 */
function extractFromCivilYearBlock(text) {
  const civilMatch = text.match(/Rend\s+ann[ée]e\s+civile/i);
  if (!civilMatch) return null;
  const start = civilMatch.index ?? 0;
  const chunk = text.slice(start, start + 20000);

  const aajMatch = chunk.match(/AAJ\s+(-?\d+(?:,\d+)?)/i);
  if (!aajMatch) return null;

  const ytd = toFloatPercent(`${aajMatch[1]}%`);
  const annualPairs = [];
  const yearRe = /\b(20\d{2})\s+(-?\d+(?:,\d+)?)\b/g;
  let m = yearRe.exec(chunk);
  while (m !== null) {
    const y = parseInt(m[1], 10);
    if (y >= 2000 && y <= 2035) {
      annualPairs.push([y, toFloatPercent(`${m[2]}%`)]);
    }
    m = yearRe.exec(chunk);
  }

  if (annualPairs.length === 0) return null;
  const [latestYear, latestValue] = annualPairs.reduce((a, b) => (a[0] > b[0] ? a : b));
  return { ytd2026: ytd, annualYear: latestYear, annualValue: latestValue };
}

/**
 * Bloc « Rendements passés* » (ex. rapport Audacieux) : AAJ + optionnellement « 1 an » comme proxy annuel.
 */
function extractFromRendementsPasses(text) {
  const idx = text.search(/Rendements\s+pass[ée]s/i);
  if (idx === -1) return null;
  const chunk = text.slice(idx, idx + 6000);
  const aaj = chunk.match(/AAJ\s+(-?\d+(?:,\d+)?)/i);
  if (!aaj) return null;
  const ytd = toFloatPercent(`${aaj[1]}%`);
  const oneYear = chunk.match(/\b1\s+an\s+(-?\d+(?:,\d+)?)/i);
  if (!oneYear) return null;
  const v = toFloatPercent(`${oneYear[1]}%`);
  return { ytd2026: ytd, annualYear: new Date().getFullYear() - 1, annualValue: v };
}

/**
 * Ancienne table compacte « 1 mois … AAJ … 2015 … 2024 » (pypdf). Fenêtre élargie sur tout le texte après la ligne d’en-tête.
 */
function extractFromLegacyCompactTable(text) {
  const lines = text
    .split(/\r?\n/)
    .map((ln) => ln.trim())
    .filter(Boolean);

  let labelIdx = -1;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.includes('AAJ') && line.includes('1 mois') && line.includes('3 mois')) {
      labelIdx = i;
      break;
    }
  }
  if (labelIdx === -1) return null;

  const labelLine = lines[labelIdx];
  const years = [...labelLine.matchAll(/\b(20\d{2})\b/g)].map((x) => parseInt(x[1], 10));
  if (years.length === 0) return null;

  const expectedCount = PERIOD_LABELS.length + years.length;
  const contextStart = Math.max(0, labelIdx - 5);
  const contextEnd = Math.min(lines.length, labelIdx + 40);
  const context = lines.slice(contextStart, contextEnd).join(' ');
  const allPercents = context.match(PERCENT_RE) || [];
  if (allPercents.length < expectedCount) return null;

  const slice = allPercents.slice(-expectedCount).map((x) => toFloatPercent(x));
  const ytd2026 = slice[PERIOD_LABELS.indexOf('AAJ')];
  const latestYear = Math.max(...years);
  const latestYearIndex = PERIOD_LABELS.length + years.indexOf(latestYear);
  const annualValue = slice[latestYearIndex];
  return { ytd2026, annualYear: latestYear, annualValue };
}

export function extractReturns(text) {
  const fromCivil = extractFromCivilYearBlock(text);
  if (fromCivil) return fromCivil;

  const fromRp = extractFromRendementsPasses(text);
  if (fromRp) return fromRp;

  const fromLegacy = extractFromLegacyCompactTable(text);
  if (fromLegacy) return fromLegacy;

  throw new Error(
    'Impossible d extraire les rendements (AAJ et annees civiles). Verifiez que le PDF contient une section « Rend année civile » ou « Rendements passés » avec AAJ.'
  );
}

/** Optional: "Date du rapport 05-31-2024" -> ISO date for Postgres */
export function tryExtractReportDateIso(text) {
  const m = text.match(/Date du rapport\s+(\d{2})-(\d{2})-(\d{4})/i);
  if (!m) return null;
  const [, mm, dd, yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Reconstitue des lignes logiques (comme pypdf) à partir des positions des glyphes.
 * Sans cela, toute une page devient un seul bloc et les regex « ligne AAJ » échouent.
 */
function textContentToLineOrientedString(textContent) {
  const items = textContent.items.filter((item) => 'str' in item && item.str);
  const rows = [];
  for (const item of items) {
    const tr = item.transform;
    const y = Math.round(tr[5]);
    const x = tr[4];
    rows.push({ y, x, str: item.str });
  }
  rows.sort((a, b) => (b.y !== a.y ? b.y - a.y : a.x - b.x));
  const lines = [];
  let buf = [];
  let lineY = null;
  const yTol = 4;
  for (const r of rows) {
    if (lineY === null || Math.abs(r.y - lineY) <= yTol) {
      buf.push(r);
      lineY = r.y;
    } else {
      buf.sort((a, b) => a.x - b.x);
      lines.push(buf.map((b) => b.str).join(' '));
      buf = [r];
      lineY = r.y;
    }
  }
  if (buf.length) {
    buf.sort((a, b) => a.x - b.x);
    lines.push(buf.map((b) => b.str).join(' '));
  }
  return lines.join('\n');
}

export async function extractTextFromPdfFile(file) {
  const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
  if (typeof window !== 'undefined' && !GlobalWorkerOptions.workerSrc) {
    GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_DIST_VERSION}/build/pdf.worker.min.mjs`;
  }
  const buf = await file.arrayBuffer();
  const pdf = await getDocument({ data: new Uint8Array(buf) }).promise;
  const parts = [];
  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const tc = await page.getTextContent();
    parts.push(textContentToLineOrientedString(tc));
  }
  return parts.join('\n');
}

/**
 * @returns {{ key: string, ytd_2026: number, year_2025: number, annualSourceYear: number, asOfDate: string | null }}
 */
export function parseMorningstarPortfolioPdf(text) {
  const key = extractProfileKey(text);
  const { ytd2026, annualYear, annualValue } = extractReturns(text);
  const asIso = tryExtractReportDateIso(text);
  return {
    key,
    ytd_2026: ytd2026,
    year_2025: annualValue,
    annualSourceYear: annualYear,
    asOfDate: asIso,
  };
}

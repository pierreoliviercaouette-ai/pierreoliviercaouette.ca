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

export function extractReturns(text) {
  const lines = text
    .split(/\r?\n/)
    .map((ln) => ln.trim())
    .filter(Boolean);

  const civilIdx = lines.findIndex((ln) => ln.includes('Rend année civile'));
  if (civilIdx !== -1) {
    const window = lines.slice(civilIdx, civilIdx + 30);
    let ytd = null;
    const annualPairs = [];
    for (const ln of window) {
      const mAaj = ln.match(/^AAJ\s+(-?\d+(?:,\d+)?)\b/i);
      if (mAaj) {
        ytd = toFloatPercent(`${mAaj[1]}%`);
        continue;
      }
      const mYear = ln.match(/^(20\d{2})\s+(-?\d+(?:,\d+)?)\b/);
      if (mYear) {
        annualPairs.push([parseInt(mYear[1], 10), toFloatPercent(`${mYear[2]}%`)]);
      }
    }
    if (ytd != null && annualPairs.length > 0) {
      const [latestYear, latestValue] = annualPairs.reduce((a, b) => (a[0] > b[0] ? a : b));
      return { ytd2026: ytd, annualYear: latestYear, annualValue: latestValue };
    }
  }

  let labelIdx = -1;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.includes('AAJ') && line.includes('1 mois') && line.includes('3 mois')) {
      labelIdx = i;
      break;
    }
  }
  if (labelIdx === -1) {
    throw new Error('Impossible de trouver la ligne des périodes (AAJ, 1 mois, etc.).');
  }

  const labelLine = lines[labelIdx];
  const years = [...labelLine.matchAll(/\b(20\d{2})\b/g)].map((x) => parseInt(x[1], 10));
  if (years.length === 0) {
    throw new Error('Impossible de trouver les colonnes annuelles (ex. 2025) dans le PDF.');
  }

  const expectedCount = PERIOD_LABELS.length + years.length;
  const contextStart = Math.max(0, labelIdx - 25);
  const contextEnd = Math.min(lines.length, labelIdx + 3);
  const context = lines.slice(contextStart, contextEnd).join(' ');
  const allPercents = context.match(PERCENT_RE) || [];
  if (allPercents.length < expectedCount) {
    throw new Error(
      `Pas assez de pourcentages détectés près de la ligne AAJ (${allPercents.length} trouvés, ${expectedCount} attendus).`
    );
  }

  const slice = allPercents.slice(-expectedCount).map((x) => toFloatPercent(x));
  const ytd2026 = slice[PERIOD_LABELS.indexOf('AAJ')];
  const latestYear = Math.max(...years);
  const latestYearIndex = PERIOD_LABELS.length + years.indexOf(latestYear);
  const annualValue = slice[latestYearIndex];

  return { ytd2026, annualYear: latestYear, annualValue };
}

/** Optional: "Date du rapport 05-31-2024" -> ISO date for Postgres */
export function tryExtractReportDateIso(text) {
  const m = text.match(/Date du rapport\s+(\d{2})-(\d{2})-(\d{4})/i);
  if (!m) return null;
  const [, mm, dd, yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
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
    const line = tc.items.map((item) => ('str' in item ? item.str : '')).join(' ');
    parts.push(line);
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

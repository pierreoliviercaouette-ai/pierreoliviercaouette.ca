/**
 * Parse Morningstar / iA-style *fund* fact sheets (not multi-profile portfolio PDFs).
 * Extracts ISIN/code, name, civil-year table, AAJ (YTD), optional report date.
 */

import { extractTextFromPdfFile, tryExtractReportDateIso } from './morningstarPdfImport';

export const IA_ALLOWED_FUND_FILENAME = 'Ecof-FU870p.pdf';
export const IA_ALLOWED_FUND_PREFIX = 'ecof';

function normalizeFileName(name) {
  return String(name || '').trim().toLowerCase();
}

export function assertAllowedIaFundFileName(fileName) {
  const normalized = normalizeFileName(fileName);
  const isAllowed = normalized.startsWith(IA_ALLOWED_FUND_PREFIX) && normalized.endsWith('.pdf');
  if (!isAllowed) {
    throw new Error(
      `Seuls les fichiers de type "ecof...pdf" sont acceptes (ex: ${IA_ALLOWED_FUND_FILENAME}).`
    );
  }
}

function toFloatPercent(token) {
  return parseFloat(String(token).replace('%', '').replace(',', '.'), 10);
}

/**
 * Collect all year / percent pairs after « Rend année civile » + AAJ as YTD.
 */
export function extractCivilYearFundBlock(text) {
  const civilMatch = text.match(/Rend\s+ann[ée]e\s+civile/i);
  if (!civilMatch) return null;
  const start = civilMatch.index ?? 0;
  const chunk = text.slice(start, start + 25000);

  const aajMatch = chunk.match(/AAJ\s+(-?\d+(?:,\d+)?)/i);
  if (!aajMatch) return null;
  const ytdPct = toFloatPercent(`${aajMatch[1]}%`);

  const annualByYear = {};
  const yearRe = /\b(20\d{2})\s+(-?\d+(?:,\d+)?)\b/g;
  let m = yearRe.exec(chunk);
  while (m !== null) {
    const y = parseInt(m[1], 10);
    if (y >= 1990 && y <= 2040) {
      annualByYear[y] = toFloatPercent(`${m[2]}%`);
    }
    m = yearRe.exec(chunk);
  }

  if (Object.keys(annualByYear).length === 0) return null;

  return { annualByYear, ytdPct, chunk };
}

/**
 * Fallback for iA PDFs where the "Rend année civile" heading is missing/altered.
 * It scans the full text for AAJ and year/value pairs.
 */
export function extractLooseFundReturnBlock(text) {
  const ytdMatch = text.match(/(?:AAJ|DDA)\S*\s+(-?\d+(?:,\d+)?)/i);
  if (!ytdMatch) return null;
  const ytdPct = toFloatPercent(`${ytdMatch[1]}%`);

  const annualByYear = {};
  const yearRe = /\b(20\d{2})\s+(-?\d+(?:,\d+)?)\b/g;
  let m = yearRe.exec(text);
  while (m !== null) {
    const y = parseInt(m[1], 10);
    if (y >= 1990 && y <= 2040) {
      annualByYear[y] = toFloatPercent(`${m[2]}%`);
    }
    m = yearRe.exec(text);
  }

  if (Object.keys(annualByYear).length === 0) return null;
  return { annualByYear, ytdPct, chunk: text };
}

/**
 * iA layout fallback:
 * - "Rendements composés ... DDA ..." then next line starts with the YTD value
 * - "Rendements annuels ..." then one line of years + next line of values
 */
export function extractIaDdaAndAnnualTable(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  let ytdPct = null;
  const ddaIdx = lines.findIndex((l) => /\bDDA\b/i.test(l));
  if (ddaIdx >= 0) {
    for (let i = ddaIdx + 1; i <= Math.min(lines.length - 1, ddaIdx + 5); i += 1) {
      const firstVal = lines[i].match(/-?\d+(?:,\d+)?/);
      if (firstVal) {
        ytdPct = toFloatPercent(`${firstVal[0]}%`);
        break;
      }
    }
  }

  const annualByYear = {};
  const annualIdx = lines.findIndex((l) => /Rendements\s+annuels/i.test(l));
  if (annualIdx >= 0) {
    let years = [];
    let values = [];
    for (let i = annualIdx + 1; i <= Math.min(lines.length - 1, annualIdx + 6); i += 1) {
      if (!years.length) {
        years = [...lines[i].matchAll(/\b(20\d{2})\b/g)].map((m) => parseInt(m[1], 10));
        if (years.length >= 2) continue;
      } else if (!values.length) {
        values = [...lines[i].matchAll(/-?\d+(?:,\d+)?|\-/g)].map((m) => m[0]);
        if (values.length) break;
      }
    }

    for (let i = 0; i < years.length && i < values.length; i += 1) {
      if (values[i] === '-') continue;
      annualByYear[years[i]] = toFloatPercent(`${values[i]}%`);
    }
  }

  if (ytdPct === null || Object.keys(annualByYear).length === 0) return null;
  return { annualByYear, ytdPct, chunk: text };
}

const ISIN_RE = /\b([A-Z]{2}[A-Z0-9]{9}[0-9])\b/;

export function extractIsin(text) {
  const m = text.match(ISIN_RE);
  return m ? m[1] : null;
}

export function extractFundName(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const nom = text.match(/Nom\s+(?:du\s+)?fonds[:\s]+(.+)/i);
  if (nom && nom[1]) return nom[1].trim().slice(0, 200);

  const titre = lines.find((l) => /fonds\b/i.test(l) && l.length > 8 && l.length < 180);
  if (titre) return titre.replace(/^[\d.\s]+/, '').trim().slice(0, 200);

  const first = lines.find((l) => l.length > 12 && !/^page\s+/i.test(l));
  return first ? first.slice(0, 200) : 'Fonds importe';
}

export function extractCategory(text) {
  const m = text.match(/Cat[ée]gorie[:\s]+(.+)/i);
  return m ? m[1].trim().slice(0, 120) : null;
}

/**
 * @returns {{
 *   fundName: string,
 *   externalCode: string | null,
 *   category: string | null,
 *   annualByYear: Record<number, number>,
 *   ytdPct: number,
 *   asOfDate: string | null,
 * }}
 */
export function parseFundFactsheetText(text) {
  const block =
    extractCivilYearFundBlock(text) || extractIaDdaAndAnnualTable(text) || extractLooseFundReturnBlock(text);
  if (!block) {
    throw new Error(
      'Rendements introuvables (AAJ + annees civiles). Verifiez le format du PDF iA.'
    );
  }

  const asIso = tryExtractReportDateIso(text);
  const d = asIso ? new Date(`${asIso}T12:00:00Z`) : new Date();
  const reportYear = d.getUTCFullYear();

  const cleanedAnnual = { ...block.annualByYear };
  if (cleanedAnnual[reportYear] !== undefined) {
    delete cleanedAnnual[reportYear];
  }

  return {
    fundName: extractFundName(text),
    externalCode: extractIsin(text),
    category: extractCategory(text),
    annualByYear: cleanedAnnual,
    ytdPct: block.ytdPct,
    asOfDate: asIso,
  };
}

export async function parseFundFactsheetPdfFile(file) {
  assertAllowedIaFundFileName(file?.name);
  const text = await extractTextFromPdfFile(file);
  return parseFundFactsheetText(text);
}

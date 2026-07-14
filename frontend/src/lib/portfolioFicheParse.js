/**
 * Extraction des rendements année civile depuis les fiches PDF iA
 * (section « Rendements annuels au 31 décembre - Série Classique 75/75 »).
 */

/**
 * Detect FUxxx from filename patterns: FU021.pdf, Ecof-FU505p.pdf, 021.pdf
 */
export function detectFuCodeFromFilename(filename) {
  const base = String(filename || '')
    .replace(/^.*[/\\]/, '')
    .replace(/\.pdf$/i, '');
  const fu = base.match(/FU\s*0*(\d{2,4})/i);
  if (fu) {
    const n = Number(fu[1]);
    if (Number.isFinite(n) && n > 0) return `FU${String(n).padStart(3, '0')}`;
  }
  const bare = base.match(/^0*(\d{2,4})p?$/i);
  if (bare) {
    const n = Number(bare[1]);
    if (Number.isFinite(n) && n > 0) return `FU${String(n).padStart(3, '0')}`;
  }
  return null;
}

/**
 * Parse calendar-year returns from extracted PDF plain text.
 * @returns {{ calendarReturns: Record<string,{value:number,incomplete:boolean}>, seriesLabel: string|null } | null}
 */
export function parseCalendarReturnsFromFicheText(text) {
  if (!text) return null;
  const marker = /Rendements annuels au 31 d[ée]cembre/i;
  const start = text.search(marker);
  if (start < 0) return null;

  const slice = text.slice(start, start + 900);
  const seriesMatch = slice.match(/S[ée]rie\s+([^\d]{3,40}?)(?=\s+20\d{2})/i);
  const seriesLabel = seriesMatch ? seriesMatch[1].replace(/\s+/g, ' ').trim() : null;

  const yearsMatch = slice.match(/((?:20\d{2}\s+){2,}20\d{2})/);
  if (!yearsMatch) return null;
  const years = yearsMatch[1].trim().split(/\s+/).map(Number);
  const afterYears = slice.slice(yearsMatch.index + yearsMatch[0].length).trim();
  const tokens = afterYears.split(/\s+/).filter(Boolean);

  const values = [];
  for (let i = 0; i < tokens.length && values.length < years.length; i += 1) {
    const tok = tokens[i];
    if (tok === '-' || tok === '—' || tok === '–') {
      values.push(null);
      continue;
    }
    const numPart = tok.replace(/\*/g, '');
    if (!/^-?\d+[.,]\d+$/.test(numPart)) {
      // Stop once values started and we leave the return block (composition %, etc.)
      if (values.length > 0) break;
      continue;
    }
    let incomplete = tok.includes('*');
    if (!incomplete && tokens[i + 1] === '*') {
      incomplete = true;
      i += 1;
    }
    values.push({
      value: Number(numPart.replace(',', '.')),
      incomplete,
    });
  }

  if (values.length === 0) return null;

  const calendarReturns = {};
  years.forEach((year, i) => {
    const entry = values[i];
    if (!entry || entry.value == null || !Number.isFinite(entry.value)) return;
    calendarReturns[String(year)] = {
      value: entry.value,
      incomplete: Boolean(entry.incomplete),
    };
  });

  if (!Object.keys(calendarReturns).length) return null;
  return { calendarReturns, seriesLabel };
}

/**
 * Extract plain text from a PDF ArrayBuffer (admin import, no worker).
 */
export async function extractPdfText(arrayBuffer) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = arrayBuffer instanceof Uint8Array ? arrayBuffer : new Uint8Array(arrayBuffer);
  const doc = await pdfjs.getDocument({ data, disableWorker: true }).promise;
  const parts = [];
  for (let i = 1; i <= doc.numPages; i += 1) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    parts.push(content.items.map((item) => item.str).join(' '));
  }
  return parts.join('\n');
}

/**
 * Full parse pipeline for one fiche PDF file.
 */
export async function parseFundFichePdf(fileOrBuffer, filenameHint = '') {
  const filename =
    typeof fileOrBuffer?.name === 'string' ? fileOrBuffer.name : filenameHint;
  const buffer =
    fileOrBuffer instanceof ArrayBuffer
      ? fileOrBuffer
      : fileOrBuffer instanceof Uint8Array
        ? fileOrBuffer.buffer
        : await fileOrBuffer.arrayBuffer();

  const text = await extractPdfText(buffer);
  const parsed = parseCalendarReturnsFromFicheText(text);
  const fuCode = detectFuCodeFromFilename(filename);
  const codeFromText = text.match(/Code du Fonds\s*:\s*(\d{2,4})/i);
  const resolvedCode =
    fuCode ||
    (codeFromText
      ? `FU${String(Number(codeFromText[1])).padStart(3, '0')}`
      : null);

  if (!parsed || !resolvedCode) {
    return {
      ok: false,
      fuCode: resolvedCode,
      error: !resolvedCode
        ? 'Code fonds introuvable (nommez le fichier FUxxx.pdf)'
        : 'Section « Rendements annuels au 31 décembre » introuvable',
    };
  }

  return {
    ok: true,
    fuCode: resolvedCode,
    calendarReturns: parsed.calendarReturns,
    seriesLabel: parsed.seriesLabel,
    yearCount: Object.keys(parsed.calendarReturns).length,
  };
}

/**
 * Extraction des rendements année civile depuis les fiches PDF iA
 * (section « Rendements annuels au 31 décembre - Série Classique 75/75 »).
 */

function ensurePromiseWithResolvers() {
  if (typeof Promise.withResolvers === 'function') return;
  Promise.withResolvers = function withResolvers() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

/**
 * Detect FUxxx from iA filenames: Ecof-FU021.pdf, Ecof-FU505p.pdf, FU021.pdf
 */
export function detectFuCodeFromFilename(filename) {
  const base = String(filename || '')
    .replace(/^.*[/\\]/, '')
    .replace(/\.pdf$/i, '');

  // Prefixe iA courant : Ecof-FUxxx[p]
  const ecof = base.match(/^Ecof[-_\s]?FU\s*0*(\d{2,4})\s*p?$/i);
  if (ecof) {
    const n = Number(ecof[1]);
    if (Number.isFinite(n) && n > 0) return `FU${String(n).padStart(3, '0')}`;
  }

  const fu = base.match(/FU\s*0*(\d{2,4})/i);
  if (fu) {
    const n = Number(fu[1]);
    if (Number.isFinite(n) && n > 0) return `FU${String(n).padStart(3, '0')}`;
  }
  const bare = base.match(/^(?:Ecof[-_\s]?)?0*(\d{2,4})p?$/i);
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

async function resolveWorkerSrc(version) {
  const publicUrl = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  const candidates = [];
  if (typeof window !== 'undefined' && window.location?.origin) {
    candidates.push(new URL(`${publicUrl}/pdf.worker.min.mjs`, window.location.origin).href);
  }
  candidates.push(`https://unpkg.com/pdfjs-dist@${version}/legacy/build/pdf.worker.min.mjs`);
  candidates.push(
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.mjs`
  );

  // Blob URL évite beaucoup de soucis CORS / MIME avec les workers module
  if (typeof fetch === 'function' && typeof Blob !== 'undefined' && typeof URL !== 'undefined') {
    for (const url of candidates) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const code = await res.text();
        const blob = new Blob([code], { type: 'text/javascript' });
        return URL.createObjectURL(blob);
      } catch (err) {
        console.warn('[fiche-import] fetch worker failed', url, err?.message || err);
      }
    }
  }

  return candidates[0] || null;
}

async function loadPdfWithWorker(getDocument, GlobalWorkerOptions, version, data) {
  const workerSrc = await resolveWorkerSrc(version);
  if (!workerSrc) {
    throw new Error('Aucun worker PDF.js disponible');
  }

  GlobalWorkerOptions.workerSrc = workerSrc;
  const loadingTask = getDocument({
    data: data.slice(),
    useSystemFonts: true,
    isEvalSupported: false,
  });
  return Promise.race([
    loadingTask.promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout lecture PDF (45s)')), 45000);
    }),
  ]);
}

/**
 * Extract plain text from a PDF ArrayBuffer (admin import).
 * PDF.js 4 exige un workerSrc — sans cela l'import plantait dans le navigateur.
 */
export async function extractPdfText(arrayBuffer) {
  ensurePromiseWithResolvers();

  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const { getDocument, GlobalWorkerOptions, version } = pdfjs;
  const data =
    arrayBuffer instanceof Uint8Array
      ? arrayBuffer
      : new Uint8Array(arrayBuffer);

  const doc = await loadPdfWithWorker(getDocument, GlobalWorkerOptions, version, data);
  try {
    const parts = [];
    for (let i = 1; i <= doc.numPages; i += 1) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      parts.push(content.items.map((item) => item.str).join(' '));
    }
    return parts.join('\n');
  } finally {
    try {
      await doc.destroy();
    } catch {
      // ignore
    }
  }
}

/**
 * Full parse pipeline for one fiche PDF file.
 */
export async function parseFundFichePdf(fileOrBuffer, filenameHint = '') {
  const filename =
    typeof fileOrBuffer?.name === 'string' ? fileOrBuffer.name : filenameHint;

  let buffer;
  try {
    if (fileOrBuffer instanceof ArrayBuffer) {
      buffer = fileOrBuffer;
    } else if (fileOrBuffer instanceof Uint8Array) {
      buffer = fileOrBuffer.buffer.slice(
        fileOrBuffer.byteOffset,
        fileOrBuffer.byteOffset + fileOrBuffer.byteLength
      );
    } else if (typeof fileOrBuffer?.arrayBuffer === 'function') {
      buffer = await fileOrBuffer.arrayBuffer();
    } else {
      throw new Error('Fichier PDF invalide');
    }
  } catch (err) {
    return {
      ok: false,
      fuCode: detectFuCodeFromFilename(filename),
      error: `Lecture fichier: ${err?.message || err}`,
    };
  }

  let text;
  try {
    text = await extractPdfText(buffer);
  } catch (err) {
    console.error('[fiche-import] PDF.js error', filename, err);
    return {
      ok: false,
      fuCode: detectFuCodeFromFilename(filename),
      error: `Lecture PDF (pdf.js): ${err?.message || err}`,
    };
  }

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
        ? 'Code fonds introuvable (utilisez Ecof-FUxxx.pdf)'
        : 'Section « Rendements annuels au 31 décembre » introuvable dans le PDF',
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

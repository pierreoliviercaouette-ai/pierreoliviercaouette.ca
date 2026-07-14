import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import {
  parseCalendarReturnsFromFicheText,
  detectFuCodeFromFilename,
} from "../src/lib/portfolioFicheParse.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function textOf(file) {
  const data = new Uint8Array(fs.readFileSync(file));
  const doc = await pdfjs.getDocument({ data, disableWorker: true }).promise;
  let t = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const p = await doc.getPage(i);
    const c = await p.getTextContent();
    t += c.items.map((x) => x.str).join(" ") + "\n";
  }
  return t;
}

const dir = path.resolve(__dirname, "../src/assets/fiches-fonds");
const all = {};
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".pdf"))) {
  const t = await textOf(path.join(dir, f));
  const parsed = parseCalendarReturnsFromFicheText(t);
  const code = detectFuCodeFromFilename(f);
  console.log(f, code, parsed ? Object.keys(parsed.calendarReturns).length + " years" : "FAIL");
  if (parsed && code) all[code] = parsed.calendarReturns;
}

const out = path.resolve(__dirname, "../src/data/portfolioCalendarReturnsDefaults.js");
fs.writeFileSync(
  out,
  `/** Rendements année civile extraits des fiches iA (Série Classique 75/75). */\nexport const PORTFOLIO_CALENDAR_RETURNS_DEFAULTS = ${JSON.stringify(all, null, 2)};\n`
);
console.log("Wrote", out, Object.keys(all).length, "funds");

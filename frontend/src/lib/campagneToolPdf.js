/**
 * Export PDF léger pour les mini-outils des landings Meta Ads.
 * Polices standard Helvetica — normaliser les caractères typographiques.
 */

const IA_BLUE = [6, 77, 217];
const DARK = [1, 35, 63];
const TAUPE = [117, 107, 95];
const BEIGE = [226, 220, 208];
const LIGHT = [245, 243, 239];
const MARGIN = 14;
const CONTENT_W = 182;
const PAGE_BOTTOM = 275;

export function pdfText(value) {
  if (value == null) return '';
  return String(value)
    .replace(/\u2019/g, "'")
    .replace(/\u2018/g, "'")
    .replace(/\u201c/g, '"')
    .replace(/\u201d/g, '"')
    .replace(/\u2013/g, '-')
    .replace(/\u2014/g, '-')
    .replace(/\u2248/g, '~')
    .replace(/\u00a0/g, ' ')
    .replace(/…/g, '...')
    .replace(/œ/g, 'oe')
    .replace(/Œ/g, 'OE');
}

function todayLabelFr() {
  return new Date().toLocaleDateString('fr-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function ensureSpace(doc, y, need = 16) {
  if (y + need <= PAGE_BOTTOM) return y;
  doc.addPage();
  return MARGIN + 8;
}

/**
 * @param {object} options
 * @param {string} options.title
 * @param {string} [options.subtitle]
 * @param {string} [options.filename]
 * @param {Array<{ heading: string, rows: Array<{ label: string, value: string }> }>} options.sections
 * @param {string[]} [options.notes]
 * @param {string} [options.disclaimer]
 */
export async function downloadCampagneToolPdf({
  title,
  subtitle = 'Resume educatif — Pierre-Olivier Caouette, conseiller en securite financiere',
  filename = 'resume-outil.pdf',
  sections = [],
  notes = [],
  disclaimer =
    'Contenu educatif et general seulement. Ne constitue pas un conseil personnalise. Les montants et conditions dependent de ton contrat / regime. Valide toujours avec ton livret et un professionnel.',
}) {
  const [{ jsPDF }, autoTableMod] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const autoTable = autoTableMod.default || autoTableMod.autoTable;

  const doc = new jsPDF({ unit: 'mm', format: 'letter' });
  let y = MARGIN;

  doc.setFillColor(...IA_BLUE);
  doc.rect(0, 0, 216, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(pdfText(title), MARGIN, 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(pdfText(subtitle), MARGIN, 19);
  doc.text(pdfText(`Genere le ${todayLabelFr()}`), MARGIN, 25);
  y = 36;

  doc.setTextColor(...DARK);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const intro =
    'Ce document resume ce que tu as saisi dans l\'outil interactif. Garde-le avec ton livret d\'assurance ou pour ta prochaine rencontre.';
  const introLines = doc.splitTextToSize(pdfText(intro), CONTENT_W);
  doc.text(introLines, MARGIN, y);
  y += introLines.length * 5 + 6;

  sections.forEach((section) => {
    const rows = (section.rows || []).filter(
      (row) => row && String(row.value ?? '').trim() !== ''
    );
    if (!rows.length && !section.heading) return;

    y = ensureSpace(doc, y, 22);
    doc.setFillColor(...LIGHT);
    doc.rect(MARGIN, y - 4, CONTENT_W, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...IA_BLUE);
    doc.text(pdfText(section.heading || 'Resume'), MARGIN + 2, y + 1.5);
    y += 8;

    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_W,
      theme: 'plain',
      styles: {
        font: 'helvetica',
        fontSize: 9,
        textColor: DARK,
        cellPadding: { top: 2.2, bottom: 2.2, left: 2, right: 2 },
        overflow: 'linebreak',
        valign: 'top',
      },
      columnStyles: {
        0: { cellWidth: 72, fontStyle: 'bold', textColor: TAUPE },
        1: { cellWidth: 110 },
      },
      body: rows.map((row) => [pdfText(row.label), pdfText(row.value)]),
      didParseCell(data) {
        if (data.section === 'body' && data.row.index % 2 === 1) {
          data.cell.styles.fillColor = BEIGE;
        }
      },
    });
    y = (doc.lastAutoTable?.finalY || y) + 8;
  });

  if (notes.length) {
    y = ensureSpace(doc, y, 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...IA_BLUE);
    doc.text(pdfText('Notes / a retenir'), MARGIN, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...DARK);
    notes.forEach((note) => {
      const lines = doc.splitTextToSize(pdfText(`• ${note}`), CONTENT_W);
      y = ensureSpace(doc, y, lines.length * 4.5 + 2);
      doc.text(lines, MARGIN, y);
      y += lines.length * 4.5 + 2;
    });
  }

  y = ensureSpace(doc, y, 28);
  doc.setDrawColor(...BEIGE);
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...TAUPE);
  const discLines = doc.splitTextToSize(pdfText(disclaimer), CONTENT_W);
  doc.text(discLines, MARGIN, y);
  y += discLines.length * 3.6 + 6;
  doc.text(
    pdfText('pierreoliviercaouette.ca  |  Conseiller en securite financiere'),
    MARGIN,
    Math.min(y, PAGE_BOTTOM)
  );

  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}

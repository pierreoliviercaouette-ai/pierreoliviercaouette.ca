import {
  PORTFOLIO_GENERAL_DISCLAIMER,
  PORTFOLIO_GUARANTEE_DISCLAIMER,
  PORTFOLIO_INCOMPLETE_HISTORY_NOTE,
  PORTFOLIO_MER_NOTE,
  PORTFOLIO_METHOD_NOTE,
  PORTFOLIO_PRODUCT_NOTICE,
  PORTFOLIO_RISK_SCALE_NOTE,
  formatReturnWithIncomplete,
} from './portfolioCompliance';

const IA_BLUE = [6, 77, 217];
const DARK = [1, 35, 63];
const TAUPE = [117, 107, 95];
const MARGIN = 14;
const CONTENT_W = 182;

const FUND_RETURN_COLUMNS = [
  { key: 'oneMonthPct', label: '1 mois' },
  { key: 'threeMonthPct', label: '3 mois' },
  { key: 'sixMonthPct', label: '6 mois' },
  { key: 'ytdPct', label: 'AAJ' },
  { key: 'oneYearPct', label: '1 an' },
  { key: 'threeYearPct', label: '3 ans' },
  { key: 'fiveYearPct', label: '5 ans' },
  { key: 'tenYearPct', label: '10 ans' },
];

const PORTFOLIO_PERIOD_COLUMNS = [
  { key: 'oneMonth', label: '1 mois' },
  { key: 'threeMonth', label: '3 mois' },
  { key: 'sixMonth', label: '6 mois' },
  { key: 'ytd', label: 'AAJ' },
  { key: 'oneYear', label: '1 an' },
  { key: 'threeYear', label: '3 ans' },
  { key: 'fiveYear', label: '5 ans' },
  { key: 'tenYear', label: '10 ans' },
];

/** Normalise les guillemets typographiques pour les polices PDF standard. */
function pdfText(value) {
  if (value == null) return '';
  return String(value)
    .replace(/\u2019/g, "'")
    .replace(/\u2018/g, "'")
    .replace(/\u201c/g, '"')
    .replace(/\u201d/g, '"')
    .replace(/\u00a0/g, ' ')
    .replace(/…/g, '...');
}

function formatWeightPct(value) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return `${String(value).replace('.', ',')} %`;
}

function formatMoneyCad(value) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(value);
}

function todayLabelFr() {
  return new Date().toLocaleDateString('fr-CA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function slugifyFilename(slug) {
  return (slug || 'portefeuille').replace(/[^a-z0-9-]+/gi, '-').toLowerCase();
}

async function loadImageDataUrl(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function drawAccentBar(doc, accentRgb) {
  doc.setFillColor(...accentRgb);
  doc.rect(0, 0, 210, 3, 'F');
}

function addPageHeader(doc, { title, accentRgb, logoDataUrl }) {
  drawAccentBar(doc, accentRgb);
  let y = 10;
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'PNG', MARGIN, y, 28, 10);
      y += 12;
    } catch {
      y = 10;
    }
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...DARK);
  doc.text(pdfText('Pierre-Olivier Caouette | iA Groupe financier'), MARGIN, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...TAUPE);
  doc.text(pdfText(`Portefeuille modèle — ${title}`), MARGIN, y);
  return y + 4;
}

function addFooters(doc) {
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i += 1) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...TAUPE);
    doc.text(
      pdfText(`Document indicatif — généré le ${todayLabelFr()} — page ${i}/${total}`),
      MARGIN,
      287
    );
  }
}

function writeParagraphs(doc, text, startY, maxWidth = CONTENT_W) {
  const lines = doc.splitTextToSize(pdfText(text), maxWidth);
  doc.text(lines, MARGIN, startY);
  return startY + lines.length * 3.8 + 2;
}

function writeSectionTitle(doc, y, title) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.text(pdfText(title), MARGIN, y);
  return y + 6;
}

function ensureSpace(doc, y, needed, context) {
  if (y + needed <= 275) return y;
  doc.addPage();
  return addPageHeader(doc, context);
}

/**
 * Génère et télécharge un PDF structuré pour un portefeuille modèle.
 */
export async function exportPortfolioToPdf({
  slug,
  name,
  asOfLabel,
  profile,
  portfolio,
  periodReturns,
  incompleteByPeriod = {},
  staticHoldings = [],
  fundPerfByCode = {},
  allocationData = [],
  chartData = [],
  chartGrowthMeta = null,
  hasIncompleteHistory = false,
  growthPrincipal = 100000,
  currentYear,
  prevYear,
}) {
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const autoTable = autoTableModule.default;

  const accentRgb = hexToRgb(profile?.accent || '#064dd9');
  const displayName = name || profile?.name || slug;
  const logoDataUrl = await loadImageDataUrl(
    `${process.env.PUBLIC_URL || ''}/branding/ia-groupe-financier.png`
  );

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const headerContext = { title: displayName, accentRgb, logoDataUrl };

  let y = addPageHeader(doc, headerContext);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...DARK);
  doc.text(pdfText(displayName), MARGIN, y + 6);
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...TAUPE);
  y = writeParagraphs(
    doc,
    `Données de rendement au ${asOfLabel} · série Classique 75/75 · CAD · Risque modèle indicatif ${profile?.riskLevel ?? '—'}/5`,
    y
  );
  y = writeParagraphs(doc, PORTFOLIO_RISK_SCALE_NOTE, y);
  if (profile?.merPct != null) {
    y = writeParagraphs(
      doc,
      `RFG du portefeuille (illustration) : ${String(profile.merPct).replace('.', ',')} % — ${PORTFOLIO_MER_NOTE}`,
      y
    );
  }

  y = ensureSpace(doc, y, 28, headerContext);
  y = writeSectionTitle(doc, y, 'Rendements clés');
  const kpiRows = [
    [`${currentYear} (AAJ)`, formatReturnWithIncomplete(portfolio?.ytd2026, incompleteByPeriod.ytd)],
    [
      `${prevYear} (année civile)`,
      formatReturnWithIncomplete(portfolio?.year2025, incompleteByPeriod.prevYear),
    ],
    [
      '3 ans (annualisé)',
      formatReturnWithIncomplete(portfolio?.annualized3y, incompleteByPeriod.threeYear),
    ],
    [
      '5 ans (annualisé)',
      formatReturnWithIncomplete(portfolio?.annualized5y, incompleteByPeriod.fiveYear),
    ],
  ];
  autoTable(doc, {
    startY: y,
    body: kpiRows,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2.5, textColor: DARK },
    columnStyles: {
      0: { cellWidth: 55, fontStyle: 'bold', textColor: TAUPE },
      1: { cellWidth: 40, halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: MARGIN, right: MARGIN },
  });
  y = doc.lastAutoTable.finalY + 4;
  y = writeParagraphs(doc, PORTFOLIO_METHOD_NOTE, y);

  if (profile?.philosophy) {
    y = ensureSpace(doc, y, 20, headerContext);
    y = writeSectionTitle(doc, y, 'Philosophie du modèle');
    y = writeParagraphs(doc, profile.philosophy.summary, y);
    for (const bullet of profile.philosophy.bullets || []) {
      y = ensureSpace(doc, y, 8, headerContext);
      y = writeParagraphs(doc, `• ${bullet}`, y);
    }
  }

  if (allocationData.length > 0) {
    y = ensureSpace(doc, y, 24, headerContext);
    y = writeSectionTitle(doc, y, 'Répartition des actifs');
    autoTable(doc, {
      startY: y,
      head: [['Classe d\'actifs', 'Poids']],
      body: allocationData.map((a) => [pdfText(a.name), `${a.value} %`]),
      theme: 'striped',
      headStyles: { fillColor: accentRgb, textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { halign: 'right', cellWidth: 30, fontStyle: 'bold' },
      },
      margin: { left: MARGIN, right: MARGIN },
    });
    y = doc.lastAutoTable.finalY + 6;
  }

  if (staticHoldings.length > 0) {
    y = ensureSpace(doc, y, 24, headerContext);
    y = writeSectionTitle(doc, y, 'Composition du portefeuille');
    autoTable(doc, {
      startY: y,
      head: [['Fonds', 'Code', 'Poids']],
      body: staticHoldings.map((h) => [
        pdfText(h.name),
        h.fuCode || h.illustrationCode || '—',
        formatWeightPct(h.weightPct),
      ]),
      theme: 'striped',
      headStyles: { fillColor: accentRgb, textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2.5, overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 105 },
        1: { cellWidth: 22, fontStyle: 'bold' },
        2: { halign: 'right', cellWidth: 20 },
      },
      margin: { left: MARGIN, right: MARGIN },
    });
    y = doc.lastAutoTable.finalY + 6;
  }

  if (periodReturns) {
    y = ensureSpace(doc, y, 20, headerContext);
    y = writeSectionTitle(doc, y, 'Rendements du portefeuille');
    autoTable(doc, {
      startY: y,
      head: [PORTFOLIO_PERIOD_COLUMNS.map((c) => c.label)],
      body: [
        PORTFOLIO_PERIOD_COLUMNS.map((col) =>
          formatReturnWithIncomplete(periodReturns[col.key], incompleteByPeriod[col.key])
        ),
      ],
      theme: 'grid',
      headStyles: { fillColor: IA_BLUE, textColor: 255, fontSize: 7 },
      styles: { fontSize: 8, halign: 'right', cellPadding: 2 },
      margin: { left: MARGIN, right: MARGIN },
    });
    y = doc.lastAutoTable.finalY + 4;
    y = writeParagraphs(doc, `Date de référence : ${asOfLabel}.`, y);
    if (hasIncompleteHistory) {
      y = writeParagraphs(doc, PORTFOLIO_INCOMPLETE_HISTORY_NOTE, y);
    }
  }

  if (staticHoldings.length > 0) {
    y = ensureSpace(doc, y, 20, headerContext);
    doc.addPage('a4', 'landscape');
    y = addPageHeader(doc, headerContext);
    y = writeSectionTitle(doc, y, 'Rendements par fonds');
    y = writeParagraphs(
      doc,
      `Rendements nets (série Classique 75/75), au ${asOfLabel}, en CAD.`,
      y
    );

    autoTable(doc, {
      startY: y,
      head: [
        [
          'Fonds',
          'Code',
          'Poids',
          ...FUND_RETURN_COLUMNS.map((c) => c.label),
        ],
      ],
      body: staticHoldings.map((h) => {
        const perf = fundPerfByCode[h.fuCode] || {};
        const incomplete = new Set(perf.incompleteFields || []);
        return [
          pdfText(h.name),
          h.fuCode || h.illustrationCode || '—',
          formatWeightPct(h.weightPct),
          ...FUND_RETURN_COLUMNS.map((col) =>
            formatReturnWithIncomplete(perf[col.key], incomplete.has(col.key))
          ),
        ];
      }),
      theme: 'striped',
      headStyles: { fillColor: accentRgb, textColor: 255, fontSize: 7 },
      styles: { fontSize: 7, cellPadding: 1.8, overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 52 },
        1: { cellWidth: 14 },
        2: { halign: 'right', cellWidth: 12 },
      },
      margin: { left: MARGIN, right: MARGIN },
    });
    y = doc.lastAutoTable.finalY + 4;

    doc.addPage('a4', 'portrait');
    y = addPageHeader(doc, headerContext);
  }

  if (chartData.length > 1) {
    y = ensureSpace(doc, y, 24, headerContext);
    y = writeSectionTitle(doc, y, 'Croissance du placement');
    const growthNote = buildGrowthNote(chartGrowthMeta, asOfLabel, growthPrincipal);
    y = writeParagraphs(doc, growthNote, y);

    autoTable(doc, {
      startY: y,
      head: [['Année', 'Valeur illustrée']],
      body: chartData.map((p) => [pdfText(p.label), formatMoneyCad(p.display ?? p.v)]),
      theme: 'striped',
      headStyles: { fillColor: accentRgb, textColor: 255 },
      styles: { fontSize: 9, cellPadding: 2.5 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { halign: 'right', fontStyle: 'bold' },
      },
      margin: { left: MARGIN, right: MARGIN },
    });
    y = doc.lastAutoTable.finalY + 6;
  }

  y = ensureSpace(doc, y, 40, headerContext);
  y = writeSectionTitle(doc, y, 'Avis importants');
  y = writeParagraphs(doc, PORTFOLIO_PRODUCT_NOTICE, y);
  y = writeParagraphs(doc, PORTFOLIO_GUARANTEE_DISCLAIMER, y);
  y = writeParagraphs(doc, PORTFOLIO_GENERAL_DISCLAIMER, y);

  addFooters(doc);

  const dateStamp = new Date().toISOString().slice(0, 10);
  doc.save(`portefeuille-${slugifyFilename(slug)}-${dateStamp}.pdf`);
}

function buildGrowthNote(meta, asOfLabel, principal) {
  let note = `Illustration d'un placement de ${formatMoneyCad(principal)} : chaque année civile, le portefeuille est rééquilibré aux poids cibles et applique le rendement annuel des fiches de fonds (Série Classique 75/75)`;
  if (meta?.first_year != null && meta?.last_year != null) {
    note += ` (${meta.first_year}–${meta.last_year}`;
    if (meta.annualized_pct != null) {
      note += `, annualisé réalisé ≈ ${String(meta.annualized_pct).replace('.', ',')} %)`;
    } else {
      note += ')';
    }
  }
  note += `, au ${asOfLabel}. Ce n'est ni une projection ni une garantie de résultats futurs`;
  if (meta?.incomplete) {
    note += ' ; un ou plusieurs fonds ont un historique incomplet (*) sur certaines années';
  }
  note += '.';
  return note;
}

function hexToRgb(hex) {
  const normalized = String(hex).replace('#', '');
  if (normalized.length !== 6) return IA_BLUE;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return IA_BLUE;
  return [r, g, b];
}

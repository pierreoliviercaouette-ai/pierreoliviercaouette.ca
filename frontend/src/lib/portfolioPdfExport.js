import {
  PORTFOLIO_GENERAL_DISCLAIMER,
  PORTFOLIO_GUARANTEE_DISCLAIMER,
  PORTFOLIO_INCOMPLETE_HISTORY_NOTE,
  PORTFOLIO_METHOD_NOTE,
  PORTFOLIO_PRODUCT_NOTICE,
  formatReturnWithIncomplete,
} from './portfolioCompliance';

const IA_BLUE = [6, 77, 217];
const DARK = [1, 35, 63];
const TAUPE = [117, 107, 95];
const BEIGE = [226, 220, 208];
const LIGHT = [245, 243, 239];
const MARGIN = 14;
const CONTENT_W = 182;
const PAGE_BOTTOM = 272;

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

/** Normalise le texte pour les polices PDF standard (Helvetica / WinAnsi). */
function pdfText(value) {
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
    .replace(/…/g, '...');
}

function formatWeightPct(value) {
  if (value == null || Number.isNaN(Number(value))) return '-';
  return `${String(value).replace('.', ',')} %`;
}

function formatMoneyCad(value) {
  if (value == null || Number.isNaN(Number(value))) return '-';
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCumulativeReturn(first, last) {
  if (!first || !last || Number(first) <= 0) return null;
  const n = (Number(last) / Number(first) - 1) * 100;
  const sign = n >= 0 ? '+' : '-';
  const abs = Math.abs(n).toFixed(1).replace('.', ',');
  return `${sign}${abs} %`;
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

function formatGrowthLabel(point, currentYear) {
  if (point.year) {
    if (point.year === currentYear && String(point.label || '').includes('-')) {
      return `${point.year} (AAJ)`;
    }
    return String(point.year);
  }
  const label = String(point.label || '');
  if (/^\d{4}$/.test(label)) return label;
  const iso = label.match(/^(\d{4})-\d{2}-\d{2}$/);
  if (iso) {
    return Number(iso[1]) === currentYear ? `${iso[1]} (AAJ)` : iso[1];
  }
  return label;
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

function hexToRgb(hex) {
  const normalized = String(hex).replace('#', '');
  if (normalized.length !== 6) return IA_BLUE;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return IA_BLUE;
  return [r, g, b];
}

function drawAccentBar(doc, accentRgb, height = 3) {
  doc.setFillColor(...accentRgb);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), height, 'F');
}

function drawHero(doc, ctx) {
  const { displayName, asOfLabel, profile, accentRgb, logoDataUrl } = ctx;
  drawAccentBar(doc, accentRgb, 4);

  let y = 12;
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'PNG', MARGIN, y, 36, 13);
      y += 16;
    } catch {
      y = 12;
    }
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...TAUPE);
  doc.text(pdfText('Pierre-Olivier Caouette  |  Conseiller en assurance'), MARGIN, y);
  y += 4;
  doc.text(pdfText('iA Groupe financier  |  Fonds distincts - serie Classique 75/75'), MARGIN, y);
  y += 10;

  doc.setFillColor(...LIGHT);
  doc.setDrawColor(...BEIGE);
  doc.roundedRect(MARGIN, y, CONTENT_W, 34, 3, 3, 'FD');
  doc.setFillColor(...accentRgb);
  doc.rect(MARGIN, y, 4, 34, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...TAUPE);
  doc.text(pdfText('PORTEFEUILLE MODELE'), MARGIN + 10, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...DARK);
  doc.text(pdfText(displayName), MARGIN + 10, y + 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...TAUPE);
  const meta = [
    `Donnees au ${asOfLabel}`,
    `Risque ${profile?.riskLevel ?? '-'}/5`,
    profile?.merPct != null ? `RFG ${String(profile.merPct).replace('.', ',')} %` : null,
    'CAD',
  ]
    .filter(Boolean)
    .join('  |  ');
  doc.text(pdfText(meta), MARGIN + 10, y + 29);

  return y + 42;
}

function addCompactPageHeader(doc, ctx) {
  const { displayName, asOfLabel, accentRgb, logoDataUrl } = ctx;
  drawAccentBar(doc, accentRgb, 2);

  const logoX = MARGIN;
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'PNG', logoX, 5, 24, 9);
    } catch {
      /* ignore */
    }
  }

  const textX = logoDataUrl ? logoX + 28 : logoX;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...DARK);
  doc.text(pdfText(displayName), textX, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...TAUPE);
  doc.text(pdfText(`Portefeuille modele  |  ${asOfLabel}`), doc.internal.pageSize.getWidth() - MARGIN, 11, {
    align: 'right',
  });

  doc.setDrawColor(...BEIGE);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, 15, doc.internal.pageSize.getWidth() - MARGIN, 15);
  return 22;
}

function writeMutedParagraph(doc, text, startY, maxWidth = CONTENT_W, fontSize = 8) {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSize);
  doc.setTextColor(...TAUPE);
  const lines = doc.splitTextToSize(pdfText(text), maxWidth);
  doc.text(lines, MARGIN, startY);
  return startY + lines.length * (fontSize * 0.42) + 2;
}

function writeSectionTitle(doc, y, title, accentRgb) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...DARK);
  doc.text(pdfText(title), MARGIN, y);
  doc.setDrawColor(...accentRgb);
  doc.setLineWidth(0.8);
  doc.line(MARGIN, y + 2, MARGIN + 48, y + 2);
  return y + 9;
}

function drawKpiCards(doc, cards, y, accentRgb) {
  const gap = 3;
  const cardW = (CONTENT_W - gap * (cards.length - 1)) / cards.length;
  const cardH = 24;

  cards.forEach((card, i) => {
    const x = MARGIN + i * (cardW + gap);
    doc.setFillColor(...LIGHT);
    doc.setDrawColor(...BEIGE);
    doc.roundedRect(x, y, cardW, cardH, 2, 2, 'FD');
    doc.setFillColor(...accentRgb);
    doc.rect(x, y, cardW, 2, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...TAUPE);
    const labelLines = doc.splitTextToSize(pdfText(card.label), cardW - 6);
    doc.text(labelLines, x + 3, y + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...DARK);
    doc.text(pdfText(card.value), x + cardW - 3, y + 19, { align: 'right' });
  });

  return y + cardH + 8;
}

function drawAllocationBars(doc, allocationData, startY) {
  const barMaxW = 80;
  const rowH = 9;
  let y = startY;

  allocationData.forEach((item) => {
    const color = hexToRgb(item.color || '#064dd9');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...DARK);
    doc.text(pdfText(item.name), MARGIN, y + 4);

    const barX = MARGIN + 62;
    doc.setFillColor(...BEIGE);
    doc.roundedRect(barX, y, barMaxW, 5, 1, 1, 'F');
    doc.setFillColor(...color);
    doc.roundedRect(barX, y, Math.max(1, (item.value / 100) * barMaxW), 5, 1, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...DARK);
    doc.text(`${item.value} %`, barX + barMaxW + 4, y + 4);

    y += rowH;
  });

  return y + 4;
}

function drawGrowthChart(doc, chartData, accentRgb, x, y, width, height, currentYear) {
  const values = chartData.map((p) => Number(p.display ?? p.v));
  if (values.length < 2) return y;

  const min = Math.min(...values) * 0.95;
  const max = Math.max(...values) * 1.02;
  const range = max - min || 1;

  doc.setFillColor(...LIGHT);
  doc.setDrawColor(...BEIGE);
  doc.roundedRect(x, y, width, height, 2, 2, 'FD');

  const padL = 18;
  const padR = 6;
  const padT = 8;
  const padB = 14;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const baseX = x + padL;
  const baseY = y + padT + plotH;

  doc.setDrawColor(...BEIGE);
  doc.setLineWidth(0.2);
  for (let i = 0; i <= 4; i += 1) {
    const gy = baseY - (plotH * i) / 4;
    doc.line(baseX, gy, baseX + plotW, gy);
    const tickVal = min + (range * i) / 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(...TAUPE);
    const label = `${Math.round(tickVal / 1000)}k`;
    doc.text(label, baseX - 2, gy + 1, { align: 'right' });
  }

  const points = values.map((v, i) => ({
    px: baseX + (plotW * i) / (values.length - 1),
    py: baseY - ((v - min) / range) * plotH,
  }));

  doc.setDrawColor(...accentRgb);
  doc.setLineWidth(1.2);
  for (let i = 1; i < points.length; i += 1) {
    doc.line(points[i - 1].px, points[i - 1].py, points[i].px, points[i].py);
  }

  points.forEach((pt, i) => {
    doc.setFillColor(...accentRgb);
    doc.circle(pt.px, pt.py, 1.2, 'F');
    if (i === 0 || i === points.length - 1 || i % 2 === 0) {
      const label = formatGrowthLabel(chartData[i], currentYear);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(...TAUPE);
      doc.text(pdfText(label), pt.px, baseY + 5, { align: 'center' });
    }
  });

  return y + height + 6;
}

function drawDisclaimerBox(doc, y, texts) {
  const boxPad = 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  const allLines = texts.flatMap((t) => doc.splitTextToSize(pdfText(t), CONTENT_W - boxPad * 2));
  const boxH = allLines.length * 3.2 + boxPad * 2 + 6;

  doc.setFillColor(252, 251, 249);
  doc.setDrawColor(...BEIGE);
  doc.roundedRect(MARGIN, y, CONTENT_W, boxH, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...DARK);
  doc.text(pdfText('Avis importants'), MARGIN + boxPad, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...TAUPE);
  doc.text(allLines, MARGIN + boxPad, y + 11);

  return y + boxH + 6;
}

function ensureSpace(doc, y, needed, ctx, compact = true) {
  if (y + needed <= PAGE_BOTTOM) return y;
  doc.addPage();
  return compact ? addCompactPageHeader(doc, ctx) : drawHero(doc, ctx);
}

function tableDefaults(accentRgb) {
  return {
    theme: 'striped',
    headStyles: {
      fillColor: accentRgb,
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 8,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.8,
      textColor: DARK,
      lineColor: BEIGE,
      lineWidth: 0.1,
    },
    alternateRowStyles: { fillColor: LIGHT },
    margin: { left: MARGIN, right: MARGIN },
  };
}

function buildGrowthNote(meta, asOfLabel, principal) {
  let note = `Placement initial de ${formatMoneyCad(principal)}, reequilibre chaque annee civile aux poids cibles. Rendements annuels tires des fiches de fonds (serie Classique 75/75)`;
  if (meta?.first_year != null && meta?.last_year != null) {
    note += ` de ${meta.first_year} a ${meta.last_year}`;
    if (meta.annualized_pct != null) {
      note += ` (annualise realise ~ ${String(meta.annualized_pct).replace('.', ',')} %)`;
    }
  }
  note += `, au ${asOfLabel}. Illustration historique seulement - non garantie et non predictive.`;
  if (meta?.incomplete) {
    note += ' Certains fonds ont un historique incomplet (*) sur certaines periodes.';
  }
  return note;
}

/**
 * Genere et telecharge un PDF structure pour un portefeuille modele.
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
  ficheHoldings = [],
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

  const ctx = { displayName, asOfLabel, profile, accentRgb, logoDataUrl };
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  let y = drawHero(doc, ctx);

  const kpiCards = [
    {
      label: `${currentYear} (AAJ)`,
      value: formatReturnWithIncomplete(portfolio?.ytd2026, incompleteByPeriod.ytd),
    },
    {
      label: `${prevYear} (annee civile)`,
      value: formatReturnWithIncomplete(portfolio?.year2025, incompleteByPeriod.prevYear),
    },
    {
      label: '3 ans (annualise)',
      value: formatReturnWithIncomplete(portfolio?.annualized3y, incompleteByPeriod.threeYear),
    },
    {
      label: '5 ans (annualise)',
      value: formatReturnWithIncomplete(portfolio?.annualized5y, incompleteByPeriod.fiveYear),
    },
  ];
  y = drawKpiCards(doc, kpiCards, y, accentRgb);
  y = writeMutedParagraph(doc, PORTFOLIO_METHOD_NOTE, y, CONTENT_W, 7);

  if (profile?.philosophy) {
    y = ensureSpace(doc, y, 28, ctx);
    y = writeSectionTitle(doc, y, 'Philosophie du modele', accentRgb);
    y = writeMutedParagraph(doc, profile.philosophy.summary, y, CONTENT_W, 9);
    const bullets = (profile.philosophy.bullets || [])
      .filter((b) => !/interne admin/i.test(b))
      .slice(0, 4);
    bullets.forEach((bullet) => {
      y = ensureSpace(doc, y, 8, ctx);
      doc.setFillColor(...accentRgb);
      doc.circle(MARGIN + 2, y - 1.2, 0.9, 'F');
      const lines = doc.splitTextToSize(pdfText(bullet), CONTENT_W - 10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...TAUPE);
      doc.text(lines, MARGIN + 6, y);
      y += lines.length * 3.6 + 2;
    });
    y += 4;
  }

  if (allocationData.length > 0) {
    y = ensureSpace(doc, y, 40, ctx);
    y = writeSectionTitle(doc, y, 'Repartition des actifs', accentRgb);
    y = drawAllocationBars(doc, allocationData, y);
  }

  if (staticHoldings.length > 0) {
    y = ensureSpace(doc, y, 36, ctx);
    y = writeSectionTitle(doc, y, 'Composition', accentRgb);
    autoTable(doc, {
      startY: y,
      head: [['Fonds', 'Code', 'Poids']],
      body: staticHoldings.map((h) => [
        pdfText(h.name),
        h.fuCode || h.illustrationCode || '-',
        formatWeightPct(h.weightPct),
      ]),
      ...tableDefaults(accentRgb),
      styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 108 },
        1: { cellWidth: 22, fontStyle: 'bold', halign: 'center' },
        2: { cellWidth: 22, halign: 'right', fontStyle: 'bold' },
      },
      rowPageBreak: 'avoid',
    });
    y = doc.lastAutoTable.finalY + 8;
  }

  if (periodReturns) {
    y = ensureSpace(doc, y, 30, ctx);
    y = writeSectionTitle(doc, y, 'Rendements du portefeuille', accentRgb);
    autoTable(doc, {
      startY: y,
      head: [PORTFOLIO_PERIOD_COLUMNS.map((c) => c.label)],
      body: [
        PORTFOLIO_PERIOD_COLUMNS.map((col) =>
          pdfText(formatReturnWithIncomplete(periodReturns[col.key], incompleteByPeriod[col.key]))
        ),
      ],
      ...tableDefaults(accentRgb),
      styles: { fontSize: 8, halign: 'center', cellPadding: 3 },
      headStyles: { ...tableDefaults(accentRgb).headStyles, halign: 'center' },
    });
    y = doc.lastAutoTable.finalY + 4;
    y = writeMutedParagraph(doc, `Date de reference : ${asOfLabel}.`, y, CONTENT_W, 7);
    if (hasIncompleteHistory) {
      y = writeMutedParagraph(doc, PORTFOLIO_INCOMPLETE_HISTORY_NOTE, y, CONTENT_W, 7);
    }
    y += 4;
  }

  if (staticHoldings.length > 0) {
    doc.addPage('a4', 'landscape');
    y = addCompactPageHeader(doc, ctx);
    y = writeSectionTitle(doc, y, 'Rendements par fonds', accentRgb);
    y = writeMutedParagraph(
      doc,
      `Rendements nets (serie Classique 75/75), au ${asOfLabel}, en CAD. Les periodes multi-annees sont annualisees.`,
      y,
      doc.internal.pageSize.getWidth() - MARGIN * 2,
      7
    );

    autoTable(doc, {
      startY: y,
      head: [['Fonds', 'Code', 'Poids', ...FUND_RETURN_COLUMNS.map((c) => c.label)]],
      body: staticHoldings.map((h) => {
        const perf = fundPerfByCode[h.fuCode] || {};
        const incomplete = new Set(perf.incompleteFields || []);
        return [
          pdfText(h.name),
          h.fuCode || h.illustrationCode || '-',
          formatWeightPct(h.weightPct),
          ...FUND_RETURN_COLUMNS.map((col) =>
            pdfText(formatReturnWithIncomplete(perf[col.key], incomplete.has(col.key)))
          ),
        ];
      }),
      ...tableDefaults(accentRgb),
      styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
      headStyles: { ...tableDefaults(accentRgb).headStyles, fontSize: 7 },
      columnStyles: {
        0: { cellWidth: 68 },
        1: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
        2: { cellWidth: 13, halign: 'right' },
      },
      margin: { left: MARGIN, right: MARGIN },
    });

    doc.addPage('a4', 'portrait');
    y = addCompactPageHeader(doc, ctx);
  }

  if (chartData.length > 1) {
    y = ensureSpace(doc, y, 90, ctx);
    y = writeSectionTitle(doc, y, 'Croissance du placement', accentRgb);

    const firstVal = chartData[0]?.display ?? chartData[0]?.v;
    const lastVal = chartData[chartData.length - 1]?.display ?? chartData[chartData.length - 1]?.v;
    const cumulative = formatCumulativeReturn(firstVal, lastVal);

    doc.setFillColor(...LIGHT);
    doc.setDrawColor(...BEIGE);
    doc.roundedRect(MARGIN, y, CONTENT_W, 14, 2, 2, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...TAUPE);
    doc.text(pdfText(`Depart : ${formatMoneyCad(firstVal)}`), MARGIN + 5, y + 6);
    doc.text(pdfText(`Valeur au ${asOfLabel} : ${formatMoneyCad(lastVal)}`), MARGIN + 5, y + 11);
    if (cumulative) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...accentRgb);
      doc.text(pdfText(`Rendement cumule : ${cumulative}`), MARGIN + CONTENT_W - 5, y + 9, {
        align: 'right',
      });
    }
    y += 18;

    y = drawGrowthChart(doc, chartData, accentRgb, MARGIN, y, CONTENT_W, 52, currentYear);
    y = writeMutedParagraph(doc, buildGrowthNote(chartGrowthMeta, asOfLabel, growthPrincipal), y, CONTENT_W, 7);

    autoTable(doc, {
      startY: y,
      head: [['Periode', 'Valeur illustree', 'Variation']],
      body: chartData.map((point, index) => {
        const value = Number(point.display ?? point.v);
        const prev = index > 0 ? Number(chartData[index - 1].display ?? chartData[index - 1].v) : null;
        let variation = '-';
        if (prev && prev > 0) {
          const delta = ((value / prev - 1) * 100).toFixed(1).replace('.', ',');
          variation = `${Number(delta) >= 0 ? '+' : ''}${delta} %`;
        } else if (index === 0) {
          variation = 'Depart';
        }
        return [
          pdfText(formatGrowthLabel(point, currentYear)),
          formatMoneyCad(value),
          variation,
        ];
      }),
      ...tableDefaults(accentRgb),
      columnStyles: {
        0: { cellWidth: 40 },
        1: { halign: 'right', fontStyle: 'bold' },
        2: { halign: 'right' },
      },
    });
    y = doc.lastAutoTable.finalY + 8;
  }

  if (ficheHoldings.length > 0) {
    y = ensureSpace(doc, y, 30, ctx);
    y = writeSectionTitle(doc, y, 'Fiches de fonds (references)', accentRgb);
    autoTable(doc, {
      startY: y,
      head: [['Fonds', 'Code']],
      body: ficheHoldings.map((h) => [pdfText(h.name), h.fuCode]),
      ...tableDefaults(accentRgb),
      columnStyles: {
        0: { cellWidth: 140 },
        1: { cellWidth: 30, halign: 'center', fontStyle: 'bold' },
      },
    });
    y = doc.lastAutoTable.finalY + 6;
    y = writeMutedParagraph(
      doc,
      'Les fiches officielles iA sont disponibles sur demande ou via votre conseiller.',
      y,
      CONTENT_W,
      7
    );
  }

  y = ensureSpace(doc, y, 50, ctx);
  y = drawDisclaimerBox(doc, y, [
    PORTFOLIO_PRODUCT_NOTICE,
    PORTFOLIO_GUARANTEE_DISCLAIMER,
    PORTFOLIO_GENERAL_DISCLAIMER,
  ]);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...TAUPE);
  doc.text(
    pdfText('Pierre-Olivier Caouette  |  p-o.caouette@agc.ia.ca  |  pierreoliviercaouette.ca'),
    MARGIN,
    Math.min(y + 4, PAGE_BOTTOM)
  );

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i += 1) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...TAUPE);
    doc.text(
      pdfText(`Document indicatif - genere le ${todayLabelFr()} - page ${i}/${total}`),
      doc.internal.pageSize.getWidth() - MARGIN,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'right' }
    );
  }

  const dateStamp = new Date().toISOString().slice(0, 10);
  doc.save(`portefeuille-${slugifyFilename(slug)}-${dateStamp}.pdf`);
}

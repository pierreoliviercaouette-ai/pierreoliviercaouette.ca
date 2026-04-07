import { extractCivilYearFundBlock, parseFundFactsheetText } from './fundSheetPdfImport';

describe('fundSheetPdfImport', () => {
  test('extractCivilYearFundBlock reads AAJ and years', () => {
    const text = `
      Fonds XYZ
      Rend année civile
      AAJ 4,25
      2023 -8,10
      2024 12,40
      2025 6,20
    `;
    const block = extractCivilYearFundBlock(text);
    expect(block).not.toBeNull();
    expect(block.ytdPct).toBeCloseTo(4.25, 5);
    expect(block.annualByYear[2024]).toBeCloseTo(12.4, 5);
  });

  test('parseFundFactsheetText strips current civil year row', () => {
    const text = `
      Nom du fonds: Mon super fonds
      CA1234567890
      Date du rapport 04-07-2026
      Rend année civile
      AAJ 2,00
      2025 5,00
      2026 1,50
    `;
    const parsed = parseFundFactsheetText(text);
    expect(parsed.ytdPct).toBeCloseTo(2, 5);
    expect(parsed.annualByYear[2026]).toBeUndefined();
    expect(parsed.annualByYear[2025]).toBeCloseTo(5, 5);
  });
});

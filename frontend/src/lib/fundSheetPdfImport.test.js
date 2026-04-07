import {
  assertAllowedIaFundFileName,
  extractCivilYearFundBlock,
  extractIaAllocations,
  extractIaFundName,
  extractIaDdaAndAnnualTable,
  extractLooseFundReturnBlock,
  parseFundFactsheetText,
} from './fundSheetPdfImport';

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

  test('extractLooseFundReturnBlock works without "Rend année civile" heading', () => {
    const text = `
      ECOF FU607P
      Donnees de rendement
      AAJ 3,45
      2024 8,10
      2025 -1,20
    `;
    const parsed = extractLooseFundReturnBlock(text);
    expect(parsed).not.toBeNull();
    expect(parsed.ytdPct).toBeCloseTo(3.45, 5);
    expect(parsed.annualByYear[2024]).toBeCloseTo(8.1, 5);
  });

  test('extractIaDdaAndAnnualTable handles iA table format with DDA', () => {
    const text = `
      Rendements composés - Série Classique 75/75
      DDA 3 mois 6 mois 1 an 3 ans
      18,73 -1,51 15,24 18,73 38,89
      Rendements annuels au 31 décembre - Série Classique 75/75
      2025 2024 2023 2022 2021
      18,73 57,03 43,71 -31,23 1,34
    `;
    const parsed = extractIaDdaAndAnnualTable(text);
    expect(parsed).not.toBeNull();
    expect(parsed.ytdPct).toBeCloseTo(18.73, 5);
    expect(parsed.annualByYear[2025]).toBeCloseTo(18.73, 5);
    expect(parsed.annualByYear[2024]).toBeCloseTo(57.03, 5);
  });

  test('extractIaDdaAndAnnualTable handles "lancement" line between DDA and values', () => {
    const text = `
      Rendements composés - Série Classique 75/75
      DDA† 3 mois 6 mois 1 an 3 ans 5 ans 10 ans Depuis
      lancement
      43,45 8,33 29,98 43,45 23,09
      Rendements annuels au 31 décembre - Série Classique 75/75
      2025 2024 2023 2022
      43,45 20,00 8,33 -4,84
    `;
    const parsed = extractIaDdaAndAnnualTable(text);
    expect(parsed).not.toBeNull();
    expect(parsed.ytdPct).toBeCloseTo(43.45, 5);
    expect(parsed.annualByYear[2025]).toBeCloseTo(43.45, 5);
  });

  test('assertAllowedIaFundFileName accepts ecof...pdf files only', () => {
    expect(() => assertAllowedIaFundFileName('Ecof-FU870p.pdf')).not.toThrow();
    expect(() => assertAllowedIaFundFileName('ecof-ABC123.pdf')).not.toThrow();
    expect(() => assertAllowedIaFundFileName('ECOF test.pdf')).not.toThrow();
    expect(() => assertAllowedIaFundFileName('autre-fonds.pdf')).toThrow();
    expect(() => assertAllowedIaFundFileName('ecof-not-pdf.txt')).toThrow();
  });

  test('extractIaFundName parses Fidelity Innovations mondiales MC', () => {
    const text = `
      Fonds spécialisés
      Fidelity Innovations
      mondialesMC
      2017 2018 2019 2020
    `;
    expect(extractIaFundName(text)).toBe('Fidelity Innovations mondiales MC');
  });

  test('extractIaAllocations parses sector and geography blocks', () => {
    const text = `
      57,19 % Technologies de l'information
      22,04 % Services de communication
      Répartition sectorielle
      85,58 % États-Unis
      13,15 % Canada
      Répartition géographique
    `;
    const parsed = extractIaAllocations(text);
    expect(parsed.sectorAllocation.length).toBe(2);
    expect(parsed.geographicAllocation.length).toBe(2);
    expect(parsed.sectorAllocation[0].label).toContain('Technologies');
    expect(parsed.geographicAllocation[0].label).toContain('États-Unis');
  });
});

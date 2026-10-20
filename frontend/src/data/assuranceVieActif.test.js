import {
  COLLATERAL_THRESHOLD,
  ILLUSTRATION_TAX_RATE,
  firstCollateralYear,
  illustrateLoan,
  policyIrr,
  rowAtAge,
  scenarioById,
  taxableEquivalent,
  yieldReading,
} from './assuranceVieActif';

describe('illustrations assurance vie — classe d’actif', () => {
  test('les jalons des trois fichiers Excel sont intacts', () => {
    const s1 = scenarioById('s1');
    const s3 = scenarioById('s3');
    const s4 = scenarioById('s4');

    expect(s1.rows[0]).toMatchObject({ age: 32, premium: 10000.5, deathG: 239993, csv: 8523 });
    expect(s1.rows[20].premium).toBe(3573.5);
    expect(rowAtAge(s1, 65)).toMatchObject({ csv: 756796, death: 1355985, cumulative: 250039 });
    expect(rowAtAge(s1, 85).csv).toBe(2227686);

    expect(s3.rows[0].premium).toBe(9999.99);
    expect(s3.rows[20].premium).toBe(0);
    expect(s3.rows[20].base).toBe(0);
    expect(rowAtAge(s3, 65)).toMatchObject({ csv: 592922, death: 1034698 });
    expect(rowAtAge(s3, 100).death).toBe(3529624);

    expect(s4.rows[0]).toMatchObject({ premium: 28217, base: 10000, death: 765681 });
    expect(s4.rows[20].premium).toBe(10000);
    expect(rowAtAge(s4, 65).csv).toBe(895440);
    expect(rowAtAge(s4, 100).csv).toBe(5566388);
  });

  test('le seuil de 100 000 $ tombe à 40 ans, 40 ans et 39 ans', () => {
    expect(firstCollateralYear(scenarioById('s1'))).toMatchObject({ year: 9, age: 40 });
    expect(firstCollateralYear(scenarioById('s3'))).toMatchObject({ year: 9, age: 40 });
    expect(firstCollateralYear(scenarioById('s4'))).toMatchObject({ year: 8, age: 39 });
    expect(firstCollateralYear(scenarioById('s4')).csv).toBeGreaterThanOrEqual(COLLATERAL_THRESHOLD);
    expect(scenarioById('s4').rows[6].csv).toBeLessThan(COLLATERAL_THRESHOLD);
  });

  test('le prêt utilise le taux bancaire seulement si la valeur de rachat d’ouverture dépasse 100 000 $', () => {
    const rows = scenarioById('s3').rows;
    const early = illustrateLoan(rows, { startYear: 5, amount: 50000, repayment: 0, horizonAge: 50 });
    const later = illustrateLoan(rows, { startYear: 15, amount: 100000, repayment: 0, horizonAge: 65 });

    expect(early.bank).toBe(false);
    expect(early.rate).toBeCloseTo(0.085);
    expect(later.bank).toBe(true);
    expect(later.rate).toBeCloseTo(0.055);
    expect(later.breach).toBeNull();
    expect(later.last.balance).toBeGreaterThan(100000);
  });

  test('le taux interne reproduit le rendement au rachat de l’illustration', () => {
    const s1 = scenarioById('s1');
    const first = policyIrr(s1.rows.slice(0, 1), 'csv') * 100;
    const at65 = policyIrr(s1.rows.filter((row) => row.age <= 65), 'csv') * 100;
    expect(first).toBeCloseTo(s1.rows[0].irr, 1);
    expect(at65).toBeCloseTo(rowAtAge(s1, 65).irr, 1);
  });

  test('la rentabilité équivalente ajoute l’avantage fiscal à la croissance', () => {
    const reading = yieldReading(scenarioById('s1'), 65, ILLUSTRATION_TAX_RATE);
    expect(reading.held).toBeCloseTo(0.0498, 4);
    expect(reading.equivalent).toBeCloseTo(0.0498 / (1 - ILLUSTRATION_TAX_RATE), 4);
    expect(reading.advantage).toBeCloseTo(reading.equivalent - reading.held, 6);
    expect(reading.afterExit).toBeGreaterThan(0);
    expect(reading.afterExit).toBeLessThan(reading.held);
    expect(taxableEquivalent(-0.02, ILLUSTRATION_TAX_RATE)).toBeNull();
  });
});

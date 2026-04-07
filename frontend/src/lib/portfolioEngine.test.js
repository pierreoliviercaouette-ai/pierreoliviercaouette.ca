import {
  splitAnnualIntoMonthly,
  buildMonthlyReturnsFromAnnualAndYtd,
  intersectionMonthKeys,
  computePortfolioMonthlySeries,
  computeSnapshotKpis,
} from './portfolioEngine';

describe('portfolioEngine', () => {
  test('splitAnnualIntoMonthly compounds to annual', () => {
    const months = splitAnnualIntoMonthly(12);
    expect(months.length).toBe(12);
    let f = 1;
    for (const m of months) f *= 1 + m / 100;
    expect(f).toBeCloseTo(1.12, 5);
  });

  test('buildMonthlyReturnsFromAnnualAndYtd includes prior years and YTD months', () => {
    const rows = buildMonthlyReturnsFromAnnualAndYtd({ 2024: 10 }, 4, '2026-04-15');
    expect(rows.some((r) => r.month_date.startsWith('2024-'))).toBe(true);
    expect(rows.some((r) => r.month_date.startsWith('2026-04'))).toBe(true);
  });

  test('intersectionMonthKeys requires all funds', () => {
    const m = new Map();
    m.set('a', [{ month_date: '2025-01-01', return_pct: 1 }]);
    m.set('b', [{ month_date: '2025-02-01', return_pct: 2 }]);
    const keys = intersectionMonthKeys({ a: 50, b: 50 }, m);
    expect(keys.length).toBe(0);
    m.set('b', [{ month_date: '2025-01-01', return_pct: 2 }]);
    const keys2 = intersectionMonthKeys({ a: 50, b: 50 }, m);
    expect(keys2).toEqual(['2025-01-01']);
  });

  test('computePortfolioMonthlySeries blends weights', () => {
    const m = new Map();
    m.set('a', [
      { month_date: '2025-01-01', return_pct: 10 },
      { month_date: '2025-02-01', return_pct: 0 },
    ]);
    m.set('b', [
      { month_date: '2025-01-01', return_pct: 0 },
      { month_date: '2025-02-01', return_pct: 20 },
    ]);
    const series = computePortfolioMonthlySeries({ a: 50, b: 50 }, m);
    expect(series.find((x) => x.month_date === '2025-01-01').return_pct).toBeCloseTo(5, 5);
    expect(series.find((x) => x.month_date === '2025-02-01').return_pct).toBeCloseTo(10, 5);
  });

  test('computeSnapshotKpis returns YTD for civil year', () => {
    const monthly = [
      { month_date: '2026-01-01', return_pct: 1 },
      { month_date: '2026-02-01', return_pct: 1 },
    ];
    const kpis = computeSnapshotKpis(monthly, '2026-02-01');
    expect(kpis.ytd_pct).not.toBeNull();
  });
});

import { createDemoPlan, createEmptyPlan } from './demoPlan';
import { generate25YearProjection } from './projectionEngine';
import { parseInsuranceCsv, calcMortgage, calcDividendTax } from './investmentPlanningService';
import { summarizeProjection, compareScenarios } from './metrics';
import { computeLifeNeeds, computeDisabilityGap } from './needsAnalysis';
import { parseImportedPlan } from './planIo';

describe('illustrateur patrimonial engine', () => {
  test('demo plan projects positive net worth growth', () => {
    const plan = createDemoPlan();
    const proj = generate25YearProjection(
      plan.assets,
      plan.debts,
      plan.revenues,
      plan.events,
      plan.entities,
      { horizonYears: 10 },
    );
    expect(proj.data.length).toBe(11);
    const summary = summarizeProjection(proj);
    expect(summary.netWorthNow).toBeGreaterThan(0);
    expect(summary.netWorthEnd).toBeGreaterThan(summary.netWorthNow - 50000);
    expect(proj.deathSummary).toBeTruthy();
    expect(typeof proj.deathSummary.netEstate).toBe('number');
  });

  test('empty plan still runs', () => {
    const plan = createEmptyPlan();
    const proj = generate25YearProjection(
      plan.assets,
      plan.debts,
      plan.revenues,
      plan.events,
      plan.entities,
      { horizonYears: 5 },
    );
    expect(proj.data.length).toBe(6);
  });

  test('parse insurance csv', () => {
    const csv = [
      'Année;Âge;Valeur de rachat totale;Assurance vie total;Primes versées',
      '1;40;5000;500000;12000',
      '2;41;12000;505000;12000',
    ].join('\n');
    const rows = parseInsuranceCsv(csv);
    expect(rows.length).toBe(2);
    expect(rows[0].surrenderValue).toBe(5000);
    expect(rows[1].totalInsurance).toBe(505000);
  });

  test('mortgage and dividend helpers', () => {
    const payment = calcMortgage(300000, 4.5, 25, null, 'payment');
    expect(payment).toBeGreaterThan(1000);
    expect(payment).toBeLessThan(2500);
    const tax = calcDividendTax(10000, 53.31, false);
    expect(tax).toBeGreaterThan(0);
  });

  test('needs analysis', () => {
    const life = computeLifeNeeds({
      hypotheque: 200000,
      revenu_net: 6000,
      pct_remplacer: 70,
      nb_annees: 10,
      nb_enfants: 1,
      etudes: 30000,
      funerailles: 15000,
      av_actuelle: 0,
      av_groupe: 0,
    });
    expect(life.besoin_recommande).toBeGreaterThan(0);
    const dis = computeDisabilityGap({
      invalidite_revenu: 8000,
      invalidite_remplacement_pct: 60,
      invalidite_collective_pct: 40,
    });
    expect(dis.trou_mensuel).toBeCloseTo(1600, 0);
  });

  test('import/export roundtrip shape', () => {
    const plan = createDemoPlan();
    const payload = JSON.stringify({ version: 1, plan });
    const imported = parseImportedPlan(payload);
    expect(imported.assets.length).toBe(plan.assets.length);
    expect(imported.entities[0].type).toBe('personnel');
  });

  test('scenario compare delta', () => {
    const plan = createDemoPlan();
    const a = generate25YearProjection(
      plan.assets,
      plan.debts,
      plan.revenues,
      plan.events,
      plan.entities,
      { horizonYears: 5 },
    );
    const richer = {
      ...plan,
      assets: plan.assets.map((ast) =>
        ast.type === 'celi' ? { ...ast, currentBalance: (ast.currentBalance || 0) + 100000 } : ast,
      ),
    };
    const b = generate25YearProjection(
      richer.assets,
      richer.debts,
      richer.revenues,
      richer.events,
      richer.entities,
      { horizonYears: 5 },
    );
    const cmp = compareScenarios(a, b);
    expect(cmp.deltaNetWorthEnd).toBeGreaterThan(50000);
  });
});

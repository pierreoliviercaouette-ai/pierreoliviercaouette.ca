import {
  computeDeathAttainment,
  computeDisabilityAttainment,
  computeEmergencyAttainment,
  computeCriticalIllnessAttainment,
  computeRetirementAttainment,
  presentValueIncomeGap,
  computeAllAttainments,
} from './attainment';
import { createDemoPlan, createEmptyPlan } from './demoPlan';
import { ensureCollectFields } from './planDefaults';
import { adjacentStep, evaluateDossierReadiness } from './workflow';

describe('attainment engine', () => {
  test('PV income gap matches annuity formula', () => {
    const pv = presentValueIncomeGap(56000, 25, 3.4);
    expect(pv).toBeGreaterThan(800000);
    expect(pv).toBeLessThan(1100000);
  });

  test('demo plan produces rich gaps', () => {
    const plan = createDemoPlan();
    const all = computeAllAttainments(plan);
    expect(all.emergency.needs).toBeGreaterThan(0);
    expect(all.death.needs).toBeGreaterThan(all.death.available * 0.5 || 0);
    expect(all.disability.shortfall).toBeGreaterThanOrEqual(0);
    expect(all.criticalIllness.needs).toBeGreaterThan(0);
    expect(all.retirement.needs).toBeGreaterThan(0);
    expect(all.netWorth.breakdown.netWorth).toBeDefined();
  });

  test('emergency shortfall when no allocated assets', () => {
    const plan = createEmptyPlan();
    const filled = {
      ...ensureCollectFields(plan),
      ...plan,
      emergency: { base: 'depenses', months: 3, monthlyAmount: 1500, creditLine: 0, allocatedAssetIds: [] },
      revenues: [{ id: 'r1', monthlyAmount: 5000 }],
    };
    const att = computeEmergencyAttainment(filled);
    expect(att.needs).toBe(4500);
    expect(att.shortfall).toBe(4500);
  });

  test('death includes PV + debts', () => {
    const plan = createEmptyPlan();
    plan.revenues = [{ id: 'r1', monthlyAmount: 6667 }];
    plan.debts = [{ id: 'd1', currentBalance: 200000, type: 'hypotheque' }];
    plan.deathNeeds = {
      ...ensureCollectFields(plan).deathNeeds,
      policies: [],
      repayDebtIds: ['d1'],
      liquidateAssetIds: [],
      expenses: [{ id: 'e1', description: 'Funérailles', amount: 15000 }],
      incomeMode: 'individuel',
      incomeBasis: 'brut',
      incomeReplacePct: 70,
      incomeReplaceYears: 25,
      discountRate: 3.4,
      rrqDeathBenefit: 2500,
      survivorPension: 0,
      orphanPension: 0,
      otherIncome: 0,
    };
    const att = computeDeathAttainment(plan);
    expect(att.needs).toBeGreaterThan(200000);
    expect(att.breakdown.debts).toBe(200000);
  });

  test('disability monthly gap', () => {
    const plan = createEmptyPlan();
    plan.needs = { ...plan.needs, revenu_net: 5000 };
    plan.disabilityNeeds = {
      ...ensureCollectFields(plan).disabilityNeeds,
      policies: [{ id: 'p', amount: 1000 }],
      replacePct: 70,
      approach: 'remplacement',
      incomeBasis: 'net',
      otherMonthlyIncome: 0,
    };
    const att = computeDisabilityAttainment(plan);
    expect(att.needs).toBe(3500);
    expect(att.shortfall).toBe(2500);
  });

  test('critical illness aggregates income + extras', () => {
    const plan = createEmptyPlan();
    plan.criticalIllnessNeeds = {
      ...ensureCollectFields(plan).criticalIllnessNeeds,
      policies: [{ id: 'p', amount: 50000 }],
      clientMonthlyIncome: 4000,
      clientMonths: 12,
      caregiverMonthly: 0,
      caregiverMonths: 0,
      protectionLevel: 'confort',
      extras: {
        uninsuredTreatment: 5000,
        medicalEquipment: 5000,
        homeAdapt: 0,
        vehicleAdapt: 0,
        other: 0,
      },
    };
    const att = computeCriticalIllnessAttainment(plan);
    expect(att.needs).toBe(48000 + 10000);
    expect(att.shortfall).toBe(8000);
  });

  test('retirement uses 4% rule heuristic', () => {
    const plan = createEmptyPlan();
    plan.needs = { ...plan.needs, revenu_net: 4000 };
    plan.assets = [{ id: 'a1', type: 'reer', currentBalance: 200000 }];
    plan.retirement = {
      ...ensureCollectFields(plan).retirement,
      replacePct: 70,
      incomeUnit: 'pct',
      targetAge: 65,
      publicPensions: [{ id: 'p1', type: 'RRQ', annualAmount: 10000 }],
      definedBenefit: [],
      decumulationAssetIds: ['a1'],
    };
    const att = computeRetirementAttainment(plan);
    expect(att.needs).toBe(4000 * 12 * 0.7);
    expect(att.available).toBe(10000 + 200000 * 0.04);
  });

  test('workflow adjacent and readiness', () => {
    expect(adjacentStep('personnelles', 1)).toBe('objectifs');
    expect(evaluateDossierReadiness(createDemoPlan()).ready).toBe(true);
  });
});

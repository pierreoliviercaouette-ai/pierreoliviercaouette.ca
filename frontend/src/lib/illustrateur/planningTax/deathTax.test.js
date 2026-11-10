import { createDemoPlan, createEmptyPlan } from '../demoPlan';
import { ensureCollectFields } from '../planDefaults';
import {
  computeDeathTaxSummary,
  computePlanDeathTax,
  syncDeathTaxExpense,
  DEATH_TAX_EXPENSE_ID,
} from './deathTax';

describe('death tax LIR / QC', () => {
  test('REER is fully included without rollover', () => {
    const plan = createEmptyPlan();
    const person = plan.entities[0];
    plan.assets = [
      {
        id: 'reer1',
        name: 'REER',
        type: 'reer',
        entityId: person.id,
        currentBalance: 100000,
      },
    ];
    plan.scope = { conjoint: false, corporatif: false };
    plan.deathNeeds = { ...ensureCollectFields(plan).deathNeeds, spousalRollover: false };
    const tax = computePlanDeathTax(plan);
    expect(tax.reerTax).toBe(Math.round(100000 * (person.marginalTaxRate / 100)));
    expect(tax.totalTaxAtDeath).toBe(tax.reerTax);
  });

  test('spousal rollover defers REER and capital property', () => {
    const plan = createEmptyPlan();
    const person = plan.entities[0];
    plan.scope = { conjoint: true, corporatif: false };
    plan.assets = [
      {
        id: 'reer1',
        name: 'REER',
        type: 'reer',
        entityId: person.id,
        currentBalance: 100000,
      },
      {
        id: 'ne1',
        name: 'Non-enregistré',
        type: 'non_enregistre',
        entityId: person.id,
        currentBalance: 50000,
        _acb: 20000,
      },
    ];
    plan.deathNeeds = { ...ensureCollectFields(plan).deathNeeds, spousalRollover: true };
    const tax = computePlanDeathTax(plan);
    expect(tax.totalTaxAtDeath).toBe(0);
    expect(tax.rolledAssetCount).toBe(2);
    expect(tax.details.every((d) => d.rolled || d.tax === 0)).toBe(true);
  });

  test('principal residence exemption zeros real-estate gain', () => {
    const plan = createEmptyPlan();
    const person = plan.entities[0];
    plan.scope = { conjoint: false, corporatif: false };
    plan.assets = [
      {
        id: 'home',
        name: 'Maison',
        type: 'immobilier',
        entityId: person.id,
        currentBalance: 500000,
        _acb: 300000,
      },
    ];
    plan.deathNeeds = {
      ...ensureCollectFields(plan).deathNeeds,
      spousalRollover: false,
      principalResidenceAssetIds: ['home'],
    };
    const tax = computePlanDeathTax(plan);
    expect(tax.capitalGainsTax).toBe(0);
    expect(tax.details[0].principalResidence).toBe(true);
  });

  test('without PRE, immobilier triggers capital gains tax', () => {
    const person = { id: 'p1', type: 'personnel', marginalTaxRate: 50 };
    const summary = computeDeathTaxSummary(
      [
        {
          id: 'home',
          name: 'Chalet',
          type: 'immobilier',
          entityId: 'p1',
          currentBalance: 400000,
          _acb: 200000,
        },
      ],
      [],
      [person],
      {},
      { spousalRollover: false, principalResidenceAssetIds: [], noRolloverAssetIds: [] },
    );
    // gain 200000 * 50% inclusion * 50% rate = 50000
    expect(summary.capitalGainsTax).toBe(50000);
  });

  test('CELI remains non-taxable', () => {
    const plan = createEmptyPlan();
    plan.assets = [
      {
        id: 'celi',
        name: 'CELI',
        type: 'celi',
        entityId: plan.entities[0].id,
        currentBalance: 80000,
      },
    ];
    plan.scope = { conjoint: false, corporatif: false };
    expect(computePlanDeathTax(plan).totalTaxAtDeath).toBe(0);
  });

  test('syncDeathTaxExpense upserts auto line', () => {
    const next = syncDeathTaxExpense([{ id: 'e1', description: 'Funérailles', amount: 10000 }], 42000);
    expect(next).toHaveLength(2);
    expect(next.find((e) => e.id === DEATH_TAX_EXPENSE_ID).amount).toBe(42000);
  });

  test('demo with conjoint rollover keeps estate tax modest', () => {
    const plan = createDemoPlan();
    const tax = computePlanDeathTax(plan);
    expect(tax.spousalRollover).toBe(true);
    expect(tax.rolledAssetCount).toBeGreaterThan(0);
    // Personal REER/home rolled; corp may still show illustrative tax
    expect(tax.reerTax).toBe(0);
  });
});

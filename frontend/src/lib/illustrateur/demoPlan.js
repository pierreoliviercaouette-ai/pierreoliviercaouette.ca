import { DEFAULT_TAX_RATES } from './investmentPlanningService';
import { newId } from './ids';
import { createModuleOption, emptyModulesState } from './planningModules';
import { emptyBudgetState } from './budgetCatalog';
import {
  emptyContributionRoom,
  emptyCriticalIllnessNeeds,
  emptyDeathNeeds,
  emptyDisabilityNeeds,
  emptyEmergency,
  emptyPerson,
  emptyRetirement,
  emptyScope,
  emptySpouse,
} from './planDefaults';

function demoBudget() {
  const b = emptyBudgetState();
  b.netIncomeAnnual = 90000;
  b.mode = 'individuel';
  const set = (id, amount, frequency = 'mensuel') => {
    b.lines[id] = { ...b.lines[id], amount, frequency };
  };
  set('hypotheque_bail', 2100);
  set('electricite', 180);
  set('telecom', 145);
  set('taxes_mun', 4200, 'annuel');
  set('epicerie', 900);
  set('garderie', 650);
  set('vetements', 1200, 'annuel');
  set('auto_paiement', 450);
  set('essence', 220);
  set('permis', 280, 'annuel');
  set('ass_auto_hab', 185);
  set('ass_vie', 95);
  set('reer', 500);
  set('epargne_placements', 300);
  set('cartes', 150);
  set('restaurant', 250);
  set('abonnements', 65);
  set('voyages', 3500, 'annuel');
  set('cadeaux', 80);
  set('imprevus', 100);
  return b;
}

/** Dossier démo entrepreneur QC — illustration éducative. */
export function createDemoPlan() {
  const personId = newId('ent');
  const corpId = newId('ent');
  const bankId = newId('ast');
  const reerId = newId('ast');
  const celiId = newId('ast');
  const corpCashId = newId('ast');
  const homeId = newId('ast');
  const policyId = newId('ast');
  const mortgageId = newId('debt');
  const salaryId = newId('rev');
  const divId = newId('rev');

  const schedule = [];
  for (let y = 0; y <= 40; y++) {
    const age = 40 + y;
    const surrender = Math.round(5000 * y + 250 * y * y);
    const death = Math.round(500000 + surrender * 0.35);
    const premium = y < 20 ? 12000 : 0;
    schedule.push({
      year: y + 1,
      age,
      surrenderValue: surrender,
      totalInsurance: death,
      premiumPaid: premium,
    });
  }

  return {
    meta: {
      name: 'Démo entrepreneur',
      clientLabel: 'Client illustration',
      notes: 'Dossier fictif pour présentation RDV. Hypothèses non garanties.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    horizonYears: 25,
    deathScenarioYear: null,
    entities: [
      {
        id: personId,
        name: 'Personnel',
        type: 'personnel',
        province: 'QC',
        marginalTaxRate: DEFAULT_TAX_RATES.personnel,
      },
      {
        id: corpId,
        name: 'Holdco Inc.',
        type: 'corporation',
        province: 'QC',
        marginalTaxRate: DEFAULT_TAX_RATES.corporation,
        shareholders: [{ personEntityId: personId, ownershipPercent: 100, marginalTaxRate: DEFAULT_TAX_RATES.personnel }],
        corpTaxAccounts: { cdcBalance: 0, imrtdBalance: 0, gripBalance: 0 },
        dividendPolicy: { autoDistributePercent: 0, defaultOrder: 'non_eligible', gripAccrualPercent: 0 },
      },
    ],
    assets: [
      {
        id: bankId,
        name: 'Liquidités',
        type: 'non_enregistre',
        entityId: personId,
        currentBalance: 45000,
        monthlyContribution: 500,
        avgAnnualReturn: 2,
      },
      {
        id: reerId,
        name: 'REER',
        type: 'reer',
        entityId: personId,
        currentBalance: 180000,
        monthlyContribution: 800,
        avgAnnualReturn: 6,
      },
      {
        id: celiId,
        name: 'CELI',
        type: 'celi',
        entityId: personId,
        currentBalance: 65000,
        monthlyContribution: 400,
        avgAnnualReturn: 5.5,
      },
      {
        id: homeId,
        name: 'Résidence',
        type: 'immobilier',
        entityId: personId,
        currentBalance: 520000,
        monthlyContribution: 0,
        avgAnnualReturn: 3,
        _acb: 380000,
        principalResidence: true,
      },
      {
        id: corpCashId,
        name: 'Trésorerie Holdco',
        type: 'corporatif',
        entityId: corpId,
        currentBalance: 250000,
        monthlyContribution: 0,
        avgAnnualReturn: 4,
      },
      {
        id: policyId,
        name: 'Vie participative Holdco',
        type: 'assurance_participative',
        entityId: corpId,
        currentBalance: schedule[0].surrenderValue,
        monthlyContribution: 0,
        avgAnnualReturn: 0,
        insuranceSchedule: schedule,
        insuranceCurrentYearIdx: 0,
        totalInsurance: schedule[0].totalInsurance,
        annualPremium: 12000,
        includePremiumsInCashflow: true,
        premiumDebitAssetId: corpCashId,
        collateralLtvPercent: 90,
        pfiEnabled: false,
        adjustedCostBase: 0,
      },
    ],
    debts: [
      {
        id: mortgageId,
        name: 'Hypothèque résidence',
        type: 'hypotheque',
        entityId: personId,
        currentBalance: 310000,
        interestRate: 4.5,
        monthlyPayment: 1850,
        amortizationRemaining: 22,
        linkedAssetId: homeId,
      },
    ],
    revenues: [
      {
        id: salaryId,
        name: 'Salaire',
        type: 'salaire',
        entityId: personId,
        monthlyAmount: 9500,
        growthRate: 2,
      },
      {
        id: divId,
        name: 'Dividende Holdco',
        type: 'dividende',
        entityId: personId,
        monthlyAmount: 1500,
        growthRate: 0,
        dividendClass: 'non_eligible',
      },
    ],
    events: [
      {
        id: newId('evt'),
        name: 'Direction surplus → CELI',
        type: 'cashflow_direction',
        year: new Date().getFullYear(),
        details: {
          routingBySource: {
            [personId]: {
              dividendTaxMode: 'personnel',
              destinations: [{ assetId: celiId, percent: 100 }],
            },
          },
        },
      },
    ],
    needs: {
      hypotheque: 310000,
      pret_auto: 0,
      cartes: 0,
      marge_credit: 0,
      autres_dettes: 0,
      revenu_net: 7500,
      pct_remplacer: 70,
      nb_annees: 15,
      revenu_conjoint: 0,
      etudes: 30000,
      nb_enfants: 2,
      urgence: 25000,
      funerailles: 15000,
      legs: 0,
      av_actuelle: 500000,
      av_groupe: 100000,
      epargnes: 0,
      invalidite_revenu: 9500,
      invalidite_remplacement_pct: 60,
      invalidite_collective_pct: 0,
      maladie_grave_cible: 100000,
    },
    scenarios: [],
    workflow: { step: 'hub' },
    scope: { ...emptyScope(), conjoint: true, corporatif: true },
    priorities: ['assurance_vie', 'placement'],
    nextStepsNotes:
      'Valider illustrations assureur, mettre en place les cotisations automatiques CELI/REER, suivi dans 90 jours.',
    person: {
      ...emptyPerson(),
      firstName: 'Client',
      lastName: 'Illustration',
      birthDay: 15,
      birthMonth: '6',
      birthYear: 1985,
      sex: 'M',
      maritalStatus: 'conjoint',
      province: 'QC',
      tobacco: false,
      language: 'fr',
      planType: 'conjoint',
      spouse: {
        ...emptySpouse(),
        firstName: 'Conjointe',
        lastName: 'Illustration',
        birthYear: 1987,
        sex: 'F',
      },
      children: [
        { id: newId('ch'), name: 'Enfant 1', birthYear: 2015 },
        { id: newId('ch'), name: 'Enfant 2', birthYear: 2018 },
      ],
    },
    objectives: [
      { categoryId: 'protections', objectiveId: 'rembourser_deces' },
      { categoryId: 'protections', objectiveId: 'niveau_vie_invalidite' },
      { categoryId: 'finances', objectiveId: 'fonds_urgence' },
      { categoryId: 'retraite', objectiveId: 'niveau_vie' },
    ],
    contributionRoom: { ...emptyContributionRoom(), reer: 18000, celi: 45000 },
    emergency: { ...emptyEmergency(), months: 3, monthlyAmount: 4500, creditLine: 8000, allocatedAssetIds: [bankId] },
    deathNeeds: {
      ...emptyDeathNeeds(),
      policies: [
        { id: newId('pol'), type: 'temporaire', insured: 'Client', amount: 500000, annualPremium: 720 },
      ],
      liquidateAssetIds: [reerId, celiId],
      repayDebtIds: [mortgageId],
      incomeReplacePct: 70,
      incomeReplaceYears: 20,
      discountRate: 3.4,
    },
    disabilityNeeds: {
      ...emptyDisabilityNeeds(),
      policies: [{ id: newId('di'), type: 'individuelle', amount: 3000, annualPremium: 900 }],
      replacePct: 70,
    },
    criticalIllnessNeeds: {
      ...emptyCriticalIllnessNeeds(),
      policies: [{ id: newId('ci'), type: 'individuelle', amount: 50000, annualPremium: 400 }],
      clientMonthlyIncome: 7500,
      clientMonths: 12,
    },
    projects: [],
    retirement: {
      ...emptyRetirement(),
      targetAge: 65,
      replacePct: 70,
      publicPensions: [
        { id: newId('pen'), type: 'RRQ', annualAmount: 12000, frequency: 'annuel', indexed: true, startAge: 65 },
        { id: newId('pen'), type: 'SV', annualAmount: 8000, frequency: 'annuel', indexed: true, startAge: 65 },
      ],
      decumulationAssetIds: [reerId, celiId],
    },
    recommendations: [
      {
        id: newId('rec'),
        domain: 'death',
        text: 'Ajuster la couverture vie temporaire pour combler le manque à gagner illustratif et sécuriser la famille.',
      },
    ],
    savings: [{ id: newId('sav'), name: 'Épargne auto', monthlyAmount: 800, annualAmount: 9600 }],
    modules: (() => {
      const modules = emptyModulesState();
      const vieA = createModuleOption('assurance_vie', {
        letter: 'A',
        name: 'Temporaire 20 ans · 500 k$',
        pitch: 'Couverture familiale pendant les années critiques, prime contenue.',
        recommended: true,
        data: {
          productType: 'temporaire',
          coverage: 500000,
          termYears: 20,
          annualPremium: 720,
          ownerType: 'personnel',
        },
      });
      const vieB = createModuleOption('assurance_vie', {
        letter: 'B',
        name: 'Participative Holdco',
        pitch: 'Vie permanente en corporation avec valeur de rachat et collatéral possible.',
        data: {
          productType: 'participative',
          coverage: 1000000,
          annualPremium: 12000,
          ownerType: 'corporation',
          pfiEnabled: true,
          pfiAnnualAdvanceAmount: 25000,
        },
      });
      const placeA = createModuleOption('placement', {
        letter: 'A',
        name: 'Accélérer CELI + REER',
        pitch: 'Hausse des cotisations automatiques sur les comptes enregistrés.',
        recommended: true,
        data: {
          reerSolde: 180000,
          reerCotisationMensuelle: 1000,
          reerRendement: 6,
          celiSolde: 65000,
          celiCotisationMensuelle: 600,
          celiRendement: 5.5,
        },
      });
      modules.byModule.assurance_vie.options = [vieA, vieB];
      modules.byModule.placement.options = [placeA];
      modules.selections = { assurance_vie: 'A', placement: 'A' };
      modules.title = 'Proposition démo';
      return modules;
    })(),
    budget: demoBudget(),
  };
}

export function createEmptyPlan() {
  const personId = newId('ent');
  const bankId = newId('ast');
  return {
    meta: {
      name: 'Nouveau dossier',
      clientLabel: '',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    horizonYears: 25,
    deathScenarioYear: null,
    entities: [
      {
        id: personId,
        name: 'Personnel',
        type: 'personnel',
        province: 'QC',
        marginalTaxRate: DEFAULT_TAX_RATES.personnel,
      },
    ],
    assets: [
      {
        id: bankId,
        name: 'Liquidités',
        type: 'non_enregistre',
        entityId: personId,
        currentBalance: 0,
        monthlyContribution: 0,
        avgAnnualReturn: 2,
      },
    ],
    debts: [],
    revenues: [],
    events: [],
    needs: {
      hypotheque: 0,
      pret_auto: 0,
      cartes: 0,
      marge_credit: 0,
      autres_dettes: 0,
      revenu_net: 0,
      pct_remplacer: 70,
      nb_annees: 10,
      revenu_conjoint: 0,
      etudes: 30000,
      nb_enfants: 0,
      urgence: 0,
      funerailles: 15000,
      legs: 0,
      av_actuelle: 0,
      av_groupe: 0,
      epargnes: 0,
      invalidite_revenu: 0,
      invalidite_remplacement_pct: 60,
      invalidite_collective_pct: 0,
      maladie_grave_cible: 50000,
    },
    scenarios: [],
    workflow: { step: 'personnelles' },
    scope: emptyScope(),
    priorities: [],
    nextStepsNotes: '',
    person: emptyPerson(),
    objectives: [],
    contributionRoom: emptyContributionRoom(),
    emergency: emptyEmergency(),
    deathNeeds: emptyDeathNeeds(),
    disabilityNeeds: emptyDisabilityNeeds(),
    criticalIllnessNeeds: emptyCriticalIllnessNeeds(),
    projects: [],
    retirement: emptyRetirement(),
    recommendations: [],
    savings: [],
    modules: emptyModulesState(),
    budget: emptyBudgetState(),
  };
}

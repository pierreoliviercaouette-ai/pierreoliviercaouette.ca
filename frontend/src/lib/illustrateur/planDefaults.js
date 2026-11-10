import { newId } from './ids';
import { emptyBudgetState } from './budgetCatalog';
import { emptyScope, emptySpouse, ensureScope } from './planScope';

export function emptyPerson() {
  return {
    firstName: '',
    lastName: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    sex: 'M',
    maritalStatus: 'celibataire',
    province: 'QC',
    email: '',
    canadaSinceYear: '',
    tobacco: false,
    language: 'fr',
    planType: 'individuel',
    spouse: emptySpouse(),
    children: [],
    legalNotes: [],
  };
}

export { emptyScope, emptySpouse, ensureScope };

export function emptyContributionRoom() {
  return { reer: 0, celi: 0, celiapp: 0 };
}

export function emptyEmergency() {
  return {
    base: 'depenses', // revenu | depenses | fixe | aucun
    months: 3,
    monthlyAmount: 1500,
    creditLine: 0,
    allocatedAssetIds: [],
  };
}

export function emptyDeathNeeds() {
  return {
    policies: [],
    rrqDeathBenefit: 2500,
    liquidateAssetIds: [],
    repayDebtIds: [],
    expenses: [
      { id: newId('exp'), description: 'Frais funéraires', amount: 15000, indexed: false },
    ],
    incomeMode: 'individuel', // individuel | aucun
    incomeBasis: 'brut', // brut | net
    incomeFrequency: 'annuel',
    incomeReplacePct: 70,
    incomeReplaceYears: 25,
    discountRate: 3.4,
    survivorPension: 0,
    orphanPension: 0,
    otherIncome: 0,
  };
}

export function emptyDisabilityNeeds() {
  return {
    policies: [],
    otherMonthlyIncome: 0,
    eiCovered: false,
    approach: 'remplacement', // remplacement | depenses
    incomeBasis: 'net',
    replacePct: 70,
    physicalLevel: 20, // 0 physical … 100 desk
    workHours: 40,
    workHoursUnit: 'semaine',
    riskyHobby: false,
    waitingDays: 30,
    coverageToAge: 65,
  };
}

export function emptyCriticalIllnessNeeds() {
  return {
    policies: [],
    useDisability: false,
    useEmergency: false,
    incomeBasis: 'net',
    clientMonthlyIncome: 0,
    clientMonths: 12,
    caregiverMonthly: 0,
    caregiverMonths: 6,
    protectionLevel: 'confort', // aucun | base | confort | superieur
    extras: {
      uninsuredTreatment: 5000,
      medicalEquipment: 5000,
      homeAdapt: 12000,
      vehicleAdapt: 8000,
      other: 0,
    },
  };
}

export function emptyRetirement() {
  return {
    targetAge: 65,
    incomeMode: 'individuel',
    incomeUnit: 'pct', // pct | cad
    incomeFrequency: 'annuel',
    replacePct: 70,
    replaceAmount: 0,
    autoSaveSurplus: false,
    expenses: [],
    profileBefore: 'modere',
    profileDuring: 'conservateur',
    publicPensions: [
      { id: newId('pen'), type: 'RRQ', annualAmount: 0, frequency: 'annuel', indexed: true, startAge: 65 },
      { id: newId('pen'), type: 'SV', annualAmount: 0, frequency: 'annuel', indexed: true, startAge: 65 },
    ],
    definedBenefit: [],
    plannedWithdrawals: [],
    decumulationAssetIds: [],
  };
}

export function ensureCollectFields(plan) {
  const scope = ensureScope(plan);
  return {
    scope,
    person: {
      ...emptyPerson(),
      ...(plan?.person || {}),
      spouse: { ...emptySpouse(), ...(plan?.person?.spouse || {}) },
      planType: scope.conjoint ? 'conjoint' : 'individuel',
    },
    objectives: Array.isArray(plan?.objectives) ? plan.objectives : [],
    contributionRoom: { ...emptyContributionRoom(), ...(plan?.contributionRoom || {}) },
    emergency: { ...emptyEmergency(), ...(plan?.emergency || {}) },
    deathNeeds: {
      ...emptyDeathNeeds(),
      ...(plan?.deathNeeds || {}),
      expenses: plan?.deathNeeds?.expenses || emptyDeathNeeds().expenses,
      policies: plan?.deathNeeds?.policies || [],
      liquidateAssetIds: plan?.deathNeeds?.liquidateAssetIds || [],
      repayDebtIds: plan?.deathNeeds?.repayDebtIds || [],
    },
    disabilityNeeds: {
      ...emptyDisabilityNeeds(),
      ...(plan?.disabilityNeeds || {}),
      policies: plan?.disabilityNeeds?.policies || [],
    },
    criticalIllnessNeeds: {
      ...emptyCriticalIllnessNeeds(),
      ...(plan?.criticalIllnessNeeds || {}),
      policies: plan?.criticalIllnessNeeds?.policies || [],
      extras: {
        ...emptyCriticalIllnessNeeds().extras,
        ...(plan?.criticalIllnessNeeds?.extras || {}),
      },
    },
    projects: Array.isArray(plan?.projects) ? plan.projects : [],
    retirement: {
      ...emptyRetirement(),
      ...(plan?.retirement || {}),
      publicPensions: plan?.retirement?.publicPensions || emptyRetirement().publicPensions,
      definedBenefit: plan?.retirement?.definedBenefit || [],
      plannedWithdrawals: plan?.retirement?.plannedWithdrawals || [],
      decumulationAssetIds: plan?.retirement?.decumulationAssetIds || [],
      expenses: plan?.retirement?.expenses || [],
    },
    recommendations: Array.isArray(plan?.recommendations) ? plan.recommendations : [],
    savings: Array.isArray(plan?.savings) ? plan.savings : [],
    budget: plan?.budget
      ? { ...emptyBudgetState(), ...plan.budget, lines: { ...emptyBudgetState().lines, ...(plan.budget.lines || {}) } }
      : emptyBudgetState(),
  };
}

// Fiscal reference values used by calculators (Quebec + Canada, 2026).
// These values are intentionally centralized for easier annual updates.

export const TAX_YEAR = 2026;

export const INCOME_TAX_2026 = {
  quebecAbatement: 0.165,
  federalBrackets: [
    { min: 0, max: 58523, rate: 0.14 },
    { min: 58523, max: 117045, rate: 0.205 },
    { min: 117045, max: 181440, rate: 0.26 },
    { min: 181440, max: 258482, rate: 0.29 },
    { min: 258482, max: Infinity, rate: 0.33 },
  ],
  quebecBrackets: [
    { min: 0, max: 54345, rate: 0.14 },
    { min: 54345, max: 108680, rate: 0.19 },
    { min: 108680, max: 132245, rate: 0.24 },
    { min: 132245, max: Infinity, rate: 0.2575 },
  ],
};

export const REER_2026 = {
  deductionLimitMax: 33810,
  contributionRate: 0.18,
};

export const REEE_2026 = {
  cesg: {
    annualContributionCapPerChild: 2500,
    baseRate: 0.2,
    additionalContributionBasePerChild: 500,
    additionalLowIncomeRate: 0.2,
    additionalMidIncomeRate: 0.1,
    additionalLowIncomeThreshold: 58523,
    additionalMidIncomeThreshold: 117045,
    lifetimeCapPerChild: 7200,
  },
  iqee: {
    annualContributionCapPerChild: 2500,
    baseRate: 0.1,
    additionalContributionBasePerChild: 500,
    additionalLowIncomeRate: 0.1,
    additionalMidIncomeRate: 0.05,
    additionalLowIncomeThreshold: 54345,
    additionalMidIncomeThreshold: 108680,
    lifetimeCapPerChild: 3600,
  },
  bec: {
    annualAmountPerChild: 100,
    lifetimeCapPerChild: 2000,
    // Simplified proxy threshold for estimator mode.
    estimatedEligibilityThreshold: 58523,
  },
};

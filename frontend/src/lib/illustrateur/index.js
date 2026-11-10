export { generate25YearProjection, computeAssetTypeBreakdown, sortAssetTypes } from './projectionEngine';
export {
  ASSET_TYPES,
  DEBT_TYPES,
  REVENUE_TYPES,
  EVENT_TYPES,
  ENTITY_TYPES,
  DEFAULT_TAX_RATES,
  calcMortgage,
  calcDividendTax,
  parseInsuranceCsv,
  parseInsuranceRows,
} from './investmentPlanningService';
export { createDemoPlan, createEmptyPlan } from './demoPlan';
export {
  clonePlan,
  touchPlan,
  loadSessionPlan,
  saveSessionPlan,
  clearSessionPlan,
  exportPlanJson,
  parseImportedPlan,
  readPlanFile,
} from './planIo';
export { computeLifeNeeds, computeDisabilityGap, computeCriticalIllnessGap } from './needsAnalysis';
export {
  formatCad,
  formatCompactCad,
  formatPct,
  assetTypeLabel,
  summarizeProjection,
  buildNetWorthSeries,
  buildCashflowSeries,
  buildAllocationNow,
  buildAllocationEnd,
  buildSparkline,
  compareScenarios,
} from './metrics';
export { newId } from './ids';
export {
  PLANNING_MODULES,
  OPTION_LETTERS,
  emptyModulesState,
  ensureModules,
  createModuleOption,
  defaultOptionData,
  nextLetter,
  composePlanFromModules,
  buildModulesBundle,
  buildCompareSeriesFromBundle,
  summarizeOptionCard,
  getSelectedOption,
} from './planningModules';

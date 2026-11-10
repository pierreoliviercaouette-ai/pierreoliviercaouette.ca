import { DEFAULT_PROPERTY_APPRECIATION } from './constants';
import { buildEntityMap, getMarginalRate, ensureAssetAcb } from './helpers';
import {
  isGrowthTaxDeferred,
  isAppreciationOnly,
  getEffectiveAssetTaxType,
  getIncomeYieldFraction,
} from './assetTaxProfiles';
import { isCorporatePassiveAsset, calcCorporatePassiveInvestmentTax } from './corporateTax';

const DEFAULTS = { propertyAppreciation: DEFAULT_PROPERTY_APPRECIATION };

/**
 * Croissance annuelle des actifs avec suivi PNB/ACB (sans imposer les gains non réalisés).
 */
export function growAssetsWithTax(assets, entityMap) {
  for (const a of assets) {
    if (a.type === 'assurance_participative' && a.insuranceSchedule) {
      a._insuranceIdx = (a._insuranceIdx || 0) + 1;
      const nextRow = a.insuranceSchedule[a._insuranceIdx];
      if (nextRow) {
        a.currentBalance = nextRow.surrenderValue || 0;
        a._totalInsurance = nextRow.totalInsurance || 0;
      }
      continue;
    }

    ensureAssetAcb(a);
    const entity = entityMap?.[a.entityId];
    const annualReturn = (parseFloat(a.avgAnnualReturn) || 0) / 100;

    if (isAppreciationOnly(a) || a.type === 'immobilier') {
      a.currentBalance *= (1 + (annualReturn || DEFAULTS.propertyAppreciation));
      continue;
    }

    if (isGrowthTaxDeferred(a)) {
      const monthlyRate = annualReturn / 12;
      for (let m = 0; m < 12; m++) {
        a.currentBalance *= (1 + monthlyRate);
        a.currentBalance += parseFloat(a.monthlyContribution) || 0;
      }
      continue;
    }

    const balanceStart = parseFloat(a.currentBalance) || 0;
    const incomeFrac = getIncomeYieldFraction(a);
    const growthFrac = Math.max(0, 1 - incomeFrac);
    const growthRate = annualReturn * growthFrac;

    const monthlyGrowth = growthRate / 12;
    for (let m = 0; m < 12; m++) {
      a.currentBalance *= (1 + monthlyGrowth);
      a.currentBalance += parseFloat(a.monthlyContribution) || 0;
    }

    const gain = (parseFloat(a.currentBalance) || 0) - balanceStart
      - (parseFloat(a.monthlyContribution) || 0) * 12;
    if (gain > 0) {
      a._acb = (parseFloat(a._acb) || balanceStart) + gain * growthFrac;
    }
  }
}

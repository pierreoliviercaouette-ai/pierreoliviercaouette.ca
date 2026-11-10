/**
 * Résolution d'une ligne du calendrier assurance (index projection vs champ année).
 */

export function getRawInsuranceScheduleIndex(policy, projectionYearIndex = null) {
  const schedule = policy?.insuranceSchedule;
  if (!schedule?.length) return 0;

  let idx = policy._insuranceIdx ?? policy.insuranceCurrentYearIdx ?? 0;
  if (projectionYearIndex != null && Number.isFinite(projectionYearIndex)) {
    if (policy._insuranceIdx == null && policy.insuranceCurrentYearIdx == null) {
      idx = projectionYearIndex;
    }
  }
  return Math.max(0, idx);
}

export function resolveInsuranceScheduleIndex(policy, projectionYearIndex = null) {
  const schedule = policy?.insuranceSchedule;
  if (!schedule?.length) return 0;
  const raw = getRawInsuranceScheduleIndex(policy, projectionYearIndex);
  return Math.min(raw, schedule.length - 1);
}

function scheduleUsesCalendarYears(schedule) {
  return schedule.some((r) => {
    const y = parseInt(r?.year, 10);
    return Number.isFinite(y) && y > 1900;
  });
}

function rowWithZeroPremium(base = {}) {
  return { ...base, premiumPaid: 0, premium: 0, prime: 0, primePayee: 0 };
}

export function getInsuranceScheduleRow(policy, options = {}) {
  const schedule = policy?.insuranceSchedule;
  if (!schedule?.length) return {};

  const rawIdx = getRawInsuranceScheduleIndex(policy, options.projectionYearIndex);
  const calendarYear = options.calendarYear;

  if (calendarYear != null && scheduleUsesCalendarYears(schedule)) {
    const calRow = schedule.find((r) => parseInt(r?.year, 10) === calendarYear);
    if (calRow) return calRow;
    const civilYears = schedule
      .map((r) => parseInt(r?.year, 10))
      .filter((y) => Number.isFinite(y) && y > 1900);
    if (civilYears.length && calendarYear > Math.max(...civilYears)) {
      return rowWithZeroPremium(schedule[schedule.length - 1]);
    }
  }

  if (rawIdx >= schedule.length) {
    return rowWithZeroPremium(schedule[schedule.length - 1]);
  }

  const idx = Math.min(rawIdx, schedule.length - 1);
  let row = schedule[idx] || {};

  const policyYear = idx + 1;
  const alt = schedule.find((r) => {
    if (r == null) return false;
    const y = parseInt(r.year, 10);
    if (!Number.isFinite(y)) return false;
    if (y === policyYear) return true;
    if (calendarYear != null && y === calendarYear) return true;
    return false;
  });
  if (alt) row = alt;

  return row;
}

/**
 * Prime annuelle pour une ligne du calendrier.
 * Si la ligne indique 0, on retourne 0 (pas de repli sur annualPremium).
 * Repli sur annualPremium seulement si aucun champ prime n'est présent sur la ligne.
 */
export function getInsurancePremiumFromRow(row, policy, { allowAnnualFallback = true } = {}) {
  if (!row || typeof row !== 'object') {
    return allowAnnualFallback ? (parseFloat(policy?.annualPremium) || 0) : 0;
  }

  const fields = ['premiumPaid', 'premium', 'prime', 'primePayee'];
  let hasPremiumField = false;
  for (const key of fields) {
    if (row[key] == null || row[key] === '') continue;
    hasPremiumField = true;
    const v = parseFloat(row[key]);
    if (Number.isFinite(v)) return Math.max(0, v);
  }

  if (hasPremiumField) return 0;
  return allowAnnualFallback ? (parseFloat(policy?.annualPremium) || 0) : 0;
}

export function isPastInsuranceScheduleEnd(policy, options = {}) {
  const schedule = policy?.insuranceSchedule;
  if (!schedule?.length) return false;
  const calendarYear = options.calendarYear;
  if (calendarYear != null && scheduleUsesCalendarYears(schedule)) {
    const civilYears = schedule
      .map((r) => parseInt(r?.year, 10))
      .filter((y) => Number.isFinite(y) && y > 1900);
    if (civilYears.length && calendarYear > Math.max(...civilYears)) return true;
  }
  const rawIdx = getRawInsuranceScheduleIndex(policy, options.projectionYearIndex);
  return rawIdx >= schedule.length;
}

/** Prime payée depuis un compte liquide (premiumDebitAssetId), indépendamment du toggle trésorerie entité. */
export function getInsurancePremiumForDebit(policy, options = {}) {
  if (!policy || policy.type !== 'assurance_participative') return 0;
  if (!policy.premiumDebitAssetId) return 0;
  if (!policy.insuranceSchedule?.length) {
    return Math.max(0, parseFloat(policy.annualPremium) || 0);
  }
  if (isPastInsuranceScheduleEnd(policy, options)) return 0;
  const row = getInsuranceScheduleRow(policy, options);
  return getInsurancePremiumFromRow(row, policy, { allowAnnualFallback: true });
}

export function isPremiumPaidFromLiquidAccount(policy) {
  return Boolean(policy?.type === 'assurance_participative' && policy?.premiumDebitAssetId);
}

/** Prime comptée au cashflow opérationnel de l'entité (payée via compte désigné ou trésorerie globale). */
export function getEntityInsurancePremiumAnnual(policy, options = {}) {
  if (!policy || policy.type !== 'assurance_participative') return 0;
  const fromLiquid = getInsurancePremiumForDebit(policy, options);
  if (fromLiquid > 0) return fromLiquid;
  return getInsurancePremiumForPolicy(policy, options);
}

export function getInsurancePremiumForPolicy(policy, options = {}) {
  if (!policy || policy.type !== 'assurance_participative') return 0;
  if (isPremiumPaidFromLiquidAccount(policy)) return 0;
  if (policy.includePremiumsInCashflow === false) return 0;
  if (!policy.insuranceSchedule?.length) {
    return parseFloat(policy.annualPremium) || 0;
  }
  if (isPastInsuranceScheduleEnd(policy, options)) return 0;
  const row = getInsuranceScheduleRow(policy, options);
  const allowFallback = getRawInsuranceScheduleIndex(policy, options.projectionYearIndex)
    < policy.insuranceSchedule.length;
  return getInsurancePremiumFromRow(row, policy, { allowAnnualFallback: allowFallback });
}

export function getInsuranceSurrenderFromRow(row, policy) {
  return (
    parseFloat(row?.surrenderValue)
    ?? parseFloat(row?.valeurRachat)
    ?? parseFloat(policy?.currentBalance)
    ?? 0
  );
}

export function getInsuranceDeathBenefitFromRow(row, policy) {
  const fromRow = parseFloat(row?.totalInsurance) ?? parseFloat(row?.capitalDeces);
  if (Number.isFinite(fromRow) && fromRow >= 0) return fromRow;
  return parseFloat(policy?._totalInsurance) || parseFloat(policy?.totalInsurance) || 0;
}

/**
 * Met à jour le capital décès projeté (_totalInsurance) pour l'année civile / index.
 * Ne modifie pas la VR (currentBalance) : elle reste pilotée par growAssetsWithTax.
 */
export function syncInsurancePolicyProjectionValues(policy, options = {}) {
  if (!policy || policy.type !== 'assurance_participative') return;
  if (!policy.insuranceSchedule?.length) {
    policy._totalInsurance = parseFloat(policy.totalInsurance) || parseFloat(policy._totalInsurance) || 0;
    return;
  }
  const row = getInsuranceScheduleRow(policy, options);
  policy._totalInsurance = getInsuranceDeathBenefitFromRow(row, policy);
}

export function syncInsurancePoliciesForProjectionYear(assets, options = {}) {
  for (const a of assets || []) {
    syncInsurancePolicyProjectionValues(a, options);
  }
}

/**
 * Comptes corporatifs (CDC, IMRTD, GRIP) et distribution de dividendes aux actionnaires.
 * Estimations — valider avec un fiscaliste.
 */

import { IMRTD_CREDIT_RATE, RTD_REFUND_RATE } from './constants';
import { applyDividendIntegration } from './corporateTax';
import { buildEntityMap } from './helpers';
import { computeInsuranceDeathSettlement, syncPolicyCbr } from './insuranceCollateral';

export const DIVIDEND_CLASSES = ['capital', 'eligible', 'non_eligible'];
export const DEFAULT_DIVIDEND_ORDER = ['capital', 'eligible', 'non_eligible'];

export function newShareholderId() {
  return `sh-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Migration douce dividendDistributionRate → dividendPolicy.autoDistributePercent */
export function normalizeDividendPolicy(entity) {
  if (entity.type !== 'corporation') return null;
  const legacy = parseFloat(entity.dividendDistributionRate);
  const existing = entity.dividendPolicy || {};
  const auto = parseFloat(existing.autoDistributePercent);
  const autoDistributePercent = Number.isFinite(auto)
    ? auto
    : (Number.isFinite(legacy) ? legacy : 0);
  return {
    autoDistributePercent,
    defaultOrder: Array.isArray(existing.defaultOrder) && existing.defaultOrder.length
      ? existing.defaultOrder.filter((c) => DIVIDEND_CLASSES.includes(c))
      : [...DEFAULT_DIVIDEND_ORDER],
    gripAccrualPercent: parseFloat(existing.gripAccrualPercent) || 0,
  };
}

export function normalizeCorpTaxAccounts(entity) {
  const raw = entity.corpTaxAccounts || {};
  return {
    cdcBalance: Math.max(0, parseFloat(raw.cdcBalance) || 0),
    imrtdBalance: Math.max(0, parseFloat(raw.imrtdBalance) || 0),
    gripBalance: Math.max(0, parseFloat(raw.gripBalance) || 0),
  };
}

/** État mutable pendant la projection (copie des soldes d'ouverture). */
export function initCorpTaxState(entity) {
  if (entity.type !== 'corporation') return null;
  const accounts = normalizeCorpTaxAccounts(entity);
  return {
    cdcBalance: accounts.cdcBalance,
    imrtdBalance: accounts.imrtdBalance,
    gripBalance: accounts.gripBalance,
  };
}

export function getCorpTaxState(entity) {
  if (!entity._corpTaxState) {
    entity._corpTaxState = initCorpTaxState(entity);
  }
  return entity._corpTaxState;
}

export function validateShareholderPercents(shareholders) {
  const list = shareholders || [];
  if (list.length === 0) return { valid: true, sum: 0 };
  const sum = list.reduce((s, sh) => s + (parseFloat(sh.ownershipPercent) || 0), 0);
  return { valid: Math.abs(sum - 100) <= 0.01, sum };
}

/**
 * Actionnaires résolus (taux marginal, libellé, cible entité personnel).
 */
export function getResolvedShareholders(corp, entities) {
  const entityMap = buildEntityMap(entities);
  const list = corp.shareholders || [];
  return list.map((sh) => {
    const person = sh.personEntityId ? entityMap[sh.personEntityId] : null;
    const rateRaw = sh.marginalTaxRate != null && sh.marginalTaxRate !== ''
      ? parseFloat(sh.marginalTaxRate)
      : parseFloat(person?.marginalTaxRate);
    return {
      id: sh.id || newShareholderId(),
      personEntityId: sh.personEntityId || null,
      name: sh.name || person?.name || 'Actionnaire',
      ownershipPercent: parseFloat(sh.ownershipPercent) || 0,
      marginalTaxRate: Number.isFinite(rateRaw) ? rateRaw : 53.31,
      targetEntityId: sh.personEntityId || null,
    };
  });
}

export function allocateByOwnership(totalAmount, shareholders) {
  const total = Math.max(0, parseFloat(totalAmount) || 0);
  if (total <= 0 || !shareholders?.length) return [];

  const parts = [];
  let allocated = 0;
  for (let i = 0; i < shareholders.length; i++) {
    const sh = shareholders[i];
    const pct = (parseFloat(sh.ownershipPercent) || 0) / 100;
    let gross;
    if (i === shareholders.length - 1) {
      gross = Math.round(total - allocated);
    } else {
      gross = Math.round(total * pct);
      allocated += gross;
    }
    parts.push({ shareholder: sh, gross: Math.max(0, gross) });
  }
  return parts;
}

export function accrueImrtdFromPassiveIncome(corpState, passiveIncomeTaxed) {
  const base = Math.max(0, parseFloat(passiveIncomeTaxed) || 0);
  const credit = Math.round(base * IMRTD_CREDIT_RATE);
  corpState.imrtdBalance = Math.round((corpState.imrtdBalance || 0) + credit);
  return credit;
}

export function accrueGripFromActiveIncome(corpState, activeIncome, accrualPercent) {
  const pct = (parseFloat(accrualPercent) || 0) / 100;
  const credit = Math.round(Math.max(0, parseFloat(activeIncome) || 0) * pct);
  corpState.gripBalance = Math.round((corpState.gripBalance || 0) + credit);
  return credit;
}

export function creditCdc(corpState, amount) {
  const amt = Math.max(0, parseFloat(amount) || 0);
  corpState.cdcBalance = Math.round((corpState.cdcBalance || 0) + amt);
  return amt;
}

function refundImrtdOnTaxableDividend(corpState, taxableDividendGross) {
  const gross = Math.max(0, parseFloat(taxableDividendGross) || 0);
  if (gross <= 0) return 0;
  const maxRefund = Math.round(gross * RTD_REFUND_RATE);
  const refund = Math.min(corpState.imrtdBalance || 0, maxRefund);
  corpState.imrtdBalance = Math.round((corpState.imrtdBalance || 0) - refund);
  return refund;
}

/**
 * Distribue un montant selon la classe de dividende.
 */
export function distributeCorporateDividends({
  corp,
  corpState,
  shareholders,
  amount,
  dividendClass = 'non_eligible',
  entities = [],
  applyTax = true,
}) {
  const grossTotal = Math.max(0, parseFloat(amount) || 0);
  const result = {
    dividendClass,
    grossTotal: 0,
    byShareholder: [],
    corp: {
      dividendPaid: 0,
      imrtdRefunded: 0,
      cdcUsed: 0,
      gripUsed: 0,
    },
    warnings: [],
  };

  if (grossTotal <= 0 || !shareholders?.length) return result;

  const entityMap = buildEntityMap(entities);
  let distributable = grossTotal;

  if (dividendClass === 'capital') {
    const available = corpState.cdcBalance || 0;
    if (distributable > available) {
      result.warnings.push(`CDC insuffisant: ${distributable} demandé, ${available} disponible`);
      distributable = available;
    }
    corpState.cdcBalance = Math.round(available - distributable);
    result.corp.cdcUsed = distributable;
  } else if (dividendClass === 'eligible') {
    const grip = corpState.gripBalance || 0;
    if (distributable > grip) {
      result.warnings.push(`GRIP insuffisant: plafonné à ${grip}`);
      distributable = grip;
    }
    corpState.gripBalance = Math.round(grip - distributable);
    result.corp.gripUsed = distributable;
  }

  const parts = allocateByOwnership(distributable, shareholders);
  let taxableGrossTotal = 0;

  for (const { shareholder: sh, gross } of parts) {
    if (gross <= 0) continue;
    let tax = 0;
    let net = gross;

    if (dividendClass !== 'capital' && applyTax) {
      const personalEntity = sh.personEntityId
        ? entityMap[sh.personEntityId]
        : { marginalTaxRate: sh.marginalTaxRate, type: 'personnel' };
      const integration = applyDividendIntegration(
        gross,
        personalEntity,
        corp,
        dividendClass === 'eligible',
      );
      tax = integration.tax;
      net = integration.net;
      taxableGrossTotal += gross;
    }

    result.byShareholder.push({
      shareholderId: sh.id,
      personEntityId: sh.personEntityId,
      name: sh.name,
      gross,
      tax: Math.round(tax),
      net: Math.round(net),
      dividendClass,
    });
  }

  if (dividendClass !== 'capital') {
    result.corp.imrtdRefunded = refundImrtdOnTaxableDividend(corpState, taxableGrossTotal);
  }

  result.grossTotal = distributable;
  result.corp.dividendPaid = distributable;
  return result;
}

/** Dépose le montant net sur le premier compte liquide de l'entité cible. */
export function depositToEntityAssets(assets, entityId, amount, cashflowTracker = null) {
  const net = Math.max(0, parseFloat(amount) || 0);
  if (net <= 0 || !entityId) return 0;
  const target = assets.find(
    (a) => a.entityId === entityId
      && a.type !== 'immobilier'
      && a.type !== 'assurance_participative',
  );
  if (!target) return 0;
  target.currentBalance = (parseFloat(target.currentBalance) || 0) + net;
  cashflowTracker?.add(target.id, net);
  return net;
}

export function applyDistributionToEntityCashflows(entityCashflows, distribution, entities) {
  if (!distribution?.byShareholder?.length) return;
  const entityMap = buildEntityMap(entities);

  for (const sh of distribution.byShareholder) {
    const eid = sh.personEntityId;
    if (!eid || !entityCashflows[eid]) continue;
    const cf = entityCashflows[eid];
    cf.dividendReceived = (cf.dividendReceived || 0) + sh.gross;
    cf.dividendTax = (cf.dividendTax || 0) + sh.tax;
    const priorOp = cf.operatingCashflow || 0;
    cf.operatingCashflow = priorOp + sh.net;
    cf.netCashflow = (cf.netCashflow || priorOp) + sh.net;
  }

  const corpId = distribution.corpEntityId;
  if (corpId && entityCashflows[corpId]) {
    const cf = entityCashflows[corpId];
    cf.dividendPaid = (cf.dividendPaid || 0) + (distribution.corp?.dividendPaid || 0);
    cf.imrtdRefunded = (cf.imrtdRefunded || 0) + (distribution.corp?.imrtdRefunded || 0);
    cf.netCashflow = (cf.operatingCashflow || 0) - (cf.dividendPaid || 0) + (cf.imrtdRefunded || 0);
    if (!cf.corpTaxAccounts) cf.corpTaxAccounts = {};
    Object.assign(cf.corpTaxAccounts, distribution.corpTaxSnapshot || {});
  }
}

export function runAutoDividendPolicy({
  corp,
  corpState,
  shareholders,
  operatingCashflow,
  entities,
  applyTax = true,
}) {
  const policy = normalizeDividendPolicy(corp);
  const pct = (policy.autoDistributePercent || 0) / 100;
  const pool = Math.max(0, operatingCashflow) * pct;
  if (pool <= 0 || !shareholders?.length) {
    return { distributions: [], totalPaid: 0, corpTaxSnapshot: { ...corpState } };
  }

  let remaining = Math.round(pool);
  const distributions = [];
  const order = policy.defaultOrder || DEFAULT_DIVIDEND_ORDER;

  for (const dividendClass of order) {
    if (remaining <= 0) break;
    if (dividendClass === 'capital' && (corpState.cdcBalance || 0) <= 0) continue;
    if (dividendClass === 'eligible' && (corpState.gripBalance || 0) <= 0) continue;

    const dist = distributeCorporateDividends({
      corp,
      corpState,
      shareholders,
      amount: remaining,
      dividendClass,
      entities,
      applyTax,
    });
    dist.corpEntityId = corp.id;
    dist.corpTaxSnapshot = { ...corpState };
    distributions.push(dist);
    remaining -= dist.grossTotal;
  }

  const totalPaid = distributions.reduce((s, d) => s + (d.corp?.dividendPaid || 0), 0);
  return { distributions, totalPaid, corpTaxSnapshot: { ...corpState } };
}

export function accrueCorporateTaxAccounts({
  corp,
  corpState,
  passiveIncomeGross = 0,
  activeIncomeGross = 0,
  gripAccrualPercent = 0,
  cdcCredit = 0,
}) {
  const passiveTaxed = Math.max(0, parseFloat(passiveIncomeGross) || 0);
  const imrtdAccrued = accrueImrtdFromPassiveIncome(corpState, passiveTaxed);
  const gripAccrued = accrueGripFromActiveIncome(corpState, activeIncomeGross, gripAccrualPercent);
  const cdcAdded = creditCdc(corpState, cdcCredit);
  return { imrtdAccrued, gripAccrued, cdcAdded };
}

/** Crédit CDC au décès (polices corporatives). */
export function accrueCdcFromInsuranceDeath(assets, debts, entities, corpEntityId, scheduleOptions = {}) {
  const entityMap = buildEntityMap(entities);
  let total = 0;
  for (const a of assets) {
    if (a.type !== 'assurance_participative' || a.entityId !== corpEntityId) continue;
    syncPolicyCbr(a);
    const settlement = computeInsuranceDeathSettlement(
      a,
      debts,
      entityMap[a.entityId],
      scheduleOptions,
    );
    total += settlement.cdcCredit || 0;
  }
  return total;
}

export function summarizeCorpTaxBalances(entities) {
  let cdc = 0;
  let imrtd = 0;
  let grip = 0;
  let dividendsPaid = 0;
  for (const e of entities) {
    if (e.type !== 'corporation') continue;
    const st = e._corpTaxState || normalizeCorpTaxAccounts(e);
    cdc += st.cdcBalance || 0;
    imrtd += st.imrtdBalance || 0;
    grip += st.gripBalance || 0;
  }
  return { corpCdcBalance: Math.round(cdc), corpImrtdBalance: Math.round(imrtd), corpGripBalance: Math.round(grip) };
}

export function prepareCorporationsForProjection(entities) {
  for (const e of entities) {
    if (e.type !== 'corporation') continue;
    e.dividendPolicy = normalizeDividendPolicy(e);
    e._corpTaxState = initCorpTaxState(e);
  }
}

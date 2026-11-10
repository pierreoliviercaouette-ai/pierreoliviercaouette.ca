/**
 * Moteur de projection (horizon paramétrable) pour la planification d'investissement immobilier.
 * - Stacked area chart par actif
 * - Fiscalité: taux marginal par entité, comptes à l'abri fiscal, gain en capital
 * - Trésorerie par entité: cashflow net avec dividendes inter-entités
 * - Sommaire au décès: disposition réputée, REER en revenu, assurance capital-décès
 */

import { DEFAULT_TAX_RATES, calcDividendTax, ASSET_TYPES } from './investmentPlanningService';
import {
  growAssetsWithTax,
  computeDeathTaxSummary,
  computeYearTaxSnapshot,
  deductInsurancePremiumsFromLiquidAccounts,
  calcSaleTaxFromAsset,
  ensureAssetAcb,
  rawAnnualPremiumForAssurance,
  NON_TAXABLE_AT_DEATH_TYPES,
  getResolvedShareholders,
  getCorpTaxState,
  distributeCorporateDividends,
  runAutoDividendPolicy,
  accrueCorporateTaxAccounts,
  applyDistributionToEntityCashflows,
  depositToEntityAssets,
  prepareCorporationsForProjection,
  summarizeCorpTaxBalances,
  accrueCdcFromInsuranceDeath,
  resolveInsuranceDeathBenefit,
  normalizeDividendPolicy,
  processPlannedCorpToPersonalForCorp,
  mergeCorpPersonalDistributionsIntoRevenueTax,
  refreshTaxSnapshotAfterCorpPersonal,
} from './planningTax';
import {
  computeCollateralCapacity,
  syncPolicyCbr,
  applyPolicyAdvance,
  summarizeInsuranceCollateralYear,
  sumLinkedDebtOnPolicy,
} from './planningTax/insuranceCollateral';
import { INTEREST_DEDUCTION_PURPOSES } from './planningTax/interestDeductibility';
import {
  applyReerWithdrawal,
  applyReerContribution,
  applyCeliWithdrawal,
  applyCeliContribution,
} from './planningTax/eventTax';
import {
  applyRevenueAdjustmentsForYear,
  growRevenuesForYear,
  isPersonalRevenueType,
  isRentalRevenueType,
  sumRevenueMonthly,
} from './planningTax/revenueSchedule';
import { buildAssetDebugSnapshot, syncAssetCatalogFromAssets } from './planningTax/assetDebugSnapshot';
import {
  createAssetCashflowTracker,
  buildPerAssetCashflowImpact,
  computeAnnualEntityCashflowFromImpacts,
  summarizeCashflowByEntityType,
} from './planningTax/assetCashflowImpact';

const DEFAULT_HORIZON_YEARS = 25;


const DEFAULTS = {
  salaryGrowth: 0.02,
  rentGrowth: 0.025,
  investmentReturn: 0.05,
  propertyAppreciation: 0.03,
  inflationRate: 0.02,
};

function calcMonthlyPayment(balance, annualRate, amortYears) {
  if (balance <= 0 || annualRate <= 0 || amortYears <= 0) return 0;
  const semiRate = annualRate / 2;
  const effectiveMonthly = Math.pow(1 + semiRate, 1 / 6) - 1;
  const n = amortYears * 12;
  if (effectiveMonthly === 0) return balance / n;
  return balance * (effectiveMonthly * Math.pow(1 + effectiveMonthly, n)) / (Math.pow(1 + effectiveMonthly, n) - 1);
}

// ─── Fund routing helper ──────────────────────────────────────────────

function routeFunds(assets, amount, eventDetails, event, defaultEntityId) {
  if (amount <= 0) return;
  const d = eventDetails || {};
  const destId = d.fundDestinationId;

  // Route to an existing asset
  if (destId && destId !== '__new__') {
    const existing = assets.find(a => a.id === destId);
    if (existing) {
      existing.currentBalance = (parseFloat(existing.currentBalance) || 0) + amount;
      return;
    }
  }

  // Create a new account (explicit or default)
  const accountName = d.newAccountName || `Fonds - ${event.name}`;
  const accountType = d.newAccountType || 'non_enregistre';
  const defaultReturnPct = DEFAULTS.investmentReturn * 100;
  const explicitReturn = parseFloat(d.fundExpectedReturn);
  const avgReturn = Number.isFinite(explicitReturn) ? explicitReturn : defaultReturnPct;
  assets.push({
    id: `fund-${event.id}-${Date.now()}`,
    name: accountName,
    type: accountType,
    currentBalance: amount,
    monthlyContribution: 0,
    avgAnnualReturn: avgReturn,
    entityId: d.entityId || defaultEntityId,
  });
}

// ─── Achat: mise de fonds (multi-sources) ─────────────────────────────

function migrateLegacyDownPaymentSources(d, downPayment) {
  const src = d.downPaymentSource || 'liquidites';
  const uid = () => `leg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

  if (src === 'liquidites') {
    return [{
      id: uid(),
      type: 'liquidites',
      amount: String(Math.round(downPayment)),
      liquidSourceId: d.liquidSourceId || '',
    }];
  }
  if (src === 'refinancement') {
    return [{
      id: uid(),
      type: 'refinancement',
      amount: String(Math.round(downPayment)),
      refiAssetId: d.refiAssetId,
      refiDebtId: d.refiDebtId,
      refiPropertyValue: d.refiPropertyValue,
      refiNewLTV: d.refiNewLTV,
      refiNewRate: d.refiNewRate,
      refiNewAmortization: d.refiNewAmortization,
    }];
  }
  if (src === 'collateral_bancaire') {
    return [{
      id: uid(),
      type: 'collateral_bancaire',
      amount: String(Math.round(downPayment)),
      collateralAssetId: d.collateralAssetId,
      collateralInterestRate: d.collateralInterestRate,
      collateralAmortization: d.collateralAmortization,
    }];
  }
  if (src === 'mixte_collateral') {
    const liq = parseFloat(d.collateralLiquidPortion) || 0;
    const coll = Math.max(0, downPayment - liq);
    return [
      {
        id: uid(),
        type: 'collateral_bancaire',
        amount: String(Math.round(coll)),
        collateralAssetId: d.collateralAssetId,
        collateralInterestRate: d.collateralInterestRate,
        collateralAmortization: d.collateralAmortization,
      },
      {
        id: uid(),
        type: 'liquidites',
        amount: String(Math.round(liq)),
        liquidSourceId: d.liquidSourceId || '',
      },
    ];
  }
  if (src === 'mixte') {
    const liq = parseFloat(d.liquidPortion) || 0;
    const refiPart = Math.max(0, downPayment - liq);
    return [
      {
        id: uid(),
        type: 'refinancement',
        amount: String(Math.round(refiPart)),
        refiAssetId: d.refiAssetId,
        refiDebtId: d.refiDebtId,
        refiPropertyValue: d.refiPropertyValue,
        refiNewLTV: d.refiNewLTV,
        refiNewRate: d.refiNewRate,
        refiNewAmortization: d.refiNewAmortization,
      },
      {
        id: uid(),
        type: 'liquidites',
        amount: String(Math.round(liq)),
        liquidSourceId: d.liquidSourceId || '',
      },
    ];
  }
  return [{ id: uid(), type: 'liquidites', amount: String(Math.round(downPayment)), liquidSourceId: d.liquidSourceId || '' }];
}

/** Exported for UI: legacy → rows, or passthrough */
export function getAchatDownPaymentSources(d, downPayment) {
  if (Array.isArray(d.downPaymentSources) && d.downPaymentSources.length > 0) {
    return d.downPaymentSources;
  }
  return migrateLegacyDownPaymentSources(d, downPayment);
}

function resolveAmountForSource(sources, sourceIndex, downPayment) {
  if (!sources[sourceIndex]) return 0;
  if (sources.length === 1) {
    const v = parseFloat(sources[0].amount);
    if (Number.isFinite(v) && v > 0) return v;
    return downPayment;
  }
  const v = parseFloat(sources[sourceIndex].amount);
  return Number.isFinite(v) && v >= 0 ? v : 0;
}

function computeAchatLiquidCashInvestment(d, downPayment) {
  const sources = getAchatDownPaymentSources(d, downPayment);
  let sum = 0;
  for (let i = 0; i < sources.length; i++) {
    if (sources[i].type === 'liquidites') sum += resolveAmountForSource(sources, i, downPayment);
  }
  return sum;
}

/**
 * Apply down payment funding in order: refinancings → collateral loans → liquidités.
 * Each row has an `amount` (portion of mise de fonds); single row may omit amount → full down payment.
 */
function applyAchatDownPaymentFromSources(d, event, assets, debts) {
  const price = parseFloat(d.purchasePrice) || 0;
  const downPct = (parseFloat(d.downPaymentPercent) || 20) / 100;
  const downPayment = price * downPct;
  const sourcesRaw = getAchatDownPaymentSources(d, downPayment);

  const deductFromLiquidAssets = (amount, preferredLiquidId) => {
    let remaining = Math.max(0, parseFloat(amount) || 0);
    if (remaining <= 0) return 0;

    const prefer = preferredLiquidId !== undefined ? preferredLiquidId : d.liquidSourceId;

    if (prefer) {
      const src = assets.find(a => a.id === prefer && a.type !== 'immobilier');
      if (src) {
        const take = Math.min(parseFloat(src.currentBalance) || 0, remaining);
        src.currentBalance = (parseFloat(src.currentBalance) || 0) - take;
        remaining -= take;
      }
    }

    for (const a of assets) {
      if (a.type !== 'immobilier' && a.id !== prefer && remaining > 0) {
        const take = Math.min(parseFloat(a.currentBalance) || 0, remaining);
        a.currentBalance = (parseFloat(a.currentBalance) || 0) - take;
        remaining -= take;
      }
    }

    return Math.max(0, (parseFloat(amount) || 0) - remaining);
  };

  let remaining = downPayment;
  const refiSources = sourcesRaw.filter(s => s.type === 'refinancement');
  const collateralSources = sourcesRaw.filter(s => s.type === 'collateral_bancaire');
  const liquidSources = sourcesRaw.filter(s => s.type === 'liquidites');
  const processedRefiDebtIds = new Set();

  for (let i = 0; i < refiSources.length; i++) {
    const s = refiSources[i];
    const idx = sourcesRaw.indexOf(s);
    const want = Math.min(resolveAmountForSource(sourcesRaw, idx, downPayment), remaining);
    if (want <= 0) continue;
    if (s.refiDebtId && processedRefiDebtIds.has(s.refiDebtId)) continue;

    const refiDebtIdx = debts.findIndex(db => db.id === s.refiDebtId);
    if (refiDebtIdx === -1) continue;

    const refiPropValue = parseFloat(s.refiPropertyValue) || 0;
    const refiLTV = (parseFloat(s.refiNewLTV) || 80) / 100;
    const refiNewBal = refiPropValue * refiLTV;
    const refiOldBal = debts[refiDebtIdx].currentBalance;
    const refiRate = (parseFloat(s.refiNewRate) || debts[refiDebtIdx].interestRate) / 100;
    const refiAmort = parseFloat(s.refiNewAmortization) || 25;
    debts[refiDebtIdx].currentBalance = refiNewBal;
    debts[refiDebtIdx].interestRate = refiRate * 100;
    debts[refiDebtIdx].monthlyPayment = calcMonthlyPayment(refiNewBal, refiRate, refiAmort);
    debts[refiDebtIdx].amortizationRemaining = refiAmort;
    const cashOut = Math.max(0, refiNewBal - refiOldBal);
    const allocated = Math.min(want, cashOut, remaining);
    remaining -= allocated;
    const surplus = cashOut - allocated;
    if (surplus > 0) {
      assets.push({
        id: `refi-surplus-${event.id}-${s.id || i}`,
        name: `Surplus refi - ${event.name}`,
        type: 'non_enregistre',
        currentBalance: surplus,
        monthlyContribution: 0,
        avgAnnualReturn: 0,
        entityId: d.entityId,
      });
    }
    if (s.refiDebtId) processedRefiDebtIds.add(s.refiDebtId);
  }

  for (let i = 0; i < collateralSources.length; i++) {
    const s = collateralSources[i];
    const idx = sourcesRaw.indexOf(s);
    const want = Math.min(resolveAmountForSource(sourcesRaw, idx, downPayment), remaining);
    if (want <= 0) continue;

    const collateralAsset = assets.find(a => a.id === s.collateralAssetId && a.type === 'assurance_participative');
    const cap = collateralAsset
      ? computeCollateralCapacity(collateralAsset, debts)
      : { availableCapacity: 0 };
    const maxCollateralLoan = cap.availableCapacity;
    const collateralRate = parseFloat(s.collateralInterestRate) || 7.5;
    const collateralAmort = parseFloat(s.collateralAmortization) || 25;
    const collateralLoan = Math.min(want, maxCollateralLoan, remaining);
    if (collateralLoan > 0) {
      debts.push({
        id: `collateral-loan-${event.id}-${s.id || i}`,
        name: `Prêt collatéral - ${d.propertyName || event.name}`,
        type: 'marge_credit',
        currentBalance: collateralLoan,
        interestRate: collateralRate,
        monthlyPayment: calcMonthlyPayment(collateralLoan, collateralRate / 100, collateralAmort),
        amortizationRemaining: collateralAmort,
        entityId: d.entityId,
        linkedAssetId: collateralAsset?.id || null,
        isCollateralLoan: true,
        interestDeductionPurpose: INTEREST_DEDUCTION_PURPOSES.MISE_DE_FONDS_IMMEUBLE,
      });
      remaining -= collateralLoan;
    }
  }

  for (let i = 0; i < liquidSources.length; i++) {
    const s = liquidSources[i];
    const idx = sourcesRaw.indexOf(s);
    const want = Math.min(resolveAmountForSource(sourcesRaw, idx, downPayment), remaining);
    if (want <= 0) continue;
    deductFromLiquidAssets(want, s.liquidSourceId);
    remaining -= want;
  }
}

// ─── Event application ───────────────────────────────────────────────

function applyEvent(assets, debts, revenues, event, entityMap, cashflowDirection, cashflowTracker = null) {
  const d = event.details || {};
  switch (event.type) {
    case 'refinancement': {
      const debtIdx = debts.findIndex(db => db.id === d.debtId);
      if (debtIdx !== -1) {
        const oldBalance = debts[debtIdx].currentBalance;
        const propertyValue = parseFloat(d.propertyValue) || 0;
        const newLTV = (parseFloat(d.newLTV) || 80) / 100;
        const newBalance = propertyValue * newLTV;
        const cashOut = newBalance - oldBalance;
        const newRate = (parseFloat(d.newRate) || debts[debtIdx].interestRate) / 100;
        const amort = parseFloat(d.newAmortization) || debts[debtIdx].amortizationRemaining || 25;
        debts[debtIdx].currentBalance = newBalance;
        debts[debtIdx].interestRate = newRate * 100;
        debts[debtIdx].monthlyPayment = calcMonthlyPayment(newBalance, newRate, amort);
        debts[debtIdx].amortizationRemaining = amort;
        if (cashOut > 0) {
          routeFunds(assets, cashOut, d, event, d.entityId || debts[debtIdx].entityId);
        }
      }
      break;
    }
    case 'achat': {
      const price = parseFloat(d.purchasePrice) || 0;
      const downPct = (parseFloat(d.downPaymentPercent) || 20) / 100;
      const mortgageAmt = price * (1 - downPct);
      const rate = (parseFloat(d.interestRate) || 5) / 100;
      const amort = parseFloat(d.amortization) || 25;
      const monthlyRevenue = parseFloat(d.monthlyRevenue) || 0;
      const monthlyExpenses = parseFloat(d.monthlyExpenses) || 0;

      assets.push({
        id: `event_${event.id}`, name: d.propertyName || event.name,
        type: 'immobilier', currentBalance: price, monthlyContribution: 0,
        avgAnnualReturn: (DEFAULTS.propertyAppreciation * 100), entityId: d.entityId,
        _acb: price, // track original cost base
      });
      debts.push({
        id: `mortgage-${event.id}`, name: `Hypothèque - ${d.propertyName || event.name}`,
        type: 'hypotheque', currentBalance: mortgageAmt, interestRate: rate * 100,
        monthlyPayment: calcMonthlyPayment(mortgageAmt, rate, amort),
        amortizationRemaining: amort, entityId: d.entityId,
        linkedAssetId: `event_${event.id}`,
      });
      if (monthlyRevenue > 0) {
        revenues.push({
          id: `revenue-${event.id}`, name: `Loyers - ${d.propertyName || event.name}`,
          type: 'revenu_immeuble', monthlyAmount: monthlyRevenue - monthlyExpenses, entityId: d.entityId,
          linkedAssetId: `event_${event.id}`,
        });
      }

      applyAchatDownPaymentFromSources(d, event, assets, debts);
      break;
    }
    case 'vente': {
      const salePrice = parseFloat(d.salePrice) || 0;
      const assetIdx = assets.findIndex(a => a.id === d.assetId);
      
      // Remove all debts linked to this asset (mortgage + any linked debt)
      let mortgageBalance = 0;
      const debtIdx = debts.findIndex(db => db.id === d.debtId);
      if (debtIdx !== -1) { mortgageBalance = debts[debtIdx].currentBalance; debts.splice(debtIdx, 1); }
      // Also remove any debt linked by linkedAssetId
      for (let i = debts.length - 1; i >= 0; i--) {
        if (debts[i].linkedAssetId === d.assetId) {
          if (debtIdx === -1 || debts[i].id !== d.debtId) { // Don't double-count
            mortgageBalance += parseFloat(debts[i].currentBalance) || 0;
          }
          debts.splice(i, 1);
        }
      }

      // ACB: use explicit value from form, then asset _acb, then asset balance
      const explicitAcb = parseFloat(d.acb) || 0;
      const assetAcb = assetIdx !== -1 ? (assets[assetIdx]._acb || parseFloat(assets[assetIdx].currentBalance) || 0) : 0;
      const acb = explicitAcb > 0 ? explicitAcb : assetAcb;
      if (assetIdx !== -1) { assets.splice(assetIdx, 1); }

      // Remove ALL revenues linked to this asset (by revenueId, linkedAssetId, or matching entity+type)
      const revIdx = revenues.findIndex(r => r.id === d.revenueId);
      if (revIdx !== -1) revenues.splice(revIdx, 1);
      // Also remove revenues linked by linkedAssetId
      for (let i = revenues.length - 1; i >= 0; i--) {
        if (revenues[i].linkedAssetId === d.assetId) {
          revenues.splice(i, 1);
        }
      }

      const entity = entityMap?.[d.entityId];
      const { tax: capitalGainsTax } = calcSaleTaxFromAsset(salePrice, { _acb: acb, acb }, entity);
      const netProceeds = salePrice - mortgageBalance - capitalGainsTax;
      if (netProceeds > 0) {
        routeFunds(assets, netProceeds, d, event, d.entityId);
      }
      break;
    }
    case 'renovation': {
      const renoCost = parseFloat(d.renovationCost) || 0;
      const valueIncreasePct = (parseFloat(d.valueIncreasePercent) || 0) / 100;
      const revenueIncreasePct = (parseFloat(d.revenueIncreasePercent) || 0) / 100;

      // Apply value increase to the property
      const assetIdx = assets.findIndex(a => a.id === d.assetId);
      if (assetIdx !== -1) {
        assets[assetIdx].currentBalance *= (1 + valueIncreasePct);
        // Update ACB: renovation cost adds to cost base
        assets[assetIdx]._acb = (assets[assetIdx]._acb || assets[assetIdx].currentBalance) + renoCost;
      }

      // Increase linked revenues
      if (revenueIncreasePct > 0) {
        for (const r of revenues) {
          if (r.entityId === d.entityId && r.type === 'revenu_immeuble') {
            r.monthlyAmount = (parseFloat(r.monthlyAmount) || 0) * (1 + revenueIncreasePct);
          }
        }
      }

      // Deduct renovation cost from funding source
      if (d.fundingSource === 'refinancement' && d.renoRefiDebtId) {
        const refiDebtIdx = debts.findIndex(db => db.id === d.renoRefiDebtId);
        if (refiDebtIdx !== -1) {
          const propValue = parseFloat(d.renoRefiPropertyValue) || 0;
          const ltv = (parseFloat(d.renoRefiLTV) || 80) / 100;
          const newBalance = propValue * ltv;
          const rate = (parseFloat(d.renoRefiRate) || debts[refiDebtIdx].interestRate) / 100;
          debts[refiDebtIdx].currentBalance = newBalance;
          debts[refiDebtIdx].interestRate = rate * 100;
          debts[refiDebtIdx].monthlyPayment = calcMonthlyPayment(newBalance, rate, 25);
        }
      } else if (d.fundingSource === 'marge_credit') {
        debts.push({
          id: `reno-loan-${event.id}`,
          name: `Emprunt réno - ${event.name}`,
          type: 'marge_credit',
          currentBalance: renoCost,
          interestRate: 7,
          monthlyPayment: calcMonthlyPayment(renoCost, 0.07, 10),
          amortizationRemaining: 10,
          entityId: d.entityId,
        });
      } else {
        // Liquidités — deduct from specified account or first available
        let remaining = renoCost;
        if (d.fundingAccountId) {
          const srcIdx = assets.findIndex(a => a.id === d.fundingAccountId);
          if (srcIdx !== -1) {
            const take = Math.min(assets[srcIdx].currentBalance, remaining);
            assets[srcIdx].currentBalance -= take;
            remaining -= take;
          }
        }
        if (remaining > 0) {
          for (const a of assets) {
            if (a.type !== 'immobilier' && a.type !== 'assurance_participative' && remaining > 0) {
              const take = Math.min(a.currentBalance, remaining);
              a.currentBalance -= take;
              remaining -= take;
            }
          }
        }
      }
      break;
    }
    case 'produit_financier': {
      assets.push({
        id: `product-${event.id}`, name: d.productName || event.name,
        type: d.productType || 'autre', currentBalance: parseFloat(d.initialAmount) || 0,
        monthlyContribution: parseFloat(d.monthlyContribution) || 0,
        avgAnnualReturn: parseFloat(d.expectedReturn) || 5, entityId: d.entityId,
      });
      break;
    }
    case 'assurance_participative': {
      if (d.insuranceSchedule) {
        const idx = d.insuranceCurrentYearIdx || 0;
        const currentRow = d.insuranceSchedule[idx] || d.insuranceSchedule[0] || {};
        assets.push({
          id: `insurance-${event.id}`, name: d.policyName || event.name,
          type: 'assurance_participative',
          currentBalance: currentRow.surrenderValue || 0,
          monthlyContribution: 0, avgAnnualReturn: 0,
          entityId: d.entityId,
          insuranceSchedule: d.insuranceSchedule,
          insuranceCurrentYearIdx: idx,
          totalInsurance: currentRow.totalInsurance || 0,
          _insuranceIdx: idx,
          _totalInsurance: currentRow.totalInsurance || 0,
          annualPremium: parseFloat(currentRow.premiumPaid) || parseFloat(d.annualPremium) || 0,
          includePremiumsInCashflow: d.includePremiumsInCashflow !== false,
          premiumDebitAssetId: d.premiumDebitAssetId || '',
          collateralLtvPercent: parseFloat(d.collateralLtvPercent) || undefined,
          adjustedCostBase: parseFloat(d.adjustedCostBase) || undefined,
          pfiEnabled: !!d.pfiEnabled,
          pfiBorrower: d.pfiBorrower || 'corporation',
          pfiAdvanceYears: parseInt(d.pfiAdvanceYears, 10) || 10,
          pfiInterestRate: parseFloat(d.pfiInterestRate) || 7.5,
          guaranteeFeePercent: parseFloat(d.guaranteeFeePercent) || 0,
        });
      }
      break;
    }
    case 'plan_financement_immediat': {
      const policy = assets.find((a) => a.id === d.policyAssetId && a.type === 'assurance_participative');
      if (policy) {
        policy.pfiEnabled = true;
        policy.pfiBorrower = d.pfiBorrower || 'corporation';
        policy.pfiAdvanceYears = parseInt(d.pfiAdvanceYears, 10) || 10;
        policy.pfiStopAdvancesAfterYear = d.pfiStopAdvancesAfterYear ? parseInt(d.pfiStopAdvancesAfterYear, 10) : null;
        policy.pfiInterestRate = parseFloat(d.pfiInterestRate) || 7.5;
        policy.guaranteeFeePercent = parseFloat(d.guaranteeFeePercent) || 1.5;
        policy.pfiAnnualAdvanceAmount = parseFloat(d.pfiAnnualAdvanceAmount) || 0;
        if (d.collateralLtvPercent) policy.collateralLtvPercent = parseFloat(d.collateralLtvPercent);
      }
      break;
    }
    case 'avance_sur_police': {
      const policy = assets.find((a) => a.id === d.policyAssetId && a.type === 'assurance_participative');
      if (policy) {
        const { taxableIncome } = applyPolicyAdvance(policy, d.amount);
        event._policyAdvanceTax = taxableIncome;
      }
      break;
    }
    case 'changement_contributions': {
      const list = Array.isArray(d.changes) ? d.changes : [];
      for (const ch of list) {
        const aid = ch?.assetId;
        if (!aid) continue;
        const ai = assets.findIndex(a => a.id === aid);
        if (ai === -1) continue;
        const target = assets[ai];
        if (target.type === 'immobilier' || target.type === 'assurance_participative') continue;
        if (ch.monthlyContribution !== '' && ch.monthlyContribution != null) {
          target.monthlyContribution = parseFloat(ch.monthlyContribution) || 0;
        }
        if (ch.avgAnnualReturn !== '' && ch.avgAnnualReturn != null) {
          target.avgAnnualReturn = parseFloat(ch.avgAnnualReturn) || 0;
        }
      }
      break;
    }
    case 'cotisation_reer': {
      const asset = assets.find((a) => a.id === d.assetId && a.type === 'reer');
      if (asset) applyReerContribution(asset, d.amount);
      break;
    }
    case 'retrait_reer': {
      const asset = assets.find((a) => a.id === d.assetId && a.type === 'reer');
      const entity = entityMap?.[d.entityId || asset?.entityId];
      if (asset) applyReerWithdrawal(asset, d.amount, entity);
      break;
    }
    case 'cotisation_celi': {
      const asset = assets.find((a) => a.id === d.assetId && a.type === 'celi');
      if (asset) applyCeliContribution(asset, d.amount);
      break;
    }
    case 'retrait_celi': {
      const asset = assets.find((a) => a.id === d.assetId && a.type === 'celi');
      if (asset) applyCeliWithdrawal(asset, d.amount);
      break;
    }
    case 'declaration_dividende': {
      const corp = entityMap?.[d.corpEntityId];
      if (!corp || corp.type !== 'corporation') break;
      const shareholders = getResolvedShareholders(corp, Object.values(entityMap || {}));
      if (!shareholders.length) break;
      const corpState = getCorpTaxState(corp);
      const dividendClass = d.dividendClass || 'non_eligible';
      const amount = parseFloat(d.totalAmount) || 0;
      const dist = distributeCorporateDividends({
        corp,
        corpState,
        shareholders,
        amount,
        dividendClass,
        entities: Object.values(entityMap || {}),
        applyTax: d.applyPersonalTax !== false,
      });
      dist.corpEntityId = corp.id;
      for (const sh of dist.byShareholder) {
        depositToEntityAssets(assets, sh.personEntityId, sh.net, cashflowTracker);
      }
      event._dividendDistribution = dist;
      break;
    }
    case 'cashflow_direction': {
      // Pure configuration event: adjusts how future cashflow is routed.
      if (!cashflowDirection) break;
      if (d.routingBySource) {
        cashflowDirection.routingBySource = d.routingBySource;
      } else if (d.allocations) {
        // Backward compatibility with older schema: { holding, allocations }
        const personalEntities = Object.values(entityMap || {}).filter(e => e?.type === 'personnel');
        const primaryPersonal = personalEntities[0];
        if (primaryPersonal) {
          const dividendTaxMode = d.holding === 'personnel' ? 'personnel' : 'corporatif';
          const routingBySource = {};
          for (const [id, ent] of Object.entries(entityMap || {})) {
            routingBySource[id] = {
              dividendTaxMode,
              // map to at least one destination (best-effort)
              destinations: [],
            };
          }
          cashflowDirection.routingBySource = routingBySource;
        }
      }
      break;
    }
    default: break;
  }
}

// ─── Growth functions ────────────────────────────────────────────────

function calcAnnualInterest(debt) {
  if (!debt || debt.currentBalance <= 0) return 0;
  const monthlyRate = ((parseFloat(debt.interestRate) || 0) / 100) / 12;
  let balance = debt.currentBalance;
  let totalInterest = 0;
  const payment = parseFloat(debt.monthlyPayment) || 0;
  for (let m = 0; m < 12; m++) {
    if (balance <= 0) break;
    const interest = balance * monthlyRate;
    totalInterest += interest;
    const principal = Math.min(payment - interest, balance);
    balance = Math.max(0, balance - Math.max(0, principal));
  }
  return totalInterest;
}

function amortizeDebts(debts) {
  for (const d of debts) {
    if (d.currentBalance <= 0) continue;
    const monthlyRate = ((parseFloat(d.interestRate) || 0) / 100) / 12;
    for (let m = 0; m < 12; m++) {
      if (d.currentBalance <= 0) break;
      const interest = d.currentBalance * monthlyRate;
      const principal = Math.min((parseFloat(d.monthlyPayment) || 0) - interest, d.currentBalance);
      d.currentBalance = Math.max(0, d.currentBalance - Math.max(0, principal));
    }
  }
}

function growRevenues(revenues) {
  growRevenuesForYear(revenues);
}

// ─── Treasury / Cashflow per entity ──────────────────────────────────

function applyPersonalNetFromDistribution(desiredByAssetId, distribution, getAssetById, entityById) {
  const netByEntity = {};
  for (const sh of distribution.byShareholder || []) {
    if (sh.personEntityId) {
      netByEntity[sh.personEntityId] = (netByEntity[sh.personEntityId] || 0) + sh.net;
    }
  }
  const byEntity = {};
  for (const [assetId, gross] of Object.entries(desiredByAssetId)) {
    const a = getAssetById(assetId);
    if (!a) continue;
    const ent = entityById[a.entityId];
    if (ent?.type !== 'personnel') continue;
    if (!byEntity[a.entityId]) byEntity[a.entityId] = { ids: [], grossSum: 0 };
    byEntity[a.entityId].ids.push(assetId);
    byEntity[a.entityId].grossSum += gross;
  }
  for (const [eid, group] of Object.entries(byEntity)) {
    const netTotal = netByEntity[eid] ?? group.grossSum;
    for (const assetId of group.ids) {
      const share = group.grossSum > 0 ? (desiredByAssetId[assetId] / group.grossSum) : 0;
      desiredByAssetId[assetId] = netTotal * share;
    }
  }
}

function processCorporateDividendStep(
  entities, entityCashflows, assets, wAssets, wDebts, year, deathScenarioYear, taxSnapshot, revenues = [], cashflowTracker = null, scheduleOptions = {},
) {
  const investmentByEntity = taxSnapshot.investmentIncome?.byEntity || {};
  const revenueByEntity = taxSnapshot.revenueTax?.byEntity || {};
  const allPlannedDistributions = [];

  for (const corp of entities.filter((e) => e.type === 'corporation')) {
    const corpState = getCorpTaxState(corp);
    const policy = normalizeDividendPolicy(corp);
    const passiveGross = investmentByEntity[corp.id]?.passiveGross || 0;
    let cdcCredit = 0;
    if (year === deathScenarioYear) {
      cdcCredit = accrueCdcFromInsuranceDeath(wAssets, wDebts, entities, corp.id, scheduleOptions);
    }
    const rev = revenueByEntity[corp.id] || {};
    const activeGross = Math.max(0, (rev.grossImmeuble || 0) + (rev.grossOther || 0));

    accrueCorporateTaxAccounts({
      corp,
      corpState,
      passiveIncomeGross: passiveGross,
      activeIncomeGross: activeGross,
      gripAccrualPercent: policy.gripAccrualPercent,
      cdcCredit,
    });

    const plannedDists = processPlannedCorpToPersonalForCorp({
      revenues,
      entities,
      corpId: corp.id,
      getCorpState: () => corpState,
    });
    let plannedPaid = 0;
    let plannedImrtdRefunded = 0;
    for (const dist of plannedDists) {
      dist.corpEntityId = corp.id;
      dist.corpTaxSnapshot = { ...corpState };
      applyDistributionToEntityCashflows(entityCashflows, dist, entities);
      for (const sh of dist.byShareholder) {
        depositToEntityAssets(wAssets, sh.personEntityId, sh.net, cashflowTracker);
      }
      plannedPaid += dist.corp?.dividendPaid || dist.grossTotal || 0;
      plannedImrtdRefunded += dist.corp?.imrtdRefunded || 0;
      allPlannedDistributions.push(dist);
    }

    const shareholders = getResolvedShareholders(corp, entities);
    if (!shareholders.length && plannedDists.length === 0) continue;

    let opCf = Math.max(0, entityCashflows[corp.id]?.operatingCashflow || 0);
    opCf = Math.max(0, opCf - plannedPaid + plannedImrtdRefunded);

    const auto = runAutoDividendPolicy({
      corp,
      corpState,
      shareholders,
      operatingCashflow: opCf,
      entities,
      applyTax: true,
    });

    let paid = 0;
    let imrtdRefunded = 0;
    for (const dist of auto.distributions) {
      dist.corpEntityId = corp.id;
      applyDistributionToEntityCashflows(entityCashflows, dist, entities);
      for (const sh of dist.byShareholder) {
        depositToEntityAssets(wAssets, sh.personEntityId, sh.net, cashflowTracker);
      }
      paid += dist.corp?.dividendPaid || 0;
      imrtdRefunded += dist.corp?.imrtdRefunded || 0;
    }

    if (entityCashflows[corp.id]) {
      entityCashflows[corp.id].operatingCashflow = Math.round(opCf - paid + imrtdRefunded);
      entityCashflows[corp.id].corpTaxAccounts = { ...corpState };
    }
  }

  if (allPlannedDistributions.length > 0 && taxSnapshot?.revenueTax) {
    mergeCorpPersonalDistributionsIntoRevenueTax(taxSnapshot.revenueTax, allPlannedDistributions);
    refreshTaxSnapshotAfterCorpPersonal(taxSnapshot, revenues, wDebts);
  }
}

function applyCashflowDirectionAllocation({
  assets, entities, entityCashflows, cashflowDirection, year, cashInvestments, cashflowTracker,
}) {
  const routingBySource = cashflowDirection?.routingBySource || {};
  const entityById = {};
  for (const e of entities) entityById[e.id] = e;

  const sources = Object.keys(routingBySource || {});
  if (sources.length === 0) return { investedAmount: 0 };

  const flows = entityCashflows || {};
  let investedAmountThisYear = 0;

  const getAnnualInsurancePremiumForAsset = (asset) => rawAnnualPremiumForAssurance(asset);

  const getAssetById = (id) => assets.find(a => a.id === id);

  const normalizeDestinations = (destinations) => {
    const safe = (destinations || [])
      .map(d => ({ assetId: d?.assetId || '', percent: parseFloat(d?.percent) || 0 }))
      .filter(d => d.assetId && d.percent > 0);
    const sum = safe.reduce((s, d) => s + d.percent, 0);
    if (sum <= 0) return [];
    return safe.map(d => ({ ...d, percent: (d.percent * 100) / sum }));
  };

  const allocateToAccounts = ({ desiredByAssetId }) => {
    // Cap insurance accounts by their annual premium; redistribute unspent to non-insurance destinations.
    const desired = { ...(desiredByAssetId || {}) };
    const insuranceIds = Object.keys(desired).filter(id => getAssetById(id)?.type === 'assurance_participative');
    const nonInsuranceIds = Object.keys(desired).filter(id => getAssetById(id)?.type !== 'assurance_participative');

    let unspentInsurance = 0;
    for (const id of insuranceIds) {
      const a = getAssetById(id);
      const cap = getAnnualInsurancePremiumForAsset(a);
      const want = Math.max(0, desired[id] || 0);
      const spent = Math.min(want, cap);
      unspentInsurance += Math.max(0, want - spent);
      delete desired[id];
    }

    if (unspentInsurance > 0 && nonInsuranceIds.length > 0) {
      const totalNonIns = nonInsuranceIds.reduce((s, id) => s + (Math.max(0, desired[id] || 0)), 0);
      if (totalNonIns > 0) {
        for (const id of nonInsuranceIds) {
          const base = Math.max(0, desired[id] || 0);
          desired[id] = base + (unspentInsurance * base) / totalNonIns;
        }
      }
    }

    let invested = 0;
    for (const [assetId, amt] of Object.entries(desired)) {
      const a = getAssetById(assetId);
      if (!a) continue;
      const amount = Math.max(0, parseFloat(amt) || 0);
      if (amount <= 0) continue;
      a.currentBalance = (parseFloat(a.currentBalance) || 0) + amount;
      cashflowTracker?.add(assetId, amount);
      invested += amount;
    }
    return invested;
  };

  for (const [sourceId, route] of Object.entries(routingBySource)) {
    const source = entityById[sourceId];
    if (!source) continue;

    // Backward compatibility (old schema): targetEntityId + allocations
    // Best-effort: map allocation types to the first matching account in the target entity.
    if (!route?.destinations && route?.allocations && route?.targetEntityId) {
      const targetEntityId = route.targetEntityId;
      const alloc = route.allocations || {};
      const destinations = [];
      const types = Object.entries(alloc).filter(([, v]) => (parseFloat(v) || 0) > 0);
      for (const [type, pct] of types) {
        const acc = assets.find(a => a.entityId === targetEntityId && a.type === type);
        if (acc) destinations.push({ assetId: acc.id, percent: parseFloat(pct) || 0 });
      }
      route.destinations = destinations;
    }

    const destinations = normalizeDestinations(route?.destinations || []);
    const dividendTaxMode = route?.dividendTaxMode || 'corporatif';

    const sourceCash = Math.max(0, flows[sourceId]?.operatingCashflow || 0);
    if (sourceCash <= 0) continue;

    if (destinations.length === 0) continue;

    // Build desired amounts per destination (gross)
    const desiredByAssetId = {};
    for (const d of destinations) {
      desiredByAssetId[d.assetId] = sourceCash * (d.percent / 100);
    }

    // If source is corporation and some destinations are personal, apply dividend tax (optional)
    if (source.type === 'corporation') {
      const personalDestIds = Object.keys(desiredByAssetId).filter(id => {
        const a = getAssetById(id);
        const ent = a ? entityById[a.entityId] : null;
        return ent?.type === 'personnel';
      });

      if (personalDestIds.length > 0 && dividendTaxMode === 'corporatif') {
        const grossToPersonal = personalDestIds.reduce((s, id) => s + (desiredByAssetId[id] || 0), 0);
        if (grossToPersonal > 0) {
          const shareholders = getResolvedShareholders(source, entities);
          const corpState = getCorpTaxState(source);
          const dividendClass = route?.dividendClass || 'non_eligible';

          if (shareholders.length > 0) {
            const dist = distributeCorporateDividends({
              corp: source,
              corpState,
              shareholders,
              amount: grossToPersonal,
              dividendClass,
              entities,
              applyTax: true,
            });
            dist.corpEntityId = source.id;
            applyDistributionToEntityCashflows(entityCashflows, dist, entities);
            applyPersonalNetFromDistribution(desiredByAssetId, dist, getAssetById, entityById);
            if (entityCashflows[sourceId]) {
              entityCashflows[sourceId].corpTaxAccounts = { ...corpState };
            }
          } else {
            const firstPersonal = entityById[getAssetById(personalDestIds[0])?.entityId];
            const personalRate = parseFloat(firstPersonal?.marginalTaxRate) || DEFAULT_TAX_RATES.personnel;
            const isEligible = (parseFloat(source.marginalTaxRate) || 0) > 30;
            const divTax = calcDividendTax(grossToPersonal, personalRate, isEligible);
            const netToPersonal = Math.max(0, grossToPersonal - divTax);
            for (const id of personalDestIds) {
              const share = (desiredByAssetId[id] || 0) / grossToPersonal;
              desiredByAssetId[id] = netToPersonal * share;
            }
          }
        }
      }
    }

    investedAmountThisYear += allocateToAccounts({ desiredByAssetId });
  }

  if (cashInvestments && investedAmountThisYear > 0) {
    cashInvestments.push({ year, amount: investedAmountThisYear });
  }

  return { investedAmount: investedAmountThisYear };
}

/** Agrège actifs et passifs liés par type d'actif (pour l'onglet Analyse). */
export function computeAssetTypeBreakdown(assets, debts) {
  const assetsByType = {};
  const debtsByType = {};
  const assetTypeById = {};

  for (const a of assets) {
    const type = a.type || 'autre';
    assetTypeById[a.id] = type;
    assetsByType[type] = (assetsByType[type] || 0) + (parseFloat(a.currentBalance) || 0);
  }

  let unlinkedDebt = 0;
  for (const d of debts) {
    const bal = parseFloat(d.currentBalance) || 0;
    const linkedType = d.linkedAssetId ? assetTypeById[d.linkedAssetId] : null;
    if (linkedType) {
      debtsByType[linkedType] = (debtsByType[linkedType] || 0) + bal;
    } else {
      unlinkedDebt += bal;
    }
  }

  return { assetsByType, debtsByType, unlinkedDebt };
}

export function sortAssetTypes(types) {
  const order = ASSET_TYPES.map((t) => t.value);
  return [...types].sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
}

function routePfiProceeds(assets, policy, amount, cashflowTracker = null) {
  if (amount <= 0) return;
  const target = assets.find(
    (a) => a.entityId === policy.entityId
      && a.type !== 'immobilier'
      && a.type !== 'assurance_participative',
  );
  if (target) {
    target.currentBalance = (parseFloat(target.currentBalance) || 0) + amount;
    cashflowTracker?.add(target.id, amount);
  }
}

/** Avances annuelles PFI sur polices avec pfiEnabled (après VR à jour, avant snapshot). */
function applyAnnualPfiStep(assets, debts, year, yearIndex, cashflowTracker = null) {
  let annualGuaranteeFee = 0;
  let pfiAdvanceThisYear = 0;

  for (const policy of assets) {
    if (policy.type !== 'assurance_participative' || !policy.pfiEnabled) continue;

    syncPolicyCbr(policy, yearIndex);
    const stopYear = parseInt(policy.pfiStopAdvancesAfterYear, 10);
    const maxAdvanceYears = parseInt(policy.pfiAdvanceYears, 10) || 10;
    const mayAdvance = !(Number.isFinite(stopYear) && year >= stopYear) && yearIndex < maxAdvanceYears;

    if (mayAdvance) {
      const cap = computeCollateralCapacity(policy, debts);
      const configured = parseFloat(policy.pfiAnnualAdvanceAmount) || 0;
      const advance = Math.min(
        cap.availableCapacity,
        configured > 0 ? configured : cap.availableCapacity,
      );
      if (advance > 0) {
        const ratePct = parseFloat(policy.pfiInterestRate) || 7.5;
        const rate = ratePct / 100;
        let pfiDebt = debts.find((d) => d.linkedAssetId === policy.id && d.isPfiLoan);
        if (pfiDebt) {
          pfiDebt.currentBalance = (parseFloat(pfiDebt.currentBalance) || 0) + advance;
          pfiDebt.monthlyPayment = ((parseFloat(pfiDebt.currentBalance) || 0) * rate) / 12;
        } else {
          pfiDebt = {
            id: `pfi-loan-${policy.id}`,
            name: `PFI — ${policy.name || 'Police'}`,
            type: 'marge_credit',
            currentBalance: advance,
            interestRate: ratePct,
            monthlyPayment: (advance * rate) / 12,
            amortizationRemaining: 99,
            entityId: policy.entityId,
            linkedAssetId: policy.id,
            isCollateralLoan: true,
            isPfiLoan: true,
            pfiAnnualAdvance: true,
            interestDeductionPurpose: INTEREST_DEDUCTION_PURPOSES.REVENU_PLACEMENT,
          };
          debts.push(pfiDebt);
        }
        pfiAdvanceThisYear += advance;
        routePfiProceeds(assets, policy, advance, cashflowTracker);
      }
    }

    if (policy.pfiBorrower === 'shareholder') {
      const feePct = (parseFloat(policy.guaranteeFeePercent) || 0) / 100;
      annualGuaranteeFee += sumLinkedDebtOnPolicy(debts, policy.id) * feePct;
    }
  }

  return { annualGuaranteeFee, pfiAdvanceThisYear };
}

// ─── Main projection ─────────────────────────────────────────────────

/**
 * @param {object} [options]
 * @param {number} [options.horizonYears] — nombre d’années après l’année courante (0 = année courante seulement)
 * @param {number|null} [options.deathScenarioYear] — année civile pour le sommaire au décès (sinon fin d’horizon)
 */
export function generate25YearProjection(assets, debts, revenues, events = [], entities = [], options = {}) {
  const currentYear = new Date().getFullYear();
  const horizonRaw = parseInt(options.horizonYears, 10);
  const horizonYears = Number.isFinite(horizonRaw)
    ? Math.min(60, Math.max(0, horizonRaw))
    : DEFAULT_HORIZON_YEARS;

  const lastCalendarYear = currentYear + horizonYears;
  let deathScenarioYear = parseInt(options.deathScenarioYear, 10);
  if (!Number.isFinite(deathScenarioYear)) {
    deathScenarioYear = lastCalendarYear;
  }
  deathScenarioYear = Math.min(Math.max(deathScenarioYear, currentYear), lastCalendarYear);

  const results = [];
  const allAssetNames = new Set();
  const allRevenueNames = new Set();
  const allAssetTypes = new Set();

  const entityMap = {};
  for (const e of entities) { entityMap[e.id] = e; }
  prepareCorporationsForProjection(entities);

  let wAssets = JSON.parse(JSON.stringify(assets));
  let wDebts = JSON.parse(JSON.stringify(debts));
  let wRevenues = JSON.parse(JSON.stringify(revenues));

  // Track real cash investments (mise de fonds from treasury, not refinancing)
  const cashInvestments = []; // { year, amount }

  // Cashflow direction configuration (updated by cashflow_direction events)
  const cashflowDirection = {
    routingBySource: {},
  };

  // Track initial non-immobilier assets as initial investment at year 0
  const initialNonImmoAssets = wAssets.filter(a => a.type !== 'immobilier' && a.type !== 'assurance_participative');

  // Initialize ACB / insurance schedule index
  for (const a of wAssets) {
    ensureAssetAcb(a);
    if (a.type) allAssetTypes.add(a.type);
    if (a.type === 'assurance_participative') {
      if (a.insuranceSchedule?.length) {
        a._insuranceIdx = a.insuranceCurrentYearIdx || 0;
        const row = a.insuranceSchedule[a._insuranceIdx] || a.insuranceSchedule[0] || {};
        a.currentBalance = parseFloat(a.currentBalance) || parseFloat(row.surrenderValue) || 0;
        a._totalInsurance = parseFloat(row.totalInsurance) || parseFloat(a.totalInsurance) || 0;
      } else {
        a._totalInsurance = parseFloat(a.totalInsurance) || 0;
      }
    }
  }

  let deathSummary = null;
  const assetCatalogMap = new Map();
  syncAssetCatalogFromAssets(assetCatalogMap, wAssets);

  for (let y = 0; y <= horizonYears; y++) {
    const year = currentYear + y;
    const scheduleContext = { calendarYear: year, projectionYearIndex: y };
    applyRevenueAdjustmentsForYear(wRevenues, year);

    const yearEvents = (events || []).filter(e => parseInt(e.year) === year);
    const yearCashflowTracker = createAssetCashflowTracker();
    let policyAdvanceTaxYear = 0;
    for (const event of yearEvents) {
      // Track cash investments from treasury (not refinancing)
      if (event.type === 'achat') {
        const d = event.details || {};
        const price = parseFloat(d.purchasePrice) || 0;
        const downPct = (parseFloat(d.downPaymentPercent) || 20) / 100;
        const downPayment = price * downPct;
        const liq = computeAchatLiquidCashInvestment(d, downPayment);
        if (liq > 0) cashInvestments.push({ year, amount: liq });
      }
      applyEvent(wAssets, wDebts, wRevenues, event, entityMap, cashflowDirection, yearCashflowTracker);
      policyAdvanceTaxYear += event._policyAdvanceTax || 0;
      delete event._policyAdvanceTax;
    }
    syncAssetCatalogFromAssets(assetCatalogMap, wAssets);
    for (const a of wAssets) {
      a._balanceYearStart = parseFloat(a.currentBalance) || 0;
    }

    // Asset breakdown
    const assetBreakdown = {};
    for (const a of wAssets) {
      const name = a.name || `Actif ${a.id}`;
      allAssetNames.add(name);
      assetBreakdown[name] = Math.round(parseFloat(a.currentBalance) || 0);
      if (a.type) allAssetTypes.add(a.type);
    }

    // Revenue breakdown (per source)
    const revenueBreakdown = {};
    for (const r of wRevenues) {
      const name = r.name || `Revenu ${r.id}`;
      allRevenueNames.add(name);
      revenueBreakdown[`rev::${name}`] = Math.round((parseFloat(r.monthlyAmount) || 0) * 12);
    }

    let totalAssets = wAssets.reduce((s, a) => s + (parseFloat(a.currentBalance) || 0), 0);
    let totalDebts = wDebts.reduce((s, d) => s + (parseFloat(d.currentBalance) || 0), 0);
    const totalMonthlyRev = wRevenues.reduce((s, r) => s + (parseFloat(r.monthlyAmount) || 0), 0);
    let totalMonthlyDebt = wDebts.reduce((s, d) => s + (parseFloat(d.monthlyPayment) || 0), 0);

    // Per-asset and per-debt projected values (for refinancing UI)
    const assetProjected = {};
    for (const a of wAssets) {
      assetProjected[a.id] = Math.round(parseFloat(a.currentBalance) || 0);
    }
    const debtProjected = {};
    for (const d of wDebts) {
      debtProjected[d.id] = Math.round(parseFloat(d.currentBalance) || 0);
      // Also map by linkedAssetId for easier lookup
      if (d.linkedAssetId) {
        const key = `asset:${d.linkedAssetId}`;
        const curr = debtProjected[key] || 0;
        debtProjected[key] = Math.round(curr + (parseFloat(d.currentBalance) || 0));
      }
    }

    const taxSnapshot = computeYearTaxSnapshot({
      entities,
      assets: wAssets,
      debts: wDebts,
      revenues: wRevenues,
      year,
      projectionYearIndex: y,
    });
    const entityCashflows = taxSnapshot.entityCashflows;

    processCorporateDividendStep(
      entities,
      entityCashflows,
      assets,
      wAssets,
      wDebts,
      year,
      deathScenarioYear,
      taxSnapshot,
      wRevenues,
      yearCashflowTracker,
      scheduleContext,
    );

    const totalAnnualRevGross = taxSnapshot.totalGrossRevenue;
    const totalAnnualRevAfterTax = taxSnapshot.totalRevenueAfterTax;
    const totalMonthlyRevAfterTax = taxSnapshot.monthlyRevenueAfterTax;
    const annualTax = taxSnapshot.totalTax;
    const annualInsurancePremiumsTotal = taxSnapshot.annualInsurancePremiums;

    for (const event of yearEvents) {
      if (event._dividendDistribution) {
        applyDistributionToEntityCashflows(entityCashflows, event._dividendDistribution, entities);
        delete event._dividendDistribution;
      }
    }

    // Primes payées depuis le compte liquide désigné avant répartition du surplus
    deductInsurancePremiumsFromLiquidAccounts(wAssets, yearCashflowTracker, scheduleContext);

    // Apply cashflow direction routing (affects asset balances & net worth)
    applyCashflowDirectionAllocation({
      assets: wAssets,
      entities,
      entityCashflows,
      cashflowDirection,
      year,
      cashInvestments,
      cashflowTracker: yearCashflowTracker,
    });

    const pfiStep = applyAnnualPfiStep(wAssets, wDebts, year, y, yearCashflowTracker);
    const collateralSummary = summarizeInsuranceCollateralYear(
      wAssets.filter((a) => a.type === 'assurance_participative'),
      wDebts,
    );

    // Rebuild asset breakdown/projections after routing cash
    for (const key of Object.keys(assetBreakdown)) delete assetBreakdown[key];
    for (const key of Object.keys(assetProjected)) delete assetProjected[key];
    for (const a of wAssets) {
      const name = a.name || `Actif ${a.id}`;
      allAssetNames.add(name);
      assetBreakdown[name] = Math.round(parseFloat(a.currentBalance) || 0);
      assetProjected[a.id] = Math.round(parseFloat(a.currentBalance) || 0);
      if (a.type) allAssetTypes.add(a.type);
      if (a.type === 'assurance_participative') {
        a._totalInsurance = resolveInsuranceDeathBenefit(a, scheduleContext);
      }
    }
    totalAssets = wAssets.reduce((s, a) => s + (parseFloat(a.currentBalance) || 0), 0);
    totalDebts = wDebts.reduce((s, d) => s + (parseFloat(d.currentBalance) || 0), 0);
    totalMonthlyDebt = wDebts.reduce((s, d) => s + (parseFloat(d.monthlyPayment) || 0), 0);

    // Asset type breakdown for KPIs
    const immobilierTotal = wAssets.filter(a => a.type === 'immobilier').reduce((s, a) => s + (parseFloat(a.currentBalance) || 0), 0);
    const assuranceParticipativeTotal = wAssets
      .filter((a) => a.type === 'assurance_participative')
      .reduce((s, a) => s + (parseFloat(a.currentBalance) || 0), 0);
    const assuranceDeathBenefitTotal = wAssets
      .filter((a) => a.type === 'assurance_participative')
      .reduce((s, a) => s + (parseFloat(a._totalInsurance) || parseFloat(a.totalInsurance) || 0), 0);
    const placementsTotal = wAssets
      .filter((a) => a.type !== 'immobilier' && a.type !== 'assurance_participative')
      .reduce((s, a) => s + (parseFloat(a.currentBalance) || 0), 0);
    // Taxable at sale/succession: immobilier (capital gains), REER (income at death), non-sheltered investments
    // Only CELI and assurance_participative are truly non-taxable at succession
    const taxableAtSaleTotal = wAssets
      .filter((a) => !NON_TAXABLE_AT_DEATH_TYPES.has(a.type))
      .reduce((s, a) => s + (parseFloat(a.currentBalance) || 0), 0);

    const typeBreakdown = computeAssetTypeBreakdown(wAssets, wDebts);
    const typeRowFields = {};
    for (const [type, val] of Object.entries(typeBreakdown.assetsByType)) {
      allAssetTypes.add(type);
      typeRowFields[`typeAsset::${type}`] = Math.round(val);
    }
    for (const [type, val] of Object.entries(typeBreakdown.debtsByType)) {
      allAssetTypes.add(type);
      typeRowFields[`typeDebt::${type}`] = Math.round(val);
    }
    if (typeBreakdown.unlinkedDebt > 0) {
      typeRowFields['typeDebt::unlinked'] = Math.round(typeBreakdown.unlinkedDebt);
    }

    const corpBalances = summarizeCorpTaxBalances(entities);
    let dividendsPaidTotal = 0;
    let dividendTaxPersonal = 0;
    for (const cf of Object.values(entityCashflows || {})) {
      dividendsPaidTotal += cf.dividendPaid || 0;
      dividendTaxPersonal += cf.dividendTax || 0;
    }

    for (const a of wAssets) {
      if (a.type === 'assurance_participative') syncPolicyCbr(a, y);
    }
    const cashflowByAssetId = buildPerAssetCashflowImpact(
      wAssets,
      wDebts,
      entities,
      yearCashflowTracker.toMap(),
      { revenues: wRevenues, revenueTax: taxSnapshot.revenueTax, ...scheduleContext },
    );
    const cashflowByEntityType = summarizeCashflowByEntityType(cashflowByAssetId, wAssets, entities);
    const annualCashflowEntityNet = computeAnnualEntityCashflowFromImpacts(cashflowByEntityType);
    const assetDebugSnapshot = buildAssetDebugSnapshot(wAssets, wDebts, {
      cashflowByAssetId,
      revenues: wRevenues,
      revenueTax: taxSnapshot.revenueTax,
      entities,
      ...scheduleContext,
    });

    results.push({
      year,
      yearIndex: y,
      assetDebugSnapshot,
      cashflowImpactPersonnel: cashflowByEntityType.personnel,
      cashflowImpactCorporation: cashflowByEntityType.corporation,
      cashflowImpactTotal: annualCashflowEntityNet,
      totalAssets: Math.round(totalAssets),
      totalDebts: Math.round(totalDebts),
      netWorth: Math.round(totalAssets - totalDebts),
      annualRevenue: Math.round(totalMonthlyRev * 12),
      annualRevenueGross: Math.round(totalAnnualRevGross),
      annualRevenueAfterTax: Math.round(totalMonthlyRevAfterTax * 12),
      annualTax: Math.round(annualTax + policyAdvanceTaxYear),
      annualDebtPayment: Math.round(totalMonthlyDebt * 12),
      annualCashflow: Math.round(totalAnnualRevGross - totalMonthlyDebt * 12),
      annualInsurancePremiums: Math.round(annualInsurancePremiumsTotal),
      annualCashflowAfterTax: Math.round(annualCashflowEntityNet),
      annualCashflowLegacyFormula: Math.round(
        (totalMonthlyRevAfterTax - totalMonthlyDebt) * 12
        - annualInsurancePremiumsTotal
        - pfiStep.annualGuaranteeFee,
      ),
      annualPolicyAdvanceTax: Math.round(policyAdvanceTaxYear),
      annualGuaranteeFee: Math.round(pfiStep.annualGuaranteeFee),
      pfiAdvanceThisYear: Math.round(pfiStep.pfiAdvanceThisYear),
      collateralLoanBalance: collateralSummary.collateralLoanBalance,
      pfiLoanBalance: collateralSummary.pfiLoanBalance,
      annualCollateralInterest: collateralSummary.annualCollateralInterest,
      collateralCapacityTotal: collateralSummary.collateralCapacityTotal,
      corpCdcBalance: corpBalances.corpCdcBalance,
      corpImrtdBalance: corpBalances.corpImrtdBalance,
      corpGripBalance: corpBalances.corpGripBalance,
      dividendsPaidTotal: Math.round(dividendsPaidTotal),
      dividendTaxPersonal: Math.round(dividendTaxPersonal),
      totalPersonalRevenueMonthly: Math.round(sumRevenueMonthly(wRevenues, isPersonalRevenueType)),
      totalRentalRevenueMonthly: Math.round(sumRevenueMonthly(wRevenues, isRentalRevenueType)),
      events: yearEvents.map(e => e.name || e.type),
      entityCashflows,
      immobilierTotal: Math.round(immobilierTotal),
      assuranceParticipativeTotal: Math.round(assuranceParticipativeTotal),
      assuranceDeathBenefitTotal: Math.round(assuranceDeathBenefitTotal),
      placementsTotal: Math.round(placementsTotal),
      taxableAtSaleTotal: Math.round(taxableAtSaleTotal),
      assetProjected,
      debtProjected,
      ...typeRowFields,
      ...assetBreakdown,
      ...revenueBreakdown,
    });

    if (year === deathScenarioYear) {
      deathSummary = computeDeathTaxSummary(
        JSON.parse(JSON.stringify(wAssets)),
        JSON.parse(JSON.stringify(wDebts)),
        entities,
        scheduleContext,
      );
    }

    if (y < horizonYears) {
      growAssetsWithTax(wAssets, entityMap);
      amortizeDebts(wDebts);
      growRevenuesForYear(wRevenues);
    }
  }

  // Ensure all data points have all asset keys
  const assetNames = Array.from(allAssetNames);
  const revenueNames = Array.from(allRevenueNames);
  const assetTypes = sortAssetTypes(allAssetTypes);
  const hasUnlinkedDebt = results.some((r) => (r['typeDebt::unlinked'] || 0) > 0);

  for (const row of results) {
    for (const name of assetNames) {
      if (!(name in row)) row[name] = 0;
    }
    for (const name of revenueNames) {
      const key = `rev::${name}`;
      if (!(key in row)) row[key] = 0;
    }
    for (const type of assetTypes) {
      if (!(`typeAsset::${type}` in row)) row[`typeAsset::${type}`] = 0;
      if (!(`typeDebt::${type}` in row)) row[`typeDebt::${type}`] = 0;
    }
    if (hasUnlinkedDebt && !('typeDebt::unlinked' in row)) row['typeDebt::unlinked'] = 0;
  }

  if (!deathSummary) {
    deathSummary = computeDeathTaxSummary(wAssets, wDebts, entities);
  }

  const projectedAssetCatalog = Array.from(assetCatalogMap.values()).map((entry) => {
    const inBilan = (assets || []).some((a) => a.id === entry.id);
    return { ...entry, fromPlanningOnly: !inBilan };
  });

  return {
    data: results,
    assetNames,
    revenueNames,
    assetTypes,
    projectedAssetCatalog,
    hasUnlinkedDebt,
    deathSummary,
    cashInvestments,
    horizonYears,
    deathScenarioYear,
  };
}

export default { generate25YearProjection };

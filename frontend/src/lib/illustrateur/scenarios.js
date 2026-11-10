import { clonePlan } from './planIo';
import { formatCad, formatPct, summarizeProjection } from './metrics';
import { generate25YearProjection } from './projectionEngine';
import { newId } from './ids';

export const OPTION_LETTERS = ['A', 'B', 'C'];

export function emptyProposal() {
  return {
    title: 'Proposition',
    baselineLabel: 'Situation actuelle',
    options: [],
  };
}

export function ensureProposal(plan) {
  return plan?.proposal && typeof plan.proposal === 'object'
    ? {
        title: plan.proposal.title || 'Proposition',
        baselineLabel: plan.proposal.baselineLabel || 'Situation actuelle',
        options: Array.isArray(plan.proposal.options) ? plan.proposal.options : [],
      }
    : emptyProposal();
}

function runProjection(planLike) {
  const deathYear =
    planLike.deathScenarioYear != null && planLike.deathScenarioYear !== ''
      ? parseInt(planLike.deathScenarioYear, 10)
      : undefined;
  return generate25YearProjection(
    planLike.assets || [],
    planLike.debts || [],
    planLike.revenues || [],
    planLike.events || [],
    planLike.entities || [],
    {
      horizonYears: planLike.horizonYears ?? 25,
      deathScenarioYear: Number.isFinite(deathYear) ? deathYear : undefined,
    },
  );
}

/** Snapshot the editable plan fields into a scenario option (no nested proposal recursion). */
export function snapshotPlanForOption(plan) {
  const snap = clonePlan(plan);
  delete snap.proposal;
  delete snap.scenarios;
  return snap;
}

export function nextLetter(options = []) {
  const used = new Set(options.map((o) => o.letter));
  return OPTION_LETTERS.find((l) => !used.has(l)) || null;
}

export function createOptionFromPlan(plan, { letter, name, pitch = '', recommended = false } = {}) {
  const resolvedLetter = letter || nextLetter([]) || 'A';
  return {
    id: newId('opt'),
    letter: resolvedLetter,
    name: name || `Option ${resolvedLetter}`,
    pitch:
      pitch ||
      `Cette option illustre une trajectoire patrimoniale alternative (option ${resolvedLetter}).`,
    highlights: [],
    recommended: Boolean(recommended),
    savedAt: new Date().toISOString(),
    plan: snapshotPlanForOption(plan),
  };
}

export function buildOptionSummary(option) {
  try {
    const projection = runProjection(option.plan || {});
    const summary = summarizeProjection(projection);
    return { option, projection, summary, error: null };
  } catch (err) {
    return {
      option,
      projection: { data: [], deathSummary: null },
      summary: summarizeProjection(null),
      error: String(err?.message || err),
    };
  }
}

export function buildProposalBundle(plan) {
  const proposal = ensureProposal(plan);
  const baselinePlan = snapshotPlanForOption(plan);
  let baseline;
  try {
    const projection = runProjection(baselinePlan);
    baseline = {
      label: proposal.baselineLabel,
      plan: baselinePlan,
      projection,
      summary: summarizeProjection(projection),
      error: null,
    };
  } catch (err) {
    baseline = {
      label: proposal.baselineLabel,
      plan: baselinePlan,
      projection: { data: [], deathSummary: null },
      summary: summarizeProjection(null),
      error: String(err?.message || err),
    };
  }

  const options = (proposal.options || [])
    .slice()
    .sort((a, b) => String(a.letter).localeCompare(String(b.letter)))
    .map((opt) => buildOptionSummary(opt));

  return {
    title: proposal.title,
    baseline,
    options,
    hasOptions: options.length > 0,
    canCompare: options.length >= 1,
  };
}

export function buildCompareSeries(bundle) {
  const years = new Set();
  (bundle.baseline.projection?.data || []).forEach((r) => years.add(r.year));
  for (const opt of bundle.options) {
    (opt.projection?.data || []).forEach((r) => years.add(r.year));
  }
  const sortedYears = Array.from(years).sort((a, b) => a - b);
  const baselineByYear = new Map((bundle.baseline.projection?.data || []).map((r) => [r.year, r.netWorth]));

  return sortedYears.map((year) => {
    const point = {
      year,
      baseline: baselineByYear.get(year) ?? null,
    };
    for (const opt of bundle.options) {
      const row = (opt.projection?.data || []).find((r) => r.year === year);
      point[`opt_${opt.option.letter}`] = row?.netWorth ?? null;
    }
    return point;
  });
}

export function buildOptionDeltas(bundle) {
  const base = bundle.baseline.summary;
  return bundle.options.map(({ option, summary }) => ({
    letter: option.letter,
    name: option.name,
    recommended: option.recommended,
    pitch: option.pitch,
    netWorthEnd: summary.netWorthEnd,
    growthCad: summary.growthCad,
    cashflowYear0: summary.cashflowYear0,
    deathNetEstate: summary.deathNetEstate,
    deltaNetWorthEnd: summary.netWorthEnd - (base.netWorthEnd || 0),
    deltaGrowthCad: summary.growthCad - (base.growthCad || 0),
    deltaCashflow: summary.cashflowYear0 - (base.cashflowYear0 || 0),
    deltaDeath:
      summary.deathNetEstate != null && base.deathNetEstate != null
        ? summary.deathNetEstate - base.deathNetEstate
        : null,
  }));
}

export function plainDelta(value) {
  if (value == null || !Number.isFinite(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${formatCad(value)}`;
}

export function optionHeadline(delta) {
  if (!delta) return '';
  const parts = [];
  if (delta.deltaNetWorthEnd) {
    parts.push(`valeur nette horizon ${plainDelta(delta.deltaNetWorthEnd)}`);
  }
  if (delta.deltaCashflow) {
    parts.push(`cashflow ${plainDelta(delta.deltaCashflow)}`);
  }
  return parts.length ? `Écart vs situation actuelle : ${parts.join(' · ')}` : 'Proche de la situation actuelle.';
}

export function autoHighlights(summary, baselineSummary) {
  const items = [];
  items.push(`Valeur nette horizon : ${formatCad(summary.netWorthEnd)}`);
  items.push(`Croissance : ${formatCad(summary.growthCad)} (${formatPct(summary.growthPct)})`);
  items.push(`Cashflow an 0 : ${formatCad(summary.cashflowYear0)}`);
  if (baselineSummary) {
    const dNw = summary.netWorthEnd - (baselineSummary.netWorthEnd || 0);
    if (Math.abs(dNw) >= 1000) items.push(`Écart VN vs actuel : ${plainDelta(dNw)}`);
  }
  if (summary.assuranceDeathEnd > 0) {
    items.push(`Capital décès polices : ${formatCad(summary.assuranceDeathEnd)}`);
  }
  return items.slice(0, 4);
}

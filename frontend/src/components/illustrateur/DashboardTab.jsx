import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  buildAllocationEnd,
  buildAllocationNow,
  buildCashflowSeries,
  buildNetWorthSeries,
  buildSparkline,
  computeCriticalIllnessGap,
  computeDisabilityGap,
  computeLifeNeeds,
  formatCad,
  formatPct,
  summarizeProjection,
} from '../../lib/illustrateur';
import { buildCompareSeriesFromBundle } from '../../lib/illustrateur/planningModules';
import {
  AllocationDonut,
  CashflowChart,
  CompositionArea,
  DASH_COLORS,
  NetWorthChart,
  ScenarioCompareChart,
  Sparkline,
} from './DashboardCharts';
import { SectionCard } from './Field';
import { usePlan } from './PlanContext';

export function DashboardTab({ presentation = false } = {}) {
  const { plan, projection, compareProjection, modulesBundle, setWorkflowStep, setPresentPage } = usePlan();

  const summary = useMemo(() => summarizeProjection(projection), [projection]);
  const hasProposal = modulesBundle?.hasSelections;
  const compareSeries = useMemo(
    () => (hasProposal ? buildCompareSeriesFromBundle(modulesBundle) : []),
    [hasProposal, modulesBundle],
  );
  const selectedSections = useMemo(
    () => (modulesBundle?.sections || []).filter((s) => s.selected),
    [modulesBundle],
  );
  const nwSeries = useMemo(() => {
    const series = buildNetWorthSeries(projection);
    const overlaySrc =
      hasProposal && modulesBundle?.baseline?.projection?.data?.length
        ? modulesBundle.baseline.projection
        : compareProjection;
    if (!overlaySrc?.data?.length) return series;
    const byYear = new Map(overlaySrc.data.map((r) => [r.year, r.netWorth]));
    return series.map((row) => ({ ...row, compareNetWorth: byYear.get(row.year) ?? null }));
  }, [projection, compareProjection, hasProposal, modulesBundle]);
  const nwCompareKey =
    hasProposal || compareProjection ? 'compareNetWorth' : null;
  const cfSeries = useMemo(() => buildCashflowSeries(projection), [projection]);
  const allocSourcePlan = hasProposal ? modulesBundle?.composed?.plan || plan : plan;
  const allocNow = useMemo(() => buildAllocationNow(allocSourcePlan), [allocSourcePlan]);
  const allocEnd = useMemo(() => buildAllocationEnd(projection), [projection]);
  const sparkNw = useMemo(() => buildSparkline(projection, 'netWorth'), [projection]);
  const sparkCf = useMemo(() => buildSparkline(projection, 'annualCashflowAfterTax'), [projection]);

  const compositionKeys = useMemo(() => {
    if (projection?.assetTypes?.length) return projection.assetTypes;
    return (projection?.assetNames || []).slice(0, 6);
  }, [projection]);

  const compositionData = useMemo(() => {
    const labels = projection?.assetTypes?.length
      ? projection.assetTypes.map((t) => ({ key: `typeAsset::${t}`, name: t }))
      : (projection?.assetNames || []).slice(0, 6).map((n) => ({ key: n, name: n }));
    return (projection?.data || []).map((row) => {
      const point = { year: row.year };
      for (const { key, name } of labels) {
        point[name] = row[key] || 0;
      }
      return point;
    });
  }, [projection]);

  const needsSource = modulesBundle?.hasSelections
    ? modulesBundle.composed?.plan?.needs
    : plan.needs;
  const life = useMemo(() => computeLifeNeeds(needsSource || {}), [needsSource]);
  const disability = useMemo(() => computeDisabilityGap(needsSource || {}), [needsSource]);
  const ci = useMemo(() => computeCriticalIllnessGap(needsSource || {}), [needsSource]);
  const growthPositive = summary.growthCad >= 0;

  return (
    <div className="space-y-6">
      {projection?.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Erreur de projection : {projection.error}
        </div>
      )}

      {hasProposal && (
        <div className="rounded-2xl border border-primary/20 bg-white p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                Dashboard chiffré · proposition assemblée
              </p>
              <h2 className="mt-1 font-heading text-2xl text-dark">
                {modulesBundle.title || 'Situation vs proposition'}
              </h2>
              <p className="mt-1 text-sm text-prestige-taupe">
                Baseline du dossier vs assemblage des options sélectionnées par module.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {!presentation && (
                <button
                  type="button"
                  onClick={() => setWorkflowStep('lecture')}
                  className="rounded-full border border-prestige-beige px-3 py-1.5 text-xs font-semibold"
                >
                  Lecture simple
                </button>
              )}
              {presentation && (
                <button
                  type="button"
                  onClick={() => setPresentPage('options')}
                  className="rounded-full border border-prestige-beige px-3 py-1.5 text-xs font-semibold print:hidden"
                >
                  ← Retour lecture simple
                </button>
              )}
            </div>
          </div>
          <div className="mt-5">
            <ScenarioCompareChart data={compareSeries} showComposed height={360} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <p>
              VN actuelle (assemblé) :{' '}
              <span className="font-semibold tabular-nums">{formatCad(modulesBundle.composed.summary.netWorthNow)}</span>
            </p>
            <p>
              VN horizon (assemblé) :{' '}
              <span className="font-semibold tabular-nums">{formatCad(modulesBundle.composed.summary.netWorthEnd)}</span>
            </p>
            <p>
              Δ VN vs baseline :{' '}
              <span className="font-semibold tabular-nums">
                {formatCad(
                  (modulesBundle.composed.summary.netWorthEnd || 0) -
                    (modulesBundle.baseline.summary.netWorthEnd || 0),
                )}
              </span>
            </p>
            <p>
              Modules retenus : <span className="font-semibold">{selectedSections.length}</span>
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedSections.map((sec) => (
              <span
                key={sec.id}
                className="rounded-full border border-prestige-beige bg-[#f8f5f0] px-3 py-1 text-xs font-semibold"
              >
                {sec.short} · {sec.selectedLetter}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DashKpi
          label="Valeur nette"
          value={formatCad(summary.netWorthNow)}
          hint={`→ ${formatCad(summary.netWorthEnd)} à l’horizon`}
          tone="navy"
          spark={<Sparkline data={sparkNw} color={DASH_COLORS.navy} />}
        />
        <DashKpi
          label="Croissance projetée"
          value={formatCad(summary.growthCad)}
          hint={`${formatPct(summary.growthPct)} sur ${summary.years} ans`}
          tone={growthPositive ? 'green' : 'rose'}
          spark={
            <Sparkline data={sparkNw} color={growthPositive ? DASH_COLORS.green : DASH_COLORS.rose} />
          }
        />
        <DashKpi
          label="Cashflow an 0"
          value={formatCad(summary.cashflowYear0)}
          hint={`Fin d’horizon : ${formatCad(summary.cashflowEnd)}`}
          tone="blue"
          spark={<Sparkline data={sparkCf} color={DASH_COLORS.blue} />}
        />
        <DashKpi
          label="Ratio d’endettement"
          value={formatPct(summary.debtRatioNow)}
          hint={`Horizon : ${formatPct(summary.debtRatioEnd)}`}
          tone="amber"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat label="Actifs aujourd’hui" value={formatCad(summary.totalAssetsNow)} />
        <MiniStat label="Passifs aujourd’hui" value={formatCad(summary.totalDebtsNow)} />
        <MiniStat label="Capital décès polices" value={formatCad(summary.assuranceDeathEnd)} />
        <MiniStat
          label="Succession nette illustrée"
          value={summary.deathNetEstate != null ? formatCad(summary.deathNetEstate) : '—'}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionCard
            title={
              hasProposal
                ? 'Trajectoire assemblée vs situation actuelle'
                : 'Trajectoire patrimoniale'
            }
            action={
              !presentation ? (
                <button
                  type="button"
                  className="text-xs font-semibold text-primary"
                  onClick={() => setWorkflowStep('gaps')}
                >
                  Gaps & priorités →
                </button>
              ) : null
            }
          >
            <NetWorthChart data={nwSeries} compareKey={nwCompareKey} height={360} />
            <div className="mt-3 grid gap-2 text-xs text-prestige-taupe sm:grid-cols-3">
              <p>
                PFI fin : <span className="tabular-nums text-dark">{formatCad(summary.pfiLoanEnd)}</span>
              </p>
              <p>
                Collatéral :{' '}
                <span className="tabular-nums text-dark">{formatCad(summary.collateralCapacityEnd)}</span>
              </p>
              <p>
                Dettes fin : <span className="tabular-nums text-dark">{formatCad(summary.totalDebtsEnd)}</span>
              </p>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Répartition actuelle">
          {allocNow.length ? (
            <AllocationDonut data={allocNow} title="Actifs" height={280} />
          ) : (
            <EmptyChart hint="Ajoutez des actifs dans Bilan." onAction={() => setWorkflowStep('bilan')} />
          )}
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Cashflow annuel après impôt">
          <CashflowChart data={cfSeries} height={280} />
        </SectionCard>
        <SectionCard title="Répartition à l’horizon">
          {allocEnd.length ? (
            <AllocationDonut data={allocEnd} title="Horizon" height={280} />
          ) : (
            <EmptyChart hint="La projection alimentera la répartition." />
          )}
        </SectionCard>
      </div>

      <SectionCard title="Composition des actifs dans le temps">
        {compositionKeys.length ? (
          <CompositionArea data={compositionData} keys={compositionKeys} height={300} />
        ) : (
          <EmptyChart hint="Aucun actif à empiler." onAction={() => setWorkflowStep('bilan')} />
        )}
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-3">
        <NeedCard
          title="Assurance vie"
          value={formatCad(life.besoin_recommande || life.r_total)}
          detail="Besoin recommandé (illustratif)"
          onClick={() => setWorkflowStep('besoins')}
        />
        <NeedCard
          title="Invalidité"
          value={formatCad(disability.trou_mensuel)}
          detail="Trou de revenu / mois"
          onClick={() => setWorkflowStep('besoins')}
        />
        <NeedCard
          title="Maladie grave"
          value={formatCad(ci.capital_cible)}
          detail="Capital cible"
          onClick={() => setWorkflowStep('besoins')}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/admin/assurance-vie-actif"
          className="rounded-full border border-prestige-beige bg-white px-4 py-2 text-sm font-semibold hover:border-primary"
        >
          Illustrateur vie / levier
        </Link>
        <button
          type="button"
          onClick={() => setWorkflowStep('evenements')}
          className="rounded-full border border-prestige-beige bg-white px-4 py-2 text-sm font-semibold hover:border-primary"
        >
          Ajuster la planification
        </button>
        <button
          type="button"
          onClick={() => setWorkflowStep('revenus')}
          className="rounded-full border border-prestige-beige bg-white px-4 py-2 text-sm font-semibold hover:border-primary"
        >
          Revenus & cashflow
        </button>
      </div>
    </div>
  );
}

function DashKpi({ label, value, hint, tone = 'navy', spark }) {
  const tones = {
    navy: 'from-[#01233f]/[0.06] to-white',
    blue: 'from-[#064dd9]/[0.06] to-white',
    green: 'from-emerald-600/[0.08] to-white',
    rose: 'from-rose-700/[0.08] to-white',
    amber: 'from-amber-700/[0.08] to-white',
  };
  return (
    <div className={`rounded-2xl border border-prestige-beige bg-gradient-to-br ${tones[tone] || tones.navy} p-4`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-prestige-taupe">{label}</p>
      <p className="mt-2 font-heading text-2xl tabular-nums text-dark md:text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-prestige-taupe">{hint}</p>}
      {spark && <div className="mt-2">{spark}</div>}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-prestige-beige bg-white px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-prestige-taupe">{label}</p>
      <p className="mt-1 font-heading text-lg tabular-nums text-dark">{value}</p>
    </div>
  );
}

function NeedCard({ title, value, detail, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-prestige-beige bg-white p-5 text-left transition hover:border-primary"
    >
      <p className="text-[11px] uppercase tracking-[0.14em] text-prestige-taupe">{title}</p>
      <p className="mt-2 font-heading text-2xl tabular-nums text-dark">{value}</p>
      <p className="mt-1 text-xs text-prestige-taupe">{detail}</p>
    </button>
  );
}

function EmptyChart({ hint, onAction }) {
  return (
    <div className="flex h-[220px] flex-col items-center justify-center gap-2 text-center text-sm text-prestige-taupe">
      <p>{hint}</p>
      {onAction && (
        <button type="button" onClick={onAction} className="font-semibold text-primary">
          Ouvrir
        </button>
      )}
    </div>
  );
}

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
import { buildCompareSeries, buildOptionDeltas, plainDelta } from '../../lib/illustrateur/scenarios';
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
  const { plan, projection, compareProjection, proposalBundle, setTab, setPresentPage } = usePlan();

  const summary = useMemo(() => summarizeProjection(projection), [projection]);
  const hasProposal = proposalBundle?.hasOptions;
  const compareSeries = useMemo(
    () => (hasProposal ? buildCompareSeries(proposalBundle) : []),
    [hasProposal, proposalBundle],
  );
  const optionDeltas = useMemo(
    () => (hasProposal ? buildOptionDeltas(proposalBundle) : []),
    [hasProposal, proposalBundle],
  );
  const nwSeries = useMemo(() => {
    const base = buildNetWorthSeries(projection);
    if (!compareProjection?.data?.length) return base;
    const byYear = new Map(compareProjection.data.map((r) => [r.year, r.netWorth]));
    return base.map((row) => ({ ...row, compareNetWorth: byYear.get(row.year) ?? null }));
  }, [projection, compareProjection]);
  const cfSeries = useMemo(() => buildCashflowSeries(projection), [projection]);
  const allocNow = useMemo(() => buildAllocationNow(plan), [plan]);
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

  const life = useMemo(() => computeLifeNeeds(plan.needs || {}), [plan.needs]);
  const disability = useMemo(() => computeDisabilityGap(plan.needs || {}), [plan.needs]);
  const ci = useMemo(() => computeCriticalIllnessGap(plan.needs || {}), [plan.needs]);
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
                Dashboard chiffré · proposition
              </p>
              <h2 className="mt-1 font-heading text-2xl text-dark">
                {proposalBundle.title || 'Comparaison A-B-C'}
              </h2>
              <p className="mt-1 text-sm text-prestige-taupe">
                Situation actuelle vs options enregistrées — graphiques et écarts.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {!presentation && (
                <button
                  type="button"
                  onClick={() => setTab('options')}
                  className="rounded-full border border-prestige-beige px-3 py-1.5 text-xs font-semibold"
                >
                  Lecture simple A-B-C
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
            <ScenarioCompareChart
              data={compareSeries}
              options={optionDeltas}
              height={360}
            />
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-prestige-beige text-[11px] uppercase tracking-[0.12em] text-prestige-taupe">
                  <th className="py-2 pr-4 font-semibold">Option</th>
                  <th className="py-2 pr-4 font-semibold">VN horizon</th>
                  <th className="py-2 pr-4 font-semibold">Δ VN</th>
                  <th className="py-2 pr-4 font-semibold">Cashflow</th>
                  <th className="py-2 font-semibold">Δ CF</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-prestige-beige/70">
                  <td className="py-2.5 pr-4 font-medium">{proposalBundle.baseline.label}</td>
                  <td className="py-2.5 pr-4 tabular-nums">{formatCad(proposalBundle.baseline.summary.netWorthEnd)}</td>
                  <td className="py-2.5 pr-4 text-prestige-taupe">—</td>
                  <td className="py-2.5 pr-4 tabular-nums">{formatCad(proposalBundle.baseline.summary.cashflowYear0)}</td>
                  <td className="py-2.5 text-prestige-taupe">—</td>
                </tr>
                {optionDeltas.map((d) => (
                  <tr key={d.letter} className="border-b border-prestige-beige/70">
                    <td className="py-2.5 pr-4 font-medium">
                      {d.letter} · {d.name}
                      {d.recommended ? ' ★' : ''}
                    </td>
                    <td className="py-2.5 pr-4 tabular-nums">{formatCad(d.netWorthEnd)}</td>
                    <td className="py-2.5 pr-4 tabular-nums font-semibold">{plainDelta(d.deltaNetWorthEnd)}</td>
                    <td className="py-2.5 pr-4 tabular-nums">{formatCad(d.cashflowYear0)}</td>
                    <td className="py-2.5 tabular-nums font-semibold">{plainDelta(d.deltaCashflow)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            title={hasProposal ? 'Dossier actif (éditeur)' : 'Trajectoire patrimoniale'}
            action={
              !presentation ? (
                <button
                  type="button"
                  className="text-xs font-semibold text-primary"
                  onClick={() => setTab('analyse')}
                >
                  Analyse détaillée →
                </button>
              ) : null
            }
          >
            <NetWorthChart
              data={nwSeries}
              compareKey={compareProjection ? 'compareNetWorth' : null}
              height={360}
            />
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
            <EmptyChart hint="Ajoutez des actifs dans Bilan." onAction={() => setTab('bilan')} />
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
          <EmptyChart hint="Aucun actif à empiler." onAction={() => setTab('bilan')} />
        )}
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-3">
        <NeedCard
          title="Assurance vie"
          value={formatCad(life.besoin_recommande || life.r_total)}
          detail="Besoin recommandé (illustratif)"
          onClick={() => setTab('analyse')}
        />
        <NeedCard
          title="Invalidité"
          value={formatCad(disability.trou_mensuel)}
          detail="Trou de revenu / mois"
          onClick={() => setTab('analyse')}
        />
        <NeedCard
          title="Maladie grave"
          value={formatCad(ci.capital_cible)}
          detail="Capital cible"
          onClick={() => setTab('analyse')}
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
          onClick={() => setTab('plan')}
          className="rounded-full border border-prestige-beige bg-white px-4 py-2 text-sm font-semibold hover:border-primary"
        >
          Ajuster la planification
        </button>
        <button
          type="button"
          onClick={() => setTab('revenus')}
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

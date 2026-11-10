import { useMemo } from 'react';
import {
  buildAllocationNow,
  buildCashflowSeries,
  buildNetWorthSeries,
  formatCad,
  formatPct,
  summarizeProjection,
} from '../../lib/illustrateur';
import {
  AllocationDonut,
  CashflowChart,
  NetWorthChart,
} from './DashboardCharts';
import { usePlan } from './PlanContext';

export function PresentationView() {
  const { plan, projection, setPresentMode } = usePlan();
  const summary = useMemo(() => summarizeProjection(projection), [projection]);
  const nwSeries = useMemo(() => buildNetWorthSeries(projection), [projection]);
  const cfSeries = useMemo(() => buildCashflowSeries(projection), [projection]);
  const allocNow = useMemo(() => buildAllocationNow(plan), [plan]);

  return (
    <div className="min-h-screen bg-[#f0ebe3] text-dark">
      <header className="border-b border-prestige-beige bg-dark text-white">
        <div className="container-max flex items-center justify-between gap-4 px-4 py-8 md:px-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">Illustrateur patrimonial</p>
            <h1 className="mt-2 font-heading text-3xl md:text-4xl">
              {plan.meta?.clientLabel || plan.meta?.name || 'Projection'}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              Illustration éducative — hypothèses non garanties. Conseiller en sécurité financière.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPresentMode(false)}
            className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold print:hidden"
          >
            Quitter présentation
          </button>
        </div>
      </header>

      <div className="container-max space-y-8 px-4 py-10 md:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <PresentKpi label="Valeur nette aujourd’hui" value={formatCad(summary.netWorthNow)} />
          <PresentKpi
            label="Croissance projetée"
            value={formatCad(summary.growthCad)}
            sub={formatPct(summary.growthPct)}
          />
          <PresentKpi label="Cashflow annuel illustré" value={formatCad(summary.cashflowYear0)} />
          <PresentKpi label="Capital décès polices" value={formatCad(summary.assuranceDeathEnd)} />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="rounded-3xl border border-prestige-beige bg-white p-6 md:p-8 xl:col-span-2">
            <h2 className="font-heading text-2xl">Trajectoire patrimoniale</h2>
            <div className="mt-4">
              <NetWorthChart data={nwSeries} height={400} />
            </div>
          </section>
          <section className="rounded-3xl border border-prestige-beige bg-white p-6 md:p-8">
            <h2 className="font-heading text-2xl">Répartition</h2>
            <div className="mt-2">
              <AllocationDonut data={allocNow} title="Actifs" height={320} />
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-prestige-beige bg-white p-6 md:p-8">
          <h2 className="font-heading text-2xl">Cashflow après impôt</h2>
          <div className="mt-4">
            <CashflowChart data={cfSeries} height={300} />
          </div>
        </section>

        {projection?.deathSummary && (
          <section className="rounded-3xl border border-prestige-beige bg-white p-6 md:p-8">
            <h2 className="font-heading text-2xl">Lecture au décès (illustratif)</h2>
            <p className="mt-4 font-heading text-3xl tabular-nums">
              {formatCad(projection.deathSummary.netEstate)}
            </p>
            <p className="mt-2 text-sm text-prestige-taupe">
              Succession nette illustrée après impôts et dettes collatérales — à valider avec fiscaliste et juriste.
            </p>
          </section>
        )}

        <p className="text-center text-xs text-prestige-taupe">
          Ne constitue pas un conseil personnalisé ni une proposition d’assurance. Les rendements et participations
          peuvent varier.
        </p>
      </div>
    </div>
  );
}

function PresentKpi({ label, value, sub }) {
  return (
    <div className="rounded-3xl border border-prestige-beige bg-white px-5 py-6">
      <p className="text-[11px] uppercase tracking-[0.16em] text-prestige-taupe">{label}</p>
      <p className="mt-3 font-heading text-3xl tabular-nums">{value}</p>
      {sub && <p className="mt-1 text-sm text-prestige-taupe">{sub}</p>}
    </div>
  );
}

import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCad, summarizeProjection } from '../../lib/illustrateur';
import { usePlan } from './PlanContext';

export function PresentationView() {
  const { plan, projection, setPresentMode } = usePlan();
  const summary = useMemo(() => summarizeProjection(projection), [projection]);
  const chartData = projection?.data || [];

  return (
    <div className="min-h-screen bg-[#f4f1eb] text-dark">
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
          <PresentKpi label="Valeur nette projetée" value={formatCad(summary.netWorthEnd)} />
          <PresentKpi label="Cashflow annuel illustré" value={formatCad(summary.cashflowYear0)} />
          <PresentKpi
            label="Capital décès polices"
            value={formatCad(summary.assuranceDeathEnd)}
          />
        </div>

        <section className="rounded-3xl border border-prestige-beige bg-white p-6 md:p-8">
          <h2 className="font-heading text-2xl">Trajectoire patrimoniale</h2>
          <div className="mt-6 h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e0d4" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#756b5f' }} />
                <YAxis
                  tickFormatter={(v) =>
                    new Intl.NumberFormat('fr-CA', { notation: 'compact', maximumFractionDigits: 1 }).format(v)
                  }
                  tick={{ fontSize: 12, fill: '#756b5f' }}
                  width={64}
                />
                <Tooltip formatter={(v) => formatCad(v)} />
                <Area
                  type="monotone"
                  dataKey="netWorth"
                  name="Valeur nette"
                  stroke="#064dd9"
                  fill="#064dd9"
                  fillOpacity={0.2}
                  strokeWidth={3}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {projection?.deathSummary && (
          <section className="rounded-3xl border border-prestige-beige bg-white p-6 md:p-8">
            <h2 className="font-heading text-2xl">Lecture au décès (illustratif)</h2>
            <p className="mt-4 text-3xl font-heading tabular-nums">
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

function PresentKpi({ label, value }) {
  return (
    <div className="rounded-3xl border border-prestige-beige bg-white px-5 py-6">
      <p className="text-[11px] uppercase tracking-[0.16em] text-prestige-taupe">{label}</p>
      <p className="mt-3 font-heading text-3xl tabular-nums">{value}</p>
    </div>
  );
}

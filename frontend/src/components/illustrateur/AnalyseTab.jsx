import { useMemo, useState } from 'react';
import {
  buildCashflowSeries,
  buildNetWorthSeries,
  compareScenarios,
  formatCad,
  formatPct,
  summarizeProjection,
} from '../../lib/illustrateur';
import { CashflowChart, NetWorthChart } from './DashboardCharts';
import { SectionCard } from './Field';
import { usePlan } from './PlanContext';

/** Outil avancé hors parcours principal (snapshots mémoire / graphiques détaillés). */
export function AnalyseTab() {
  const {
    plan,
    projection,
    compareProjection,
    comparePlan,
    snapshotAsScenario,
    loadScenario,
    setCompareFromScenario,
    captureCompareBaseline,
    setComparePlan,
  } = usePlan();
  const [scenarioName, setScenarioName] = useState('');
  const summary = useMemo(() => summarizeProjection(projection), [projection]);
  const comparison = useMemo(
    () => (compareProjection ? compareScenarios(projection, compareProjection) : null),
    [projection, compareProjection],
  );

  const nwSeries = useMemo(() => {
    const base = buildNetWorthSeries(projection);
    if (!compareProjection?.data?.length) return base;
    const byYear = new Map(compareProjection.data.map((r) => [r.year, r.netWorth]));
    return base.map((row) => ({ ...row, compareNetWorth: byYear.get(row.year) ?? null }));
  }, [projection, compareProjection]);
  const cfSeries = useMemo(() => buildCashflowSeries(projection), [projection]);

  return (
    <div className="space-y-6">
      {projection?.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Erreur de projection : {projection.error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Valeur nette actuelle" value={formatCad(summary.netWorthNow)} />
        <Kpi label="Valeur nette horizon" value={formatCad(summary.netWorthEnd)} />
        <Kpi label="Croissance" value={`${formatCad(summary.growthCad)} · ${formatPct(summary.growthPct)}`} />
        <Kpi
          label="Succession nette illustrée"
          value={summary.deathNetEstate != null ? formatCad(summary.deathNetEstate) : '—'}
        />
      </div>

      <SectionCard title="Croissance de la valeur nette">
        <NetWorthChart data={nwSeries} compareKey={comparePlan ? 'compareNetWorth' : null} height={360} />
        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
          <p className="tabular-nums">PFI (fin) : {formatCad(summary.pfiLoanEnd)}</p>
          <p className="tabular-nums">Capacité collatérale : {formatCad(summary.collateralCapacityEnd)}</p>
          <p className="tabular-nums">Capital décès polices : {formatCad(summary.assuranceDeathEnd)}</p>
        </div>
      </SectionCard>

      <SectionCard title="Cashflow après impôt">
        <CashflowChart data={cfSeries} height={280} />
      </SectionCard>

      <SectionCard title="Snapshots mémoire (avancé)">
        <p className="mb-3 text-xs text-prestige-taupe">
          Hors parcours principal. Pour les options client, utilisez les modules A-B-C (phase Plan).
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs">
            <span className="text-prestige-taupe">Nom du snapshot</span>
            <input
              className="mt-1 block rounded-lg border border-prestige-beige px-3 py-2 text-sm"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="Statu quo"
            />
          </label>
          <button
            type="button"
            className="rounded-full bg-dark px-4 py-2 text-sm font-semibold text-white"
            onClick={() => {
              snapshotAsScenario(scenarioName || undefined);
              setScenarioName('');
            }}
          >
            Enregistrer snapshot
          </button>
          <button
            type="button"
            className="rounded-full border border-prestige-beige px-4 py-2 text-sm font-semibold"
            onClick={() => captureCompareBaseline()}
          >
            Fixer baseline A
          </button>
          {comparePlan && (
            <button
              type="button"
              className="rounded-full border border-prestige-beige px-4 py-2 text-sm"
              onClick={() => setComparePlan(null)}
            >
              Retirer comparaison
            </button>
          )}
        </div>
        <ul className="mt-4 space-y-2">
          {(plan.scenarios || []).map((scn) => (
            <li
              key={scn.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-prestige-beige px-3 py-2 text-sm"
            >
              <span>
                {scn.name}
                <span className="ml-2 text-xs text-prestige-taupe">
                  {scn.savedAt ? new Date(scn.savedAt).toLocaleString('fr-CA') : ''}
                </span>
              </span>
              <span className="flex gap-2">
                <button type="button" className="text-primary" onClick={() => loadScenario(scn.id)}>
                  Charger
                </button>
                <button type="button" className="text-primary" onClick={() => setCompareFromScenario(scn.id)}>
                  Comparer (B)
                </button>
              </span>
            </li>
          ))}
          {!plan.scenarios?.length && (
            <p className="text-sm text-prestige-taupe">Aucun snapshot dans ce dossier session.</p>
          )}
        </ul>
        {comparison && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Kpi label="Δ valeur nette horizon" value={formatCad(comparison.deltaNetWorthEnd)} />
            <Kpi label="Δ cashflow an 0" value={formatCad(comparison.deltaCashflow0)} />
            <Kpi label="VN scénario B" value={formatCad(comparison.b.netWorthEnd)} />
          </div>
        )}
      </SectionCard>

      {projection?.deathSummary && (
        <SectionCard title="Sommaire au décès (illustration admin)">
          <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <p>Impôt REER : {formatCad(projection.deathSummary.reerTax)}</p>
            <p>Impôt gains : {formatCad(projection.deathSummary.capitalGainsTax)}</p>
            <p>Capital décès : {formatCad(projection.deathSummary.deathBenefit)}</p>
            <p className="font-semibold">Succession nette : {formatCad(projection.deathSummary.netEstate)}</p>
          </div>
          <p className="mt-2 text-xs text-prestige-taupe">
            Réservé à l’outil conseiller. Ne pas exposer comme simulateur public d’impôt au décès.
          </p>
        </SectionCard>
      )}
    </div>
  );
}

function Kpi({ label, value }) {
  return (
    <div className="rounded-2xl border border-prestige-beige bg-white px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.14em] text-prestige-taupe">{label}</p>
      <p className="mt-1 font-heading text-xl tabular-nums text-dark">{value}</p>
    </div>
  );
}

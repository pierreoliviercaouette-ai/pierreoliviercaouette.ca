import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  buildCashflowSeries,
  buildNetWorthSeries,
  compareScenarios,
  computeCriticalIllnessGap,
  computeDisabilityGap,
  computeLifeNeeds,
  formatCad,
  formatPct,
  summarizeProjection,
} from '../../lib/illustrateur';
import { CashflowChart, NetWorthChart } from './DashboardCharts';
import { MoneyInput, SectionCard } from './Field';
import { usePlan } from './PlanContext';

export function AnalyseTab() {
  const {
    plan,
    setPlan,
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

  const life = useMemo(() => computeLifeNeeds(plan.needs || {}), [plan.needs]);
  const disability = useMemo(() => computeDisabilityGap(plan.needs || {}), [plan.needs]);
  const ci = useMemo(() => computeCriticalIllnessGap(plan.needs || {}), [plan.needs]);

  const nwSeries = useMemo(() => {
    const base = buildNetWorthSeries(projection);
    if (!compareProjection?.data?.length) return base;
    const byYear = new Map(compareProjection.data.map((r) => [r.year, r.netWorth]));
    return base.map((row) => ({ ...row, compareNetWorth: byYear.get(row.year) ?? null }));
  }, [projection, compareProjection]);
  const cfSeries = useMemo(() => buildCashflowSeries(projection), [projection]);

  const setNeed = (key, value) => {
    setPlan((p) => ({ ...p, needs: { ...(p.needs || {}), [key]: value } }));
  };

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
        <NetWorthChart
          data={nwSeries}
          compareKey={comparePlan ? 'compareNetWorth' : null}
          height={360}
        />
        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
          <p className="tabular-nums">PFI (fin) : {formatCad(summary.pfiLoanEnd)}</p>
          <p className="tabular-nums">Capacité collatérale : {formatCad(summary.collateralCapacityEnd)}</p>
          <p className="tabular-nums">Capital décès polices : {formatCad(summary.assuranceDeathEnd)}</p>
        </div>
      </SectionCard>

      <SectionCard title="Cashflow après impôt">
        <CashflowChart data={cfSeries} height={280} />
      </SectionCard>

      <SectionCard title="Scénarios A / B">
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
            Enregistrer scénario (mémoire)
          </button>
          <button
            type="button"
            className="rounded-full border border-prestige-beige px-4 py-2 text-sm font-semibold"
            onClick={() => captureCompareBaseline()}
          >
            Fixer baseline A (état actuel)
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
            <p className="text-sm text-prestige-taupe">Aucun scénario sauvegardé dans ce dossier session.</p>
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

      <SectionCard title="Besoins assurance (illustratif)">
        <div className="mb-4 flex flex-wrap gap-3">
          <Link
            to="/admin/assurance-vie-actif"
            className="rounded-full border border-prestige-beige px-4 py-2 text-sm font-semibold text-dark hover:border-primary"
          >
            Ouvrir illustrateur vie / levier
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <MoneyInput label="Hypothèque $" value={plan.needs?.hypotheque} onChange={(v) => setNeed('hypotheque', v)} />
          <MoneyInput label="Revenu net $/mois" value={plan.needs?.revenu_net} onChange={(v) => setNeed('revenu_net', v)} />
          <MoneyInput label="% à remplacer" value={plan.needs?.pct_remplacer} onChange={(v) => setNeed('pct_remplacer', v)} />
          <MoneyInput label="Années remplacement" value={plan.needs?.nb_annees} onChange={(v) => setNeed('nb_annees', v)} />
          <MoneyInput label="AV personnelle $" value={plan.needs?.av_actuelle} onChange={(v) => setNeed('av_actuelle', v)} />
          <MoneyInput label="AV collective $" value={plan.needs?.av_groupe} onChange={(v) => setNeed('av_groupe', v)} />
          <MoneyInput label="Enfants" value={plan.needs?.nb_enfants} onChange={(v) => setNeed('nb_enfants', v)} />
          <MoneyInput
            label="Revenu invalidité $/mois"
            value={plan.needs?.invalidite_revenu}
            onChange={(v) => setNeed('invalidite_revenu', v)}
          />
          <MoneyInput
            label="Cible invalidité %"
            value={plan.needs?.invalidite_remplacement_pct}
            onChange={(v) => setNeed('invalidite_remplacement_pct', v)}
          />
          <MoneyInput
            label="Collective invalidité %"
            value={plan.needs?.invalidite_collective_pct}
            onChange={(v) => setNeed('invalidite_collective_pct', v)}
          />
          <MoneyInput
            label="Cible maladie grave $"
            value={plan.needs?.maladie_grave_cible}
            onChange={(v) => setNeed('maladie_grave_cible', v)}
          />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Kpi label="Besoin vie net" value={formatCad(life.r_total)} />
          <Kpi label="Trou invalidité / mois" value={formatCad(disability.trou_mensuel)} />
          <Kpi label="Capital MG cible" value={formatCad(ci.capital_cible)} />
        </div>
        <p className="mt-3 text-xs text-prestige-taupe">{life.conseil?.replace(/^[^\wÀ-ÿ]+/, '')}</p>
      </SectionCard>

      {projection?.deathSummary && (
        <SectionCard title="Sommaire au décès (illustration admin)">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
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

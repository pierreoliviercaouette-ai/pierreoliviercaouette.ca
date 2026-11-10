import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  compareScenarios,
  computeCriticalIllnessGap,
  computeDisabilityGap,
  computeLifeNeeds,
  formatCad,
  summarizeProjection,
} from '../../lib/illustrateur';
import { MoneyInput, SectionCard } from './Field';
import { usePlan } from './PlanContext';

const CHART_COLORS = ['#064dd9', '#01233f', '#73c4ef', '#756b5f', '#9a3412', '#166534', '#7c3aed'];

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

  const chartData = useMemo(() => {
    const rows = projection?.data || [];
    const assetKeys = (projection?.assetNames || []).slice(0, 8);
    return rows.map((row) => {
      const point = {
        year: row.year,
        netWorth: row.netWorth,
        compareNetWorth: null,
      };
      for (const name of assetKeys) {
        point[name] = row[name] || 0;
      }
      return point;
    });
  }, [projection]);

  const chartWithCompare = useMemo(() => {
    if (!compareProjection?.data?.length) return chartData;
    const byYear = new Map(compareProjection.data.map((r) => [r.year, r.netWorth]));
    return chartData.map((row) => ({
      ...row,
      compareNetWorth: byYear.get(row.year) ?? null,
    }));
  }, [chartData, compareProjection]);

  const stackedKeys = (projection?.assetNames || []).slice(0, 6);

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
        <Kpi label="Cashflow an 0" value={formatCad(summary.cashflowYear0)} />
        <Kpi
          label="Succession nette illustrée"
          value={summary.deathNetEstate != null ? formatCad(summary.deathNetEstate) : '—'}
        />
      </div>

      <SectionCard title="Croissance de la valeur nette">
        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartWithCompare} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e0d4" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#756b5f' }} />
              <YAxis
                tickFormatter={(v) =>
                  new Intl.NumberFormat('fr-CA', { notation: 'compact', maximumFractionDigits: 1 }).format(v)
                }
                tick={{ fontSize: 11, fill: '#756b5f' }}
                width={56}
              />
              <Tooltip
                formatter={(value, name) => [formatCad(value), name]}
                contentStyle={{ borderRadius: 12, borderColor: '#e8e0d4', fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {stackedKeys.map((key, i) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="assets"
                  stroke={CHART_COLORS[i % CHART_COLORS.length]}
                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                  fillOpacity={0.35}
                  isAnimationActive={false}
                />
              ))}
              <Area
                type="monotone"
                dataKey="netWorth"
                name="Valeur nette"
                stroke="#01233f"
                fill="transparent"
                strokeWidth={2.5}
                isAnimationActive={false}
              />
              {comparePlan && (
                <Area
                  type="monotone"
                  dataKey="compareNetWorth"
                  name="Scénario B"
                  stroke="#9a3412"
                  fill="transparent"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  isAnimationActive={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
          <p className="tabular-nums">PFI (fin) : {formatCad(summary.pfiLoanEnd)}</p>
          <p className="tabular-nums">Capacité collatérale : {formatCad(summary.collateralCapacityEnd)}</p>
          <p className="tabular-nums">Capital décès polices : {formatCad(summary.assuranceDeathEnd)}</p>
        </div>
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

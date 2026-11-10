import { useMemo } from 'react';
import {
  computeCriticalIllnessGap,
  computeDisabilityGap,
  computeLifeNeeds,
  formatCad,
} from '../../lib/illustrateur';
import { evaluateDossierReadiness } from '../../lib/illustrateur/workflow';
import { MoneyInput, SectionCard } from './Field';
import { usePlan } from './PlanContext';
import { WorkflowNav } from './WorkflowRail';

export function NeedsStep() {
  const { plan, setPlan } = usePlan();
  const readiness = evaluateDossierReadiness(plan);

  const life = useMemo(() => computeLifeNeeds(plan.needs || {}), [plan.needs]);
  const disability = useMemo(() => computeDisabilityGap(plan.needs || {}), [plan.needs]);
  const ci = useMemo(() => computeCriticalIllnessGap(plan.needs || {}), [plan.needs]);

  const setNeed = (key, value) => {
    setPlan((p) => ({ ...p, needs: { ...(p.needs || {}), [key]: value } }));
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Besoins de protection (illustratif)">
        <p className="mb-4 text-sm text-prestige-taupe">
          Ces entrées alimentent l’analyse automatique des gaps à l’étape suivante. Pas un devis assureur.
        </p>
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
          <MiniKpi label="Besoin vie net" value={formatCad(life.r_total || life.besoin_recommande)} />
          <MiniKpi label="Trou invalidité / mois" value={formatCad(disability.trou_mensuel)} />
          <MiniKpi label="Capital MG cible" value={formatCad(ci.capital_cible)} />
        </div>
      </SectionCard>

      <SectionCard title="Checklist — dossier prêt pour les gaps">
        <ul className="space-y-2">
          {readiness.checks.map((c) => (
            <li key={c.id} className="flex items-center gap-2 text-sm">
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                  c.ok ? 'bg-green-700' : 'bg-amber-600'
                }`}
              >
                {c.ok ? '✓' : '!'}
              </span>
              {c.label}
            </li>
          ))}
        </ul>
        {!readiness.ready && (
          <p className="mt-3 text-xs text-amber-800">
            Complétez les points manquants (profil, bilan/revenus, besoins) avant d’ouvrir l’analyse des gaps.
          </p>
        )}
      </SectionCard>

      <WorkflowNav />
    </div>
  );
}

function MiniKpi({ label, value }) {
  return (
    <div className="rounded-xl border border-prestige-beige bg-[#f8f5f0] px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.12em] text-prestige-taupe">{label}</p>
      <p className="mt-1 font-heading text-lg tabular-nums text-dark">{value}</p>
    </div>
  );
}

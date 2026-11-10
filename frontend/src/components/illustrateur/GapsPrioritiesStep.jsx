import { formatCad } from '../../lib/illustrateur';
import { PLANNING_MODULES } from '../../lib/illustrateur/planningModules';
import { SectionCard } from './Field';
import { usePlan } from './PlanContext';
import { WorkflowNav } from './WorkflowRail';

const SEVERITY_STYLE = {
  high: 'border-red-200 bg-red-50 text-red-900',
  medium: 'border-amber-200 bg-amber-50 text-amber-950',
  low: 'border-prestige-beige bg-white text-dark',
  info: 'border-prestige-beige bg-[#f8f5f0] text-dark/80',
};

export function GapsPrioritiesStep() {
  const { gapsBundle, plan, setPriorities, setWorkflowStep } = usePlan();
  const gaps = gapsBundle?.ordered || [];
  const priorities = plan.priorities || [];

  const togglePriority = (moduleId) => {
    const set = new Set(priorities);
    if (set.has(moduleId)) set.delete(moduleId);
    else if (set.size < 3) set.add(moduleId);
    setPriorities([...set]);
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Gaps automatiques">
        <p className="mb-4 text-sm leading-relaxed text-prestige-taupe">
          Analyse illustrative selon de bonnes pratiques de planification. Servez-vous-en pour prioriser avec le
          client 1 à 3 objectifs principaux — ensuite vous construisez manuellement les options A-B-C.
        </p>
        <div className="space-y-3">
          {gaps.map((gap) => {
            const mod = PLANNING_MODULES.find((m) => m.id === gap.moduleId);
            const selected = priorities.includes(gap.moduleId);
            return (
              <div
                key={gap.id}
                className={`rounded-2xl border p-4 ${SEVERITY_STYLE[gap.severity] || SEVERITY_STYLE.info}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">
                      {mod?.short || gap.moduleId} · {gap.severity}
                    </p>
                    <p className="font-heading text-lg">{gap.title}</p>
                    <p className="mt-1 text-sm opacity-90">{gap.summary}</p>
                    {gap.suggestedFocus && (
                      <p className="mt-2 text-xs font-medium opacity-80">Focus : {gap.suggestedFocus}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-xl tabular-nums">{gap.metricLabel}</p>
                    {gap.hasGap && (
                      <button
                        type="button"
                        onClick={() => togglePriority(gap.moduleId)}
                        className={`mt-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          selected ? 'bg-dark text-white' : 'border border-current/30 bg-white/70'
                        }`}
                      >
                        {selected ? 'Priorité RDV ✓' : 'Prioriser (max 3)'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {!gaps.length && (
            <p className="text-sm text-prestige-taupe">Aucun gap calculé — enrichissez le dossier.</p>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Priorités retenues avec le client">
        {priorities.length === 0 ? (
          <p className="text-sm text-prestige-taupe">
            Aucune priorité cochée. Sélectionnez jusqu’à 3 facettes ci-dessus pour guider la construction des options.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {priorities.map((id, i) => {
              const mod = PLANNING_MODULES.find((m) => m.id === id);
              return (
                <span
                  key={id}
                  className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-semibold"
                >
                  {i + 1}. {mod?.label || id}
                </span>
              );
            })}
          </div>
        )}
        <button
          type="button"
          onClick={() => setWorkflowStep('modules')}
          className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Construire les options A-B-C →
        </button>
      </SectionCard>

      <WorkflowNav />
    </div>
  );
}

export function GapMetricBanner({ moduleId }) {
  const { gapsBundle } = usePlan();
  const gap = (gapsBundle?.ordered || []).find((g) => g.moduleId === moduleId && g.hasGap);
  if (!gap) return null;
  return (
    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="font-semibold">{gap.title}</p>
      <p className="mt-0.5">
        {gap.summary}
        {gap.metric ? ` · ${typeof gap.metric === 'number' ? formatCad(gap.metric) : gap.metricLabel}` : ''}
      </p>
    </div>
  );
}

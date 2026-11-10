import {
  WORKFLOW_PHASES,
  WORKFLOW_STEPS,
  evaluateDossierReadiness,
  getStepMeta,
} from '../../lib/illustrateur/workflow';
import { usePlan } from './PlanContext';

export function WorkflowRail() {
  const { plan, workflowStep, setWorkflowStep, gapsBundle } = usePlan();
  const current = getStepMeta(workflowStep);
  const readiness = evaluateDossierReadiness(plan);
  const priorityCount = (plan.priorities || []).length;
  const openGaps = (gapsBundle?.ordered || []).filter((g) => g.hasGap).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {WORKFLOW_PHASES.map((phase) => {
          const active = current.phase === phase.id;
          const done = current.phase > phase.id;
          return (
            <button
              key={phase.id}
              type="button"
              onClick={() => {
                const first = WORKFLOW_STEPS.find((s) => s.phase === phase.id);
                if (!first) return;
                if (phase.id >= 2 && !readiness.ready) {
                  setWorkflowStep('besoins');
                  return;
                }
                setWorkflowStep(first.id);
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active
                  ? 'bg-dark text-white'
                  : done
                    ? 'border border-primary/30 bg-primary/10 text-dark'
                    : 'border border-prestige-beige bg-white text-dark/70'
              }`}
            >
              {phase.short}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setWorkflowStep('hub')}
          className={`rounded-full px-3 py-2 text-xs font-semibold ${
            workflowStep === 'hub'
              ? 'bg-dark text-white'
              : 'border border-prestige-beige bg-white text-dark/70'
          }`}
        >
          Accueil
        </button>
      </div>

      {current.phase > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {WORKFLOW_STEPS.filter((s) => s.phase === current.phase).map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setWorkflowStep(step.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                workflowStep === step.id
                  ? 'bg-primary text-white'
                  : 'bg-white/80 text-dark/75 hover:bg-white'
              }`}
            >
              {step.short}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3 text-[11px] text-prestige-taupe">
        <span>
          Dossier :{' '}
          <span className={readiness.ready ? 'font-semibold text-green-800' : 'font-semibold text-amber-800'}>
            {readiness.ready ? 'prêt' : 'incomplet'}
          </span>
        </span>
        {current.phase >= 2 && (
          <>
            <span>· Gaps ouverts : {openGaps}</span>
            <span>· Priorités RDV : {priorityCount}/3</span>
          </>
        )}
      </div>
    </div>
  );
}

export function WorkflowNav({ onBeforeNext } = {}) {
  const { workflowStep, goWorkflowPrev, goWorkflowNext, canAdvanceFromStep } = usePlan();
  const meta = getStepMeta(workflowStep);
  if (workflowStep === 'hub') return null;

  const idx = WORKFLOW_STEPS.findIndex((s) => s.id === workflowStep);
  const isFirst = idx <= 1;
  const isLast = workflowStep === 'dashboard';
  const blocked = !canAdvanceFromStep(workflowStep);

  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-prestige-beige pt-5">
      <button
        type="button"
        disabled={isFirst}
        onClick={goWorkflowPrev}
        className="rounded-full border border-prestige-beige bg-white px-4 py-2 text-sm font-semibold disabled:opacity-40"
      >
        ← Retour
      </button>
      <p className="text-xs text-prestige-taupe">
        Phase {meta.phase || '—'} · {meta.label}
      </p>
      {!isLast && (
        <button
          type="button"
          disabled={blocked}
          onClick={() => {
            if (onBeforeNext && !onBeforeNext()) return;
            goWorkflowNext();
          }}
          className="rounded-full bg-dark px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
          title={blocked ? 'Complétez la checklist du dossier avant de continuer' : undefined}
        >
          Continuer →
        </button>
      )}
    </div>
  );
}

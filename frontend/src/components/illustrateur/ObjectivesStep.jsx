import { useState } from 'react';
import {
  OBJECTIVE_CATEGORIES,
  isObjectiveSelected,
  toggleObjective,
} from '../../lib/illustrateur/objectivesCatalog';
import { newId } from '../../lib/illustrateur';
import { usePlan } from './PlanContext';
import { AddRowButton, CollectCard, StepFooter, StepTitle } from './collectUi';
import { CollectShell } from './CollectShell';

export function ObjectivesStep() {
  const { plan, setPlan, goWorkflowNext, goWorkflowPrev } = usePlan();
  const objectives = plan.objectives || [];
  const [open, setOpen] = useState(() => Object.fromEntries(OBJECTIVE_CATEGORIES.map((c) => [c.id, true])));

  const setObjectives = (next) => setPlan((p) => ({ ...p, objectives: next }));

  return (
    <CollectShell title={<StepTitle>Objectifs</StepTitle>}>
      <p className="mb-4 rounded-lg border border-[#d7dee8] bg-[#eaf2fb] px-3 py-2 text-sm text-[#3d4f66]">
        Les objectifs sélectionnés seront affichés dans le rapport. Cliquez pour les adapter à la situation du
        client.
      </p>
      <div className="space-y-4">
        {OBJECTIVE_CATEGORIES.map((cat) => (
          <CollectCard
            key={cat.id}
            title={
              <button
                type="button"
                className="flex w-full items-center justify-between text-left"
                onClick={() => setOpen((o) => ({ ...o, [cat.id]: !o[cat.id] }))}
              >
                <span className="text-sm font-bold text-[#0b4ea2]">{cat.label}</span>
                <span className="text-[#0b4ea2]">{open[cat.id] ? '▾' : '▸'}</span>
              </button>
            }
          >
            {open[cat.id] && (
              <>
                <div className="grid gap-2 sm:grid-cols-2">
                  {cat.items.map((item) => {
                    const selected = isObjectiveSelected(objectives, cat.id, item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setObjectives(toggleObjective(objectives, cat.id, item.id))}
                        className={`flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm ${
                          selected
                            ? 'border-[#0b4ea2] bg-[#eaf2fb] text-[#0b4ea2]'
                            : 'border-[#d7dee8] bg-white text-[#12263a]'
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
                            selected ? 'border-[#0b4ea2] bg-[#0b4ea2] text-white' : 'border-[#a8b6c7]'
                          }`}
                        >
                          {selected ? '✓' : ''}
                        </span>
                        {item.label}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3">
                  <AddRowButton
                    onClick={() => {
                      const label = window.prompt('Objectif personnalisé');
                      if (!label) return;
                      setObjectives([
                        ...objectives,
                        { categoryId: cat.id, objectiveId: `custom_${newId('obj')}`, customLabel: label },
                      ]);
                    }}
                  >
                    Ajouter un objectif personnalisé
                  </AddRowButton>
                </div>
                {(objectives || [])
                  .filter((o) => o.categoryId === cat.id && o.customLabel)
                  .map((o) => (
                    <button
                      key={o.objectiveId}
                      type="button"
                      className="mt-2 block text-left text-sm text-[#0b4ea2]"
                      onClick={() =>
                        setObjectives(objectives.filter((x) => x.objectiveId !== o.objectiveId))
                      }
                    >
                      ✓ {o.customLabel} (retirer)
                    </button>
                  ))}
              </>
            )}
          </CollectCard>
        ))}
      </div>
      <StepFooter onPrev={goWorkflowPrev} onNext={goWorkflowNext} />
    </CollectShell>
  );
}

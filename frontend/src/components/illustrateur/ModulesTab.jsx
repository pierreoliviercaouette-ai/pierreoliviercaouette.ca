import { useEffect, useMemo, useState } from 'react';
import {
  createModuleOption,
  ensureModules,
  nextLetter,
  OPTION_LETTERS,
  PLANNING_MODULES,
  summarizeOptionCard,
} from '../../lib/illustrateur/planningModules';
import { sortModulesByPriorities } from '../../lib/illustrateur/planningGaps';
import { SectionCard, TextInput } from './Field';
import { GapMetricBanner } from './GapsPrioritiesStep';
import { ModuleOptionFields } from './ModuleOptionFields';
import { usePlan } from './PlanContext';
import { WorkflowNav } from './WorkflowRail';

export function ModulesTab() {
  const {
    plan,
    modulesBundle,
    updateModules,
    upsertModuleOption,
    selectModuleOption,
    removeModuleOption,
    setRecommendedModuleOption,
    setWorkflowStep,
    openProposalPresentation,
  } = usePlan();

  const modules = ensureModules(plan);
  const priorities = useMemo(
    () => (Array.isArray(plan.priorities) ? plan.priorities : []),
    [plan.priorities],
  );
  const orderedModules = useMemo(
    () => sortModulesByPriorities(PLANNING_MODULES, priorities),
    [priorities],
  );

  const [activeModuleId, setActiveModuleId] = useState(
    () => priorities[0] || orderedModules[0]?.id || PLANNING_MODULES[0].id,
  );

  useEffect(() => {
    if (priorities[0] && !activeModuleId) setActiveModuleId(priorities[0]);
  }, [priorities, activeModuleId]);

  const activeMeta = PLANNING_MODULES.find((m) => m.id === activeModuleId);
  const activeOptions = modules.byModule[activeModuleId]?.options || [];
  const selectedLetter = modules.selections[activeModuleId] || null;

  const [draftLetter, setDraftLetter] = useState(nextLetter(activeOptions) || 'A');
  const [draftName, setDraftName] = useState('');
  const [draftPitch, setDraftPitch] = useState('');
  const [draftData, setDraftData] = useState(() => createModuleOption(activeModuleId).data);
  const [editingId, setEditingId] = useState(null);

  const sectionStats = useMemo(() => {
    const byId = new Map((modulesBundle?.sections || []).map((s) => [s.id, s]));
    return orderedModules.map((m) => byId.get(m.id)).filter(Boolean);
  }, [modulesBundle, orderedModules]);

  const switchModule = (id) => {
    setActiveModuleId(id);
    const opts = ensureModules(plan).byModule[id]?.options || [];
    setDraftLetter(nextLetter(opts) || 'A');
    setDraftName('');
    setDraftPitch('');
    setDraftData(createModuleOption(id).data);
    setEditingId(null);
  };

  const startEdit = (option) => {
    setEditingId(option.id);
    setDraftLetter(option.letter);
    setDraftName(option.name || '');
    setDraftPitch(option.pitch || '');
    setDraftData({ ...createModuleOption(activeModuleId).data, ...(option.data || {}) });
  };

  const saveOption = () => {
    upsertModuleOption(activeModuleId, {
      id: editingId || undefined,
      letter: draftLetter,
      name: draftName || undefined,
      pitch: draftPitch || undefined,
      data: draftData,
    });
    setEditingId(null);
    setDraftName('');
    setDraftPitch('');
    setDraftData(createModuleOption(activeModuleId).data);
    const pretend = [
      ...activeOptions.filter((o) => o.letter !== draftLetter),
      { letter: draftLetter },
    ];
    setDraftLetter(nextLetter(pretend) || draftLetter);
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Options A-B-C par facette">
        <p className="mb-4 text-sm leading-relaxed text-prestige-taupe">
          Construisez manuellement les options pour couvrir les priorités retenues avec le client. Les
          facettes prioritaires apparaissent en tête.
        </p>
        {priorities.length > 0 && (
          <p className="mb-3 text-xs font-semibold text-primary">
            Priorités RDV :{' '}
            {priorities
              .map((id) => PLANNING_MODULES.find((m) => m.id === id)?.short || id)
              .join(' · ')}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {sectionStats.map((sec) => {
            const isPrio = priorities.includes(sec.id);
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => switchModule(sec.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  activeModuleId === sec.id
                    ? 'bg-dark text-white'
                    : isPrio
                      ? 'border border-primary/50 bg-primary/10 text-dark'
                      : sec.selected
                        ? 'border border-primary/40 bg-white text-dark'
                        : 'border border-prestige-beige bg-white text-dark/80'
                }`}
              >
                {isPrio ? '★ ' : ''}
                {sec.short}
                {sec.selectedLetter ? ` · ${sec.selectedLetter}` : sec.hasOptions ? ` · ${sec.options.length}` : ''}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setWorkflowStep('lecture')}
            className="rounded-full border border-prestige-beige px-4 py-2 text-sm font-semibold"
          >
            Lecture simple
          </button>
          <button
            type="button"
            onClick={() => setWorkflowStep('dashboard')}
            className="rounded-full border border-prestige-beige px-4 py-2 text-sm font-semibold"
          >
            Dashboard assemblé
          </button>
          {modulesBundle?.hasSelections && (
            <button
              type="button"
              onClick={openProposalPresentation}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              Présenter au client
            </button>
          )}
        </div>
      </SectionCard>

      <SectionCard title={activeMeta?.label || 'Module'}>
        <p className="mb-4 text-sm text-prestige-taupe">{activeMeta?.description}</p>
        <GapMetricBanner moduleId={activeModuleId} />

        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <label className="block text-xs">
            <span className="text-prestige-taupe">Lettre</span>
            <select
              className="mt-1 w-full rounded-lg border border-prestige-beige bg-white px-3 py-2 text-sm"
              value={draftLetter}
              onChange={(e) => setDraftLetter(e.target.value)}
              disabled={Boolean(editingId)}
            >
              {OPTION_LETTERS.map((l) => (
                <option key={l} value={l}>
                  Option {l}
                  {activeOptions.some((o) => o.letter === l && o.id !== editingId) ? ' (remplacer)' : ''}
                </option>
              ))}
            </select>
          </label>
          <TextInput
            label="Nom de l’option"
            value={draftName}
            onChange={setDraftName}
            className="md:col-span-3"
          />
        </div>
        <label className="mb-4 block text-xs">
          <span className="text-prestige-taupe">Pitch client</span>
          <textarea
            className="mt-1 w-full rounded-lg border border-prestige-beige bg-white px-3 py-2 text-sm"
            rows={2}
            value={draftPitch}
            onChange={(e) => setDraftPitch(e.target.value)}
            placeholder="En une ou deux phrases, ce que cette option change pour le client."
          />
        </label>

        <ModuleOptionFields moduleId={activeModuleId} data={draftData} onChange={setDraftData} />

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={saveOption}
            className="rounded-full bg-dark px-4 py-2 text-sm font-semibold text-white"
          >
            {editingId ? 'Mettre à jour l’option' : `Enregistrer option ${draftLetter}`}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setDraftData(createModuleOption(activeModuleId).data);
                setDraftName('');
                setDraftPitch('');
              }}
              className="rounded-full border border-prestige-beige px-4 py-2 text-sm font-semibold"
            >
              Annuler édition
            </button>
          )}
        </div>
      </SectionCard>

      <SectionCard title={`Options ${activeMeta?.short || ''} (${activeOptions.length}/3)`}>
        {!activeOptions.length && (
          <p className="text-sm text-prestige-taupe">Aucune option encore pour ce module.</p>
        )}
        <div className="space-y-3">
          {activeOptions
            .slice()
            .sort((a, b) => String(a.letter).localeCompare(String(b.letter)))
            .map((opt) => {
              const bullets = summarizeOptionCard(activeModuleId, opt);
              const isSelected = selectedLetter === opt.letter;
              return (
                <div
                  key={opt.id}
                  className={`rounded-2xl border p-4 ${
                    isSelected ? 'border-primary bg-primary/[0.04]' : 'border-prestige-beige bg-white'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-prestige-taupe">
                        Option {opt.letter}
                        {opt.recommended ? ' · recommandée' : ''}
                        {isSelected ? ' · sélectionnée' : ''}
                      </p>
                      <p className="font-heading text-lg text-dark">{opt.name}</p>
                      <p className="mt-1 text-sm text-dark/75">{opt.pitch}</p>
                    </div>
                  </div>
                  <ul className="mt-3 grid gap-1 text-xs text-prestige-taupe sm:grid-cols-2">
                    {bullets.map((b) => (
                      <li key={b}>· {b}</li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <button
                      type="button"
                      className="rounded-full border border-prestige-beige px-3 py-1.5 font-semibold"
                      onClick={() => selectModuleOption(activeModuleId, opt.letter)}
                    >
                      Sélectionner pour la proposition
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-prestige-beige px-3 py-1.5 font-semibold"
                      onClick={() => setRecommendedModuleOption(activeModuleId, opt.id)}
                    >
                      Marquer recommandée
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-prestige-beige px-3 py-1.5 font-semibold"
                      onClick={() => startEdit(opt)}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-red-200 px-3 py-1.5 font-semibold text-red-700"
                      onClick={() => removeModuleOption(activeModuleId, opt.id)}
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </SectionCard>

      <SectionCard title="Méta proposition">
        <div className="grid gap-3 md:grid-cols-2">
          <TextInput
            label="Titre"
            value={modules.title}
            onChange={(v) => updateModules((m) => ({ ...m, title: v }))}
          />
          <TextInput
            label="Libellé situation actuelle"
            value={modules.baselineLabel}
            onChange={(v) => updateModules((m) => ({ ...m, baselineLabel: v }))}
          />
        </div>
        <p className="mt-3 text-xs text-prestige-taupe">
          Sélections actives : {modulesBundle?.selectedCount || 0} / {PLANNING_MODULES.length} modules
        </p>
      </SectionCard>

      <WorkflowNav />
    </div>
  );
}

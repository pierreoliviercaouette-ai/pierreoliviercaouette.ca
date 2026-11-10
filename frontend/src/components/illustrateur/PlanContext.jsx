import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  clonePlan,
  clearSessionPlan,
  createDemoPlan,
  createEmptyPlan,
  exportPlanJson,
  generate25YearProjection,
  loadSessionPlan,
  readPlanFile,
  saveSessionPlan,
  touchPlan,
  newId,
  summarizeProjection,
} from '../../lib/illustrateur';
import {
  buildModulesBundle,
  composePlanFromModules,
  createModuleOption,
  ensureModules,
} from '../../lib/illustrateur/planningModules';
import { analyzePlanningGaps } from '../../lib/illustrateur/planningGaps';
import { computeAllAttainments } from '../../lib/illustrateur/attainment';
import { ensureCollectFields } from '../../lib/illustrateur/planDefaults';
import {
  adjacentStep,
  defaultWorkflow,
  ensurePriorities,
  ensureWorkflow,
  getStepMeta,
} from '../../lib/illustrateur/workflow';

const PlanContext = createContext(null);

function runProjection(plan) {
  const deathYear =
    plan.deathScenarioYear != null && plan.deathScenarioYear !== ''
      ? parseInt(plan.deathScenarioYear, 10)
      : undefined;
  return generate25YearProjection(
    plan.assets || [],
    plan.debts || [],
    plan.revenues || [],
    plan.events || [],
    plan.entities || [],
    {
      horizonYears: plan.horizonYears ?? 25,
      deathScenarioYear: Number.isFinite(deathYear) ? deathYear : undefined,
    },
  );
}

function normalizePlan(raw) {
  const collect = ensureCollectFields(raw);
  return {
    ...raw,
    ...collect,
    modules: ensureModules(raw),
    workflow: ensureWorkflow(raw),
    priorities: ensurePriorities(raw),
    nextStepsNotes: raw?.nextStepsNotes || '',
  };
}

export function PlanProvider({ children }) {
  const [plan, setPlanState] = useState(() => {
    const loaded = loadSessionPlan() || createDemoPlan();
    return normalizePlan(loaded);
  });
  const [comparePlan, setComparePlan] = useState(null);
  const [presentMode, setPresentMode] = useState(false);
  const [presentPage, setPresentPage] = useState('ouverture');

  const setPlan = useCallback((updater) => {
    setPlanState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return touchPlan(normalizePlan(next));
    });
  }, []);

  useEffect(() => {
    saveSessionPlan(plan);
  }, [plan]);

  const workflowStep = plan.workflow?.step || 'hub';

  const setWorkflowStep = useCallback(
    (step) => {
      setPlan((prev) => ({
        ...prev,
        workflow: { ...(prev.workflow || defaultWorkflow()), step },
      }));
    },
    [setPlan],
  );

  const goWorkflowNext = useCallback(() => {
    setWorkflowStep(adjacentStep(workflowStep, 1));
  }, [setWorkflowStep, workflowStep]);

  const goWorkflowPrev = useCallback(() => {
    setWorkflowStep(adjacentStep(workflowStep, -1));
  }, [setWorkflowStep, workflowStep]);

  const canAdvanceFromStep = useCallback(() => true, []);

  const attainment = useMemo(() => {
    try {
      return computeAllAttainments(plan);
    } catch (err) {
      console.error('[illustrateur] attainment', err);
      return {};
    }
  }, [plan]);

  const setPriorities = useCallback(
    (priorities) => {
      setPlan((prev) => ({
        ...prev,
        priorities: ensurePriorities({ priorities }),
      }));
    },
    [setPlan],
  );

  const modulesBundle = useMemo(() => {
    try {
      return buildModulesBundle(plan);
    } catch (err) {
      console.error('[illustrateur] modules', err);
      return {
        title: 'Proposition',
        sections: [],
        selectedCount: 0,
        hasSelections: false,
        baseline: { summary: summarizeProjection(null), projection: { data: [] } },
        composed: { summary: summarizeProjection(null), projection: { data: [] }, error: String(err) },
      };
    }
  }, [plan]);

  const baselineProjection = useMemo(() => {
    try {
      return runProjection(plan);
    } catch (err) {
      return { data: [], error: String(err?.message || err) };
    }
  }, [plan]);

  const baselineSummary = useMemo(
    () => summarizeProjection(baselineProjection),
    [baselineProjection],
  );

  const gapsBundle = useMemo(() => {
    try {
      return analyzePlanningGaps(plan, baselineSummary);
    } catch (err) {
      console.error('[illustrateur] gaps', err);
      return { gaps: [], ordered: [] };
    }
  }, [plan, baselineSummary]);

  const composedPlan = useMemo(() => {
    try {
      return modulesBundle.hasSelections ? modulesBundle.composed.plan : plan;
    } catch {
      return plan;
    }
  }, [modulesBundle, plan]);

  const projection = useMemo(() => {
    try {
      if (modulesBundle.hasSelections) return modulesBundle.composed.projection;
      return baselineProjection;
    } catch (err) {
      console.error('[illustrateur] projection', err);
      return { data: [], deathSummary: null, error: String(err?.message || err) };
    }
  }, [baselineProjection, modulesBundle]);

  const compareProjection = useMemo(() => {
    if (!comparePlan) return null;
    try {
      return runProjection(comparePlan);
    } catch (err) {
      console.error('[illustrateur] compare', err);
      return null;
    }
  }, [comparePlan]);

  const updateCollection = useCallback(
    (key, id, updates) => {
      setPlan((prev) => ({
        ...prev,
        [key]: (prev[key] || []).map((item) => (item.id === id ? { ...item, ...updates } : item)),
      }));
    },
    [setPlan],
  );

  const addToCollection = useCallback(
    (key, item) => {
      setPlan((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), { ...item, id: item.id || newId(key.slice(0, 3)) }],
      }));
    },
    [setPlan],
  );

  const removeFromCollection = useCallback(
    (key, id) => {
      setPlan((prev) => ({
        ...prev,
        [key]: (prev[key] || []).filter((item) => item.id !== id),
      }));
    },
    [setPlan],
  );

  const updateModules = useCallback(
    (updater) => {
      setPlan((prev) => {
        const current = ensureModules(prev);
        const next = typeof updater === 'function' ? updater(current) : updater;
        return { ...prev, modules: next };
      });
    },
    [setPlan],
  );

  const upsertModuleOption = useCallback(
    (moduleId, { id, letter, name, pitch, data, recommended }) => {
      updateModules((modules) => {
        const currentOptions = modules.byModule[moduleId]?.options || [];
        const resolvedLetter = letter || 'A';
        let nextOptions;
        if (id) {
          nextOptions = currentOptions.map((o) =>
            o.id === id
              ? {
                  ...o,
                  name: name ?? o.name,
                  pitch: pitch ?? o.pitch,
                  data: data ?? o.data,
                  recommended: recommended ?? o.recommended,
                  savedAt: new Date().toISOString(),
                }
              : o,
          );
        } else {
          const option = createModuleOption(moduleId, {
            letter: resolvedLetter,
            name,
            pitch,
            recommended,
            data,
          });
          nextOptions = [
            ...currentOptions.filter((o) => o.letter !== resolvedLetter),
            option,
          ].sort((a, b) => String(a.letter).localeCompare(String(b.letter)));
        }
        return {
          ...modules,
          byModule: {
            ...modules.byModule,
            [moduleId]: { options: nextOptions },
          },
        };
      });
    },
    [updateModules],
  );

  const selectModuleOption = useCallback(
    (moduleId, letter) => {
      updateModules((modules) => ({
        ...modules,
        selections: {
          ...modules.selections,
          [moduleId]: letter,
        },
      }));
    },
    [updateModules],
  );

  const clearModuleSelection = useCallback(
    (moduleId) => {
      updateModules((modules) => {
        const selections = { ...modules.selections };
        delete selections[moduleId];
        return { ...modules, selections };
      });
    },
    [updateModules],
  );

  const removeModuleOption = useCallback(
    (moduleId, optionId) => {
      updateModules((modules) => {
        const options = (modules.byModule[moduleId]?.options || []).filter((o) => o.id !== optionId);
        const removed = (modules.byModule[moduleId]?.options || []).find((o) => o.id === optionId);
        const selections = { ...modules.selections };
        if (removed && selections[moduleId] === removed.letter) delete selections[moduleId];
        return {
          ...modules,
          selections,
          byModule: {
            ...modules.byModule,
            [moduleId]: { options },
          },
        };
      });
    },
    [updateModules],
  );

  const setRecommendedModuleOption = useCallback(
    (moduleId, optionId) => {
      updateModules((modules) => ({
        ...modules,
        byModule: {
          ...modules.byModule,
          [moduleId]: {
            options: (modules.byModule[moduleId]?.options || []).map((o) => ({
              ...o,
              recommended: o.id === optionId,
            })),
          },
        },
      }));
    },
    [updateModules],
  );

  const openProposalPresentation = useCallback(() => {
    setPresentPage('ouverture');
    setPresentMode(true);
  }, []);

  const resetTo = useCallback(
    (factory, step = 'hub') => {
      setComparePlan(null);
      const next = normalizePlan(factory());
      next.workflow = { step };
      setPlan(next);
    },
    [setPlan],
  );

  const value = useMemo(
    () => ({
      plan,
      setPlan,
      projection,
      baselineProjection,
      baselineSummary,
      composedPlan,
      comparePlan,
      setComparePlan,
      compareProjection,
      modulesBundle,
      gapsBundle,
      attainment,
      workflowStep,
      setWorkflowStep,
      goWorkflowNext,
      goWorkflowPrev,
      canAdvanceFromStep,
      stepMeta: getStepMeta(workflowStep),
      setPriorities,
      // legacy aliases
      tab: workflowStep,
      setTab: setWorkflowStep,
      presentMode,
      setPresentMode,
      presentPage,
      setPresentPage,
      updateCollection,
      addToCollection,
      removeFromCollection,
      updateModules,
      upsertModuleOption,
      selectModuleOption,
      clearModuleSelection,
      removeModuleOption,
      setRecommendedModuleOption,
      openProposalPresentation,
      proposalBundle: modulesBundle,
      loadDemo: () => resetTo(createDemoPlan, 'hub'),
      loadEmpty: () => resetTo(createEmptyPlan, 'personnelles'),
      clearSession: () => {
        clearSessionPlan();
        resetTo(createEmptyPlan, 'hub');
      },
      exportJson: () => exportPlanJson(plan),
      importFile: async (file) => {
        const imported = await readPlanFile(file);
        setComparePlan(null);
        setPlan(normalizePlan(imported));
      },
      snapshotAsScenario: (name) => {
        const snap = clonePlan(plan);
        setPlan((prev) => ({
          ...prev,
          scenarios: [
            ...(prev.scenarios || []),
            {
              id: newId('scn'),
              name: name || `Scénario ${(prev.scenarios || []).length + 1}`,
              savedAt: new Date().toISOString(),
              plan: snap,
            },
          ],
        }));
      },
      loadScenario: (scenarioId) => {
        const scn = (plan.scenarios || []).find((s) => s.id === scenarioId);
        if (!scn?.plan) return;
        const restored = clonePlan(scn.plan);
        setPlan({
          ...normalizePlan(restored),
          scenarios: plan.scenarios,
        });
      },
      setCompareFromScenario: (scenarioId) => {
        const scn = (plan.scenarios || []).find((s) => s.id === scenarioId);
        if (!scn?.plan) return;
        setComparePlan(clonePlan(scn.plan));
      },
      captureCompareBaseline: () => setComparePlan(clonePlan(composePlanFromModules(plan))),
    }),
    [
      plan,
      setPlan,
      projection,
      baselineProjection,
      baselineSummary,
      composedPlan,
      comparePlan,
      compareProjection,
      modulesBundle,
      gapsBundle,
      attainment,
      workflowStep,
      setWorkflowStep,
      goWorkflowNext,
      goWorkflowPrev,
      canAdvanceFromStep,
      setPriorities,
      presentMode,
      presentPage,
      updateCollection,
      addToCollection,
      removeFromCollection,
      updateModules,
      upsertModuleOption,
      selectModuleOption,
      clearModuleSelection,
      removeModuleOption,
      setRecommendedModuleOption,
      openProposalPresentation,
      resetTo,
    ],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within PlanProvider');
  return ctx;
}

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
} from '../../lib/illustrateur';
import {
  buildModulesBundle,
  composePlanFromModules,
  createModuleOption,
  ensureModules,
} from '../../lib/illustrateur/planningModules';
import { summarizeProjection } from '../../lib/illustrateur/metrics';

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

export function PlanProvider({ children }) {
  const [plan, setPlanState] = useState(() => {
    const loaded = loadSessionPlan() || createDemoPlan();
    return {
      ...loaded,
      modules: ensureModules(loaded),
    };
  });
  const [comparePlan, setComparePlan] = useState(null);
  const [tab, setTab] = useState('dashboard');
  const [presentMode, setPresentMode] = useState(false);
  const [presentPage, setPresentPage] = useState('options');

  const setPlan = useCallback((updater) => {
    setPlanState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return touchPlan({
        ...next,
        modules: ensureModules(next),
      });
    });
  }, []);

  useEffect(() => {
    saveSessionPlan(plan);
  }, [plan]);

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
      return runProjection(plan);
    } catch (err) {
      console.error('[illustrateur] projection', err);
      return { data: [], deathSummary: null, error: String(err?.message || err) };
    }
  }, [plan, modulesBundle]);

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
    setPresentPage('options');
    setPresentMode(true);
  }, []);

  const value = useMemo(
    () => ({
      plan,
      setPlan,
      projection,
      composedPlan,
      comparePlan,
      setComparePlan,
      compareProjection,
      modulesBundle,
      tab,
      setTab,
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
      // legacy aliases kept briefly for AnalyseTab remnants
      proposalBundle: modulesBundle,
      loadDemo: () => {
        setComparePlan(null);
        setPlan(createDemoPlan());
        setTab('dashboard');
      },
      loadEmpty: () => {
        setComparePlan(null);
        setPlan(createEmptyPlan());
        setTab('dashboard');
      },
      clearSession: () => {
        clearSessionPlan();
        setComparePlan(null);
        setPlan(createEmptyPlan());
        setTab('dashboard');
      },
      exportJson: () => exportPlanJson(plan),
      importFile: async (file) => {
        const imported = await readPlanFile(file);
        setComparePlan(null);
        setPlan({ ...imported, modules: ensureModules(imported) });
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
          ...restored,
          scenarios: plan.scenarios,
          modules: ensureModules(restored),
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
      composedPlan,
      comparePlan,
      compareProjection,
      modulesBundle,
      tab,
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
    ],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within PlanProvider');
  return ctx;
}

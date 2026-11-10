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
  const [plan, setPlanState] = useState(() => loadSessionPlan() || createDemoPlan());
  const [comparePlan, setComparePlan] = useState(null);
  const [tab, setTab] = useState('bilan');
  const [presentMode, setPresentMode] = useState(false);

  const setPlan = useCallback((updater) => {
    setPlanState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return touchPlan(next);
    });
  }, []);

  useEffect(() => {
    saveSessionPlan(plan);
  }, [plan]);

  const projection = useMemo(() => {
    try {
      return runProjection(plan);
    } catch (err) {
      console.error('[illustrateur] projection', err);
      return { data: [], deathSummary: null, error: String(err?.message || err) };
    }
  }, [plan]);

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

  const value = useMemo(
    () => ({
      plan,
      setPlan,
      projection,
      comparePlan,
      setComparePlan,
      compareProjection,
      tab,
      setTab,
      presentMode,
      setPresentMode,
      updateCollection,
      addToCollection,
      removeFromCollection,
      loadDemo: () => {
        setComparePlan(null);
        setPlan(createDemoPlan());
      },
      loadEmpty: () => {
        setComparePlan(null);
        setPlan(createEmptyPlan());
      },
      clearSession: () => {
        clearSessionPlan();
        setComparePlan(null);
        setPlan(createEmptyPlan());
      },
      exportJson: () => exportPlanJson(plan),
      importFile: async (file) => {
        const imported = await readPlanFile(file);
        setComparePlan(null);
        setPlan(imported);
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
        setPlan({
          ...clonePlan(scn.plan),
          scenarios: plan.scenarios,
        });
      },
      setCompareFromScenario: (scenarioId) => {
        const scn = (plan.scenarios || []).find((s) => s.id === scenarioId);
        if (!scn?.plan) return;
        setComparePlan(clonePlan(scn.plan));
      },
      captureCompareBaseline: () => setComparePlan(clonePlan(plan)),
    }),
    [
      plan,
      setPlan,
      projection,
      comparePlan,
      compareProjection,
      tab,
      presentMode,
      updateCollection,
      addToCollection,
      removeFromCollection,
    ],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within PlanProvider');
  return ctx;
}

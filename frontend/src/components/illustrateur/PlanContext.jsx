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
  autoHighlights,
  buildProposalBundle,
  createOptionFromPlan,
  ensureProposal,
  nextLetter,
  snapshotPlanForOption,
} from '../../lib/illustrateur/scenarios';
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
      proposal: ensureProposal(loaded),
    };
  });
  const [comparePlan, setComparePlan] = useState(null);
  const [tab, setTab] = useState('dashboard');
  const [presentMode, setPresentMode] = useState(false);
  const [presentPage, setPresentPage] = useState('options'); // options | dashboard

  const setPlan = useCallback((updater) => {
    setPlanState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return touchPlan({
        ...next,
        proposal: ensureProposal(next),
      });
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

  const proposalBundle = useMemo(() => {
    try {
      return buildProposalBundle(plan);
    } catch (err) {
      console.error('[illustrateur] proposal', err);
      return {
        title: 'Proposition',
        baseline: { label: 'Situation actuelle', summary: summarizeProjection(projection), projection },
        options: [],
        hasOptions: false,
        canCompare: false,
      };
    }
  }, [plan, projection]);

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

  const updateProposal = useCallback(
    (updater) => {
      setPlan((prev) => {
        const current = ensureProposal(prev);
        const nextProposal = typeof updater === 'function' ? updater(current) : updater;
        return { ...prev, proposal: nextProposal };
      });
    },
    [setPlan],
  );

  const saveCurrentAsOption = useCallback(
    ({ letter, name, pitch, recommended = false, openViews = true } = {}) => {
      let createdLetter = null;
      updateProposal((proposal) => {
        const resolvedLetter = letter || nextLetter(proposal.options);
        if (!resolvedLetter) return proposal;
        createdLetter = resolvedLetter;
        const option = createOptionFromPlan(plan, {
          letter: resolvedLetter,
          name,
          pitch,
          recommended,
        });
        try {
          const proj = runProjection(option.plan);
          option.highlights = autoHighlights(summarizeProjection(proj), summarizeProjection(projection));
        } catch {
          option.highlights = [];
        }
        const options = [
          ...proposal.options.filter((o) => o.letter !== resolvedLetter),
          option,
        ].sort((a, b) => String(a.letter).localeCompare(String(b.letter)));
        return { ...proposal, options };
      });
      if (openViews) {
        setTab('options');
        setPresentPage('options');
      }
      return createdLetter;
    },
    [plan, projection, updateProposal],
  );

  const updateOptionMeta = useCallback(
    (optionId, updates) => {
      updateProposal((proposal) => ({
        ...proposal,
        options: proposal.options.map((o) => (o.id === optionId ? { ...o, ...updates } : o)),
      }));
    },
    [updateProposal],
  );

  const setRecommendedOption = useCallback(
    (optionId) => {
      updateProposal((proposal) => ({
        ...proposal,
        options: proposal.options.map((o) => ({
          ...o,
          recommended: o.id === optionId,
        })),
      }));
    },
    [updateProposal],
  );

  const removeOption = useCallback(
    (optionId) => {
      updateProposal((proposal) => ({
        ...proposal,
        options: proposal.options.filter((o) => o.id !== optionId),
      }));
    },
    [updateProposal],
  );

  const loadOptionIntoEditor = useCallback(
    (optionId) => {
      const option = ensureProposal(plan).options.find((o) => o.id === optionId);
      if (!option?.plan) return;
      setPlan({
        ...clonePlan(option.plan),
        proposal: ensureProposal(plan),
        scenarios: plan.scenarios || [],
        meta: {
          ...(option.plan.meta || {}),
          name: option.name || option.plan.meta?.name,
          clientLabel: plan.meta?.clientLabel,
        },
      });
      setTab('bilan');
    },
    [plan, setPlan],
  );

  const refreshOptionFromEditor = useCallback(
    (optionId) => {
      updateProposal((proposal) => ({
        ...proposal,
        options: proposal.options.map((o) => {
          if (o.id !== optionId) return o;
          const refreshed = {
            ...o,
            plan: snapshotPlanForOption(plan),
            savedAt: new Date().toISOString(),
          };
          try {
            const proj = runProjection(refreshed.plan);
            refreshed.highlights = autoHighlights(
              summarizeProjection(proj),
              summarizeProjection(projection),
            );
          } catch {
            /* keep old highlights */
          }
          return refreshed;
        }),
      }));
    },
    [plan, projection, updateProposal],
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
      comparePlan,
      setComparePlan,
      compareProjection,
      proposalBundle,
      tab,
      setTab,
      presentMode,
      setPresentMode,
      presentPage,
      setPresentPage,
      updateCollection,
      addToCollection,
      removeFromCollection,
      updateProposal,
      saveCurrentAsOption,
      updateOptionMeta,
      setRecommendedOption,
      removeOption,
      loadOptionIntoEditor,
      refreshOptionFromEditor,
      openProposalPresentation,
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
        setPlan({ ...imported, proposal: ensureProposal(imported) });
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
          proposal: ensureProposal(plan),
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
      proposalBundle,
      tab,
      presentMode,
      presentPage,
      updateCollection,
      addToCollection,
      removeFromCollection,
      updateProposal,
      saveCurrentAsOption,
      updateOptionMeta,
      setRecommendedOption,
      removeOption,
      loadOptionIntoEditor,
      refreshOptionFromEditor,
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

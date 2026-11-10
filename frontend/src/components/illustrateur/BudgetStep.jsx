import { useMemo, useState } from 'react';
import { formatCad, planHasConjoint } from '../../lib/illustrateur';
import { BUDGET_CATEGORIES, BUDGET_FREQUENCIES } from '../../lib/illustrateur/budgetCatalog';
import { ensureBudget, summarizeBudget } from '../../lib/illustrateur/budgetEngine';
import { CollectShell } from './CollectShell';
import {
  CollectCard,
  FieldLabel,
  SegmentedToggle,
  StepFooter,
  StepTitle,
  TextField,
} from './collectUi';
import { usePlan } from './PlanContext';

export function BudgetStep() {
  const { plan, setPlan, goWorkflowNext, goWorkflowPrev } = usePlan();
  const withSpouse = planHasConjoint(plan);
  const budget = ensureBudget(plan);
  const summary = useMemo(() => summarizeBudget(budget), [budget]);
  const [tab, setTab] = useState(BUDGET_CATEGORIES[0].id);

  const patchBudget = (updates) => {
    setPlan((p) => ({ ...p, budget: { ...ensureBudget(p), ...updates } }));
  };

  const patchLine = (lineId, updates) => {
    setPlan((p) => {
      const b = ensureBudget(p);
      return {
        ...p,
        budget: {
          ...b,
          lines: {
            ...b.lines,
            [lineId]: { ...b.lines[lineId], ...updates },
          },
        },
      };
    });
  };

  const activeCat = BUDGET_CATEGORIES.find((c) => c.id === tab) || BUDGET_CATEGORIES[0];
  const catSummary = summary.byCategory.find((c) => c.id === tab);

  return (
    <CollectShell
      title={<StepTitle>Budget complet</StepTitle>}
      right={
        <aside className="sticky top-24 space-y-3">
          <div className="rounded-xl border border-[#d7dee8] bg-white p-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#5a6b7d]">Sommaire</p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt>Revenu net / an</dt>
                <dd className="font-semibold tabular-nums">{formatCad(summary.netIncomeAnnual)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>Dépenses / an</dt>
                <dd className="font-semibold tabular-nums">{formatCad(summary.totalAnnual)}</dd>
              </div>
              <div className="flex justify-between gap-2 border-t border-[#e8eef5] pt-2">
                <dt className="font-semibold">Écart / mois</dt>
                <dd
                  className={`font-bold tabular-nums ${
                    summary.gapMonthly >= 0 ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {formatCad(summary.gapMonthly)}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>% du revenu</dt>
                <dd className="tabular-nums">{summary.pctOfIncome.toFixed(0)} %</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-xl border border-[#d7dee8] bg-white p-4 shadow-sm">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#5a6b7d]">
              Par catégorie / mois
            </p>
            <ul className="space-y-1.5 text-xs">
              {summary.byCategory.map((c) => (
                <li key={c.id} className="flex justify-between gap-2">
                  <button type="button" className="text-left text-[#0b4ea2]" onClick={() => setTab(c.id)}>
                    {c.label}
                  </button>
                  <span className="tabular-nums">{formatCad(c.monthly)}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      }
    >
      <p className="mb-4 rounded-lg border border-[#d7dee8] bg-[#eaf2fb] px-3 py-2 text-sm text-[#3d4f66]">
        Outil de budget intégré (catégories et fréquences inspirées de l’outil Excel). Les totaux alimentent
        le sommaire et peuvent guider le fonds d’urgence.
      </p>

      <CollectCard title="Paramètres">
        <div className="grid gap-3 md:grid-cols-3">
          <FieldLabel label="Revenu net annuel">
            <TextField
              type="number"
              value={budget.netIncomeAnnual}
              onChange={(v) => patchBudget({ netIncomeAnnual: v })}
            />
          </FieldLabel>
          {withSpouse ? (
            <FieldLabel label="Type de budget">
              <SegmentedToggle
                value={budget.mode || 'individuel'}
                onChange={(v) => patchBudget({ mode: v })}
                options={[
                  { value: 'individuel', label: 'Individuel' },
                  { value: 'communs', label: 'Communs' },
                ]}
              />
            </FieldLabel>
          ) : (
            <FieldLabel label="Type de budget">
              <p className="py-2 text-sm text-[#5a6b7d]">Individuel</p>
            </FieldLabel>
          )}
          <FieldLabel label="Affichage totaux">
            <SegmentedToggle
              value={budget.viewFrequency || 'mensuel'}
              onChange={(v) => patchBudget({ viewFrequency: v })}
              options={[
                { value: 'mensuel', label: 'Mensuel' },
                { value: 'annuel', label: 'Annuel' },
              ]}
            />
          </FieldLabel>
        </div>
      </CollectCard>

      <div className="mt-4 flex flex-wrap gap-1">
        {BUDGET_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setTab(c.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
              tab === c.id ? 'bg-[#0b4ea2] text-white' : 'bg-[#eef2f7] text-[#3d4f66]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <CollectCard
          title={`${activeCat.label} · sous-total ${formatCad(
            budget.viewFrequency === 'annuel' ? catSummary?.annual : catSummary?.monthly,
          )}/${budget.viewFrequency === 'annuel' ? 'an' : 'mois'}`}
        >
          <div className="space-y-2">
            {activeCat.lines.map((line) => {
              const row = budget.lines?.[line.id] || {};
              return (
                <div
                  key={line.id}
                  className="grid items-end gap-2 rounded-lg border border-[#d7dee8] bg-white p-2 md:grid-cols-[1.4fr_100px_120px]"
                >
                  <FieldLabel label={line.custom ? 'Libellé personnalisé' : line.label}>
                    {line.custom ? (
                      <TextField
                        value={row.label || ''}
                        onChange={(v) => patchLine(line.id, { label: v })}
                      />
                    ) : (
                      <span className="text-sm text-[#12263a]">{line.label}</span>
                    )}
                  </FieldLabel>
                  <FieldLabel label="Montant">
                    <TextField
                      type="number"
                      value={row.amount || 0}
                      onChange={(v) => patchLine(line.id, { amount: v })}
                    />
                  </FieldLabel>
                  <FieldLabel label="Fréquence">
                    <select
                      className="w-full rounded-md border border-[#d7dee8] bg-white px-2 py-2 text-sm"
                      value={row.frequency || line.defaultFreq}
                      onChange={(e) => patchLine(line.id, { frequency: e.target.value })}
                    >
                      {BUDGET_FREQUENCIES.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </FieldLabel>
                </div>
              );
            })}
          </div>
        </CollectCard>
      </div>

      <div className="mt-4">
        <button
          type="button"
          className="rounded-md border border-[#0b4ea2] px-4 py-2 text-sm font-semibold text-[#0b4ea2]"
          onClick={() =>
            setPlan((p) => ({
              ...p,
              emergency: {
                ...(p.emergency || {}),
                base: 'depenses',
                monthlyAmount: Math.round(summarizeBudget(ensureBudget(p)).totalMonthly),
              },
            }))
          }
        >
          Copier le total mensuel vers fonds d’urgence
        </button>
      </div>

      <StepFooter onPrev={goWorkflowPrev} onNext={goWorkflowNext} />
    </CollectShell>
  );
}

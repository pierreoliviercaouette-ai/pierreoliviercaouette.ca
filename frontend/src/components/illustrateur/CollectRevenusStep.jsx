import { useState } from 'react';
import { formatCad, formatCompactCad, newId } from '../../lib/illustrateur';
import { usePlan } from './PlanContext';
import {
  AddRowButton,
  CollectCard,
  FieldLabel,
  SegmentedToggle,
  StepFooter,
  StepTitle,
  TextField,
} from './collectUi';
import { CollectShell } from './CollectShell';

export function CollectRevenusStep() {
  const {
    plan,
    setPlan,
    addToCollection,
    removeFromCollection,
    updateCollection,
    goWorkflowNext,
    goWorkflowPrev,
    attainment,
  } = usePlan();
  const cf = attainment?.cashflow || {};
  const room = plan.contributionRoom || {};
  const [view, setView] = useState('annuel');

  return (
    <CollectShell
      title={<StepTitle>Revenu et épargne</StepTitle>}
      right={
        <aside className="sticky top-24 rounded-xl border border-[#d7dee8] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#5a6b7d]">Flux monétaire</p>
            <SegmentedToggle
              value={view}
              onChange={setView}
              options={[
                { value: 'annuel', label: 'Annuel' },
                { value: 'mensuel', label: 'Mensuel' },
              ]}
            />
          </div>
          <div className="mx-auto mt-4 flex h-36 w-36 items-center justify-center rounded-full border-[14px] border-[#0b4ea2] border-r-[#9ec0ea]">
            <span className="font-heading text-xl text-[#0b4ea2]">
              {formatCompactCad(view === 'mensuel' ? (cf.annualIncome || 0) / 12 : cf.annualIncome || 0)}
            </span>
          </div>
          <ul className="mt-4 space-y-1 text-xs text-[#5a6b7d]">
            <li>● Épargne : {formatCad(view === 'mensuel' ? (cf.annualSavings || 0) / 12 : cf.annualSavings)}</li>
            <li>● Dépenses estimées : {formatCad(view === 'mensuel' ? (cf.expenses || 0) / 12 : cf.expenses)}</li>
          </ul>
        </aside>
      }
    >
      <div className="space-y-5">
        <CollectCard
          title="Revenu"
          action={
            <AddRowButton
              onClick={() =>
                addToCollection('revenues', {
                  id: newId('rev'),
                  name: 'Nouveau revenu',
                  type: 'salaire',
                  entityId: plan.entities?.[0]?.id,
                  monthlyAmount: 0,
                  growthRate: 2,
                })
              }
            >
              Ajouter un revenu
            </AddRowButton>
          }
        >
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-[#5a6b7d]">
              <tr>
                <th className="py-2 text-left">Description</th>
                <th>Brut annuel</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {(plan.revenues || []).map((r) => {
                const annual = (parseFloat(r.monthlyAmount) || 0) * 12 || parseFloat(r.annualAmount) || 0;
                return (
                  <tr key={r.id} className="border-t border-[#d7dee8] bg-white/70">
                    <td className="py-2">
                      <input
                        className="w-full rounded border border-[#d7dee8] px-2 py-1"
                        value={r.name || ''}
                        onChange={(e) => updateCollection('revenues', r.id, { name: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="w-28 rounded border border-[#d7dee8] px-2 py-1"
                        value={annual}
                        onChange={(e) =>
                          updateCollection('revenues', r.id, {
                            monthlyAmount: (Number(e.target.value) || 0) / 12,
                          })
                        }
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="text-xs text-red-600"
                        onClick={() => removeFromCollection('revenues', r.id)}
                      >
                        Retirer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CollectCard>

        <CollectCard
          title="Épargne"
          action={
            <AddRowButton
              onClick={() =>
                setPlan((p) => ({
                  ...p,
                  savings: [
                    ...(p.savings || []),
                    { id: newId('sav'), name: 'Épargne', monthlyAmount: 0, annualAmount: 0 },
                  ],
                }))
              }
            >
              Ajouter une épargne
            </AddRowButton>
          }
        >
          {(plan.savings || []).length === 0 && (
            <p className="text-sm text-[#5a6b7d]">Aucune épargne périodique ajoutée.</p>
          )}
          <div className="space-y-2">
            {(plan.savings || []).map((s) => (
              <div key={s.id} className="flex flex-wrap items-center gap-2">
                <input
                  className="rounded border border-[#d7dee8] px-2 py-1 text-sm"
                  value={s.name}
                  onChange={(e) =>
                    setPlan((p) => ({
                      ...p,
                      savings: p.savings.map((x) => (x.id === s.id ? { ...x, name: e.target.value } : x)),
                    }))
                  }
                />
                <input
                  type="number"
                  className="w-28 rounded border border-[#d7dee8] px-2 py-1 text-sm"
                  value={s.monthlyAmount || 0}
                  onChange={(e) =>
                    setPlan((p) => ({
                      ...p,
                      savings: p.savings.map((x) =>
                        x.id === s.id
                          ? {
                              ...x,
                              monthlyAmount: Number(e.target.value) || 0,
                              annualAmount: (Number(e.target.value) || 0) * 12,
                            }
                          : x,
                      ),
                    }))
                  }
                />
                <span className="text-xs text-[#5a6b7d]">$/mois</span>
              </div>
            ))}
          </div>
        </CollectCard>

        <CollectCard title="Droits de cotisation">
          <div className="grid gap-3 md:grid-cols-3">
            <FieldLabel label="Droits REER/RPAC inutilisés">
              <TextField
                type="number"
                value={room.reer}
                onChange={(v) => setPlan((p) => ({ ...p, contributionRoom: { ...p.contributionRoom, reer: v } }))}
              />
            </FieldLabel>
            <FieldLabel label="Droits CELI inutilisés">
              <TextField
                type="number"
                value={room.celi}
                onChange={(v) => setPlan((p) => ({ ...p, contributionRoom: { ...p.contributionRoom, celi: v } }))}
              />
            </FieldLabel>
            <FieldLabel label="Droits CELIAPP inutilisés">
              <TextField
                type="number"
                value={room.celiapp}
                onChange={(v) =>
                  setPlan((p) => ({ ...p, contributionRoom: { ...p.contributionRoom, celiapp: v } }))
                }
              />
            </FieldLabel>
          </div>
        </CollectCard>
      </div>
      <StepFooter onPrev={goWorkflowPrev} onNext={goWorkflowNext} />
    </CollectShell>
  );
}

import { DEFAULT_TAX_RATES, formatCad, newId } from '../../lib/illustrateur';
import { CollectShell } from './CollectShell';
import {
  AddRowButton,
  CollectCard,
  FieldLabel,
  StepFooter,
  StepTitle,
  TextField,
} from './collectUi';
import { usePlan } from './PlanContext';

export function CorporatifStep() {
  const { plan, setPlan, addToCollection, updateCollection, goWorkflowNext, goWorkflowPrev } = usePlan();
  const corps = (plan.entities || []).filter((e) => e.type === 'corporation');
  const persons = (plan.entities || []).filter((e) => e.type === 'personnel');

  const addCorp = () => {
    addToCollection('entities', {
      id: newId('ent'),
      name: 'Holdco Inc.',
      type: 'corporation',
      province: 'QC',
      marginalTaxRate: DEFAULT_TAX_RATES.corporation,
      shareholders: persons[0]
        ? [{ personEntityId: persons[0].id, ownershipPercent: 100, marginalTaxRate: DEFAULT_TAX_RATES.personnel }]
        : [],
      corpTaxAccounts: { cdcBalance: 0, imrtdBalance: 0, gripBalance: 0 },
      dividendPolicy: { autoDistributePercent: 0, defaultOrder: 'non_eligible', gripAccrualPercent: 0 },
    });
  };

  const patchCorp = (id, updates) => updateCollection('entities', id, updates);

  const corpAssets = (corpId) =>
    (plan.assets || []).filter((a) => a.entityId === corpId).reduce((s, a) => s + (parseFloat(a.currentBalance) || 0), 0);

  return (
    <CollectShell title={<StepTitle>Corporatif</StepTitle>}>
      <p className="mb-4 rounded-lg border border-[#d7dee8] bg-[#eaf2fb] px-3 py-2 text-sm text-[#3d4f66]">
        Structure Holdco : actionnaires, comptes fiscaux (CDC / IMRTD / GRIP) et politique de dividendes —
        branchés sur le moteur de projection existant.
      </p>

      <CollectCard title="Corporations" action={<AddRowButton onClick={addCorp}>Ajouter une corporation</AddRowButton>}>
        {corps.length === 0 && (
          <p className="text-sm text-[#5a6b7d]">Aucune corporation. Ajoutez une Holdco pour planifier dividendes et trésorerie.</p>
        )}
        <div className="space-y-4">
          {corps.map((corp) => (
            <div key={corp.id} className="rounded-xl border border-[#d7dee8] bg-white p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <FieldLabel label="Nom">
                  <TextField value={corp.name} onChange={(v) => patchCorp(corp.id, { name: v })} />
                </FieldLabel>
                <FieldLabel label="Taux marginal corpo %">
                  <TextField
                    type="number"
                    value={corp.marginalTaxRate}
                    onChange={(v) => patchCorp(corp.id, { marginalTaxRate: v })}
                  />
                </FieldLabel>
                <FieldLabel label="Actifs rattachés">
                  <p className="py-2 text-sm font-semibold tabular-nums">{formatCad(corpAssets(corp.id))}</p>
                </FieldLabel>
              </div>

              <h4 className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#0b4ea2]">
                Comptes fiscaux
              </h4>
              <div className="mt-2 grid gap-3 md:grid-cols-3">
                {['cdcBalance', 'imrtdBalance', 'gripBalance'].map((key) => (
                  <FieldLabel key={key} label={key.replace('Balance', '').toUpperCase()}>
                    <TextField
                      type="number"
                      value={corp.corpTaxAccounts?.[key] || 0}
                      onChange={(v) =>
                        patchCorp(corp.id, {
                          corpTaxAccounts: { ...(corp.corpTaxAccounts || {}), [key]: v },
                        })
                      }
                    />
                  </FieldLabel>
                ))}
              </div>

              <h4 className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#0b4ea2]">
                Politique de dividendes
              </h4>
              <div className="mt-2 grid gap-3 md:grid-cols-3">
                <FieldLabel label="Auto-distribution %">
                  <TextField
                    type="number"
                    value={corp.dividendPolicy?.autoDistributePercent || 0}
                    onChange={(v) =>
                      patchCorp(corp.id, {
                        dividendPolicy: { ...(corp.dividendPolicy || {}), autoDistributePercent: v },
                      })
                    }
                  />
                </FieldLabel>
                <FieldLabel label="Ordre par défaut">
                  <select
                    className="w-full rounded-md border border-[#d7dee8] bg-white px-3 py-2 text-sm"
                    value={corp.dividendPolicy?.defaultOrder || 'non_eligible'}
                    onChange={(e) =>
                      patchCorp(corp.id, {
                        dividendPolicy: { ...(corp.dividendPolicy || {}), defaultOrder: e.target.value },
                      })
                    }
                  >
                    <option value="non_eligible">Non déterminé</option>
                    <option value="eligible">Déterminé</option>
                  </select>
                </FieldLabel>
                <FieldLabel label="Accrual GRIP %">
                  <TextField
                    type="number"
                    value={corp.dividendPolicy?.gripAccrualPercent || 0}
                    onChange={(v) =>
                      patchCorp(corp.id, {
                        dividendPolicy: { ...(corp.dividendPolicy || {}), gripAccrualPercent: v },
                      })
                    }
                  />
                </FieldLabel>
              </div>

              <h4 className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#0b4ea2]">
                Actionnaires
              </h4>
              <div className="mt-2 space-y-2">
                {(corp.shareholders || []).map((sh, idx) => (
                  <div key={`${corp.id}-sh-${idx}`} className="grid gap-2 md:grid-cols-3">
                    <select
                      className="rounded-md border border-[#d7dee8] bg-white px-2 py-2 text-sm"
                      value={sh.personEntityId || ''}
                      onChange={(e) => {
                        const next = [...(corp.shareholders || [])];
                        next[idx] = { ...sh, personEntityId: e.target.value };
                        patchCorp(corp.id, { shareholders: next });
                      }}
                    >
                      {persons.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <TextField
                      type="number"
                      value={sh.ownershipPercent || 0}
                      onChange={(v) => {
                        const next = [...(corp.shareholders || [])];
                        next[idx] = { ...sh, ownershipPercent: v };
                        patchCorp(corp.id, { shareholders: next });
                      }}
                    />
                    <span className="py-2 text-xs text-[#5a6b7d]">% propriété</span>
                  </div>
                ))}
                <AddRowButton
                  onClick={() =>
                    patchCorp(corp.id, {
                      shareholders: [
                        ...(corp.shareholders || []),
                        {
                          personEntityId: persons[0]?.id,
                          ownershipPercent: 0,
                          marginalTaxRate: DEFAULT_TAX_RATES.personnel,
                        },
                      ],
                    })
                  }
                >
                  Actionnaire
                </AddRowButton>
              </div>
            </div>
          ))}
        </div>
      </CollectCard>

      <StepFooter onPrev={goWorkflowPrev} onNext={goWorkflowNext} />
    </CollectShell>
  );
}

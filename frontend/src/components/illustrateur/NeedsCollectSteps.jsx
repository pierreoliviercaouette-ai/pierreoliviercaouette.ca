import { useEffect, useMemo } from 'react';
import { formatCad, newId, planHasConjoint } from '../../lib/illustrateur';
import {
  computePlanDeathTax,
  deathTaxOptionsFromPlan,
  DEATH_TAX_EXPENSE_ID,
  isEligibleForSpousalRollover,
  syncDeathTaxExpense,
} from '../../lib/illustrateur/planningTax';
import { usePlan } from './PlanContext';
import {
  AddRowButton,
  AttainmentPanel,
  CollectCard,
  FieldLabel,
  SegmentedToggle,
  StepFooter,
  StepTitle,
  TextField,
} from './collectUi';
import { CollectShell } from './CollectShell';

function clientName(plan) {
  return (
    [plan.person?.firstName, plan.person?.lastName].filter(Boolean).join(' ') ||
    plan.meta?.clientLabel ||
    'Client'
  );
}

function patchSection(setPlan, key, updates) {
  setPlan((p) => ({ ...p, [key]: { ...p[key], ...updates } }));
}

export function EmergencyStep() {
  const { plan, setPlan, goWorkflowNext, goWorkflowPrev, attainment } = usePlan();
  const e = plan.emergency || {};
  const liquidAssets = (plan.assets || []).filter(
    (a) => a.type === 'non_enregistre' || a.type === 'celi' || /liquid|banque|caisse/i.test(a.name || ''),
  );

  return (
    <CollectShell
      title={<StepTitle>Fonds d’urgence</StepTitle>}
      right={<AttainmentPanel clientLabel={clientName(plan)} attainment={attainment?.emergency} />}
    >
      <div className="space-y-4">
        <CollectCard title="Objectif">
          <SegmentedToggle
            value={e.base || 'depenses'}
            onChange={(v) => patchSection(setPlan, 'emergency', { base: v })}
            options={[
              { value: 'revenu', label: 'Revenu mensuel' },
              { value: 'depenses', label: 'Dépenses mensuelles' },
              { value: 'fixe', label: 'Montant fixe' },
              { value: 'aucun', label: 'Aucun' },
            ]}
          />
          {e.base !== 'aucun' && (
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#12263a]">
              <TextField
                type="number"
                className="w-16"
                value={e.months}
                onChange={(v) => patchSection(setPlan, 'emergency', { months: v })}
              />
              mois ×
              <TextField
                type="number"
                className="w-28"
                value={e.monthlyAmount}
                onChange={(v) => patchSection(setPlan, 'emergency', { monthlyAmount: v })}
              />
              $
            </p>
          )}
        </CollectCard>

        <CollectCard title="Actifs alloués au fonds d’urgence">
          {liquidAssets.length === 0 ? (
            <p className="rounded-lg border border-dashed border-[#d7dee8] bg-white px-3 py-4 text-sm text-[#5a6b7d]">
              Aucun compte bancaire, CELI ou placement non enregistré disponible. Ajouter un actif.
            </p>
          ) : (
            <div className="space-y-2">
              {liquidAssets.map((a) => {
                const checked = (e.allocatedAssetIds || []).includes(a.id);
                return (
                  <label key={a.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const ids = new Set(e.allocatedAssetIds || []);
                        if (checked) ids.delete(a.id);
                        else ids.add(a.id);
                        patchSection(setPlan, 'emergency', { allocatedAssetIds: [...ids] });
                      }}
                    />
                    {a.name} — {formatCad(a.currentBalance)}
                  </label>
                );
              })}
            </div>
          )}
        </CollectCard>

        <CollectCard title="Marge de crédit">
          <FieldLabel label="Montant disponible">
            <TextField
              type="number"
              value={e.creditLine}
              onChange={(v) => patchSection(setPlan, 'emergency', { creditLine: v })}
            />
          </FieldLabel>
        </CollectCard>
      </div>
      <StepFooter onPrev={goWorkflowPrev} onNext={goWorkflowNext} />
    </CollectShell>
  );
}

export function DeathNeedsStep() {
  const { plan, setPlan, goWorkflowNext, goWorkflowPrev, attainment } = usePlan();
  const d = plan.deathNeeds || {};
  const withSpouse = planHasConjoint(plan);
  const deathTaxOpts = useMemo(() => deathTaxOptionsFromPlan(plan), [plan]);
  const deathTax = useMemo(() => computePlanDeathTax(plan), [plan]);

  useEffect(() => {
    setPlan((p) => {
      const expenses = p.deathNeeds?.expenses || [];
      const nextExpenses = syncDeathTaxExpense(expenses, deathTax.totalTaxAtDeath);
      const currentAuto = expenses.find((e) => e.id === DEATH_TAX_EXPENSE_ID || e.source === 'death_tax');
      const nextAuto = nextExpenses.find((e) => e.id === DEATH_TAX_EXPENSE_ID);
      if (
        currentAuto &&
        nextAuto &&
        Number(currentAuto.amount) === Number(nextAuto.amount) &&
        expenses.length === nextExpenses.length
      ) {
        return p;
      }
      return { ...p, deathNeeds: { ...p.deathNeeds, expenses: nextExpenses } };
    });
  }, [deathTax.totalTaxAtDeath, setPlan]);

  const toggleId = (field, id) => {
    const set = new Set(d[field] || []);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    patchSection(setPlan, 'deathNeeds', { [field]: [...set] });
  };

  const togglePrincipalResidence = (assetId) => {
    const current = Array.isArray(d.principalResidenceAssetIds)
      ? d.principalResidenceAssetIds
      : deathTaxOpts.principalResidenceAssetIds;
    const set = new Set(current);
    if (set.has(assetId)) set.delete(assetId);
    else set.add(assetId);
    patchSection(setPlan, 'deathNeeds', { principalResidenceAssetIds: [...set] });
  };

  const toggleNoRollover = (assetId) => {
    const set = new Set(d.noRolloverAssetIds || []);
    if (set.has(assetId)) set.delete(assetId);
    else set.add(assetId);
    patchSection(setPlan, 'deathNeeds', { noRolloverAssetIds: [...set] });
  };

  const entityById = useMemo(() => {
    const map = {};
    for (const e of plan.entities || []) map[e.id] = e;
    return map;
  }, [plan.entities]);

  const principalResidenceIds = useMemo(
    () =>
      Array.isArray(d.principalResidenceAssetIds)
        ? d.principalResidenceAssetIds
        : deathTaxOpts.principalResidenceAssetIds || [],
    [d.principalResidenceAssetIds, deathTaxOpts.principalResidenceAssetIds],
  );

  return (
    <CollectShell
      title={<StepTitle>Besoins en cas de décès</StepTitle>}
      right={<AttainmentPanel clientLabel={clientName(plan)} attainment={attainment?.death} />}
    >
      <div className="space-y-4">
        <CollectCard
          title="Assurance vie"
          action={
            <AddRowButton
              onClick={() =>
                patchSection(setPlan, 'deathNeeds', {
                  policies: [
                    ...(d.policies || []),
                    { id: newId('pol'), type: 'temporaire', insured: clientName(plan), amount: 0, annualPremium: 0 },
                  ],
                })
              }
            >
              Ajouter
            </AddRowButton>
          }
        >
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-[#5a6b7d]">
              <tr>
                <th className="py-2 text-left">Type</th>
                <th>Montant</th>
                <th>Prime/an</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {(d.policies || []).map((p) => (
                <tr key={p.id} className="border-t border-[#d7dee8] bg-white/70">
                  <td className="py-2">
                    <input
                      className="w-full rounded border border-[#d7dee8] px-2 py-1"
                      value={p.type}
                      onChange={(e) =>
                        patchSection(setPlan, 'deathNeeds', {
                          policies: d.policies.map((x) => (x.id === p.id ? { ...x, type: e.target.value } : x)),
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="w-28 rounded border border-[#d7dee8] px-2 py-1"
                      value={p.amount || 0}
                      onChange={(e) =>
                        patchSection(setPlan, 'deathNeeds', {
                          policies: d.policies.map((x) =>
                            x.id === p.id ? { ...x, amount: Number(e.target.value) || 0 } : x,
                          ),
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="w-24 rounded border border-[#d7dee8] px-2 py-1"
                      value={p.annualPremium || 0}
                      onChange={(e) =>
                        patchSection(setPlan, 'deathNeeds', {
                          policies: d.policies.map((x) =>
                            x.id === p.id ? { ...x, annualPremium: Number(e.target.value) || 0 } : x,
                          ),
                        })
                      }
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="text-xs text-red-600"
                      onClick={() =>
                        patchSection(setPlan, 'deathNeeds', {
                          policies: d.policies.filter((x) => x.id !== p.id),
                        })
                      }
                    >
                      Retirer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollectCard>

        <CollectCard title="Prestation de décès RRQ/RPC">
          <TextField
            type="number"
            value={d.rrqDeathBenefit}
            onChange={(v) => patchSection(setPlan, 'deathNeeds', { rrqDeathBenefit: v })}
          />
        </CollectCard>

        <CollectCard title="Actifs à liquider">
          {(plan.assets || []).map((a) => (
            <label key={a.id} className="mb-1 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={(d.liquidateAssetIds || []).includes(a.id)}
                onChange={() => toggleId('liquidateAssetIds', a.id)}
              />
              {a.name} — {formatCad(a.currentBalance)}
            </label>
          ))}
        </CollectCard>

        <CollectCard title="Passifs à rembourser">
          {(plan.debts || []).map((debt) => (
            <label key={debt.id} className="mb-1 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={(d.repayDebtIds || []).includes(debt.id)}
                onChange={() => toggleId('repayDebtIds', debt.id)}
              />
              {debt.name} — {formatCad(debt.currentBalance)}
            </label>
          ))}
        </CollectCard>

        <CollectCard title="Impôt au décès (LIR / Québec)">
          <p className="mb-3 text-sm text-[#5a6b7d]">
            Disposition réputée des biens (gains en capital, inclusion REER). Calcul illustratif — pas un avis
            fiscal. La ligne est ajoutée automatiquement aux dépenses prévues.
          </p>

          {withSpouse && (
            <label className="mb-3 flex cursor-pointer items-start gap-3 rounded-lg border border-[#d7dee8] bg-white p-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-[#0b4ea2]"
                checked={deathTaxOpts.spousalRollover}
                onChange={(e) =>
                  patchSection(setPlan, 'deathNeeds', { spousalRollover: e.target.checked })
                }
              />
              <span>
                <span className="block text-sm font-semibold">Roullement au conjoint</span>
                <span className="text-xs text-[#5a6b7d]">
                  Art. 70(6) (biens en capital à l’ACB) et roullement REER (art. 146) — report d’impôt.
                </span>
              </span>
            </label>
          )}

          {!withSpouse && (
            <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Aucun conjoint dans la portée du plan — disposition réputée sans roullement.
            </p>
          )}

          <div className="mb-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-[#d7dee8] bg-white p-3">
              <p className="text-[11px] uppercase text-[#5a6b7d]">Gains en capital</p>
              <p className="font-semibold tabular-nums">{formatCad(deathTax.capitalGainsTax)}</p>
            </div>
            <div className="rounded-lg border border-[#d7dee8] bg-white p-3">
              <p className="text-[11px] uppercase text-[#5a6b7d]">REER</p>
              <p className="font-semibold tabular-nums">{formatCad(deathTax.reerTax)}</p>
            </div>
            <div className="rounded-lg border border-[#d7dee8] bg-white p-3">
              <p className="text-[11px] uppercase text-[#5a6b7d]">Corporatif</p>
              <p className="font-semibold tabular-nums">{formatCad(deathTax.corpTax)}</p>
            </div>
            <div className="rounded-lg border border-[#0b4ea2]/30 bg-[#eaf2fb] p-3">
              <p className="text-[11px] uppercase text-[#0b4ea2]">Total impôt estimé</p>
              <p className="font-bold tabular-nums text-[#0b4ea2]">{formatCad(deathTax.totalTaxAtDeath)}</p>
            </div>
          </div>

          {deathTaxOpts.spousalRollover && deathTax.rolledAssetCount > 0 && (
            <p className="mb-3 text-xs text-emerald-700">
              {deathTax.rolledAssetCount} bien(s) roulement conjoint — gain reporté illustratif{' '}
              {formatCad(deathTax.deferredGain)}.
            </p>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-[#5a6b7d]">
                <tr>
                  <th className="py-2 text-left">Actif</th>
                  <th>JVM</th>
                  <th>Gain / solde</th>
                  <th>Impôt</th>
                  <th className="text-left">Traitement</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {(deathTax.details || []).map((row) => {
                  const asset = (plan.assets || []).find((a) => a.id === row.assetId);
                  const entity = asset ? entityById[asset.entityId] : null;
                  const canRoll = asset && isEligibleForSpousalRollover(asset, entity);
                  const isRealEstate = row.type === 'immobilier';
                  return (
                    <tr key={row.assetId || row.name} className="border-t border-[#d7dee8] bg-white/70">
                      <td className="py-2 font-medium">{row.name}</td>
                      <td className="tabular-nums">{formatCad(row.fmv)}</td>
                      <td className="tabular-nums">{formatCad(row.gain || 0)}</td>
                      <td className="tabular-nums font-semibold">{formatCad(row.tax || 0)}</td>
                      <td className="max-w-[220px] text-xs text-[#5a6b7d]">{row.treatment}</td>
                      <td className="space-y-1 py-2 text-xs">
                        {isRealEstate && (
                          <label className="flex items-center gap-1 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={principalResidenceIds.includes(row.assetId)}
                              onChange={() => togglePrincipalResidence(row.assetId)}
                            />
                            Rés. princ.
                          </label>
                        )}
                        {withSpouse && deathTaxOpts.spousalRollover && canRoll && (
                          <label className="flex items-center gap-1 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={!(d.noRolloverAssetIds || []).includes(row.assetId)}
                              onChange={() => toggleNoRollover(row.assetId)}
                            />
                            Rouler
                          </label>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CollectCard>

        <CollectCard
          title="Dépenses prévues"
          action={
            <AddRowButton
              onClick={() =>
                patchSection(setPlan, 'deathNeeds', {
                  expenses: [
                    ...(d.expenses || []).filter((e) => e.id !== DEATH_TAX_EXPENSE_ID && e.source !== 'death_tax'),
                    { id: newId('exp'), description: 'Dépense', amount: 0, indexed: false },
                    ...(d.expenses || []).filter((e) => e.id === DEATH_TAX_EXPENSE_ID || e.source === 'death_tax'),
                  ],
                })
              }
            >
              Ajouter une dépense
            </AddRowButton>
          }
        >
          {(d.expenses || []).map((exp) => {
            const isAutoTax = exp.id === DEATH_TAX_EXPENSE_ID || exp.source === 'death_tax';
            return (
              <div key={exp.id} className="mb-2 grid gap-2 md:grid-cols-3">
                <TextField
                  value={exp.description}
                  onChange={(v) =>
                    !isAutoTax &&
                    patchSection(setPlan, 'deathNeeds', {
                      expenses: d.expenses.map((x) => (x.id === exp.id ? { ...x, description: v } : x)),
                    })
                  }
                />
                <TextField
                  type="number"
                  value={exp.amount}
                  onChange={(v) =>
                    !isAutoTax &&
                    patchSection(setPlan, 'deathNeeds', {
                      expenses: d.expenses.map((x) => (x.id === exp.id ? { ...x, amount: v } : x)),
                    })
                  }
                />
                {isAutoTax ? (
                  <p className="py-2 text-xs font-semibold text-[#0b4ea2]">Auto · LIR / QC</p>
                ) : (
                  <SegmentedToggle
                    value={exp.indexed ? 'oui' : 'non'}
                    onChange={(v) =>
                      patchSection(setPlan, 'deathNeeds', {
                        expenses: d.expenses.map((x) => (x.id === exp.id ? { ...x, indexed: v === 'oui' } : x)),
                      })
                    }
                    options={[
                      { value: 'oui', label: 'Indexé' },
                      { value: 'non', label: 'Non' },
                    ]}
                  />
                )}
              </div>
            );
          })}
        </CollectCard>

        <CollectCard title="Remplacement du revenu">
          <div className="mb-3 flex flex-wrap gap-2">
            <SegmentedToggle
              value={d.incomeMode || 'individuel'}
              onChange={(v) => patchSection(setPlan, 'deathNeeds', { incomeMode: v })}
              options={[
                { value: 'individuel', label: 'Individuel' },
                { value: 'aucun', label: 'Aucun' },
              ]}
            />
            <SegmentedToggle
              value={d.incomeBasis || 'brut'}
              onChange={(v) => patchSection(setPlan, 'deathNeeds', { incomeBasis: v })}
              options={[
                { value: 'brut', label: 'Brut' },
                { value: 'net', label: 'Net' },
              ]}
            />
          </div>
          <p className="flex flex-wrap items-center gap-2 text-sm">
            Remplacer
            <TextField
              type="number"
              className="w-16"
              value={d.incomeReplacePct}
              onChange={(v) => patchSection(setPlan, 'deathNeeds', { incomeReplacePct: v })}
            />
            % pendant
            <TextField
              type="number"
              className="w-16"
              value={d.incomeReplaceYears}
              onChange={(v) => patchSection(setPlan, 'deathNeeds', { incomeReplaceYears: v })}
            />
            ans · taux
            <TextField
              type="number"
              className="w-16"
              value={d.discountRate}
              onChange={(v) => patchSection(setPlan, 'deathNeeds', { discountRate: v })}
            />
            %
          </p>
          <div className={`mt-3 grid gap-3 ${planHasConjoint(plan) ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {planHasConjoint(plan) && (
              <FieldLabel label="Rente conjoint survivant">
                <TextField
                  type="number"
                  value={d.survivorPension}
                  onChange={(v) => patchSection(setPlan, 'deathNeeds', { survivorPension: v })}
                />
              </FieldLabel>
            )}
            <FieldLabel label="Rente d’orphelin">
              <TextField
                type="number"
                value={d.orphanPension}
                onChange={(v) => patchSection(setPlan, 'deathNeeds', { orphanPension: v })}
              />
            </FieldLabel>
            <FieldLabel label="Autres revenus">
              <TextField
                type="number"
                value={d.otherIncome}
                onChange={(v) => patchSection(setPlan, 'deathNeeds', { otherIncome: v })}
              />
            </FieldLabel>
          </div>
          {attainment?.death?.breakdown && (
            <p className="mt-3 text-sm text-red-600">
              Revenu manquant projeté : {formatCad(attainment.death.breakdown.incomeReplacePv)}
            </p>
          )}
        </CollectCard>
      </div>
      <StepFooter onPrev={goWorkflowPrev} onNext={goWorkflowNext} />
    </CollectShell>
  );
}

export function DisabilityStep() {
  const { plan, setPlan, goWorkflowNext, goWorkflowPrev, attainment } = usePlan();
  const d = plan.disabilityNeeds || {};

  return (
    <CollectShell
      title={<StepTitle>Invalidité</StepTitle>}
      right={<AttainmentPanel clientLabel={clientName(plan)} attainment={attainment?.disability} />}
    >
      <div className="space-y-4">
        <CollectCard
          title="Assurance invalidité"
          action={
            <AddRowButton
              onClick={() =>
                patchSection(setPlan, 'disabilityNeeds', {
                  policies: [
                    ...(d.policies || []),
                    { id: newId('di'), type: 'individuelle', amount: 0, annualPremium: 0 },
                  ],
                })
              }
            >
              Ajouter
            </AddRowButton>
          }
        >
          {(d.policies || []).map((p) => (
            <div key={p.id} className="mb-2 flex flex-wrap gap-2 text-sm">
              <input
                className="rounded border border-[#d7dee8] px-2 py-1"
                value={p.type}
                onChange={(e) =>
                  patchSection(setPlan, 'disabilityNeeds', {
                    policies: d.policies.map((x) => (x.id === p.id ? { ...x, type: e.target.value } : x)),
                  })
                }
              />
              <input
                type="number"
                className="w-28 rounded border border-[#d7dee8] px-2 py-1"
                value={p.amount || 0}
                onChange={(e) =>
                  patchSection(setPlan, 'disabilityNeeds', {
                    policies: d.policies.map((x) =>
                      x.id === p.id ? { ...x, amount: Number(e.target.value) || 0 } : x,
                    ),
                  })
                }
              />
              <span className="text-xs text-[#5a6b7d]">$/mois</span>
            </div>
          ))}
        </CollectCard>

        <CollectCard title="Autres sources de revenu">
          <FieldLabel label="Revenus mensuels">
            <TextField
              type="number"
              value={d.otherMonthlyIncome}
              onChange={(v) => patchSection(setPlan, 'disabilityNeeds', { otherMonthlyIncome: v })}
            />
          </FieldLabel>
          <div className="mt-3">
            <p className="mb-1 text-xs text-[#5a6b7d]">Couvert par l’assurance-emploi ?</p>
            <SegmentedToggle
              value={d.eiCovered ? 'oui' : 'non'}
              onChange={(v) => patchSection(setPlan, 'disabilityNeeds', { eiCovered: v === 'oui' })}
              options={[
                { value: 'oui', label: 'Oui' },
                { value: 'non', label: 'Non' },
              ]}
            />
          </div>
        </CollectCard>

        <CollectCard title="Approche de calcul">
          <SegmentedToggle
            value={d.approach || 'remplacement'}
            onChange={(v) => patchSection(setPlan, 'disabilityNeeds', { approach: v })}
            options={[
              { value: 'remplacement', label: 'Remplacement du revenu' },
              { value: 'depenses', label: 'Dépenses courantes' },
            ]}
          />
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <SegmentedToggle
              value={d.incomeBasis || 'net'}
              onChange={(v) => patchSection(setPlan, 'disabilityNeeds', { incomeBasis: v })}
              options={[
                { value: 'brut', label: 'Brut' },
                { value: 'net', label: 'Net' },
              ]}
            />
            <TextField
              type="number"
              className="w-16"
              value={d.replacePct}
              onChange={(v) => patchSection(setPlan, 'disabilityNeeds', { replacePct: v })}
            />
            %
          </div>
        </CollectCard>

        <CollectCard title="Informations pour tarification">
          <FieldLabel label={`Niveau d’activité physique (${d.physicalLevel || 0})`}>
            <input
              type="range"
              min={0}
              max={100}
              value={d.physicalLevel || 0}
              onChange={(e) =>
                patchSection(setPlan, 'disabilityNeeds', { physicalLevel: Number(e.target.value) })
              }
              className="w-full"
            />
          </FieldLabel>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <FieldLabel label="Heures de travail">
              <TextField
                type="number"
                value={d.workHours}
                onChange={(v) => patchSection(setPlan, 'disabilityNeeds', { workHours: v })}
              />
            </FieldLabel>
            <FieldLabel label="Délai de carence (jours)">
              <TextField
                type="number"
                value={d.waitingDays}
                onChange={(v) => patchSection(setPlan, 'disabilityNeeds', { waitingDays: v })}
              />
            </FieldLabel>
            <FieldLabel label="Couverture jusqu’à l’âge">
              <TextField
                type="number"
                value={d.coverageToAge}
                onChange={(v) => patchSection(setPlan, 'disabilityNeeds', { coverageToAge: v })}
              />
            </FieldLabel>
          </div>
        </CollectCard>
      </div>
      <StepFooter onPrev={goWorkflowPrev} onNext={goWorkflowNext} />
    </CollectShell>
  );
}

export function CriticalIllnessStep() {
  const { plan, setPlan, goWorkflowNext, goWorkflowPrev, attainment } = usePlan();
  const ci = plan.criticalIllnessNeeds || {};
  const extras = ci.extras || {};

  return (
    <CollectShell
      title={<StepTitle>Maladie grave</StepTitle>}
      right={<AttainmentPanel clientLabel={clientName(plan)} attainment={attainment?.criticalIllness} />}
    >
      <div className="space-y-4">
        <CollectCard
          title="Assurance maladie grave"
          action={
            <AddRowButton
              onClick={() =>
                patchSection(setPlan, 'criticalIllnessNeeds', {
                  policies: [
                    ...(ci.policies || []),
                    { id: newId('ci'), type: 'individuelle', amount: 0, annualPremium: 0 },
                  ],
                })
              }
            >
              Ajouter
            </AddRowButton>
          }
        >
          {(ci.policies || []).map((p) => (
            <div key={p.id} className="mb-2 flex flex-wrap gap-2 text-sm">
              <input
                type="number"
                className="w-32 rounded border border-[#d7dee8] px-2 py-1"
                value={p.amount || 0}
                onChange={(e) =>
                  patchSection(setPlan, 'criticalIllnessNeeds', {
                    policies: ci.policies.map((x) =>
                      x.id === p.id ? { ...x, amount: Number(e.target.value) || 0 } : x,
                    ),
                  })
                }
              />
              <span className="text-xs text-[#5a6b7d]">$</span>
            </div>
          ))}
        </CollectCard>

        <CollectCard title="Montants disponibles">
          <div className="space-y-3">
            <div>
              <p className="mb-1 text-xs text-[#5a6b7d]">Utiliser l’assurance invalidité ?</p>
              <SegmentedToggle
                value={ci.useDisability ? 'oui' : 'non'}
                onChange={(v) => patchSection(setPlan, 'criticalIllnessNeeds', { useDisability: v === 'oui' })}
                options={[
                  { value: 'oui', label: 'Oui' },
                  { value: 'non', label: 'Non' },
                ]}
              />
            </div>
            <div>
              <p className="mb-1 text-xs text-[#5a6b7d]">Utiliser le fonds d’urgence ?</p>
              <SegmentedToggle
                value={ci.useEmergency ? 'oui' : 'non'}
                onChange={(v) => patchSection(setPlan, 'criticalIllnessNeeds', { useEmergency: v === 'oui' })}
                options={[
                  { value: 'oui', label: 'Oui' },
                  { value: 'non', label: 'Non' },
                ]}
              />
            </div>
          </div>
        </CollectCard>

        <CollectCard title="Remplacement du revenu">
          <div className="grid gap-3 md:grid-cols-2">
            <FieldLabel label="Revenu client $/mois">
              <TextField
                type="number"
                value={ci.clientMonthlyIncome}
                onChange={(v) => patchSection(setPlan, 'criticalIllnessNeeds', { clientMonthlyIncome: v })}
              />
            </FieldLabel>
            <FieldLabel label="Pendant (mois)">
              <TextField
                type="number"
                value={ci.clientMonths}
                onChange={(v) => patchSection(setPlan, 'criticalIllnessNeeds', { clientMonths: v })}
              />
            </FieldLabel>
            <FieldLabel label="Revenu aidant $/mois">
              <TextField
                type="number"
                value={ci.caregiverMonthly}
                onChange={(v) => patchSection(setPlan, 'criticalIllnessNeeds', { caregiverMonthly: v })}
              />
            </FieldLabel>
            <FieldLabel label="Aidant (mois)">
              <TextField
                type="number"
                value={ci.caregiverMonths}
                onChange={(v) => patchSection(setPlan, 'criticalIllnessNeeds', { caregiverMonths: v })}
              />
            </FieldLabel>
          </div>
        </CollectCard>

        <CollectCard title="Dépenses supplémentaires">
          <SegmentedToggle
            value={ci.protectionLevel || 'confort'}
            onChange={(v) => patchSection(setPlan, 'criticalIllnessNeeds', { protectionLevel: v })}
            options={[
              { value: 'aucun', label: 'Aucun' },
              { value: 'base', label: 'Base' },
              { value: 'confort', label: 'Confort' },
              { value: 'superieur', label: 'Supérieur' },
            ]}
          />
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {[
              ['uninsuredTreatment', 'Traitement non assuré'],
              ['medicalEquipment', 'Équipement médical'],
              ['homeAdapt', 'Adaptation du domicile'],
              ['vehicleAdapt', 'Adaptation du véhicule'],
              ['other', 'Autres frais'],
            ].map(([key, label]) => (
              <FieldLabel key={key} label={label}>
                <TextField
                  type="number"
                  value={extras[key]}
                  onChange={(v) =>
                    patchSection(setPlan, 'criticalIllnessNeeds', {
                      extras: { ...extras, [key]: v },
                    })
                  }
                />
              </FieldLabel>
            ))}
          </div>
        </CollectCard>
      </div>
      <StepFooter onPrev={goWorkflowPrev} onNext={goWorkflowNext} />
    </CollectShell>
  );
}

export function ProjectsStep() {
  const { plan, setPlan, goWorkflowNext, goWorkflowPrev } = usePlan();

  return (
    <CollectShell title={<StepTitle>Projets</StepTitle>}>
      <CollectCard
        title="Projets / événements de cashflow"
        action={
          <AddRowButton
            onClick={() =>
              setPlan((p) => ({
                ...p,
                projects: [
                  ...(p.projects || []),
                  { id: newId('prj'), name: 'Nouveau projet', year: new Date().getFullYear(), amount: 0 },
                ],
              }))
            }
          >
            Ajouter un projet
          </AddRowButton>
        }
      >
        {(plan.projects || []).length === 0 && (
          <p className="text-sm text-[#5a6b7d]">Aucun projet. Ajoutez voyages, rénovations, etc.</p>
        )}
        <div className="space-y-2">
          {(plan.projects || []).map((prj) => (
            <div key={prj.id} className="grid gap-2 md:grid-cols-4">
              <TextField
                value={prj.name}
                onChange={(v) =>
                  setPlan((p) => ({
                    ...p,
                    projects: p.projects.map((x) => (x.id === prj.id ? { ...x, name: v } : x)),
                  }))
                }
              />
              <TextField
                type="number"
                value={prj.year}
                onChange={(v) =>
                  setPlan((p) => ({
                    ...p,
                    projects: p.projects.map((x) => (x.id === prj.id ? { ...x, year: v } : x)),
                  }))
                }
              />
              <TextField
                type="number"
                value={prj.amount}
                onChange={(v) =>
                  setPlan((p) => ({
                    ...p,
                    projects: p.projects.map((x) => (x.id === prj.id ? { ...x, amount: v } : x)),
                  }))
                }
              />
              <button
                type="button"
                className="text-xs text-red-600"
                onClick={() =>
                  setPlan((p) => ({ ...p, projects: p.projects.filter((x) => x.id !== prj.id) }))
                }
              >
                Retirer
              </button>
            </div>
          ))}
        </div>
      </CollectCard>
      <StepFooter onPrev={goWorkflowPrev} onNext={goWorkflowNext} />
    </CollectShell>
  );
}

export function RetirementStep() {
  const { plan, setPlan, goWorkflowNext, goWorkflowPrev, attainment } = usePlan();
  const r = plan.retirement || {};
  const att = attainment?.retirement;

  return (
    <CollectShell
      title={<StepTitle>Retraite</StepTitle>}
      right={
        <AttainmentPanel
          clientLabel={clientName(plan)}
          attainment={att}
          extraRows={
            att?.breakdown?.totalDeficit != null ? (
              <div className="flex justify-between gap-3 border-t border-[#e8eef5] pt-2 text-sm">
                <dt className="text-red-700">Déficit total illustratif</dt>
                <dd className="font-bold tabular-nums text-red-600">
                  {formatCad(att.breakdown.totalDeficit)}
                </dd>
              </div>
            ) : null
          }
        />
      }
    >
      <div className="space-y-4">
        <CollectCard title="Moment de la retraite">
          <div className="grid gap-3 md:grid-cols-2">
            <FieldLabel label="Âge cible">
              <TextField
                type="number"
                value={r.targetAge}
                onChange={(v) => patchSection(setPlan, 'retirement', { targetAge: v })}
              />
            </FieldLabel>
          </div>
        </CollectCard>

        <CollectCard title="Objectif de revenu">
          <div className="flex flex-wrap gap-2">
            <SegmentedToggle
              value={r.incomeUnit || 'pct'}
              onChange={(v) => patchSection(setPlan, 'retirement', { incomeUnit: v })}
              options={[
                { value: 'pct', label: '%' },
                { value: 'cad', label: '$' },
              ]}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            {r.incomeUnit === 'cad' ? (
              <TextField
                type="number"
                className="w-32"
                value={r.replaceAmount}
                onChange={(v) => patchSection(setPlan, 'retirement', { replaceAmount: v })}
              />
            ) : (
              <>
                <TextField
                  type="number"
                  className="w-16"
                  value={r.replacePct}
                  onChange={(v) => patchSection(setPlan, 'retirement', { replacePct: v })}
                />
                % du revenu net actuel
              </>
            )}
          </div>
        </CollectCard>

        <CollectCard title="Profil d’investisseur">
          <div className="grid gap-3 md:grid-cols-2">
            <FieldLabel label="Avant la retraite">
              <select
                className="w-full rounded-md border border-[#d7dee8] bg-white px-3 py-2 text-sm"
                value={r.profileBefore || 'modere'}
                onChange={(e) => patchSection(setPlan, 'retirement', { profileBefore: e.target.value })}
              >
                <option value="conservateur">Conservateur</option>
                <option value="modere">Modéré</option>
                <option value="audacieux">Audacieux</option>
              </select>
            </FieldLabel>
            <FieldLabel label="Pendant la retraite">
              <select
                className="w-full rounded-md border border-[#d7dee8] bg-white px-3 py-2 text-sm"
                value={r.profileDuring || 'conservateur'}
                onChange={(e) => patchSection(setPlan, 'retirement', { profileDuring: e.target.value })}
              >
                <option value="conservateur">Conservateur</option>
                <option value="modere">Modéré</option>
                <option value="audacieux">Audacieux</option>
              </select>
            </FieldLabel>
          </div>
        </CollectCard>

        <CollectCard title="Régimes publics">
          {(r.publicPensions || []).map((p) => (
            <div key={p.id} className="mb-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="w-16 font-semibold">{p.type}</span>
              <TextField
                type="number"
                className="w-28"
                value={p.annualAmount}
                onChange={(v) =>
                  patchSection(setPlan, 'retirement', {
                    publicPensions: r.publicPensions.map((x) =>
                      x.id === p.id ? { ...x, annualAmount: v } : x,
                    ),
                  })
                }
              />
              <span className="text-xs text-[#5a6b7d]">$/an · dès {p.startAge} ans</span>
            </div>
          ))}
        </CollectCard>

        <CollectCard title="Actifs alloués à l’objectif (ordre de décaissement)">
          {(plan.assets || [])
            .filter((a) => a.type === 'reer' || a.type === 'celi' || a.type === 'non_enregistre')
            .map((a) => {
              const checked = (r.decumulationAssetIds || []).includes(a.id);
              return (
                <label key={a.id} className="mb-1 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const set = new Set(r.decumulationAssetIds || []);
                      if (checked) set.delete(a.id);
                      else set.add(a.id);
                      patchSection(setPlan, 'retirement', { decumulationAssetIds: [...set] });
                    }}
                  />
                  {a.name} — {formatCad(a.currentBalance)}
                </label>
              );
            })}
        </CollectCard>
      </div>
      <StepFooter onPrev={goWorkflowPrev} onNext={goWorkflowNext} />
    </CollectShell>
  );
}

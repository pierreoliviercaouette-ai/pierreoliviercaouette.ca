import { ASSET_TYPES, DEBT_TYPES, formatCad, newId } from '../../lib/illustrateur';
import { usePlan } from './PlanContext';
import { AddRowButton, CollectCard, NetWorthPanel, StepFooter, StepTitle } from './collectUi';
import { CollectShell } from './CollectShell';

export function CollectBilanStep() {
  const { plan, addToCollection, removeFromCollection, updateCollection, goWorkflowNext, goWorkflowPrev, attainment } =
    usePlan();
  const nw = attainment?.netWorth?.breakdown || {};
  const client =
    [plan.person?.firstName, plan.person?.lastName].filter(Boolean).join(' ') ||
    plan.meta?.clientLabel ||
    'Client';

  const addAsset = (kind) => {
    addToCollection('assets', {
      id: newId('ast'),
      name: kind === 'bien' ? 'Nouveau bien' : 'Nouveau placement',
      type: kind === 'bien' ? 'immobilier' : 'non_enregistre',
      entityId: plan.entities?.[0]?.id,
      currentBalance: 0,
      monthlyContribution: 0,
      avgAnnualReturn: 5,
    });
  };

  const addDebt = () => {
    addToCollection('debts', {
      id: newId('debt'),
      name: 'Nouveau passif',
      type: 'hypotheque',
      entityId: plan.entities?.[0]?.id,
      currentBalance: 0,
      interestRate: 4.5,
      monthlyPayment: 0,
      amortizationRemaining: 25,
    });
  };

  return (
    <CollectShell
      title={<StepTitle>Actifs et passifs</StepTitle>}
      right={
        <NetWorthPanel
          clientLabel={client}
          assets={nw.assets || 0}
          debts={nw.debts || 0}
          netWorth={nw.netWorth || 0}
        />
      }
    >
      <div className="space-y-5">
        <CollectCard
          title="Actifs"
          action={
            <div className="flex flex-wrap gap-2">
              <AddRowButton onClick={() => addAsset('placement')}>Ajouter un placement</AddRowButton>
              <AddRowButton onClick={() => addAsset('bien')}>Ajouter un bien</AddRowButton>
            </div>
          }
        >
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-[#5a6b7d]">
              <tr>
                <th className="py-2">Type</th>
                <th>Description</th>
                <th>Valeur</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {(plan.assets || []).map((a) => (
                <tr key={a.id} className="border-t border-[#d7dee8] bg-white/70">
                  <td className="py-2">
                    <select
                      className="rounded border border-[#d7dee8] bg-white px-2 py-1 text-xs"
                      value={a.type}
                      onChange={(e) => updateCollection('assets', a.id, { type: e.target.value })}
                    >
                      {ASSET_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      className="w-full rounded border border-[#d7dee8] px-2 py-1"
                      value={a.name || ''}
                      onChange={(e) => updateCollection('assets', a.id, { name: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="w-28 rounded border border-[#d7dee8] px-2 py-1 tabular-nums"
                      value={a.currentBalance ?? 0}
                      onChange={(e) =>
                        updateCollection('assets', a.id, { currentBalance: Number(e.target.value) || 0 })
                      }
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="text-xs text-red-600"
                      onClick={() => removeFromCollection('assets', a.id)}
                    >
                      Retirer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollectCard>

        <CollectCard title="Passifs" action={<AddRowButton onClick={addDebt}>Ajouter un passif</AddRowButton>}>
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-[#5a6b7d]">
              <tr>
                <th className="py-2">Type</th>
                <th>Description</th>
                <th>Amort.</th>
                <th>Solde</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {(plan.debts || []).map((d) => (
                <tr key={d.id} className="border-t border-[#d7dee8] bg-white/70">
                  <td className="py-2">
                    <select
                      className="rounded border border-[#d7dee8] bg-white px-2 py-1 text-xs"
                      value={d.type}
                      onChange={(e) => updateCollection('debts', d.id, { type: e.target.value })}
                    >
                      {DEBT_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      className="w-full rounded border border-[#d7dee8] px-2 py-1"
                      value={d.name || ''}
                      onChange={(e) => updateCollection('debts', d.id, { name: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="w-16 rounded border border-[#d7dee8] px-2 py-1"
                      value={d.amortizationRemaining ?? 0}
                      onChange={(e) =>
                        updateCollection('debts', d.id, {
                          amortizationRemaining: Number(e.target.value) || 0,
                        })
                      }
                    />
                  </td>
                  <td className="tabular-nums">{formatCad(d.currentBalance)}</td>
                  <td>
                    <button
                      type="button"
                      className="text-xs text-red-600"
                      onClick={() => removeFromCollection('debts', d.id)}
                    >
                      Retirer
                    </button>
                    <input
                      type="number"
                      className="ml-2 w-24 rounded border border-[#d7dee8] px-2 py-1"
                      value={d.currentBalance ?? 0}
                      onChange={(e) =>
                        updateCollection('debts', d.id, { currentBalance: Number(e.target.value) || 0 })
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollectCard>
      </div>
      <StepFooter onPrev={goWorkflowPrev} onNext={goWorkflowNext} />
    </CollectShell>
  );
}

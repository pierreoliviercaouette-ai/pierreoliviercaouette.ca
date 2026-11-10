import { useMemo } from 'react';
import { formatCad, planHasCorporate } from '../../lib/illustrateur';
import { computeYearTaxSnapshot } from '../../lib/illustrateur/planningTax';
import { CollectShell } from './CollectShell';
import { CollectCard, FieldLabel, StepFooter, StepTitle, TextField } from './collectUi';
import { usePlan } from './PlanContext';

export function FiscaliteStep() {
  const { plan, updateCollection, goWorkflowNext, goWorkflowPrev } = usePlan();
  const withCorp = planHasCorporate(plan);
  const entities = useMemo(
    () =>
      (plan.entities || []).filter((e) => withCorp || e.type !== 'corporation'),
    [plan.entities, withCorp],
  );

  const snapshot = useMemo(() => {
    try {
      return computeYearTaxSnapshot({
        entities: plan.entities || [],
        assets: plan.assets || [],
        debts: plan.debts || [],
        revenues: plan.revenues || [],
        year: new Date().getFullYear(),
        projectionYearIndex: 0,
      });
    } catch (err) {
      return { error: String(err?.message || err) };
    }
  }, [plan]);

  const entityTax = snapshot?.revenueTax?.byEntity || {};
  const cashflows = snapshot?.entityCashflows || {};

  return (
    <CollectShell title={<StepTitle>Fiscalité</StepTitle>}>
      <p className="mb-4 rounded-lg border border-[#d7dee8] bg-[#eaf2fb] px-3 py-2 text-sm text-[#3d4f66]">
        Vue illustrative année 0 (taux marginaux + moteur planningTax). Ajustez les taux par entité ; le détail
        successoral admin reste dans l’analyse avancée.
      </p>

      <CollectCard title="Taux par entité">
        <div className="space-y-3">
          {entities.map((ent) => (
            <div key={ent.id} className="grid gap-3 rounded-lg border border-[#d7dee8] bg-white p-3 md:grid-cols-4">
              <p className="text-sm font-semibold">
                {ent.name}
                <span className="ml-2 text-xs font-normal text-[#5a6b7d]">{ent.type}</span>
              </p>
              <FieldLabel label="Province">
                <TextField
                  value={ent.province || 'QC'}
                  onChange={(v) => updateCollection('entities', ent.id, { province: v })}
                />
              </FieldLabel>
              <FieldLabel label="Taux marginal %">
                <TextField
                  type="number"
                  value={ent.marginalTaxRate}
                  onChange={(v) => updateCollection('entities', ent.id, { marginalTaxRate: v })}
                />
              </FieldLabel>
              <p className="text-xs text-[#5a6b7d] self-end pb-2">
                Impôt revenu ill. : {formatCad(entityTax[ent.id]?.totalTax || 0)}
              </p>
            </div>
          ))}
        </div>
      </CollectCard>

      <div className="mt-4">
        <CollectCard title="Trésorerie après impôt (par entité)">
          {snapshot?.error && <p className="text-sm text-red-600">{snapshot.error}</p>}
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-[#5a6b7d]">
              <tr>
                <th className="py-2 text-left">Entité</th>
                <th>Revenus</th>
                <th>Impôt</th>
                <th>Dettes</th>
                <th>Cashflow net</th>
              </tr>
            </thead>
            <tbody>
              {entities.map((ent) => {
                const cf = cashflows[ent.id] || {};
                return (
                  <tr key={ent.id} className="border-t border-[#d7dee8] bg-white/70">
                    <td className="py-2 font-medium">{ent.name}</td>
                    <td className="tabular-nums">{formatCad(cf.grossRevenue || 0)}</td>
                    <td className="tabular-nums">{formatCad(cf.incomeTax || 0)}</td>
                    <td className="tabular-nums">{formatCad(cf.debtPayments || 0)}</td>
                    <td className="tabular-nums font-semibold">{formatCad(cf.netCashflow || 0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-3 text-sm text-[#5a6b7d]">
            Impôt total ill. : {formatCad(snapshot?.totalTax || 0)} · Cashflow après impôt :{' '}
            {formatCad(snapshot?.annualCashflowAfterTax || 0)} · Primes :{' '}
            {formatCad(snapshot?.annualInsurancePremiums || 0)}
          </p>
        </CollectCard>
      </div>

      <StepFooter onPrev={goWorkflowPrev} onNext={goWorkflowNext} />
    </CollectShell>
  );
}

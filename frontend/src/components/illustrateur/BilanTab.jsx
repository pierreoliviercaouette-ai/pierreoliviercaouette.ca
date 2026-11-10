import {
  ASSET_TYPES,
  DEBT_TYPES,
  DEFAULT_TAX_RATES,
  ENTITY_TYPES,
  formatCad,
  parseInsuranceCsv,
} from '../../lib/illustrateur';
import { MoneyInput, SelectInput, TextInput, SectionCard } from './Field';
import { usePlan } from './PlanContext';

export function BilanTab() {
  const { plan, setPlan, updateCollection, addToCollection, removeFromCollection } = usePlan();
  const entityOptions = (plan.entities || []).map((e) => ({ value: e.id, label: e.name }));

  const addEntity = () => {
    addToCollection('entities', {
      name: 'Nouvelle entité',
      type: 'personnel',
      province: 'QC',
      marginalTaxRate: DEFAULT_TAX_RATES.personnel,
    });
  };

  const addAsset = () => {
    const entityId = plan.entities?.[0]?.id;
    addToCollection('assets', {
      name: 'Nouvel actif',
      type: 'non_enregistre',
      entityId,
      currentBalance: 0,
      monthlyContribution: 0,
      avgAnnualReturn: 5,
    });
  };

  const addDebt = () => {
    const entityId = plan.entities?.[0]?.id;
    addToCollection('debts', {
      name: 'Nouvelle dette',
      type: 'hypotheque',
      entityId,
      currentBalance: 0,
      interestRate: 4.5,
      monthlyPayment: 0,
      amortizationRemaining: 25,
    });
  };

  const onInsuranceCsv = async (assetId, file) => {
    if (!file) return;
    const text = await file.text();
    const schedule = parseInsuranceCsv(text);
    if (!schedule.length) {
      window.alert('Aucune ligne de barème reconnue dans le CSV.');
      return;
    }
    updateCollection('assets', assetId, {
      insuranceSchedule: schedule,
      insuranceCurrentYearIdx: 0,
      currentBalance: schedule[0].surrenderValue || 0,
      totalInsurance: schedule[0].totalInsurance || 0,
      annualPremium: schedule[0].premiumPaid || 0,
    });
  };

  const totalAssets = (plan.assets || []).reduce((s, a) => s + (parseFloat(a.currentBalance) || 0), 0);
  const totalDebts = (plan.debts || []).reduce((s, d) => s + (parseFloat(d.currentBalance) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Actifs" value={formatCad(totalAssets)} />
        <Kpi label="Passifs" value={formatCad(totalDebts)} />
        <Kpi label="Valeur nette" value={formatCad(totalAssets - totalDebts)} />
      </div>

      <SectionCard
        title="Entités"
        action={
          <button type="button" onClick={addEntity} className="text-sm font-semibold text-primary">
            + Entité
          </button>
        }
      >
        <div className="space-y-3">
          {(plan.entities || []).map((ent) => (
            <div key={ent.id} className="grid gap-3 rounded-xl border border-prestige-beige/80 p-3 md:grid-cols-5">
              <TextInput label="Nom" value={ent.name} onChange={(v) => updateCollection('entities', ent.id, { name: v })} />
              <SelectInput
                label="Type"
                value={ent.type}
                options={ENTITY_TYPES}
                onChange={(v) =>
                  updateCollection('entities', ent.id, {
                    type: v,
                    marginalTaxRate:
                      v === 'corporation' ? DEFAULT_TAX_RATES.corporation : DEFAULT_TAX_RATES.personnel,
                  })
                }
              />
              <MoneyInput
                label="Taux marginal %"
                value={ent.marginalTaxRate}
                onChange={(v) => updateCollection('entities', ent.id, { marginalTaxRate: v })}
              />
              <TextInput
                label="Province"
                value={ent.province || 'QC'}
                onChange={(v) => updateCollection('entities', ent.id, { province: v })}
              />
              <div className="flex items-end">
                <button
                  type="button"
                  className="text-xs text-red-700"
                  onClick={() => removeFromCollection('entities', ent.id)}
                >
                  Retirer
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Actifs"
        action={
          <button type="button" onClick={addAsset} className="text-sm font-semibold text-primary">
            + Actif
          </button>
        }
      >
        <div className="space-y-3">
          {(plan.assets || []).map((asset) => (
            <div key={asset.id} className="space-y-3 rounded-xl border border-prestige-beige/80 p-3">
              <div className="grid gap-3 md:grid-cols-6">
                <TextInput
                  label="Nom"
                  value={asset.name}
                  onChange={(v) => updateCollection('assets', asset.id, { name: v })}
                  className="md:col-span-2"
                />
                <SelectInput
                  label="Type"
                  value={asset.type}
                  options={ASSET_TYPES}
                  onChange={(v) => updateCollection('assets', asset.id, { type: v })}
                />
                <SelectInput
                  label="Entité"
                  value={asset.entityId}
                  options={entityOptions}
                  onChange={(v) => updateCollection('assets', asset.id, { entityId: v })}
                />
                <MoneyInput
                  label="Solde $"
                  value={asset.currentBalance}
                  onChange={(v) => updateCollection('assets', asset.id, { currentBalance: v })}
                />
                <MoneyInput
                  label="Cotis. $/mois"
                  value={asset.monthlyContribution}
                  onChange={(v) => updateCollection('assets', asset.id, { monthlyContribution: v })}
                />
              </div>
              <div className="grid gap-3 md:grid-cols-4">
                <MoneyInput
                  label="Rendement %/an"
                  value={asset.avgAnnualReturn}
                  onChange={(v) => updateCollection('assets', asset.id, { avgAnnualReturn: v })}
                />
                {asset.type === 'assurance_participative' && (
                  <>
                    <MoneyInput
                      label="Prime annuelle $"
                      value={asset.annualPremium}
                      onChange={(v) => updateCollection('assets', asset.id, { annualPremium: v })}
                    />
                    <SelectInput
                      label="Débit prime"
                      value={asset.premiumDebitAssetId || ''}
                      options={[
                        { value: '', label: '— Aucun —' },
                        ...(plan.assets || [])
                          .filter((a) => a.id !== asset.id)
                          .map((a) => ({ value: a.id, label: a.name })),
                      ]}
                      onChange={(v) =>
                        updateCollection('assets', asset.id, { premiumDebitAssetId: v || null })
                      }
                    />
                    <MoneyInput
                      label="LTV collatéral %"
                      value={asset.collateralLtvPercent ?? 90}
                      onChange={(v) => updateCollection('assets', asset.id, { collateralLtvPercent: v })}
                    />
                  </>
                )}
              </div>
              {asset.type === 'assurance_participative' && (
                <div className="flex flex-wrap items-center gap-3 text-xs text-prestige-taupe">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-prestige-beige px-3 py-1.5">
                    Importer barème CSV
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      className="hidden"
                      onChange={(e) => onInsuranceCsv(asset.id, e.target.files?.[0])}
                    />
                  </label>
                  <span>
                    {asset.insuranceSchedule?.length
                      ? `${asset.insuranceSchedule.length} lignes · VR ${formatCad(asset.currentBalance)}`
                      : 'Aucun barème — utilisez prime/VR manuels'}
                  </span>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(asset.pfiEnabled)}
                      onChange={(e) => updateCollection('assets', asset.id, { pfiEnabled: e.target.checked })}
                    />
                    PFI activé
                  </label>
                  {asset.pfiEnabled && (
                    <>
                      <MoneyInput
                        label="Avance PFI $/an"
                        value={asset.pfiAnnualAdvanceAmount || 0}
                        onChange={(v) => updateCollection('assets', asset.id, { pfiAnnualAdvanceAmount: v })}
                      />
                      <MoneyInput
                        label="Taux PFI %"
                        value={asset.pfiInterestRate || 5}
                        onChange={(v) => updateCollection('assets', asset.id, { pfiInterestRate: v })}
                      />
                    </>
                  )}
                </div>
              )}
              <button
                type="button"
                className="text-xs text-red-700"
                onClick={() => removeFromCollection('assets', asset.id)}
              >
                Retirer l’actif
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Passifs"
        action={
          <button type="button" onClick={addDebt} className="text-sm font-semibold text-primary">
            + Dette
          </button>
        }
      >
        <div className="space-y-3">
          {(plan.debts || []).map((debt) => (
            <div key={debt.id} className="grid gap-3 rounded-xl border border-prestige-beige/80 p-3 md:grid-cols-6">
              <TextInput
                label="Nom"
                value={debt.name}
                onChange={(v) => updateCollection('debts', debt.id, { name: v })}
                className="md:col-span-2"
              />
              <SelectInput
                label="Type"
                value={debt.type}
                options={DEBT_TYPES}
                onChange={(v) => updateCollection('debts', debt.id, { type: v })}
              />
              <SelectInput
                label="Entité"
                value={debt.entityId}
                options={entityOptions}
                onChange={(v) => updateCollection('debts', debt.id, { entityId: v })}
              />
              <MoneyInput
                label="Solde $"
                value={debt.currentBalance}
                onChange={(v) => updateCollection('debts', debt.id, { currentBalance: v })}
              />
              <MoneyInput
                label="Taux %"
                value={debt.interestRate}
                onChange={(v) => updateCollection('debts', debt.id, { interestRate: v })}
              />
              <MoneyInput
                label="Paiement $/mois"
                value={debt.monthlyPayment}
                onChange={(v) => updateCollection('debts', debt.id, { monthlyPayment: v })}
              />
              <MoneyInput
                label="Amort. restant (ans)"
                value={debt.amortizationRemaining}
                onChange={(v) => updateCollection('debts', debt.id, { amortizationRemaining: v })}
              />
              <SelectInput
                label="Actif lié"
                value={debt.linkedAssetId || ''}
                options={[
                  { value: '', label: '— Aucun —' },
                  ...(plan.assets || []).map((a) => ({ value: a.id, label: a.name })),
                ]}
                onChange={(v) => updateCollection('debts', debt.id, { linkedAssetId: v || null })}
              />
              <div className="flex items-end">
                <button
                  type="button"
                  className="text-xs text-red-700"
                  onClick={() => removeFromCollection('debts', debt.id)}
                >
                  Retirer
                </button>
              </div>
            </div>
          ))}
          {!plan.debts?.length && <p className="text-sm text-prestige-taupe">Aucune dette.</p>}
        </div>
      </SectionCard>

      <SectionCard title="Métadonnées dossier">
        <div className="grid gap-3 md:grid-cols-2">
          <TextInput
            label="Nom du dossier"
            value={plan.meta?.name || ''}
            onChange={(v) => setPlan((p) => ({ ...p, meta: { ...p.meta, name: v } }))}
          />
          <TextInput
            label="Libellé client (écran seulement)"
            value={plan.meta?.clientLabel || ''}
            onChange={(v) => setPlan((p) => ({ ...p, meta: { ...p.meta, clientLabel: v } }))}
          />
        </div>
      </SectionCard>
    </div>
  );
}

function Kpi({ label, value }) {
  return (
    <div className="rounded-2xl border border-prestige-beige bg-white px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.14em] text-prestige-taupe">{label}</p>
      <p className="mt-1 font-heading text-2xl tabular-nums text-dark">{value}</p>
    </div>
  );
}

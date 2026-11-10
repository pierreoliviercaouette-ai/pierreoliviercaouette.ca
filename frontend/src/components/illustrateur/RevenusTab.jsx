import { REVENUE_TYPES, formatCad } from '../../lib/illustrateur';
import { MoneyInput, SelectInput, TextInput, SectionCard } from './Field';
import { usePlan } from './PlanContext';

export function RevenusTab() {
  const { plan, projection, updateCollection, addToCollection, removeFromCollection } = usePlan();
  const entityOptions = (plan.entities || []).map((e) => ({ value: e.id, label: e.name }));
  const year0 = projection?.data?.[0];

  const addRevenue = () => {
    addToCollection('revenues', {
      name: 'Nouveau revenu',
      type: 'salaire',
      entityId: plan.entities?.[0]?.id,
      monthlyAmount: 0,
      growthRate: 2,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Revenus bruts an 0" value={formatCad(year0?.annualRevenueGross)} />
        <Kpi label="Impôt estimé an 0" value={formatCad(year0?.annualTax)} />
        <Kpi label="Cashflow après impôt" value={formatCad(year0?.annualCashflowAfterTax)} />
      </div>

      <SectionCard
        title="Revenus"
        action={
          <button type="button" onClick={addRevenue} className="text-sm font-semibold text-primary">
            + Revenu
          </button>
        }
      >
        <div className="space-y-3">
          {(plan.revenues || []).map((rev) => (
            <div key={rev.id} className="grid gap-3 rounded-xl border border-prestige-beige/80 p-3 md:grid-cols-6">
              <TextInput
                label="Nom"
                value={rev.name}
                onChange={(v) => updateCollection('revenues', rev.id, { name: v })}
                className="md:col-span-2"
              />
              <SelectInput
                label="Type"
                value={rev.type}
                options={REVENUE_TYPES}
                onChange={(v) => updateCollection('revenues', rev.id, { type: v })}
              />
              <SelectInput
                label="Entité"
                value={rev.entityId}
                options={entityOptions}
                onChange={(v) => updateCollection('revenues', rev.id, { entityId: v })}
              />
              <MoneyInput
                label="$ / mois"
                value={rev.monthlyAmount}
                onChange={(v) => updateCollection('revenues', rev.id, { monthlyAmount: v })}
              />
              <MoneyInput
                label="Croissance %/an"
                value={rev.growthRate ?? 0}
                onChange={(v) => updateCollection('revenues', rev.id, { growthRate: v })}
              />
              {rev.type === 'dividende' && (
                <SelectInput
                  label="Classe"
                  value={rev.dividendClass || 'non_eligible'}
                  options={[
                    { value: 'non_eligible', label: 'Non déterminé' },
                    { value: 'eligible', label: 'Déterminé' },
                    { value: 'capital', label: 'Capital' },
                  ]}
                  onChange={(v) => updateCollection('revenues', rev.id, { dividendClass: v })}
                />
              )}
              <div className="flex items-end">
                <button
                  type="button"
                  className="text-xs text-red-700"
                  onClick={() => removeFromCollection('revenues', rev.id)}
                >
                  Retirer
                </button>
              </div>
            </div>
          ))}
          {!plan.revenues?.length && (
            <p className="text-sm text-prestige-taupe">Ajoutez un salaire ou un dividende pour alimenter le cashflow.</p>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Lecture cashflow an 0">
        <p className="text-sm leading-relaxed text-prestige-taupe">
          Le moteur ImmoIQ estime l’impôt via le taux marginal de chaque entité, débite les primes d’assurance
          des comptes liquides liés, puis oriente le surplus selon les événements « direction du cashflow ».
          Les chiffres restent illustratifs — à valider avec un fiscaliste.
        </p>
        {year0?.annualInsurancePremiums > 0 && (
          <p className="mt-3 text-sm tabular-nums text-dark">
            Primes assurance année 0 : {formatCad(year0.annualInsurancePremiums)}
          </p>
        )}
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

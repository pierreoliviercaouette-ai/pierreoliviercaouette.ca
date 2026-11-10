import { EVENT_TYPES, formatCad } from '../../lib/illustrateur';
import { MoneyInput, SelectInput, TextInput, SectionCard } from './Field';
import { usePlan } from './PlanContext';

const currentYear = new Date().getFullYear();

export function PlanificationTab() {
  const { plan, setPlan, updateCollection, addToCollection, removeFromCollection } = usePlan();
  const assetOptions = (plan.assets || []).map((a) => ({ value: a.id, label: `${a.name} (${a.type})` }));

  const addEvent = () => {
    addToCollection('events', {
      name: 'Nouvel événement',
      type: 'cotisation_celi',
      year: currentYear + 1,
      details: { amount: 7000, assetId: plan.assets?.find((a) => a.type === 'celi')?.id || '' },
    });
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Horizon">
        <div className="grid gap-3 md:grid-cols-3">
          <MoneyInput
            label="Horizon (années)"
            value={plan.horizonYears ?? 25}
            onChange={(v) => setPlan((p) => ({ ...p, horizonYears: Math.min(60, Math.max(0, v)) }))}
          />
          <MoneyInput
            label="Année de décès illustratif"
            value={plan.deathScenarioYear ?? currentYear + (plan.horizonYears || 25)}
            onChange={(v) => setPlan((p) => ({ ...p, deathScenarioYear: v || null }))}
          />
          <div className="flex items-end text-sm text-prestige-taupe">
            Projection {currentYear} → {currentYear + (plan.horizonYears || 25)}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Événements"
        action={
          <button type="button" onClick={addEvent} className="text-sm font-semibold text-primary">
            + Événement
          </button>
        }
      >
        <div className="space-y-3">
          {(plan.events || [])
            .slice()
            .sort((a, b) => (a.year || 0) - (b.year || 0))
            .map((evt) => (
              <div key={evt.id} className="space-y-3 rounded-xl border border-prestige-beige/80 p-3">
                <div className="grid gap-3 md:grid-cols-5">
                  <TextInput
                    label="Nom"
                    value={evt.name}
                    onChange={(v) => updateCollection('events', evt.id, { name: v })}
                    className="md:col-span-2"
                  />
                  <SelectInput
                    label="Type"
                    value={evt.type}
                    options={EVENT_TYPES}
                    onChange={(v) =>
                      updateCollection('events', evt.id, {
                        type: v,
                        details: defaultDetailsForType(v, plan),
                      })
                    }
                  />
                  <MoneyInput
                    label="Année"
                    value={evt.year}
                    onChange={(v) => updateCollection('events', evt.id, { year: v })}
                  />
                  <div className="flex items-end">
                    <button
                      type="button"
                      className="text-xs text-red-700"
                      onClick={() => removeFromCollection('events', evt.id)}
                    >
                      Retirer
                    </button>
                  </div>
                </div>
                <EventDetails
                  evt={evt}
                  assetOptions={assetOptions}
                  onChange={(details) => updateCollection('events', evt.id, { details })}
                />
              </div>
            ))}
          {!plan.events?.length && (
            <p className="text-sm text-prestige-taupe">
              Ajoutez des cotisations/retraits REER·CELI, un PFI, ou une direction de cashflow.
            </p>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Rappel">
        <p className="text-sm text-prestige-taupe leading-relaxed">
          Les événements sont appliqués au début de l’année civile choisie. Les montants affichés dans Analyse
          (ex. {formatCad(0)}) restent des illustrations — pas une cotation assureur ni un avis fiscal.
        </p>
      </SectionCard>
    </div>
  );
}

function defaultDetailsForType(type, plan) {
  const celi = plan.assets?.find((a) => a.type === 'celi');
  const reer = plan.assets?.find((a) => a.type === 'reer');
  const policy = plan.assets?.find((a) => a.type === 'assurance_participative');
  switch (type) {
    case 'cotisation_celi':
    case 'retrait_celi':
      return { amount: 7000, assetId: celi?.id || '' };
    case 'cotisation_reer':
    case 'retrait_reer':
      return { amount: 10000, assetId: reer?.id || '' };
    case 'plan_financement_immediat':
    case 'avance_sur_police':
      return { amount: 25000, assetId: policy?.id || '' };
    case 'cashflow_direction':
      return { routingBySource: {} };
    case 'changement_contributions':
      return { assetId: celi?.id || '', monthlyContribution: 500 };
    default:
      return {};
  }
}

function EventDetails({ evt, assetOptions, onChange }) {
  const d = evt.details || {};
  const moneyTypes = new Set([
    'cotisation_celi',
    'retrait_celi',
    'cotisation_reer',
    'retrait_reer',
    'plan_financement_immediat',
    'avance_sur_police',
    'produit_financier',
  ]);

  if (evt.type === 'changement_contributions') {
    return (
      <div className="grid gap-3 md:grid-cols-3">
        <SelectInput
          label="Actif"
          value={d.assetId || ''}
          options={assetOptions}
          onChange={(v) => onChange({ ...d, assetId: v })}
        />
        <MoneyInput
          label="Nouvelle cotis. $/mois"
          value={d.monthlyContribution || 0}
          onChange={(v) => onChange({ ...d, monthlyContribution: v })}
        />
      </div>
    );
  }

  if (evt.type === 'cashflow_direction') {
    const sources = Object.entries(d.routingBySource || {});
    return (
      <div className="space-y-3">
        {sources.length === 0 && (
          <p className="text-xs text-prestige-taupe">
            Aucun routage. Chargez le dossier démo ou importez un JSON avec `routingBySource`.
          </p>
        )}
        {sources.map(([sourceId, route]) => {
          const dest = route?.destinations?.[0] || { assetId: '', percent: 100 };
          return (
            <div key={sourceId} className="grid gap-3 md:grid-cols-3">
              <p className="text-xs text-prestige-taupe self-end">Source entité · {sourceId.slice(0, 8)}…</p>
              <SelectInput
                label="Destination (surplus)"
                value={dest.assetId || ''}
                options={[{ value: '', label: '— Choisir —' }, ...assetOptions]}
                onChange={(v) =>
                  onChange({
                    ...d,
                    routingBySource: {
                      ...(d.routingBySource || {}),
                      [sourceId]: {
                        ...route,
                        destinations: [{ assetId: v, percent: 100 }],
                      },
                    },
                  })
                }
              />
              <MoneyInput
                label="% alloué"
                value={dest.percent ?? 100}
                onChange={(v) =>
                  onChange({
                    ...d,
                    routingBySource: {
                      ...(d.routingBySource || {}),
                      [sourceId]: {
                        ...route,
                        destinations: [{ assetId: dest.assetId, percent: v }],
                      },
                    },
                  })
                }
              />
            </div>
          );
        })}
      </div>
    );
  }

  if (evt.type === 'declaration_dividende') {
    return (
      <div className="grid gap-3 md:grid-cols-3">
        <MoneyInput
          label="Montant total $"
          value={d.totalAmount || 0}
          onChange={(v) => onChange({ ...d, totalAmount: v })}
        />
        <SelectInput
          label="Classe"
          value={d.dividendClass || 'non_eligible'}
          options={[
            { value: 'non_eligible', label: 'Non déterminé' },
            { value: 'eligible', label: 'Déterminé' },
          ]}
          onChange={(v) => onChange({ ...d, dividendClass: v })}
        />
        <TextInput
          label="ID corp (entityId)"
          value={d.corpEntityId || ''}
          onChange={(v) => onChange({ ...d, corpEntityId: v })}
        />
      </div>
    );
  }

  if (!moneyTypes.has(evt.type)) {
    return null;
  }

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <SelectInput
        label="Actif cible"
        value={d.assetId || ''}
        options={[{ value: '', label: '— Choisir —' }, ...assetOptions]}
        onChange={(v) => onChange({ ...d, assetId: v })}
      />
      <MoneyInput
        label="Montant $"
        value={d.amount || 0}
        onChange={(v) => onChange({ ...d, amount: v })}
      />
    </div>
  );
}

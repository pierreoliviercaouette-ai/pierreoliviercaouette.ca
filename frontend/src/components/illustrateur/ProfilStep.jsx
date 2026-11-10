import { SectionCard, TextInput, MoneyInput } from './Field';
import { usePlan } from './PlanContext';
import { WorkflowNav } from './WorkflowRail';

export function ProfilStep() {
  const { plan, setPlan } = usePlan();

  return (
    <div className="space-y-6">
      <SectionCard title="Profil du dossier">
        <p className="mb-4 text-sm text-prestige-taupe">
          Identité client et hypothèses de parcours. Ces infos structurent la présentation et le PDF.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <TextInput
            label="Nom du dossier"
            value={plan.meta?.name || ''}
            onChange={(v) => setPlan((p) => ({ ...p, meta: { ...p.meta, name: v } }))}
          />
          <TextInput
            label="Libellé client"
            value={plan.meta?.clientLabel || ''}
            onChange={(v) => setPlan((p) => ({ ...p, meta: { ...p.meta, clientLabel: v } }))}
          />
          <MoneyInput
            label="Horizon (années)"
            value={plan.horizonYears ?? 25}
            onChange={(v) => setPlan((p) => ({ ...p, horizonYears: v }))}
          />
        </div>
        <label className="mt-4 block text-xs">
          <span className="text-prestige-taupe">Notes / contexte RDV</span>
          <textarea
            className="mt-1 w-full rounded-lg border border-prestige-beige bg-white px-3 py-2 text-sm"
            rows={4}
            value={plan.meta?.notes || ''}
            onChange={(e) => setPlan((p) => ({ ...p, meta: { ...p.meta, notes: e.target.value } }))}
            placeholder="Objectifs exprimés, contraintes, personnes présentes…"
          />
        </label>
      </SectionCard>
      <WorkflowNav />
    </div>
  );
}

import { usePlan } from './PlanContext';
import {
  AddRowButton,
  CollectCard,
  FieldLabel,
  SegmentedToggle,
  SelectField,
  StepFooter,
  StepTitle,
  TextField,
} from './collectUi';
import { CollectShell } from './CollectShell';
import { newId } from '../../lib/illustrateur';

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
].map((label, i) => ({ value: String(i + 1), label }));

export function PersonalInfoStep() {
  const { plan, setPlan, goWorkflowNext, goWorkflowPrev } = usePlan();
  const person = plan.person || {};

  const patch = (updates) => {
    setPlan((p) => {
      const nextPerson = { ...p.person, ...updates };
      const label = [nextPerson.firstName, nextPerson.lastName].filter(Boolean).join(' ').trim();
      return {
        ...p,
        person: nextPerson,
        meta: {
          ...p.meta,
          clientLabel: label || p.meta?.clientLabel,
          name: label || p.meta?.name,
        },
      };
    });
  };

  return (
    <CollectShell title={<StepTitle>Informations personnelles</StepTitle>}>
      <div className="space-y-4">
        <CollectCard title="Client">
          <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Dossier local (session / JSON) — aucune fiche client cloud.
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <FieldLabel label="Prénom">
              <TextField value={person.firstName} onChange={(v) => patch({ firstName: v })} />
            </FieldLabel>
            <FieldLabel label="Nom">
              <TextField value={person.lastName} onChange={(v) => patch({ lastName: v })} />
            </FieldLabel>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <FieldLabel label="Jour">
              <TextField type="number" value={person.birthDay} onChange={(v) => patch({ birthDay: v })} />
            </FieldLabel>
            <FieldLabel label="Mois">
              <SelectField value={String(person.birthMonth || '')} onChange={(v) => patch({ birthMonth: v })} options={MONTHS} />
            </FieldLabel>
            <FieldLabel label="Année">
              <TextField type="number" value={person.birthYear} onChange={(v) => patch({ birthYear: v })} />
            </FieldLabel>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <FieldLabel label="Sexe">
              <SegmentedToggle
                value={person.sex || 'M'}
                onChange={(v) => patch({ sex: v })}
                options={[
                  { value: 'M', label: 'Masculin' },
                  { value: 'F', label: 'Féminin' },
                ]}
              />
            </FieldLabel>
            <FieldLabel label="État civil">
              <SelectField
                value={person.maritalStatus || 'celibataire'}
                onChange={(v) => patch({ maritalStatus: v })}
                options={[
                  { value: 'celibataire', label: 'Célibataire' },
                  { value: 'marie', label: 'Marié(e)' },
                  { value: 'conjoint', label: 'Conjoint(e) de fait' },
                  { value: 'divorce', label: 'Divorcé(e)' },
                  { value: 'veuf', label: 'Veuf/veuve' },
                ]}
              />
            </FieldLabel>
            <FieldLabel label="Province d’imposition">
              <SelectField
                value={person.province || 'QC'}
                onChange={(v) => patch({ province: v })}
                options={[
                  { value: 'QC', label: 'Québec' },
                  { value: 'ON', label: 'Ontario' },
                  { value: 'Autre', label: 'Autre' },
                ]}
              />
            </FieldLabel>
            <FieldLabel label="Courriel personnel">
              <TextField value={person.email} onChange={(v) => patch({ email: v })} />
            </FieldLabel>
            <FieldLabel label="Réside au Canada depuis (année)">
              <TextField type="number" value={person.canadaSinceYear} onChange={(v) => patch({ canadaSinceYear: v })} />
            </FieldLabel>
            <FieldLabel label="Usage de tabac">
              <SegmentedToggle
                value={person.tobacco ? 'oui' : 'non'}
                onChange={(v) => patch({ tobacco: v === 'oui' })}
                options={[
                  { value: 'oui', label: 'Oui' },
                  { value: 'non', label: 'Non' },
                ]}
              />
            </FieldLabel>
            <FieldLabel label="Langue">
              <SegmentedToggle
                value={person.language || 'fr'}
                onChange={(v) => patch({ language: v })}
                options={[
                  { value: 'fr', label: 'Français' },
                  { value: 'en', label: 'Anglais' },
                ]}
              />
            </FieldLabel>
          </div>
        </CollectCard>

        <CollectCard title="Type de plan">
          <SegmentedToggle
            value={person.planType || 'individuel'}
            onChange={(v) => patch({ planType: v })}
            options={[
              { value: 'individuel', label: 'Individuel' },
              { value: 'conjoint', label: 'Conjoint' },
            ]}
          />
        </CollectCard>

        <CollectCard
          title="Enfant(s) et personne(s) à charge"
          action={
            <AddRowButton
              onClick={() =>
                patch({
                  children: [...(person.children || []), { id: newId('ch'), name: '', birthYear: '' }],
                })
              }
            >
              Ajouter
            </AddRowButton>
          }
        >
          {(person.children || []).length === 0 && (
            <p className="text-sm text-[#5a6b7d]">Aucun enfant ajouté.</p>
          )}
          <div className="space-y-2">
            {(person.children || []).map((ch) => (
              <div key={ch.id} className="grid gap-2 md:grid-cols-3">
                <TextField
                  value={ch.name}
                  onChange={(v) =>
                    patch({
                      children: person.children.map((c) => (c.id === ch.id ? { ...c, name: v } : c)),
                    })
                  }
                />
                <TextField
                  type="number"
                  value={ch.birthYear}
                  onChange={(v) =>
                    patch({
                      children: person.children.map((c) => (c.id === ch.id ? { ...c, birthYear: v } : c)),
                    })
                  }
                />
                <button
                  type="button"
                  className="text-xs font-semibold text-red-600"
                  onClick={() => patch({ children: person.children.filter((c) => c.id !== ch.id) })}
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>
        </CollectCard>
      </div>
      <StepFooter onPrev={goWorkflowPrev} onNext={goWorkflowNext} />
    </CollectShell>
  );
}

import { useMemo, useState } from 'react';
import { Check, Clock, Settings2, Users } from 'lucide-react';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { CampagneToolShell, ToolDownloadPdf } from '../CampagneToolShell';

const inputClass =
  'w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-sm text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] transition focus:outline-none focus:shadow-[inset_0_0_0_2px_rgba(6,77,217,0.45)]';

const labelClass = 'mb-1.5 block text-xs font-medium text-prestige-taupe';

const SITUATIONS = [
  { id: 'aucune', label: 'Pas d’assurance collective en place' },
  { id: 'couteuse', label: 'Collective trop chère / trop rigide' },
  { id: 'choix', label: 'Les employés veulent plus de choix' },
  { id: 'explorer', label: 'Je veux juste comparer les options' },
];

const CONTRIB = [
  { id: 'zero', label: 'Sans cotiser (accès seulement)' },
  { id: 'pct', label: 'Je pourrais cotiser un %' },
  { id: 'plafond', label: 'Je préfère un plafond $ / personne' },
  { id: 'indetermine', label: 'Pas encore décidé' },
];

const PILLARS = [
  {
    id: 'flex',
    icon: Settings2,
    title: 'Flexibilité',
    employeur: 'Tu peux cotiser ou non, fixer ton %, créer des catégories, couvrir qui tu veux.',
    employe:
      'Chacun choisit ses protections (invalidité court/long terme, individuel, couple, famille…).',
  },
  {
    id: 'simple',
    icon: Users,
    title: 'Simplicité',
    employeur: 'Tu décides surtout le % et/ou le budget max — tu ne choisis pas les plans pour eux.',
    employe: 'Une rencontre avec un conseiller ; preuves d’assurabilité réduites* ; ajustable dans le temps.',
  },
  {
    id: 'rapide',
    icon: Clock,
    title: 'Rapidité',
    employeur: 'Environ 2 rencontres pour la mise en place.',
    employe: '30 à 45 minutes par personne — entrée en vigueur souvent le 1er du mois suivant*.',
  },
];

function ChipGroup({ id, options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-labelledby={id}>
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`rounded-full px-3.5 py-2 text-left text-sm font-medium transition ${
              active
                ? 'bg-primary text-white'
                : 'bg-white text-prestige-taupe shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)] hover:text-dark'
            }`}
            aria-pressed={active}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Fit check PME — programme MRa vs logique collective traditionnelle.
 */
export function MraFitTool() {
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_programme-mra_pdf');
  const [employes, setEmployes] = useState('8');
  const [situation, setSituation] = useState('aucune');
  const [contrib, setContrib] = useState('indetermine');
  const [checked, setChecked] = useState({ flex: true, simple: true, rapide: true });

  const nEmployes = useMemo(() => {
    const n = parseInt(String(employes).replace(/\D/g, ''), 10);
    return Number.isFinite(n) ? Math.max(1, Math.min(500, n)) : 0;
  }, [employes]);

  const situationLabel = SITUATIONS.find((s) => s.id === situation)?.label || '';
  const contribLabel = CONTRIB.find((c) => c.id === contrib)?.label || '';
  const pillarsOn = PILLARS.filter((p) => checked[p.id]).length;

  const fitBlurb = useMemo(() => {
    if (nEmployes <= 0) return 'Indique la taille de ton équipe pour personnaliser le résumé.';
    if (situation === 'aucune') {
      return `Avec ~${nEmployes} personnes et pas de collective en place, MRa peut offrir un avantage salarié sans la lourdeur d’un régime traditionnel.`;
    }
    if (situation === 'couteuse') {
      return `Si la collective actuelle est trop chère ou trop rigide, MRa laisse le choix aux employés et limite ton rôle (%, budget, catégories).`;
    }
    if (situation === 'choix') {
      return `Tes gens veulent du sur-mesure : MRa repose sur des contrats individuels — chacun choisit ses protections avec un conseiller.`;
    }
    return `Compare calmement : flexibilité, simplicité et rapidité — puis une présentation gratuite si tu veux aller plus loin.`;
  }, [nEmployes, situation]);

  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const handlePdf = () =>
    downloadPdf({
      title: 'Programme MRa — resume pour PME',
      filename: 'resume-programme-mra.pdf',
      sections: [
        {
          heading: 'Ta situation',
          rows: [
            { label: 'Taille approx. de l’equipe', value: nEmployes ? `${nEmployes} personnes` : 'Non indique' },
            { label: 'Contexte', value: situationLabel || 'Non indique' },
            { label: 'Contribution employeur', value: contribLabel || 'Non indique' },
          ],
        },
        {
          heading: 'Points retenus',
          rows: PILLARS.filter((p) => checked[p.id]).map((p) => ({
            label: p.title,
            value: `Employeur: ${p.employeur} | Employe: ${p.employe}`,
          })),
        },
        {
          heading: 'Lecture',
          rows: [{ label: 'Resume', value: fitBlurb }],
        },
      ],
      notes: [
        'Document educatif non contractuel. Le programme MRa repose sur des contrats individuels avec selection medicale.',
        'Refus, exclusions ou surprimes possibles. Primes et garanties selon les contrats. Preuves d’assurabilite reduites selon conditions.',
        'Prochaine etape typique : presentation gratuite / 2 rencontres entreprise, puis 30-45 min par employe interesse.',
      ],
    });

  return (
    <CampagneToolShell
      title="MRa pour ta PME : est-ce que ça colle ?"
      intro="Alternative à l’assurance collective traditionnelle : tu offres l’accès, ils choisissent leurs protections, on accompagne. Coche ce qui compte pour toi — télécharge un résumé PDF."
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-prestige-taupe">
            {pillarsOn}/3 piliers cochés · {fitBlurb}
          </p>
          <ToolDownloadPdf onClick={handlePdf} busy={busy} label="Télécharger mon résumé PDF" />
        </div>
      }
      disclaimer="Illustration éducative — pas une soumission. Contrats individuels, sélection médicale, garanties selon contrats. Preuves d’assurabilité réduites sous conditions."
    >
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="mra-employes" className={labelClass}>
              Combien de personnes dans l’équipe ? (approx.)
            </label>
            <input
              id="mra-employes"
              type="number"
              min={1}
              max={500}
              value={employes}
              onChange={(e) => setEmployes(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <p id="mra-contrib-label" className={labelClass}>
              Contribution employeur (idée)
            </p>
            <ChipGroup
              id="mra-contrib-label"
              options={CONTRIB}
              value={contrib}
              onChange={setContrib}
            />
          </div>
        </div>

        <div>
          <p id="mra-sit-label" className={labelClass}>
            Ta situation aujourd’hui
          </p>
          <ChipGroup id="mra-sit-label" options={SITUATIONS} value={situation} onChange={setSituation} />
        </div>

        <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.04] to-secondary/[0.06] px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Lecture rapide</p>
          <p className="mt-1.5 text-sm leading-relaxed text-dark">{fitBlurb}</p>
        </div>

        <div>
          <h3 className="font-heading mb-3 text-base font-semibold text-dark">
            3 raisons souvent citées (coche ce qui te parle)
          </h3>
          <ul className="space-y-3">
            {PILLARS.map((p) => {
              const on = Boolean(checked[p.id]);
              const Icon = p.icon;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => toggle(p.id)}
                    className={`flex w-full gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
                      on
                        ? 'border-primary/25 bg-primary/[0.04]'
                        : 'border-prestige-beige bg-white hover:border-primary/15'
                    }`}
                    aria-pressed={on}
                  >
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        on ? 'bg-primary text-white' : 'bg-gray-100 text-prestige-taupe'
                      }`}
                    >
                      {on ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Icon className="h-4 w-4" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="font-heading block text-sm font-semibold text-dark">{p.title}</span>
                      <span className="mt-1 block text-sm text-prestige-taupe">
                        <strong className="font-medium text-dark/80">Toi : </strong>
                        {p.employeur}
                      </span>
                      <span className="mt-1 block text-sm text-prestige-taupe">
                        <strong className="font-medium text-dark/80">Eux : </strong>
                        {p.employe}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="rounded-xl bg-gray-50 px-4 py-3 text-xs leading-relaxed text-prestige-taupe">
          MRa = contrats individuels proposés via l’entreprise. Sélection médicale : refus, exclusions ou
          surprimes possibles. Mise en place typique : ~2 rencontres entreprise + 30–45 min / employé
          intéressé. Prochaine étape : formulaire ci-dessous — je te recontacte.
        </p>
      </div>
    </CampagneToolShell>
  );
}

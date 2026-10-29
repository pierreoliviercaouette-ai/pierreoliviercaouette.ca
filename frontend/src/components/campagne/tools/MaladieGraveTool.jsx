import { useState } from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { formatCad } from '../../tools/format';
import { CampagneToolShell, ToolDownloadPdf } from '../CampagneToolShell';

/**
 * Moyenne illustrative — Société canadienne du cancer, rapport spécial 2024 :
 * coûts à la charge du patient / proches ~33 000 $ sur la durée de vie (ordre de grandeur Canada).
 * Pas un montant personnalisé ; le prospect peut l’ajuster.
 */
const SOINS_NON_COUVERTS_DEFAUT = 33000;
const SOINS_STAT_NOTE =
  'Moyenne illustrative ~33 000 $ (Société canadienne du cancer, 2024 — coûts à la charge patient/proches sur la durée). À ajuster selon ta situation.';

const MOIS_OPTIONS = [
  { value: '6', label: '6 mois' },
  { value: '12', label: '12 mois' },
  { value: '18', label: '18 mois' },
  { value: '24', label: '24 mois' },
];

const inputClass =
  'w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-sm text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] transition focus:outline-none focus:shadow-[inset_0_0_0_2px_rgba(6,77,217,0.45)]';

const labelClass = 'mb-1.5 block text-xs font-medium text-prestige-taupe';

function toNum(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function Field({ id, label, hint, children }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1.5 text-xs leading-relaxed text-prestige-taupe">{hint}</p> : null}
    </div>
  );
}

function MoneyInput({ id, value, onChange, step = '1000', min = 0 }) {
  return (
    <div className="relative">
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} pr-8`}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-prestige-taupe">
        $
      </span>
    </div>
  );
}

function BreakdownRow({ label, value, muted }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className={muted ? 'text-prestige-taupe' : 'text-dark'}>{label}</span>
      <span className={`font-medium tabular-nums ${muted ? 'text-prestige-taupe' : 'text-dark'}`}>
        {formatCad(value)}
      </span>
    </div>
  );
}

/**
 * Capital maladie grave illustratif :
 * remplacement revenu conjoint + soins non couverts + surplus qualité de vie.
 */
export function MaladieGraveTool() {
  const [revenuConjoint, setRevenuConjoint] = useState('3500');
  const [moisRemplacement, setMoisRemplacement] = useState('12');
  const [soinsNonCouverts, setSoinsNonCouverts] = useState(String(SOINS_NON_COUVERTS_DEFAUT));
  const [qualiteVie, setQualiteVie] = useState('15000');
  const [dejaCouvert, setDejaCouvert] = useState('0');
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_maladie-grave_pdf');

  const revenu = toNum(revenuConjoint);
  const mois = toNum(moisRemplacement) || 12;
  const soins = toNum(soinsNonCouverts);
  const surplus = toNum(qualiteVie);
  const couvert = toNum(dejaCouvert);

  const remplacementConjoint = revenu * mois;
  const capital = remplacementConjoint + soins + surplus;
  const ecart = capital - couvert;
  const gapWarn = ecart > 0;
  const hasCapital = capital > 0;

  const detailEcart = !hasCapital
    ? 'Ajuste les besoins pour voir un ordre de grandeur.'
    : ecart > 0
      ? 'Ce qu’il manquerait encore si le diagnostic déclenche le contrat — illustration seulement.'
      : 'Sur papier, ce que t’as déjà couvre (ou dépasse) le besoin illustré.';

  const statusDetail = !hasCapital
    ? 'Entre le revenu du conjoint, les soins et un surplus qualité de vie.'
    : gapWarn
      ? 'Y’a un écart vs ce que t’as déjà. Télécharge le PDF pour le garder.'
      : 'Sur papier, t’es déjà couvert pour ce besoin. Garde le PDF quand même.';

  const handleDownload = () =>
    downloadPdf({
      title: 'Resume — maladie grave',
      filename: 'resume-maladie-grave.pdf',
      sections: [
        {
          heading: 'Tes besoins',
          rows: [
            {
              label: 'Revenu mensuel du/de la conjoint(e)',
              value: formatCad(revenu),
            },
            {
              label: 'Mois de remplacement',
              value: `${mois.toLocaleString('fr-CA')} mois`,
            },
            {
              label: 'Remplacement du revenu du conjoint',
              value: formatCad(remplacementConjoint),
            },
            {
              label: 'Soins non couverts (estime)',
              value: formatCad(soins),
            },
            {
              label: 'Surplus qualite de vie',
              value: formatCad(surplus),
            },
          ],
        },
        {
          heading: 'Resultat',
          rows: [
            { label: 'Capital illustratif a viser', value: formatCad(capital) },
            { label: 'Deja couvert', value: formatCad(couvert) },
            { label: 'Ecart vs besoin', value: formatCad(ecart) },
          ],
        },
      ],
      notes: [
        SOINS_STAT_NOTE,
        "Le capital maladie grave, c'est une grosse somme versee si on te diagnostique une maladie couverte — selon le contrat.",
        "Illustration educative seulement — complete l'invalidite, ne la remplace pas.",
      ],
    });

  return (
    <div data-testid="tool-maladie-grave">
      <CampagneToolShell
        title="Combien viser en cas de maladie grave ?"
        intro="Trois blocs concrets : remplacer le revenu du conjoint un moment, payer les soins non couverts, et garder un surplus pour la qualité de vie (voyage, bucket list…). Ça complète l’invalidité — ça la remplace pas."
        disclaimer="Illustration éducative seulement. Les maladies couvertes, délais de survie, montants et exclusions dépendent du contrat. Pas un conseil personnalisé."
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-prestige-taupe">{statusDetail}</p>
            <ToolDownloadPdf
              busy={busy}
              onClick={handleDownload}
              label="Télécharger mon résumé PDF"
            />
          </div>
        }
      >
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/[0.06] via-white to-secondary/[0.08] px-5 py-6 sm:px-7 sm:py-7">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
            Capital illustratif à viser
          </p>
          <p className="font-heading mt-2 text-3xl font-bold tracking-tight text-dark sm:text-4xl">
            {formatCad(capital)}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-prestige-taupe">
            Conjoint + soins + qualité de vie. Change un chiffre — le total se met à jour.
          </p>

          <div className="mt-5 space-y-2 border-t border-prestige-beige/80 pt-4">
            <BreakdownRow
              label={`Revenu conjoint (${mois.toLocaleString('fr-CA')} mois)`}
              value={remplacementConjoint}
              muted
            />
            <BreakdownRow label="Soins non couverts" value={soins} muted />
            <BreakdownRow label="Surplus qualité de vie" value={surplus} muted />
            {couvert > 0 ? <BreakdownRow label="Déjà couvert (−)" value={couvert} muted /> : null}
          </div>

          {hasCapital ? (
            <div
              className={`mt-4 rounded-xl border px-3.5 py-3 ${
                gapWarn
                  ? 'border-amber-200/80 bg-amber-50/70'
                  : 'border-emerald-200/80 bg-emerald-50/70'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  {gapWarn ? (
                    <AlertTriangle
                      className="h-3.5 w-3.5 shrink-0 text-amber-600"
                      strokeWidth={2.25}
                      aria-hidden
                    />
                  ) : (
                    <Check
                      className="h-3.5 w-3.5 shrink-0 text-emerald-600"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                  )}
                  <p className="text-xs font-medium uppercase tracking-wide text-prestige-taupe">
                    Écart vs déjà couvert
                  </p>
                </div>
                <p className="font-heading text-lg font-bold tabular-nums text-dark">
                  {formatCad(ecart)}
                </p>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-prestige-taupe">{detailEcart}</p>
            </div>
          ) : null}
        </div>

        <div className="mb-2">
          <h3 className="font-heading text-base font-semibold text-dark">Tes chiffres</h3>
          <p className="mt-0.5 text-sm text-prestige-taupe">
            Remplacement du conjoint, soins hors couverture, puis un surplus pour l’épreuve.
          </p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            id="mg-revenu-conjoint"
            label="Revenu mensuel net du/de la conjoint(e)"
            hint="Ce qu’il ou elle ramène par mois — à remplacer un moment si tu es en traitement."
          >
            <MoneyInput
              id="mg-revenu-conjoint"
              value={revenuConjoint}
              onChange={setRevenuConjoint}
              step="100"
            />
          </Field>

          <Field
            id="mg-mois"
            label="Mois de remplacement"
            hint="Combien de mois tu veux pouvoir remplacer ce revenu."
          >
            <select
              id="mg-mois"
              className={inputClass}
              value={MOIS_OPTIONS.some((o) => o.value === moisRemplacement) ? moisRemplacement : '12'}
              onChange={(e) => setMoisRemplacement(e.target.value)}
            >
              {MOIS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            id="mg-soins"
            label="Soins non couverts (estimé)"
            hint={SOINS_STAT_NOTE}
          >
            <MoneyInput
              id="mg-soins"
              value={soinsNonCouverts}
              onChange={setSoinsNonCouverts}
              step="1000"
            />
          </Field>

          <Field
            id="mg-qualite"
            label="Surplus qualité de vie"
            hint="Voyage, bucket list, aide à la maison, petits luxes qui aident pendant l’épreuve."
          >
            <MoneyInput id="mg-qualite" value={qualiteVie} onChange={setQualiteVie} step="1000" />
          </Field>

          <div className="sm:col-span-2">
            <Field
              id="mg-couvert"
              label="Déjà couvert (collectif ou individuel)"
              hint="Capital maladie grave déjà prévu. 0 $ si tu ne sais pas."
            >
              <MoneyInput
                id="mg-couvert"
                value={dejaCouvert}
                onChange={setDejaCouvert}
                step="5000"
              />
            </Field>
          </div>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-prestige-taupe">
          Invalidité = revenu dans le temps. Maladie grave = capital forfaitaire si le contrat
          s’applique. Deux jobs différentes.
        </p>
      </CampagneToolShell>
    </div>
  );
}

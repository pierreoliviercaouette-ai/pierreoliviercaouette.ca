import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertTriangle, Check } from 'lucide-react';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { trackRendezVousClick } from '../../../lib/analytics';
import { buildCampagneRdvPath } from '../../../data/campagneAdsLandings';
import { formatCad } from '../../tools/format';
import { CampagneToolShell, ToolClimaxReveal, ToolSoftClose } from '../CampagneToolShell';

/**
 * Moyenne illustrative — Société canadienne du cancer, rapport spécial 2024 :
 * coûts à la charge du patient / proches ~33 000 $ sur la durée de vie (ordre de grandeur Canada).
 * Pas un montant personnalisé ; le prospect peut l’ajuster.
 */
const SOINS_NON_COUVERTS_DEFAUT = 33000;
const SOINS_STAT_NOTE =
  'Moyenne illustrative ~33 000 $ (Société canadienne du cancer, 2024 — coûts à la charge patient/proches sur la durée, Canada). À ajuster selon ta situation. Ce n’est pas un montant de prestation d’assurance.';

const MOIS_OPTIONS = [
  { value: '6', label: '6 mois' },
  { value: '12', label: '12 mois' },
  { value: '18', label: '18 mois' },
  { value: '24', label: '24 mois' },
];

const inputClass =
  'w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-sm text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] transition focus:outline-none focus:shadow-[inset_0_0_0_2px_rgba(6,77,217,0.45)]';

const labelClass = 'mb-1.5 block text-xs font-medium text-prestige-taupe';

const chipClass =
  'inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors';

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

function MoneyInput({ id, value, onChange, step = '1000', min = 0, disabled = false }) {
  return (
    <div className="relative">
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} pr-8 ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
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
  const location = useLocation();
  const rdvPath = buildCampagneRdvPath('maladie-grave', location.search);

  const [pasDeConjoint, setPasDeConjoint] = useState(false);
  const [revenuConjoint, setRevenuConjoint] = useState('3500');
  const [moisRemplacement, setMoisRemplacement] = useState('12');
  const [soinsNonCouverts, setSoinsNonCouverts] = useState(String(SOINS_NON_COUVERTS_DEFAUT));
  const [qualiteVie, setQualiteVie] = useState('15000');
  const [dejaCouvert, setDejaCouvert] = useState('0');
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_maladie-grave_pdf');

  const revenu = pasDeConjoint ? 0 : toNum(revenuConjoint);
  const mois = toNum(moisRemplacement) || 12;
  const soins = toNum(soinsNonCouverts);
  const surplus = toNum(qualiteVie);
  const couvert = toNum(dejaCouvert);

  const remplacementConjoint = revenu * mois;
  const capital = remplacementConjoint + soins + surplus;
  const ecart = capital - couvert;
  const gapWarn = ecart > 0;
  const hasCapital = capital > 0;

  const phraseCeQueCaPaie = pasDeConjoint
    ? `Ex. : ~${formatCad(soins)} soins hors couverture + ~${formatCad(surplus)} pour respirer — sans bloc conjoint.`
    : `Ex. : ~${formatCad(remplacementConjoint)} pour ${mois.toLocaleString('fr-CA')} mois côté conjoint, ~${formatCad(soins)} soins hors couverture, ~${formatCad(surplus)} pour respirer.`;

  const detailEcart = !hasCapital
    ? 'Ajuste les besoins pour voir un ordre de grandeur.'
    : ecart > 0
      ? 'Ce qu’il manquerait encore si le diagnostic déclenche le contrat — illustration seulement.'
      : 'Sur papier, ce que t’as déjà couvre (ou dépasse) le besoin illustré.';

  const statusDetail = !hasCapital
    ? 'Entre les soins, un surplus qualité de vie, et le revenu du conjoint s’il s’applique.'
    : gapWarn
      ? 'Y’a un écart illustratif. Le prochain pas, c’est de le lire avec ta brochure — pas juste un PDF.'
      : 'Sur papier t’es couvert pour ce besoin. Un RDV sert à valider le contrat, pas à te vendre.';

  const softCloseSubline = gapWarn
    ? `Écart illustratif ~${formatCad(ecart)}. En 15 min on ouvre ta brochure — ce que la collective couvre vraiment, les exclusions, si un capital a du sens. Clarifier ≠ acheter.`
    : 'Sur papier, ton besoin illustré est couvert. En 15 min on valide quand même maladies, délais et exclusions du contrat — Clarifier ≠ acheter.';

  const softCloseRdvLabel = gapWarn
    ? 'Clarifier cet écart en 15 min'
    : 'Valider ça en 15 min';

  const handleSoloToggle = () => {
    setPasDeConjoint((prev) => {
      const next = !prev;
      if (next) setRevenuConjoint('0');
      else if (toNum(revenuConjoint) === 0) setRevenuConjoint('3500');
      return next;
    });
  };

  const handleCouvertUnknown = () => {
    setDejaCouvert('0');
  };

  const handleDownload = () =>
    downloadPdf({
      title: 'Résumé — maladie grave',
      filename: 'resume-maladie-grave.pdf',
      sections: [
        {
          heading: 'Tes besoins',
          rows: [
            ...(pasDeConjoint
              ? []
              : [
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
                ]),
            {
              label: 'Soins non couverts (estimé)',
              value: formatCad(soins),
            },
            {
              label: 'Surplus qualité de vie',
              value: formatCad(surplus),
            },
          ],
        },
        {
          heading: 'Résultat',
          rows: [
            { label: 'Capital illustratif à viser', value: formatCad(capital) },
            { label: 'Déjà couvert', value: formatCad(couvert) },
            { label: 'Écart vs besoin', value: formatCad(ecart) },
          ],
        },
      ],
      notes: [
        SOINS_STAT_NOTE,
        "Le capital maladie grave, c'est une grosse somme versée si on te diagnostique une maladie couverte — selon le contrat.",
        "Illustration éducative seulement — complète l'invalidité, ne la remplace pas.",
      ],
    });

  return (
    <div data-testid="tool-maladie-grave">
      <CampagneToolShell
        title="Combien viser en cas de maladie grave ?"
        intro="Trois blocs : remplacer le revenu du conjoint un moment (si applicable), payer les soins non couverts, garder un surplus pour la qualité de vie. Ça complète l’invalidité — ça la remplace pas."
        disclaimer="Illustration éducative seulement. Les maladies couvertes, délais de survie, montants et exclusions dépendent du contrat. Pas un conseil personnalisé. Les montants (incl. ~33 000 $ SCC) sont des ordres de grandeur — pas ce que « tu vas recevoir »."
        footer={
          <p className="text-sm leading-relaxed text-prestige-taupe">{statusDetail}</p>
        }
      >
        <div
          className="mb-6 grid gap-3 sm:grid-cols-2"
          data-testid="mg-contrast"
          aria-label="Invalidité versus maladie grave"
        >
          <div className="rounded-xl bg-prestige-beige/40 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-prestige-taupe">
              Invalidité
            </p>
            <p className="mt-1 text-sm font-medium text-dark">Chèque de paie partiel</p>
            <p className="mt-0.5 text-xs leading-relaxed text-prestige-taupe">
              Revenu dans le temps
            </p>
          </div>
          <div className="rounded-xl bg-primary/[0.06] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
              Maladie grave
            </p>
            <p className="mt-1 text-sm font-medium text-dark">Capital forfaitaire</p>
            <p className="mt-0.5 text-xs leading-relaxed text-prestige-taupe">
              Une fois si le contrat s’applique · 3 blocs
            </p>
          </div>
        </div>

        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/[0.06] via-white to-secondary/[0.08] px-5 py-6 sm:px-7 sm:py-7">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
            Capital illustratif à viser
          </p>
          <p className="font-heading mt-2 text-3xl font-bold tracking-tight text-dark sm:text-4xl">
            {formatCad(capital)}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-prestige-taupe">
            {phraseCeQueCaPaie}
          </p>

          <div className="mt-5 space-y-2 border-t border-prestige-beige/80 pt-4">
            {!pasDeConjoint ? (
              <BreakdownRow
                label={`Revenu conjoint (${mois.toLocaleString('fr-CA')} mois)`}
                value={remplacementConjoint}
                muted
              />
            ) : null}
            <BreakdownRow label="Soins non couverts" value={soins} muted />
            <BreakdownRow label="Surplus qualité de vie" value={surplus} muted />
            {couvert > 0 ? <BreakdownRow label="Déjà couvert (−)" value={couvert} muted /> : null}
          </div>

          {hasCapital ? (
            <div className="mt-4 space-y-3">
              <ToolClimaxReveal key={ecart}>
                <div
                  className={`rounded-xl border px-3.5 py-3.5 sm:px-4 ${
                    gapWarn
                      ? 'border-amber-200/80 bg-amber-50/70'
                      : 'border-emerald-200/80 bg-emerald-50/70'
                  }`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
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
                    <p
                      className="font-heading text-3xl font-bold tracking-tight tabular-nums text-dark sm:text-4xl sm:text-right"
                      data-testid="mg-ecart-climax"
                    >
                      {formatCad(ecart)}
                    </p>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-prestige-taupe">{detailEcart}</p>
                </div>
              </ToolClimaxReveal>

              <div data-testid="mg-rdv-tool">
                <ToolSoftClose
                  subline={softCloseSubline}
                  rdvPath={rdvPath}
                  rdvLabel={softCloseRdvLabel}
                  onRdvClick={() => trackRendezVousClick('campagne_maladie-grave_rdv_tool')}
                  onPdf={handleDownload}
                  pdfBusy={busy}
                  pdfLabel="Télécharger mon résumé PDF"
                  tone={gapWarn ? 'warn' : 'ok'}
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-heading text-base font-semibold text-dark">Tes chiffres</h3>
            <p className="mt-0.5 text-sm text-prestige-taupe">
              {pasDeConjoint
                ? 'Soins hors couverture + surplus pour l’épreuve.'
                : 'Remplacement du conjoint, soins hors couverture, puis un surplus pour l’épreuve.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSoloToggle}
            aria-pressed={pasDeConjoint}
            data-testid="mg-solo-toggle"
            className={`${chipClass} shrink-0 self-start ${
              pasDeConjoint
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-prestige-beige bg-white text-prestige-taupe hover:border-primary/30 hover:text-dark'
            }`}
          >
            Pas de conjoint à remplacer
          </button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {!pasDeConjoint ? (
            <>
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
                  value={
                    MOIS_OPTIONS.some((o) => o.value === moisRemplacement)
                      ? moisRemplacement
                      : '12'
                  }
                  onChange={(e) => setMoisRemplacement(e.target.value)}
                >
                  {MOIS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </Field>
            </>
          ) : null}

          <Field id="mg-soins" label="Soins non couverts (estimé)" hint={SOINS_STAT_NOTE}>
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
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCouvertUnknown}
                data-testid="mg-couvert-unknown"
                className={`${chipClass} ${
                  couvert === 0
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-prestige-beige bg-white text-prestige-taupe hover:border-primary/30 hover:text-dark'
                }`}
              >
                Je ne sais pas → 0 $
              </button>
              {couvert === 0 ? (
                <p className="text-xs leading-relaxed text-prestige-taupe">
                  En RDV on ouvre ta brochure : capital MG collectif souvent petit / conditionnel.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </CampagneToolShell>
    </div>
  );
}

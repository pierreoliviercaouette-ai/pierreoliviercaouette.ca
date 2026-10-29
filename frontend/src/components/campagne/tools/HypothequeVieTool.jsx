import { useMemo, useState } from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { formatCad } from '../../tools/format';
import { CampagneToolShell, ToolDownloadPdf } from '../CampagneToolShell';

const MOIS_PRESETS = [
  { value: '12', label: '12 mois' },
  { value: '24', label: '24 mois' },
  { value: '36', label: '36 mois' },
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

function MoneyInput({ id, value, onChange, min = 0, step = '1000' }) {
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

function Block({ step, title, subtitle, children, done }) {
  return (
    <div className="relative pl-11">
      <div
        className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
          done
            ? 'bg-primary text-white'
            : 'bg-white text-prestige-taupe shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)]'
        }`}
        aria-hidden
      >
        {done ? <Check className="h-4 w-4" strokeWidth={2.5} /> : step}
      </div>
      <div className="mb-3">
        <h3 className="font-heading text-base font-semibold text-dark">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-sm text-prestige-taupe">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}

function ResultCard({ label, value, detail, tone = 'default' }) {
  const toneClass =
    tone === 'warn'
      ? 'border-amber-200/80 bg-gradient-to-br from-amber-50 to-white'
      : tone === 'ok'
        ? 'border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white'
        : 'border-primary/15 bg-gradient-to-br from-primary/[0.04] to-secondary/[0.05]';

  const icon =
    tone === 'warn' ? (
      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" strokeWidth={2.25} aria-hidden />
    ) : tone === 'ok' ? (
      <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.5} aria-hidden />
    ) : null;

  return (
    <div className={`rounded-2xl border px-4 py-3.5 ${toneClass}`}>
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="text-xs font-medium uppercase tracking-wide text-prestige-taupe">{label}</p>
      </div>
      <p className="font-heading mt-1.5 text-2xl font-bold tabular-nums text-dark">{value}</p>
      {detail ? <p className="mt-1.5 text-sm leading-relaxed text-prestige-taupe">{detail}</p> : null}
    </div>
  );
}

/**
 * Estimateur illustratif du capital d’assurance vie lié à l’hypothèque.
 */
export function HypothequeVieTool() {
  const [solde, setSolde] = useState('250000');
  const [autresDettes, setAutresDettes] = useState('10000');
  const [remplacementMensuel, setRemplacementMensuel] = useState('3000');
  const [moisRemplacement, setMoisRemplacement] = useState('24');
  const [coussin, setCoussin] = useState('15000');
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_hypotheque-assurance-vie_pdf');

  const soldeN = toNum(solde);
  const dettesN = toNum(autresDettes);
  const rempN = toNum(remplacementMensuel);
  const moisN = toNum(moisRemplacement);
  const coussinN = toNum(coussin);
  const remplacementTotal = rempN * moisN;
  const auDelaDuPret = dettesN + remplacementTotal + coussinN;
  const capital = soldeN + auDelaDuPret;

  const hasMaison = soldeN > 0;
  const hasTransition = rempN > 0 && moisN > 0;
  const hasInputs = hasMaison && hasTransition;

  const milestones = useMemo(
    () => [
      { id: 'maison', done: hasMaison },
      { id: 'transition', done: hasTransition },
      { id: 'total', done: capital > 0 },
    ],
    [hasMaison, hasTransition, capital]
  );

  const doneCount = milestones.filter((m) => m.done).length;
  const total = milestones.length;
  const progress = Math.round((doneCount / total) * 100);

  const pctPret =
    capital > 0 ? Math.min(100, Math.round((soldeN / capital) * 100)) : 0;

  const statusDetail = !hasInputs
    ? 'Entre le solde hypothèque et le revenu à remplacer — tu vois tout de suite l’écart vs « juste le prêt ».'
    : auDelaDuPret > 0
      ? 'Le total dépasse le solde hypothèque. Télécharge le PDF pour comparer banque vs famille.'
      : 'Ton total égale surtout le solde. Télécharge le PDF pour le garder.';

  const handleDownload = () =>
    downloadPdf({
      title: 'Resume — hypotheque et assurance vie',
      filename: 'resume-hypotheque-assurance-vie.pdf',
      sections: [
        {
          heading: 'Tes entrees',
          rows: [
            { label: 'Combien tu dois encore sur la maison', value: formatCad(soldeN) },
            { label: 'Autres dettes a regler', value: formatCad(dettesN) },
            {
              label: 'Revenu mensuel a remplacer',
              value: formatCad(rempN),
            },
            {
              label: 'Pendant combien de mois',
              value: `${moisN.toLocaleString('fr-CA')} mois`,
            },
            {
              label: 'Argent de cote pour les imprevus',
              value: formatCad(coussinN),
            },
          ],
        },
        {
          heading: 'Resultat',
          rows: [
            {
              label: 'Si on couvre seulement le solde (logique pret)',
              value: formatCad(soldeN),
            },
            {
              label: 'Au-dela du pret (dettes + revenu + imprevus)',
              value: formatCad(auDelaDuPret),
            },
            { label: 'Montant illustratif a viser pour la famille', value: formatCad(capital) },
          ],
        },
      ],
      notes: [
        'Illustration educative seulement — pas une soumission ni un conseil personnalise.',
        "L'assurance creancier (banque) protege souvent surtout le pret ; une couverture personnelle peut viser les proches. Deux logiques differentes.",
        "On additionne maison + dettes + revenu temporaire + imprevus pour estimer ce qu'il faudrait aux proches.",
      ],
    });

  return (
    <div data-testid="tool-hypotheque-vie">
      <CampagneToolShell
        title="Combien d’assurance pour protéger la maison ?"
        intro="Si tu disparais, tes proches doivent souvent payer la maison, les dettes et le quotidien. On additionne ça — et on compare avec « juste le solde du prêt », la logique qu’on confond souvent avec l’assurance de la banque."
        disclaimer="Illustration éducative seulement — pas une soumission ni un conseil personnalisé. Assurance créancier et assurance vie personnelle ne sont pas interchangeables automatiquement."
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-prestige-taupe">{statusDetail}</p>
            <ToolDownloadPdf busy={busy} onClick={handleDownload} />
          </div>
        }
      >
        <div className="mb-8">
          <div className="mb-2 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                Pour la famille
              </p>
              <p className="font-heading mt-1 text-2xl font-bold tabular-nums text-dark sm:text-3xl">
                {formatCad(capital)}
              </p>
            </div>
            <p className="text-sm text-prestige-taupe">
              {doneCount}/{total} · {progress} %
            </p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-prestige-beige/70">
            <div
              className="flex h-full transition-all duration-500 ease-out"
              style={{ width: capital > 0 ? '100%' : `${progress}%` }}
            >
              {capital > 0 ? (
                <>
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${pctPret}%` }}
                    title="Solde hypothèque"
                  />
                  <div
                    className="h-full bg-secondary"
                    style={{ width: `${100 - pctPret}%` }}
                    title="Au-delà du prêt"
                  />
                </>
              ) : (
                <div className="h-full w-full rounded-full bg-gradient-to-r from-primary to-secondary" />
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-prestige-taupe">
            {capital > 0 ? (
              <>
                <span className="font-medium text-dark">{formatCad(soldeN)}</span> solde hypothèque
                {auDelaDuPret > 0 ? (
                  <>
                    {' '}
                    · <span className="font-medium text-dark">{formatCad(auDelaDuPret)}</span> au-delà
                    du prêt
                  </>
                ) : null}
              </>
            ) : (
              'Entre tes chiffres — le total et l’écart apparaissent tout de suite.'
            )}
          </p>
        </div>

        <div className="relative space-y-8 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-px before:bg-prestige-beige">
          <Block
            step={1}
            title="Maison et dettes"
            subtitle="Ce qui reste à payer si le revenu s’arrête."
            done={milestones[0].done}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                id="hypotheque-solde"
                label="Combien tu dois encore sur la maison"
                hint="Le solde restant de ton hypothèque."
              >
                <MoneyInput id="hypotheque-solde" value={solde} onChange={setSolde} step="1000" />
              </Field>
              <Field
                id="hypotheque-dettes"
                label="Autres dettes à régler"
                hint="Auto, carte de crédit, marge, etc."
              >
                <MoneyInput
                  id="hypotheque-dettes"
                  value={autresDettes}
                  onChange={setAutresDettes}
                  step="500"
                />
              </Field>
            </div>
          </Block>

          <Block
            step={2}
            title="Revenu de transition"
            subtitle="Combien de mois tes proches auraient besoin pour se réorganiser."
            done={milestones[1].done}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                id="hypotheque-remplacement"
                label="Revenu mensuel à remplacer"
                hint="Ce que tes proches auraient besoin chaque mois pour vivre."
              >
                <MoneyInput
                  id="hypotheque-remplacement"
                  value={remplacementMensuel}
                  onChange={setRemplacementMensuel}
                  step="100"
                />
              </Field>
              <Field
                id="hypotheque-mois"
                label="Pendant combien de mois"
                hint="Souvent 12 à 36 mois."
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Durée suggérée">
                    {MOIS_PRESETS.map((opt) => {
                      const active = moisRemplacement === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setMoisRemplacement(opt.value)}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                            active
                              ? 'bg-primary text-white'
                              : 'bg-white text-prestige-taupe shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)] hover:text-dark'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="relative">
                    <input
                      id="hypotheque-mois"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={120}
                      step="1"
                      value={moisRemplacement}
                      onChange={(e) => setMoisRemplacement(e.target.value)}
                      className={`${inputClass} pr-14`}
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-prestige-taupe">
                      mois
                    </span>
                  </div>
                </div>
              </Field>
              <div className="sm:col-span-2">
                <div className="rounded-2xl bg-gradient-to-br from-primary/[0.04] to-secondary/[0.06] px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-secondary">
                    Revenu remplacé
                  </p>
                  <p className="font-heading mt-1 text-xl font-bold tabular-nums text-dark">
                    {formatCad(remplacementTotal)}
                  </p>
                  <p className="mt-0.5 text-xs text-prestige-taupe">
                    {moisN.toLocaleString('fr-CA')} mois × {formatCad(rempN)}
                  </p>
                </div>
              </div>
            </div>
          </Block>

          <Block
            step={3}
            title="Imprévus et lecture"
            subtitle="Un coussin + la comparaison prêt vs famille."
            done={milestones[2].done}
          >
            <div className="mb-3">
              <Field
                id="hypotheque-coussin"
                label="Argent de côté pour les imprévus"
                hint="Funérailles, frais immédiats, petit coussin."
              >
                <MoneyInput id="hypotheque-coussin" value={coussin} onChange={setCoussin} step="500" />
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <ResultCard
                label="Si on couvre seulement le solde"
                value={formatCad(soldeN)}
                detail="Logique proche de l’assurance créancier : surtout le prêt. Pas automatiquement pensé pour le quotidien de la famille."
                tone="default"
              />
              <ResultCard
                label="Montant illustratif pour la famille"
                value={formatCad(capital)}
                detail={
                  auDelaDuPret > 0
                    ? `Dont ${formatCad(auDelaDuPret)} au-delà du prêt (dettes, revenu, imprévus).`
                    : 'Maison + dettes + revenu + imprévus — illustration seulement.'
                }
                tone={auDelaDuPret > 0 ? 'warn' : 'ok'}
              />
            </div>
          </Block>
        </div>
      </CampagneToolShell>
    </div>
  );
}

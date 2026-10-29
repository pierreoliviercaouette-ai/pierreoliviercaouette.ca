import { useState } from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { formatCad } from '../../tools/format';
import { CampagneToolShell, ToolDownloadPdf } from '../CampagneToolShell';

function parseNum(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

const inputClass =
  'w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-sm text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] transition focus:outline-none focus:shadow-[inset_0_0_0_2px_rgba(6,77,217,0.45)]';

const labelClass = 'mb-1.5 block text-xs font-medium text-prestige-taupe';

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

function NumberField({ id, label, value, onChange, min, max, step, suffix, hint, suffixWidth = 'pr-8' }) {
  return (
    <Field id={id} label={label} hint={hint}>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          className={`${inputClass} ${suffixWidth}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-prestige-taupe">
            {suffix}
          </span>
        ) : null}
      </div>
    </Field>
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
      <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" strokeWidth={2.25} aria-hidden />
    ) : tone === 'ok' ? (
      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" strokeWidth={2.5} aria-hidden />
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

export function InvaliditeTool() {
  const [revenuNet, setRevenuNet] = useState('4500');
  const [pctCollective, setPctCollective] = useState('60');
  const [delaiCarence, setDelaiCarence] = useState('90');
  const [depensesFixes, setDepensesFixes] = useState('3200');
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_assurance-invalidite_pdf');

  const revenu = Math.max(0, parseNum(revenuNet));
  const pct = Math.max(0, Math.min(100, parseNum(pctCollective)));
  const jours = Math.max(0, parseNum(delaiCarence));
  const depenses = Math.max(0, parseNum(depensesFixes));

  const montantCollective = revenu * (pct / 100);
  const trouVsDepenses = depenses - montantCollective;
  const trouVsRevenu = revenu - montantCollective;
  const coussin = (jours / 30) * depenses;

  const hasInputs = revenu > 0 && pct > 0 && depenses > 0;
  const gapWarn = trouVsDepenses > 0;
  const couverturePct =
    depenses > 0 ? Math.min(100, Math.round((montantCollective / depenses) * 100)) : 0;

  const statusDetail = !hasInputs
    ? 'Entre ton revenu, ce que ton assurance collective t’offre, et tes dépenses — le trou apparaît tout de suite.'
    : gapWarn
      ? 'Y’a un trou vs tes dépenses. Télécharge le PDF et compare avec ton livret.'
      : 'Sur papier, ce que ton assurance collective t’offre couvre tes dépenses. Garde le PDF avec ton livret.';

  const handleDownload = () =>
    downloadPdf({
      title: 'Resume — ton assurance collective (invalidite)',
      filename: 'resume-assurance-invalidite.pdf',
      sections: [
        {
          heading: 'Tes entrees',
          rows: [
            { label: 'Revenu net mensuel', value: formatCad(revenu) },
            {
              label: 'Part remplacee par ton assurance collective',
              value: `${pct.toLocaleString('fr-CA')} %`,
            },
            {
              label: 'Jours d’attente avant le premier cheque',
              value: `${jours.toLocaleString('fr-CA')} jours`,
            },
            { label: 'Depenses fixes mensuelles', value: formatCad(depenses) },
          ],
        },
        {
          heading: 'Resultats',
          rows: [
            {
              label: "Ce que ton assurance collective t'offre / mois",
              value: formatCad(montantCollective),
            },
            {
              label: 'Trou vs depenses fixes',
              value: formatCad(trouVsDepenses),
            },
            {
              label: 'Trou vs revenu',
              value: formatCad(trouVsRevenu),
            },
            {
              label: 'A avoir de cote pendant l’attente',
              value: formatCad(coussin),
            },
          ],
        },
      ],
      notes: [
        'Illustration educative seulement — pas un conseil personnalise.',
        'Le % et le delai, c’est une chose. La definition d’invalidite dans ton livret, c’en est une autre.',
        'Revalide avec ton livret et ta situation reelle.',
      ],
    });

  return (
    <div data-testid="tool-invalidite">
      <CampagneToolShell
        title="Le trou entre ton assurance collective et tes dépenses"
        intro="Ton assurance collective remplace souvent seulement une partie du salaire — et le premier chèque arrive après un délai. Entre tes chiffres : tu vois ce qui manque chaque mois, et ce qu’il faut tenir pendant l’attente."
        disclaimer="Contenu éducatif seulement — pas un conseil personnalisé. Valide toujours avec ton livret."
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-prestige-taupe">{statusDetail}</p>
            <ToolDownloadPdf busy={busy} onClick={handleDownload} label="Télécharger mon résumé PDF" />
          </div>
        }
      >
        {/* Snapshot — trou (chiffre) + couverture des dépenses (barre) */}
        <div className="mb-8">
          <div className="mb-2 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                {gapWarn ? 'Trou vs dépenses / mois' : 'Marge vs dépenses / mois'}
              </p>
              <p className="font-heading mt-1 text-2xl font-bold tabular-nums text-dark">
                {formatCad(Math.abs(trouVsDepenses))}
              </p>
            </div>
            <p className="max-w-[11rem] text-right text-sm leading-snug text-prestige-taupe">
              {formatCad(montantCollective)} / mois via ton assurance collective
            </p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-prestige-beige/70">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                gapWarn
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                  : 'bg-gradient-to-r from-primary to-secondary'
              }`}
              style={{ width: `${couverturePct}%` }}
              role="progressbar"
              aria-valuenow={couverturePct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Couverture des dépenses par ton assurance collective : ${couverturePct} %`}
            />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-prestige-taupe">
            {couverturePct.toLocaleString('fr-CA')} % de tes dépenses couvertes par ton assurance
            collective
            {jours > 0
              ? ` · ${jours.toLocaleString('fr-CA')} j d’attente avant le premier chèque.`
              : '.'}
          </p>
        </div>

        <div className="relative space-y-8 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-px before:bg-prestige-beige">
          <Block
            step={1}
            title="Tes chiffres"
            subtitle="Quatre infos tirées de ton livret et de ton budget."
            done={hasInputs}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <NumberField
                id="invalidite-revenu"
                label="Ton revenu net mensuel"
                value={revenuNet}
                onChange={setRevenuNet}
                min={0}
                step="100"
                suffix="$"
                hint="Ce qui rentre vraiment dans ton compte, après impôts."
              />
              <NumberField
                id="invalidite-pct"
                label="Part remplacée par ton assurance collective"
                value={pctCollective}
                onChange={setPctCollective}
                min={0}
                max={100}
                step="1"
                suffix="%"
                hint="Ex. 60 % = 60 $ pour chaque 100 $ de revenu. C’est dans ton livret — souvent entre 50 et 70 %."
              />
              <NumberField
                id="invalidite-carence"
                label="Jours d’attente avant le premier chèque"
                value={delaiCarence}
                onChange={setDelaiCarence}
                min={0}
                step="1"
                suffix="jours"
                suffixWidth="pr-14"
                hint="Pendant ce temps, ton assurance collective ne paie rien. C’est à toi de tenir."
              />
              <NumberField
                id="invalidite-depenses"
                label="Tes dépenses fixes mensuelles"
                value={depensesFixes}
                onChange={setDepensesFixes}
                min={0}
                step="50"
                suffix="$"
                hint="Loyer ou hypothèque, auto, garderie, épicerie… ce qui continue même si tu ne travailles plus."
              />
            </div>
          </Block>

          <Block
            step={2}
            title="Ce que ça veut dire"
            subtitle="Trois lectures utiles — pas quatre chiffres qui se marchent dessus."
            done={hasInputs}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <ResultCard
                label="Ton assurance collective / mois"
                value={formatCad(montantCollective)}
                detail={`Soit ${pct.toLocaleString('fr-CA')} % de ton revenu net — une fois l’attente terminée. Vs ton salaire d’aujourd’hui, ça laisse ${formatCad(trouVsRevenu)}.`}
              />
              <ResultCard
                label="Trou vs tes dépenses"
                value={formatCad(trouVsDepenses)}
                detail={
                  trouVsDepenses > 0
                    ? 'Tes dépenses dépassent ce que ton assurance collective t’offre. Cette différence, c’est toi qui la comble.'
                    : 'Ce que ton assurance collective t’offre couvre (ou dépasse) tes dépenses — sur papier.'
                }
                tone={trouVsDepenses > 0 ? 'warn' : 'ok'}
              />
              <div className="sm:col-span-2">
                <ResultCard
                  label="À avoir de côté pendant l’attente"
                  value={formatCad(coussin)}
                  detail={`${jours.toLocaleString('fr-CA')} jours sans chèque × tes dépenses — le coussin à prévoir avant que ton assurance collective commence.`}
                  tone={coussin > 0 ? 'warn' : 'default'}
                />
              </div>
            </div>

            <p className="mt-4 rounded-2xl border border-prestige-beige/90 bg-prestige-beige/25 px-4 py-3 text-sm leading-relaxed text-prestige-taupe">
              Le % et le délai, c’est une chose. La{' '}
              <span className="font-medium text-dark">définition d’invalidité</span> dans ton
              livret (« ta job » vs « n’importe quelle job »), c’en est une autre — à vérifier
              avant de conclure que ton assurance collective te couvre « pour vrai ».
            </p>
          </Block>
        </div>
      </CampagneToolShell>
    </div>
  );
}

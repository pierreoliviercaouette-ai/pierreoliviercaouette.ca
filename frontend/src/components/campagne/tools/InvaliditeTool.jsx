import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, AlertTriangle } from 'lucide-react';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { buildCampagneRdvPath } from '../../../data/campagneAdsLandings';
import { trackRendezVousClick } from '../../../lib/analytics';
import { formatCad } from '../../tools/format';
import { CampagneToolShell, ToolSoftClose } from '../CampagneToolShell';

const DELAI_CHIPS = [30, 90, 120];

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

function SnapshotCell({ label, value, tone = 'default' }) {
  const wrap =
    tone === 'warn'
      ? 'border-amber-200/80 bg-gradient-to-br from-amber-50 to-white'
      : tone === 'ok'
        ? 'border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white'
        : 'border-prestige-beige/90 bg-white';

  return (
    <div className={`rounded-2xl border px-4 py-3.5 ${wrap}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{label}</p>
      <p className="font-heading mt-1.5 text-3xl font-bold tabular-nums text-dark md:text-4xl">
        {value}
      </p>
    </div>
  );
}

export function InvaliditeTool() {
  const location = useLocation();
  const [revenuNet, setRevenuNet] = useState('4500');
  const [pctCollective, setPctCollective] = useState('60');
  const [delaiCarence, setDelaiCarence] = useState('90');
  const [depensesFixes, setDepensesFixes] = useState('3200');
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_assurance-invalidite_pdf');

  const rdvPath = buildCampagneRdvPath('assurance-invalidite', location.search);

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
  const coussinWarn = jours > 0 && depenses > 0;
  const couverturePct =
    depenses > 0 ? Math.min(100, Math.round((montantCollective / depenses) * 100)) : 0;

  const softHeadline = !hasInputs
    ? null
    : gapWarn
      ? `~${formatCad(trouVsDepenses)} /mois à combler · ~${formatCad(coussin)} à tenir.`
      : 'Les $ tiennent sur papier.';

  const softSubline = !hasInputs
    ? 'Entre ton revenu, ce que ton assurance collective t’offre, et tes dépenses — le trou apparaît tout de suite.'
    : gapWarn
      ? 'On ouvre ton livret en 15 min — %, délai, définition.'
      : 'Reste la définition et la durée dans ton livret — c’est souvent ça qu’on clarifie en 15 min.';

  const softTone = gapWarn || coussinWarn ? 'warn' : 'default';

  const handleDownload = () =>
    downloadPdf({
      title: 'Résumé — ton assurance collective (invalidité)',
      filename: 'resume-assurance-invalidite.pdf',
      sections: [
        {
          heading: 'Tes entrées',
          rows: [
            { label: 'Revenu net mensuel', value: formatCad(revenu) },
            {
              label: 'Part remplacée par ton assurance collective',
              value: `${pct.toLocaleString('fr-CA')} %`,
            },
            {
              label: 'Jours d’attente avant le premier chèque',
              value: `${jours.toLocaleString('fr-CA')} jours`,
            },
            { label: 'Dépenses fixes mensuelles', value: formatCad(depenses) },
          ],
        },
        {
          heading: 'Résultats',
          rows: [
            {
              label: "Ce que ton assurance collective t'offre / mois",
              value: formatCad(montantCollective),
            },
            {
              label: 'Trou vs dépenses fixes',
              value: formatCad(trouVsDepenses),
            },
            {
              label: 'Trou vs revenu',
              value: formatCad(trouVsRevenu),
            },
            {
              label: 'À avoir de côté pendant l’attente',
              value: formatCad(coussin),
            },
          ],
        },
      ],
      notes: [
        'Illustration éducative seulement — pas un conseil personnalisé.',
        'Le % et le délai, c’est une chose. La définition d’invalidité dans ton livret, c’en est une autre.',
        'Prochaine étape : 15 min pour valider %, délai, définition. Aucun % promis comme garantie.',
        'Revalide avec ton livret et ta situation réelle.',
      ],
    });

  return (
    <div data-testid="tool-invalidite">
      <CampagneToolShell
        title="Le trou entre ton assurance collective et tes dépenses"
        intro="Ton assurance collective remplace souvent seulement une partie du salaire — et le premier chèque arrive après un délai. Entre tes chiffres : tu vois ce qui manque chaque mois, et ce qu’il faut tenir pendant l’attente."
        disclaimer="Contenu éducatif seulement — pas un conseil personnalisé. Valide toujours avec ton livret."
        footer={
          hasInputs ? null : (
            <p className="text-sm leading-relaxed text-prestige-taupe">{softSubline}</p>
          )
        }
      >
        {/* Snapshot duo — trou + coussin (climax) */}
        <div className="mb-8">
          <div className="mb-3 grid gap-3 sm:grid-cols-2">
            <SnapshotCell
              label={gapWarn ? 'Trou vs dépenses / mois' : 'Marge vs dépenses / mois'}
              value={formatCad(Math.abs(trouVsDepenses))}
              tone={gapWarn ? 'warn' : hasInputs ? 'ok' : 'default'}
            />
            <SnapshotCell
              label="Coussin d’attente"
              value={formatCad(coussin)}
              tone={coussinWarn ? 'warn' : 'default'}
            />
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

          {hasInputs ? (
            <div className="mt-4" data-testid="invalidite-rdv-tool">
              <ToolSoftClose
                headline={softHeadline}
                subline={softSubline}
                rdvPath={rdvPath}
                rdvLabel="Clarifier mon trou en 15 min"
                onRdvClick={() => trackRendezVousClick('campagne_assurance-invalidite_rdv_tool')}
                onPdf={handleDownload}
                pdfBusy={busy}
                pdfLabel="Télécharger mon résumé PDF"
                tone={softTone}
              />
            </div>
          ) : null}
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
              <div className="min-w-0">
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
                <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Délais fréquents">
                  {DELAI_CHIPS.map((n) => {
                    const selected = String(n) === delaiCarence;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setDelaiCarence(String(n))}
                        aria-pressed={selected}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                          selected
                            ? 'bg-primary text-white'
                            : 'border border-prestige-beige bg-white text-dark hover:border-primary/40'
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-prestige-taupe">
                  Pas le livret sous la main ? Pars de 60 % / 90 j — on ajuste en RDV.
                </p>
              </div>
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
                tone={trouVsDepenses > 0 ? 'warn' : hasInputs ? 'ok' : 'default'}
              />
              <div className="sm:col-span-2">
                <ResultCard
                  label="À avoir de côté pendant l’attente"
                  value={formatCad(coussin)}
                  detail={`${jours.toLocaleString('fr-CA')} jours sans chèque × tes dépenses — le coussin à prévoir avant que ton assurance collective commence.`}
                  tone={coussinWarn ? 'warn' : 'default'}
                />
              </div>
            </div>

            <p className="mt-4 rounded-2xl border border-prestige-beige/90 bg-prestige-beige/25 px-4 py-3 text-sm leading-relaxed text-prestige-taupe">
              Le % et le délai, c’est une chose. La{' '}
              <span className="font-medium text-dark">définition d’invalidité</span> dans ton
              livret (« ta job » vs « n’importe quelle job »), c’en est une autre — à vérifier
              avant de conclure que ton assurance collective te couvre « pour vrai ».
              {hasInputs && !gapWarn ? (
                <>
                  {' '}
                  <Link
                    to={rdvPath}
                    onClick={() =>
                      trackRendezVousClick('campagne_assurance-invalidite_rdv_tool_definition')
                    }
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    Clarifier définition &amp; durée en 15 min →
                  </Link>
                </>
              ) : null}
            </p>
          </Block>
        </div>
      </CampagneToolShell>
    </div>
  );
}

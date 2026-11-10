import { useMemo, useState } from 'react';
import { Check, Home } from 'lucide-react';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { trackEvent } from '../../../lib/analytics';
import { formatCad } from '../../tools/format';
import {
  CampagneToolShell,
  ToolDownloadPdf,
} from '../CampagneToolShell';

/** Plafonds illustratifs 2026 — non indexés historiquement, à revalider. */
const PLAFOND_ANNUEL = 8000;
const PLAFOND_VIE = 40000;

const inputClass =
  'w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-sm text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] transition focus:outline-none focus:shadow-[inset_0_0_0_2px_rgba(6,77,217,0.45)]';

const labelClass = 'mb-1.5 block text-xs font-medium text-prestige-taupe';

/** Points fixes — utiles même sans dossier. */
const A_RETENIR = [
  'Projette ta mise de fonds avec les plafonds illustratifs : 8 000 $ de nouveaux droits par année, 40 000 $ à vie.',
  'Le CELIAPP n’est pas le CELI : objectifs, retraits et plafonds sont différents.',
  'Vérifie qui a le droit d’ouvrir un compte et comment les retraits fonctionnent avant de cotiser.',
];

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function Field({ id, label, hint, children, className = '' }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1.5 text-xs leading-relaxed text-prestige-taupe">{hint}</p> : null}
    </div>
  );
}

function MoneyInput({ id, value, onChange, onBlur, min, max, step, placeholder }) {
  return (
    <div className="relative">
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        className={`${inputClass} pr-8`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
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
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function buildLecture(result) {
  const {
    prevu,
    cotisationEffective,
    totalProjete,
    droitsRestantsApres,
    years,
    deja,
    plafondAtteint,
    coupeParPlafondAnnuel,
    coupeParPlafondVie,
    cible,
    ecart,
  } = result;

  if (years <= 0 || prevu <= 0) {
    return {
      headline: 'Il manque encore un chiffre',
      detail:
        'Indique combien tu mets par année et dans combien d’années tu vises d’acheter — on projette ta mise de fonds.',
      points: [],
    };
  }

  const points = [];

  if (coupeParPlafondAnnuel) {
    points.push(
      `Tu visais ${formatCad(prevu)} / an, mais le plafond annuel illustratif est ${formatCad(PLAFOND_ANNUEL)} — on calcule avec ${formatCad(cotisationEffective)}.`
    );
  } else {
    points.push(
      `Chaque année, tu mets ${formatCad(cotisationEffective)} de côté dans le CELIAPP (dans la limite du plafond).`
    );
  }

  if (deja > 0) {
    points.push(`Tu as déjà ${formatCad(deja)} dedans — ça part de là.`);
  }

  if (coupeParPlafondVie || plafondAtteint) {
    points.push(
      `Sur ${years} an${years > 1 ? 's' : ''}, tu touches le max à vie (${formatCad(PLAFOND_VIE)}). Au-delà, tu ne peux plus cotiser à ce compte.`
    );
  } else {
    points.push(
      `Après ${years} an${years > 1 ? 's' : ''}, tu aurais environ ${formatCad(totalProjete)} pour ta mise de fonds — et encore ${formatCad(droitsRestantsApres)} de place à vie.`
    );
  }

  if (cible > 0) {
    points.push(
      `Ta cible est ${formatCad(cible)} — écart ~${formatCad(ecart)} (cotisations seulement).`
    );
  }

  points.push(
    'Rappel : ce total, c’est tes cotisations seulement. Un placement peut monter ou baisser — on n’invente pas de rendement ici.'
  );

  return {
    headline: plafondAtteint
      ? 'Tu touches le max à vie dans ce scénario'
      : `Environ ${formatCad(totalProjete)} pour ta mise de fonds`,
    detail: plafondAtteint
      ? `Après ${years} an${years > 1 ? 's' : ''}, tu es au plafond de ${formatCad(PLAFOND_VIE)} (illustratif 2026).`
      : `Sur ${years} an${years > 1 ? 's' : ''} · déjà ${formatCad(deja)} dedans.`,
    points,
  };
}

export function CeliappTool() {
  const [cotisationAnnuelle, setCotisationAnnuelle] = useState('4000');
  const [annees, setAnnees] = useState('4');
  const [dejaCotise, setDejaCotise] = useState('0');
  const [miseCible, setMiseCible] = useState('');
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_celiapp_pdf');

  const result = useMemo(() => {
    const prevu = Math.max(0, toNumber(cotisationAnnuelle));
    const years = Math.max(0, Math.min(15, Math.floor(toNumber(annees))));
    const deja = Math.min(PLAFOND_VIE, Math.max(0, toNumber(dejaCotise)));
    const cible = Math.max(0, toNumber(miseCible));

    const droitsRestantsAvant = Math.max(0, PLAFOND_VIE - deja);
    const cotisationEffective = Math.min(prevu, PLAFOND_ANNUEL, droitsRestantsAvant);
    const totalAjoute = Math.min(cotisationEffective * years, droitsRestantsAvant);
    const totalProjete = deja + totalAjoute;
    const droitsRestantsApres = Math.max(0, PLAFOND_VIE - totalProjete);
    const coupeParPlafondAnnuel = prevu > PLAFOND_ANNUEL && droitsRestantsAvant > 0;
    const coupeParPlafondVie =
      years > 0 && cotisationEffective * years > droitsRestantsAvant;
    const ecart = cible > 0 ? cible - totalProjete : 0;

    return {
      prevu,
      cotisationEffective,
      totalAjoute,
      totalProjete,
      droitsRestantsApres,
      miseDeFonds: totalProjete,
      years,
      deja,
      cible,
      ecart,
      plafondAtteint: droitsRestantsApres <= 0 && totalProjete > 0,
      coupeParPlafondAnnuel,
      coupeParPlafondVie,
    };
  }, [cotisationAnnuelle, annees, dejaCotise, miseCible]);

  const lecture = useMemo(() => buildLecture(result), [result]);

  const milestones = useMemo(
    () => [
      {
        id: 'cotisation',
        done: toNumber(cotisationAnnuelle) > 0,
      },
      {
        id: 'horizon',
        done: toNumber(annees) > 0,
      },
      {
        id: 'projection',
        done: toNumber(cotisationAnnuelle) > 0 && toNumber(annees) > 0,
      },
    ],
    [cotisationAnnuelle, annees]
  );

  const doneCount = milestones.filter((m) => m.done).length;
  const total = milestones.length;

  const plafondProgress = Math.min(
    100,
    Math.round((result.totalProjete / PLAFOND_VIE) * 100)
  );

  const statusDetail =
    doneCount < 2
      ? 'Dis-nous combien tu mets par année et dans combien d’années tu vises d’acheter.'
      : result.plafondAtteint
        ? 'Max à vie dans ce scénario. 15 min pour valider la suite — PDF en bonus.'
        : 'Ta projection est prête. Clarifie le prochain vrai pas en 15 min — ou garde le PDF.';

  const trackCibleIfSet = (raw) => {
    const cible = Math.max(0, toNumber(raw));
    if (cible <= 0) return;
    trackEvent('select_content', {
      content_type: 'tool_climax',
      item_id: 'campagne_celiapp_cible',
      value: cible,
    });
  };

  const handleDownload = () =>
    downloadPdf({
      title: 'Resume — projection CELIAPP',
      filename: 'resume-celiapp.pdf',
      sections: [
        {
          heading: 'Tes entrees',
          rows: [
            {
              label: 'Montant vise par annee',
              value: formatCad(result.prevu),
            },
            {
              label: "Annees avant l'achat",
              value: `${result.years} an${result.years > 1 ? 's' : ''}`,
            },
            { label: 'Deja dans le CELIAPP', value: formatCad(result.deja) },
            ...(result.cible > 0
              ? [{ label: 'Mise cible', value: formatCad(result.cible) }]
              : []),
          ],
        },
        {
          heading: 'Projection CELIAPP',
          rows: [
            {
              label: 'Cotisation retenue / annee (apres plafonds)',
              value: formatCad(result.cotisationEffective),
            },
            { label: 'Ajoute sur la periode', value: formatCad(result.totalAjoute) },
            { label: 'Total pour la mise de fonds', value: formatCad(result.miseDeFonds) },
            {
              label: 'Place restante a vie',
              value: formatCad(result.droitsRestantsApres),
            },
            ...(result.cible > 0
              ? [{ label: 'Ecart vs cible', value: formatCad(result.ecart) }]
              : []),
          ],
        },
        {
          heading: 'En clair',
          rows: lecture.points.map((point, i) => ({
            label: `Point ${i + 1}`,
            value: point,
          })),
        },
        {
          heading: 'A retenir',
          rows: A_RETENIR.map((point, i) => ({
            label: `${i + 1}`,
            value: point,
          })),
        },
      ],
      notes: [
        'Illustration educative seulement — sans rendement, plafonds 2026 illustratifs (8 000 $ / an, 40 000 $ a vie).',
        'Admissibilite, regles de retrait et fiscalite a revalider selon ta situation.',
      ],
    });

  return (
    <div data-testid="tool-celiapp">
      <CampagneToolShell
        title="Combien pour ta mise de fonds ?"
        intro="Entre ce que tu mets par année, ce que t’as déjà dans ton CELIAPP et dans combien d’années tu vises à acheter."
        disclaimer="Illustration éducative seulement — pas un conseil personnalisé. Chiffres 2026 illustratifs (8 000 $ de nouveaux droits / année, 40 000 $ à vie ; les reports peuvent changer le max d’une année). Qui a le droit, les retraits et l’impôt : à revalider selon ta situation. Aucun rendement inventé."
        footer={<p className="text-sm leading-relaxed text-prestige-taupe">{statusDetail}</p>}
      >
        <div className="mb-8">
          <div className="mb-2 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                Vers le max à vie
              </p>
              <p className="font-heading mt-1 text-2xl font-bold text-dark">
                {formatCad(result.totalProjete)}
                <span className="text-base font-medium text-prestige-taupe">
                  {' '}
                  / {formatCad(PLAFOND_VIE)}
                </span>
              </p>
            </div>
            <p className="text-sm text-prestige-taupe">{plafondProgress} %</p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-prestige-beige/70">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                result.plafondAtteint
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-primary to-secondary'
              }`}
              style={{ width: `${plafondProgress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-prestige-taupe">
            {doneCount}/{total} infos remplies · plafond illustratif 2026.
          </p>
        </div>

        <div className="relative space-y-8 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-px before:bg-prestige-beige">
          <Block
            step={1}
            title="Ce que tu mets de côté"
            subtitle="Combien par année, et ce que t’as déjà dans ton CELIAPP."
            done={milestones[0].done}
          >
            <Field
              id="celiapp-cotisation"
              label="Combien tu mets par année"
              hint={`Plafond illustratif ${PLAFOND_ANNUEL.toLocaleString('fr-CA')} $ de nouveaux droits / année (2026). Tu peux viser plus — on clampera dans le calcul.`}
            >
              <MoneyInput
                id="celiapp-cotisation"
                value={cotisationAnnuelle}
                onChange={setCotisationAnnuelle}
                min={0}
                step="100"
                placeholder="4000"
              />
            </Field>
            <Field
              id="celiapp-deja"
              label="Déjà dans ton CELIAPP"
              hint={`Max ${PLAFOND_VIE.toLocaleString('fr-CA')} $ à vie. Mets 0 si t’as pas encore ouvert le compte.`}
            >
              <MoneyInput
                id="celiapp-deja"
                value={dejaCotise}
                onChange={setDejaCotise}
                min={0}
                max={PLAFOND_VIE}
                step="100"
                placeholder="0"
              />
            </Field>
          </Block>

          <Block
            step={2}
            title="Ton projet d’achat"
            subtitle="Dans combien d’années tu vises ta 1re propriété."
            done={milestones[1].done}
          >
            <Field
              id="celiapp-annees"
              label="Dans combien d’années tu achètes"
              hint="Ex. : 3 ans, 5 ans, 8 ans — un ordre de grandeur suffit."
            >
              <div className="relative">
                <input
                  id="celiapp-annees"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={15}
                  step="1"
                  className={`${inputClass} pr-12`}
                  value={annees}
                  onChange={(e) => setAnnees(e.target.value)}
                  placeholder="4"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-prestige-taupe">
                  ans
                </span>
              </div>
            </Field>
            <div className="flex items-end">
              <p className="pb-2.5 text-sm leading-relaxed text-prestige-taupe">
                {result.years > 0
                  ? result.coupeParPlafondAnnuel
                    ? `Tu visais ${formatCad(result.prevu)} — on retient ${formatCad(result.cotisationEffective)} / année (plafond annuel).`
                    : `Sur ${result.years} an${result.years > 1 ? 's' : ''}, on compte ${formatCad(result.cotisationEffective)} / année.`
                  : 'Ajoute un nombre d’années pour voir ce que ça donne.'}
              </p>
            </div>
            <Field
              id="celiapp-cible"
              label="Mise de fonds que tu vises (optionnel)"
              hint="Ex. : 20 000 $, 35 000 $ — ce que toi tu as en tête. Cotisations seulement en face."
              className="sm:col-span-2"
            >
              <MoneyInput
                id="celiapp-cible"
                value={miseCible}
                onChange={setMiseCible}
                onBlur={() => trackCibleIfSet(miseCible)}
                min={0}
                step="500"
                placeholder="25000"
              />
            </Field>
          </Block>

          <div className="relative pl-11">
            <div
              className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                milestones[2].done
                  ? 'bg-primary text-white'
                  : 'bg-white text-prestige-taupe shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)]'
              }`}
              aria-hidden
            >
              {milestones[2].done ? (
                <Check className="h-4 w-4" strokeWidth={2.5} />
              ) : (
                <Home className="h-3.5 w-3.5" />
              )}
            </div>

            <div className="mb-3">
              <h3 className="font-heading text-base font-semibold text-dark">
                Pour ta mise de fonds
              </h3>
              <p className="mt-0.5 text-sm text-prestige-taupe">
                Lecture simple de ton scénario — sans jargon.
              </p>
            </div>

            <div
              className={`rounded-2xl px-5 py-5 ${
                result.plafondAtteint
                  ? 'bg-gradient-to-br from-amber-50 to-white shadow-[inset_0_0_0_1px_rgba(245,158,11,0.25)]'
                  : 'bg-gradient-to-br from-primary/[0.04] to-secondary/[0.06]'
              }`}
            >
              {result.plafondAtteint ? (
                <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                  Max à vie
                </p>
              ) : null}
              <p
                className={`font-heading text-3xl font-bold tracking-tight text-dark sm:text-4xl ${
                  result.plafondAtteint ? 'mt-1' : ''
                }`}
              >
                {lecture.headline}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-prestige-taupe">{lecture.detail}</p>

              {result.cible > 0 && milestones[2].done ? (
                <div
                  key={`gap-${result.cible}-${result.totalProjete}`}
                  className="mt-4 grid gap-3 border-t border-dark/[0.06] pt-4 sm:grid-cols-3"
                  data-testid="celiapp-gap-cible"
                >
                  <div>
                    <p className="text-xs text-prestige-taupe">Projection</p>
                    <p className="mt-0.5 font-heading text-lg font-semibold text-dark sm:text-xl">
                      {formatCad(result.totalProjete)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-prestige-taupe">Cible</p>
                    <p className="mt-0.5 font-heading text-lg font-semibold text-dark sm:text-xl">
                      {formatCad(result.cible)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-prestige-taupe">Écart</p>
                    <p
                      className={`mt-0.5 font-heading text-lg font-semibold sm:text-xl ${
                        result.ecart > 0
                          ? 'text-primary'
                          : result.ecart < 0
                            ? 'text-emerald-700'
                            : 'text-dark'
                      }`}
                    >
                      {formatCad(Math.abs(result.ecart))}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-prestige-taupe">
                      {result.ecart > 0
                        ? '~à combler'
                        : result.ecart < 0
                          ? 'Au-dessus de ta cible (cotisations seulement)'
                          : 'Dans la cible (cotisations)'}
                    </p>
                  </div>
                  <p className="sm:col-span-3 text-xs leading-relaxed text-prestige-taupe">
                    L’écart, c’est cotisations vs ton souhait — pas une promesse d’achat.
                  </p>
                </div>
              ) : null}

              {lecture.points.length > 0 ? (
                <ul className="mt-4 space-y-2.5 border-t border-dark/[0.06] pt-4">
                  {lecture.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2.5 text-sm leading-relaxed text-prestige-taupe"
                    >
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                          result.plafondAtteint ? 'bg-amber-500' : 'bg-primary'
                        }`}
                        aria-hidden
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-5 grid gap-4 border-t border-dark/5 pt-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-prestige-taupe">Par année (retenu)</p>
                  <p className="mt-0.5 font-heading text-lg font-semibold text-dark">
                    {formatCad(result.cotisationEffective)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-prestige-taupe">Ajouté sur la période</p>
                  <p className="mt-0.5 font-heading text-lg font-semibold text-dark">
                    {formatCad(result.totalAjoute)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-prestige-taupe">
                    {result.plafondAtteint ? 'Max atteint' : 'Place restante à vie'}
                  </p>
                  <p
                    className={`mt-0.5 font-heading text-lg font-semibold ${
                      result.plafondAtteint ? 'text-amber-700' : 'text-dark'
                    }`}
                  >
                    {formatCad(result.droitsRestantsApres)}
                  </p>
                </div>
              </div>

              {milestones[2].done ? (
                <div className="mt-5">
                  <ToolDownloadPdf
                    onClick={handleDownload}
                    busy={busy}
                    label="Télécharger ma projection PDF"
                  />
                </div>
              ) : null}
            </div>

            <div className="mt-4 rounded-2xl bg-prestige-beige/40 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                À retenir
              </p>
              <ul className="mt-3 space-y-2">
                {A_RETENIR.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2.5 text-sm leading-relaxed text-prestige-taupe"
                  >
                    <Check
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CampagneToolShell>
    </div>
  );
}

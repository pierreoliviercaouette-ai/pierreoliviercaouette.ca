import { useMemo, useState } from 'react';
import { Check, Home } from 'lucide-react';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
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
  'CELIAPP = compte pour bâtir une mise de fonds (1re propriété admissible).',
  'Ce n’est pas le CELI : plafonds, retraits et fiscalité sont différents.',
  'Qui a le droit, jusqu’à quand, et comment retirer : à vérifier avant de cotiser.',
  'Ici : juste tes cotisations — aucun rendement inventé.',
];

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
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

function MoneyInput({ id, value, onChange, min, max, step, placeholder }) {
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
  const [cotisationAnnuelle, setCotisationAnnuelle] = useState('8000');
  const [annees, setAnnees] = useState('5');
  const [dejaCotise, setDejaCotise] = useState('0');
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_celiapp_pdf');

  const result = useMemo(() => {
    const prevu = Math.max(0, toNumber(cotisationAnnuelle));
    const years = Math.max(0, Math.min(15, Math.floor(toNumber(annees))));
    const deja = Math.min(PLAFOND_VIE, Math.max(0, toNumber(dejaCotise)));

    const droitsRestantsAvant = Math.max(0, PLAFOND_VIE - deja);
    const cotisationEffective = Math.min(prevu, PLAFOND_ANNUEL, droitsRestantsAvant);
    const totalAjoute = Math.min(cotisationEffective * years, droitsRestantsAvant);
    const totalProjete = deja + totalAjoute;
    const droitsRestantsApres = Math.max(0, PLAFOND_VIE - totalProjete);
    const coupeParPlafondAnnuel = prevu > PLAFOND_ANNUEL && droitsRestantsAvant > 0;
    const coupeParPlafondVie =
      years > 0 && cotisationEffective * years > droitsRestantsAvant;

    return {
      prevu,
      cotisationEffective,
      totalAjoute,
      totalProjete,
      droitsRestantsApres,
      miseDeFonds: totalProjete,
      years,
      deja,
      plafondAtteint: droitsRestantsApres <= 0 && totalProjete > 0,
      coupeParPlafondAnnuel,
      coupeParPlafondVie,
    };
  }, [cotisationAnnuelle, annees, dejaCotise]);

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
        ? 'Max à vie atteint dans ce scénario. Télécharge le PDF pour le garder.'
        : 'Ta projection est prête. Télécharge le PDF et mets-le avec ton plan d’achat.';

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
        intro="Le CELIAPP, c’est un compte pour épargner ta mise de fonds (1re propriété) — jusqu’à 8 000 $ / an et 40 000 $ à vie. Entre ce que tu mets, ce que t’as déjà, et dans combien d’années tu vises d’acheter."
        disclaimer="Illustration éducative seulement — pas un conseil personnalisé. Chiffres 2026 illustratifs (8 000 $ / année, 40 000 $ à vie). Qui a le droit, les retraits et l’impôt : à revalider selon ta situation."
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-prestige-taupe">{statusDetail}</p>
            <ToolDownloadPdf
              busy={busy}
              onClick={handleDownload}
              label="Télécharger ma projection PDF"
            />
          </div>
        }
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
              hint={`Max ${PLAFOND_ANNUEL.toLocaleString('fr-CA')} $ / année (2026). Ex. : 8 000 $ si tu vises le max.`}
            >
              <MoneyInput
                id="celiapp-cotisation"
                value={cotisationAnnuelle}
                onChange={setCotisationAnnuelle}
                min={0}
                max={PLAFOND_ANNUEL}
                step="100"
                placeholder="8000"
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
                  placeholder="5"
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
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                {result.plafondAtteint ? 'Max à vie' : 'Total pour la mise de fonds'}
              </p>
              <p className="font-heading mt-1 text-3xl font-bold tracking-tight text-dark sm:text-4xl">
                {formatCad(result.miseDeFonds)}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-prestige-taupe">{lecture.detail}</p>

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

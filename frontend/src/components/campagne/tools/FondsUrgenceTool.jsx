import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Check, AlertTriangle, LifeBuoy } from 'lucide-react';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { buildCampagneRdvPath } from '../../../data/campagneAdsLandings';
import { trackEvent, trackRendezVousClick } from '../../../lib/analytics';
import { formatCad } from '../../tools/format';
import { CampagneToolShell, ToolDownloadPdf, ToolSoftClose } from '../CampagneToolShell';
import {
  useCampagneWizard,
  WizardProgress,
  WizardBackButton,
  WizardChoiceList,
  WizardContinueButton,
  WizardStep,
  WizardStepHeading,
} from '../CampagneWizard';

const FONDS_STEP_IDS = ['cible', 'situation', 'result'];

const MOIS_OPTIONS = [
  { value: '3', label: '3 mois â€” revenu stable' },
  { value: '6', label: '6 mois â€” courant' },
  { value: '9', label: '9 mois â€” revenu moins stable' },
  { value: '12', label: '12 mois â€” autonome / prÃ©caire' },
];

/** Points fixes â€” utiles mÃªme sans dossier. */
const A_RETENIR = [
  'Fonds dâ€™urgence = argent accessible si tu perds ton job ou quâ€™un gros imprÃ©vu arrive.',
  'Cible typique : 3 Ã  6 mois de dÃ©penses essentielles (plus si le revenu est fragile).',
  'Garde-le liquide (Ã©pargne, CPG rachetable, CELI en liquiditÃ©s) â€” pas dans des placements qui peuvent baisser.',
  'Une fois le filet solide, le surplus peut aller vers dettes chÃ¨res, CELI ou REER â€” selon ta situation.',
];

const inputClass =
  'w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-sm text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] transition focus:outline-none focus:shadow-[inset_0_0_0_2px_rgba(6,77,217,0.45)]';

const labelClass = 'mb-1.5 block text-xs font-medium text-prestige-taupe';

function parsePositive(raw, fallback) {
  const n = Number(raw);
  if (raw === '' || Number.isNaN(n) || n < 0) return fallback;
  return n;
}

function formatDureeMois(mois) {
  if (mois == null) return null;
  if (mois <= 0) return '0 mois';
  if (mois === 1) return '1 mois';
  if (mois < 12) return `${mois} mois`;
  const ans = Math.floor(mois / 12);
  const reste = mois % 12;
  const ansLabel = ans === 1 ? '1 an' : `${ans} ans`;
  if (reste === 0) return ansLabel;
  if (reste === 1) return `${ansLabel} et 1 mois`;
  return `${ansLabel} et ${reste} mois`;
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

function MoneyInput({ id, value, onChange, min, step, placeholder }) {
  return (
    <div className="relative">
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
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

function Metric({ label, value, detail, tone = 'default' }) {
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

function buildLecture({ cible, manquant, surplus, moisPourCombler, epargneParMois, mois }) {
  if (cible <= 0) {
    return {
      headline: 'Il manque encore un chiffre',
      detail: 'Indique tes dÃ©penses essentielles et combien de mois tu vises â€” on calcule la cible.',
      points: [],
      tone: 'default',
    };
  }

  if (surplus > 0) {
    return {
      headline: 'Filet dÃ©jÃ  atteint',
      detail: `Tu as environ ${formatCad(surplus)} de plus que la cible illustrÃ©e. Le prochain sujet, câ€™est souvent oÃ¹ oriente le surplus â€” pas dâ€™ajouter encore au coussin.`,
      points: [
        `Cible : ${formatCad(cible)} (${mois} mois de dÃ©penses).`,
        'Garde ce coussin accessible â€” ce nâ€™est pas de lâ€™argent Â« long terme Â».',
        'Surplus : dettes chÃ¨res, CELI, REERâ€¦ selon ta situation (Ã  clarifier).',
      ],
      tone: 'ok',
    };
  }

  const points = [
    `Il te manque ${formatCad(manquant)} pour atteindre ${formatCad(cible)}.`,
  ];

  if (moisPourCombler == null) {
    points.push('Avec 0 $ ajoutÃ© par mois, lâ€™Ã©cart ne bouge pas â€” monte un peu pour voir un dÃ©lai.');
  } else if (moisPourCombler === 0) {
    points.push('Rien Ã  combler au rythme actuel.');
  } else {
    points.push(
      `Au rythme de ${formatCad(epargneParMois)} / mois : environ ${formatDureeMois(moisPourCombler)}.`
    );
  }

  points.push(
    'SÃ©pare ce coussin du reste : compte accessible, pas ton REER ni un portefeuille volatil.'
  );

  const long = moisPourCombler != null && moisPourCombler > 24;
  return {
    headline: long ? 'Ã‰cart encore large â€” un palier dâ€™abord' : 'Voici ton Ã©cart',
    detail: long
      ? 'Pas besoin de tout remplir dâ€™un coup. Un premier mois de dÃ©penses de cÃ´tÃ© rÃ©duit dÃ©jÃ  le stress ; tu montes ensuite.'
      : 'Ajuste les montants â€” le dÃ©lai et le rythme se mettent Ã  jour tout de suite.',
    points,
    tone: 'warn',
  };
}

export function FondsUrgenceTool({ immersive = false } = {}) {
  const location = useLocation();
  const [depensesMensuelles, setDepensesMensuelles] = useState('3500');
  const [moisCibles, setMoisCibles] = useState('6');
  const [dejaMisDeCote, setDejaMisDeCote] = useState('5000');
  const [epargneMensuelle, setEpargneMensuelle] = useState('300');
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_fonds-urgence_pdf');

  const {
    stepIndex,
    currentStepId,
    isResult,
    questionCount,
    progress: wizardProgress,
    selectAndAdvance,
    advanceFrom,
    goBack,
  } = useCampagneWizard(FONDS_STEP_IDS, {
    onReachResult: () =>
      trackEvent('select_content', {
        content_type: 'tool_result',
        item_id: 'campagne_fonds-urgence_result',
      }),
  });

  const depenses = parsePositive(depensesMensuelles, 0);
  const mois = parsePositive(moisCibles, 6);
  const epargneActuelle = parsePositive(dejaMisDeCote, 0);
  const epargneParMois = parsePositive(epargneMensuelle, 0);

  const cible = depenses * mois;
  const ecart = cible - epargneActuelle;
  const manquant = Math.max(0, ecart);
  const surplus = Math.max(0, -ecart);
  const moisPourCombler =
    manquant <= 0 ? 0 : epargneParMois > 0 ? Math.ceil(manquant / epargneParMois) : null;
  const rythme12 = manquant > 0 ? Math.ceil(manquant / 12) : 0;

  const pctVersCible =
    cible > 0 ? Math.min(100, Math.round((epargneActuelle / cible) * 100)) : 0;
  const atteint = cible > 0 && manquant <= 0;

  const lecture = useMemo(
    () =>
      buildLecture({
        cible,
        manquant,
        surplus,
        moisPourCombler,
        epargneParMois,
        mois,
      }),
    [cible, manquant, surplus, moisPourCombler, epargneParMois, mois]
  );

  const milestones = useMemo(
    () => [
      {
        id: 'cible',
        done: Boolean(String(depensesMensuelles).trim() && depenses > 0 && mois > 0),
      },
      {
        id: 'situation',
        done: String(dejaMisDeCote).trim() !== '' && String(epargneMensuelle).trim() !== '',
      },
      { id: 'resultat', done: cible > 0 },
    ],
    [depensesMensuelles, depenses, mois, dejaMisDeCote, epargneMensuelle, cible]
  );

  const doneCount = milestones.filter((m) => m.done).length;
  const total = milestones.length;

  const statusDetail = !milestones[0].done
    ? 'Indique tes dÃ©penses essentielles et combien de mois tu vises.'
    : atteint
      ? 'Filet OK â€” 15 min pour trancher le surplus, ou PDF.'
      : moisPourCombler == null
        ? 'Ajoute un montant mensuel pour estimer le dÃ©lai â€” puis 15 min ou PDF.'
        : 'DÃ©lai vu â€” 15 min pour un palier, ou PDF Ã  garder.';

  const dureeLabel = formatDureeMois(moisPourCombler);
  const moisPdfValue =
    moisPourCombler === null
      ? 'Non estimable (Ã©pargne mensuelle = 0)'
      : dureeLabel || String(moisPourCombler);

  const showRythme12SousManquant =
    !atteint && moisPourCombler != null && moisPourCombler > 12 && rythme12 > 0;

  const softClose = useMemo(() => {
    if (cible <= 0) return null;
    if (atteint || surplus > 0) {
      return {
        tone: 'ok',
        headline: 'Filet OK dans ce scÃ©nario.',
        subline: `Environ ${formatCad(surplus)} de surplus vs la cible illustrÃ©e. 15 min pour trancher le prochain dollar : dettes chÃ¨res, CELI ou REER â€” selon ta situation.`,
        rdvLabel: 'Trancher le prochain dollar â€” 15 min',
      };
    }
    if (moisPourCombler != null && moisPourCombler > 24) {
      return {
        tone: 'warn',
        headline: 'Pas besoin de tout remplir dâ€™un coup.',
        subline: `Il te manque ${formatCad(manquant)}${
          dureeLabel ? ` (~${dureeLabel} Ã  ton rythme)` : ''
        }. 15 min pour un premier palier â€” souvent un mois de dÃ©penses â€” et oÃ¹ le garer.`,
        rdvLabel: 'RÃ©server 15 minutes',
      };
    }
    return {
      tone: 'warn',
      headline: `Ton Ã©cart : ${formatCad(manquant)}.`,
      subline: dureeLabel
        ? `${dureeLabel} Ã  ton rythme â€” 15 min pour fixer oÃ¹ garer le coussin et Ã  quel rythme. ZÃ©ro pression.`
        : '15 min pour fixer oÃ¹ garer le coussin et Ã  quel rythme. ZÃ©ro pression.',
      rdvLabel: 'RÃ©server 15 minutes',
    };
  }, [cible, atteint, surplus, moisPourCombler, manquant, dureeLabel]);

  const rdvPath = buildCampagneRdvPath('fonds-urgence', location.search);

  const handleDownload = () =>
    downloadPdf({
      title: 'RÃ©sumÃ© â€” fonds dâ€™urgence',
      filename: 'resume-fonds-urgence.pdf',
      sections: [
        {
          heading: 'Tes entrÃ©es',
          rows: [
            {
              label: 'DÃ©penses essentielles / mois',
              value: formatCad(depenses),
            },
            { label: 'Mois Ã  couvrir', value: `${mois} mois` },
            { label: 'DÃ©jÃ  de cÃ´tÃ©', value: formatCad(epargneActuelle) },
            {
              label: 'Ajout possible / mois',
              value: formatCad(epargneParMois),
            },
          ],
        },
        {
          heading: 'RÃ©sultats',
          rows: [
            { label: 'Montant Ã  viser', value: formatCad(cible) },
            {
              label: atteint ? 'Surplus' : 'Il te manque',
              value: formatCad(atteint ? surplus : manquant),
            },
            { label: 'Progression', value: `${pctVersCible} %` },
            { label: 'DÃ©lai au rythme actuel', value: moisPdfValue },
            ...(rythme12 > 0 && !atteint
              ? [{ label: 'Rythme pour ~12 mois', value: `${formatCad(rythme12)} / mois` }]
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
          heading: 'Ã€ retenir',
          rows: A_RETENIR.map((point, i) => ({
            label: `${i + 1}`,
            value: point,
          })),
        },
      ],
      notes: [
        'Fonds dâ€™urgence = argent accessible si tu perds ton job ou un gros imprÃ©vu.',
        'Illustration Ã©ducative seulement â€” pas un plan sur mesure.',
      ],
    });

  if (immersive) {
    return (
      <div data-testid="tool-fonds-urgence">
        <CampagneToolShell
          immersive
          titleAs="h1"
          eyebrow="Fonds d'urgence"
          title="Combien mettre de cÃ´tÃ© ?"
          intro="Une question Ã  la fois. Ã€ la fin, on fixe ton coussin en 15 minutes."
          disclaimer="Illustration Ã©ducative seulement â€” pas un plan sur mesure."
          footer={null}
        >
          <WizardProgress
            stepIndex={stepIndex}
            questionCount={questionCount}
            isResult={isResult}
            resultLabel="Ton filet"
            progress={wizardProgress}
          />
          {!isResult && stepIndex > 0 ? <WizardBackButton onClick={goBack} /> : null}

          {currentStepId === 'cible' ? (
            <WizardStep id="cible">
              <WizardStepHeading
                title="Combien viser ?"
                hint="DÃ©penses essentielles Ã— nombre de mois Ã  couvrir."
              />
              <Field id="fu-wiz-depenses" label="DÃ©penses essentielles / mois">
                <MoneyInput
                  id="fu-wiz-depenses"
                  value={depensesMensuelles}
                  onChange={setDepensesMensuelles}
                  min={0}
                  step="50"
                  placeholder="3500"
                />
              </Field>
              <WizardChoiceList
                name="mois"
                value={moisCibles}
                options={MOIS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                onSelect={(v) => selectAndAdvance('cible', () => setMoisCibles(v))}
              />
            </WizardStep>
          ) : null}

          {currentStepId === 'situation' ? (
            <WizardStep id="situation">
              <WizardStepHeading
                title="OÃ¹ tu en es ?"
                hint="Ce que tâ€™as dÃ©jÃ , et ce que tu peux ajouter chaque mois."
              />
              <Field id="fu-wiz-deja" label="DÃ©jÃ  de cÃ´tÃ© (accessible)">
                <MoneyInput
                  id="fu-wiz-deja"
                  value={dejaMisDeCote}
                  onChange={setDejaMisDeCote}
                  min={0}
                  step="100"
                  placeholder="5000"
                />
              </Field>
              <Field id="fu-wiz-epargne" label="Ajout possible / mois">
                <MoneyInput
                  id="fu-wiz-epargne"
                  value={epargneMensuelle}
                  onChange={setEpargneMensuelle}
                  min={0}
                  step="25"
                  placeholder="300"
                />
              </Field>
              <WizardContinueButton onClick={() => advanceFrom('situation')} />
            </WizardStep>
          ) : null}

          {isResult ? (
            <WizardStep id="result">
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                Montant Ã  viser
              </p>
              <p className="font-heading mt-1 text-3xl font-bold text-dark">
                {formatCad(cible)}
              </p>
              <p className="mt-2 text-sm text-prestige-taupe">{lecture.headline}</p>
              <ul className="mt-4 space-y-2">
                {lecture.points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm text-prestige-taupe">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                      aria-hidden
                    />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              {softClose ? (
                <div className="mt-5">
                  <ToolSoftClose
                    headline={softClose.headline}
                    subline={softClose.subline}
                    rdvPath={rdvPath}
                    rdvLabel={softClose.rdvLabel}
                    onRdvClick={() =>
                      trackRendezVousClick('campagne_fonds-urgence_rdv_outil')
                    }
                    onPdf={handleDownload}
                    pdfBusy={busy}
                    tone={softClose.tone}
                  />
                </div>
              ) : null}
            </WizardStep>
          ) : null}
        </CampagneToolShell>
      </div>
    );
  }

  return (
    <div data-testid="tool-fonds-urgence">
      <CampagneToolShell
        immersive={false}
        titleAs="h2"
        eyebrow="Outil interactif"
        title="Combien mettre de cÃ´tÃ© ?"
        intro="Un fonds dâ€™urgence, câ€™est de lâ€™argent accessible si tu perds ton job ou quâ€™un gros imprÃ©vu arrive. On calcule la cible, lâ€™Ã©cart, et en combien de temps tu peux y arriver."
        disclaimer="Illustration Ã©ducative seulement â€” pas un plan sur mesure. Lâ€™argent doit rester accessible : pas un conseil de placement."
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-prestige-taupe">{statusDetail}</p>
            <ToolDownloadPdf
              busy={busy}
              onClick={handleDownload}
              label="TÃ©lÃ©charger mon rÃ©sumÃ© PDF"
              variant="ghost"
            />
          </div>
        }
      >
        <div className="mb-8">
          <div className="mb-2 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                Vers ta cible
              </p>
              <p className="font-heading mt-1 text-2xl font-bold text-dark">
                {formatCad(epargneActuelle)}
                <span className="text-base font-medium text-prestige-taupe">
                  {' '}
                  / {formatCad(cible)}
                </span>
              </p>
            </div>
            <p className="text-sm text-prestige-taupe">{pctVersCible} %</p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-prestige-beige/70">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                atteint
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-primary to-secondary'
              }`}
              style={{ width: `${pctVersCible}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-prestige-taupe">
            {doneCount}/{total} blocs remplis
            {cible > 0
              ? atteint
                ? ' Â· filet atteint dans ce scÃ©nario.'
                : ` Â· il manque ${formatCad(manquant)}.`
              : '.'}
          </p>
        </div>

        <div className="relative space-y-8 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-px before:bg-prestige-beige">
          <Block
            step={1}
            title="Combien viser"
            subtitle="DÃ©penses essentielles Ã— nombre de mois Ã  couvrir."
            done={milestones[0].done}
          >
            <Field
              id="fu-depenses"
              label="DÃ©penses essentielles / mois"
              hint="Loyer, bouffe, transport, assurances, minimums de dettes â€” pas les sorties."
            >
              <MoneyInput
                id="fu-depenses"
                value={depensesMensuelles}
                onChange={setDepensesMensuelles}
                min={0}
                step={50}
                placeholder="3500"
              />
            </Field>
            <Field
              id="fu-mois"
              label="Mois Ã  couvrir"
              hint="3â€“6 mois si le revenu est stable ; plus si autonome, contractuel ou un seul salaire."
            >
              <select
                id="fu-mois"
                className={inputClass}
                value={moisCibles}
                onChange={(e) => setMoisCibles(e.target.value)}
              >
                {MOIS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <div className="rounded-2xl bg-gradient-to-br from-primary/[0.04] to-secondary/[0.06] px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-secondary">
                  Montant Ã  viser
                </p>
                <p className="font-heading mt-1 text-xl font-bold tabular-nums text-dark">
                  {formatCad(cible)}
                </p>
                <p className="mt-0.5 text-xs text-prestige-taupe">
                  {mois} mois Ã— {formatCad(depenses)}
                </p>
              </div>
            </div>
          </Block>

          <Block
            step={2}
            title="OÃ¹ tu en es"
            subtitle="Ce que tâ€™as dÃ©jÃ  dâ€™accessible, et ce que tu peux ajouter chaque mois."
            done={milestones[1].done}
          >
            <Field
              id="fu-deja"
              label="DÃ©jÃ  de cÃ´tÃ© (accessible)"
              hint="Compte dâ€™Ã©pargne, liquiditÃ©s â€” pas ton REER ni un portefeuille long terme."
            >
              <MoneyInput
                id="fu-deja"
                value={dejaMisDeCote}
                onChange={setDejaMisDeCote}
                min={0}
                step={100}
                placeholder="5000"
              />
            </Field>
            <Field
              id="fu-epargne"
              label="Ajout possible / mois"
              hint="Ce que tu peux virer automatiquement chaque mois."
            >
              <MoneyInput
                id="fu-epargne"
                value={epargneMensuelle}
                onChange={setEpargneMensuelle}
                min={0}
                step={25}
                placeholder="300"
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
                <LifeBuoy className="h-3.5 w-3.5" />
              )}
            </div>
            <div className="mb-3">
              <h3 className="font-heading text-base font-semibold text-dark">En clair</h3>
              <p className="mt-0.5 text-sm text-prestige-taupe">
                Ã‰cart, dÃ©lai, et quoi retenir â€” sans jargon.
              </p>
            </div>

            <div
              className={`rounded-2xl px-5 py-5 ${
                lecture.tone === 'ok'
                  ? 'bg-gradient-to-br from-emerald-50 to-white shadow-[inset_0_0_0_1px_rgba(16,185,129,0.22)]'
                  : lecture.tone === 'warn'
                    ? 'bg-gradient-to-br from-amber-50/80 to-white shadow-[inset_0_0_0_1px_rgba(245,158,11,0.2)]'
                    : 'bg-gradient-to-br from-primary/[0.04] to-secondary/[0.06]'
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                {lecture.headline}
              </p>
              <p className="font-heading mt-1 text-3xl font-bold tracking-tight text-dark sm:text-4xl">
                {atteint ? formatCad(surplus) : formatCad(manquant)}
              </p>
              <p className="mt-1 text-sm font-medium text-dark">
                {atteint ? 'de surplus vs la cible' : 'Ã  combler'}
              </p>
              {showRythme12SousManquant ? (
                <p className="mt-1.5 text-sm font-bold text-dark">
                  Soit ~{formatCad(rythme12)}/mois pour ~12 mois (illustration)
                </p>
              ) : null}
              <p className="mt-2 text-sm leading-relaxed text-prestige-taupe">{lecture.detail}</p>

              {lecture.points.length > 0 ? (
                <ul className="mt-4 space-y-2.5 border-t border-dark/[0.06] pt-4">
                  {lecture.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2.5 text-sm leading-relaxed text-prestige-taupe"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-secondary"
                        strokeWidth={2.5}
                        aria-hidden
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Metric
                label="DÃ©lai au rythme actuel"
                value={dureeLabel ?? 'â€”'}
                detail={
                  moisPourCombler === null
                    ? 'Monte lâ€™ajout mensuel pour voir un dÃ©lai.'
                    : moisPourCombler === 0
                      ? 'Rien Ã  combler.'
                      : `Ã€ ${formatCad(epargneParMois)} / mois.`
                }
                tone={atteint ? 'ok' : moisPourCombler == null || moisPourCombler > 24 ? 'warn' : 'default'}
              />
              <Metric
                label={atteint ? 'Filet' : 'Pour y arriver en ~12 mois'}
                value={atteint ? 'Atteint' : rythme12 > 0 ? formatCad(rythme12) : 'â€”'}
                detail={
                  atteint
                    ? 'Cible illustrÃ©e dÃ©jÃ  couverte.'
                    : rythme12 > 0
                      ? 'Par mois, illustration seulement.'
                      : 'ComplÃ¨te la cible pour voir un rythme.'
                }
                tone={atteint ? 'ok' : 'default'}
              />
            </div>

            {softClose ? (
              <div className="mt-4">
                <ToolSoftClose
                  tone={softClose.tone}
                  headline={softClose.headline}
                  subline={softClose.subline}
                  rdvPath={rdvPath}
                  rdvLabel={softClose.rdvLabel}
                  onRdvClick={() =>
                    trackRendezVousClick('campagne_fonds-urgence_rdv_outil')
                  }
                  onPdf={handleDownload}
                  pdfBusy={busy}
                  pdfLabel="TÃ©lÃ©charger mon rÃ©sumÃ© PDF"
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-prestige-beige/35 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Ã€ retenir</p>
          <ul className="mt-3 space-y-2">
            {A_RETENIR.map((point) => (
              <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-prestige-taupe">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-secondary" aria-hidden />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </CampagneToolShell>
    </div>
  );
}

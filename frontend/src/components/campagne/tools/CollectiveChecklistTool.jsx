import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertTriangle, Check, FileText } from 'lucide-react';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { buildCampagneRdvPath } from '../../../data/campagneAdsLandings';
import { trackEvent, trackRendezVousClick } from '../../../lib/analytics';
import {
  CampagneToolShell,
  ToolDownloadPdf,
  ToolSoftClose,
} from '../CampagneToolShell';
import {
  useCampagneWizard,
  WizardProgress,
  WizardBackButton,
  WizardChoiceList,
  WizardContinueButton,
  WizardStep,
  WizardStepHeading,
} from '../CampagneWizard';

const DEFINITION_OPTIONS = [
  { value: '', label: 'Je ne sais pas encore' },
  {
    value: 'propre-metier',
    label: 'Seulement ton mÃ©tier actuel',
  },
  {
    value: 'toute-occupation',
    label: 'Nâ€™importe quel travail que tu pourrais faire',
  },
  {
    value: 'mixte',
    label: 'Ã‡a change aprÃ¨s quelques mois',
  },
];

const DEPART_OPTIONS = [
  { value: '', label: 'Je ne sais pas encore' },
  { value: 'cesse', label: 'Tout sâ€™arrÃªte quand tu quittes' },
  { value: 'conversion', label: 'Tu peux transformer en assurance perso' },
  { value: 'partielle', label: 'Certaines protections restent' },
];

const inputClass =
  'w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-sm text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] transition focus:outline-none focus:shadow-[inset_0_0_0_2px_rgba(6,77,217,0.45)]';

const labelClass = 'mb-1.5 block text-xs font-medium text-prestige-taupe';

const hintClass = 'mt-1.5 text-xs leading-relaxed text-prestige-taupe';

function Field({ id, label, hint, children, className = '' }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {hint ? <p className={hintClass}>{hint}</p> : null}
    </div>
  );
}

function displayOrDash(value, suffix = '') {
  const v = String(value ?? '').trim();
  if (!v) return 'Non renseignÃ©';
  return suffix ? `${v}${suffix}` : v;
}

function definitionLabel(value) {
  return DEFINITION_OPTIONS.find((o) => o.value === value)?.label || 'Non renseignÃ©';
}

function departLabel(value) {
  return DEPART_OPTIONS.find((o) => o.value === value)?.label || 'Non renseignÃ©';
}

function formatMoney(value) {
  const n = Number(String(value).replace(/\s/g, ''));
  if (!Number.isFinite(n) || n <= 0) return null;
  return `${n.toLocaleString('fr-CA')} $`;
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
        {subtitle ? <p className="mt-0.5 text-sm leading-snug text-prestige-taupe">{subtitle}</p> : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function ResultCard({ label, value, detail, tone = 'default' }) {
  const toneClass =
    tone === 'warn'
      ? 'border-amber-300/90 bg-gradient-to-br from-amber-50 to-white'
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
      <p className="font-heading mt-1.5 text-xl font-bold leading-snug text-dark sm:text-2xl">{value}</p>
      {detail ? <p className="mt-1.5 text-sm leading-relaxed text-prestige-taupe">{detail}</p> : null}
    </div>
  );
}

function LivretCheckbox({ id, hasLivret, onChange }) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-2xl bg-gradient-to-br from-primary/[0.04] to-secondary/[0.06] px-4 py-3.5 shadow-[inset_0_0_0_1px_rgba(1,35,63,0.06)]"
    >
      <input
        id={id}
        type="checkbox"
        checked={hasLivret}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 rounded border-input text-primary focus:ring-primary"
      />
      <span>
        <span className="block text-sm font-semibold text-dark">
          Jâ€™ai le livret de mon assurance collective
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-prestige-taupe">
          Pas juste la carte â€” le PDF ou le document RH avec les vrais chiffres.
        </span>
      </span>
    </label>
  );
}

const COLLECTIVE_STEP_IDS = ['invalidite', 'vieSante', 'depart', 'employeur', 'result'];

export function CollectiveChecklistTool({ immersive = false } = {}) {
  const location = useLocation();
  const [employeur, setEmployeur] = useState('');
  const [structureInvalidite, setStructureInvalidite] = useState('simple');
  const [pctInvalidite, setPctInvalidite] = useState('');
  const [pctCourtTerme, setPctCourtTerme] = useState('');
  const [pctLongTerme, setPctLongTerme] = useState('');
  const [delaiJours, setDelaiJours] = useState('');
  const [definition, setDefinition] = useState('');
  const [notesPaliers, setNotesPaliers] = useState('');
  const [capitalVie, setCapitalVie] = useState('');
  const [sante, setSante] = useState('');
  const [depart, setDepart] = useState('');
  const [trousNotes, setTrousNotes] = useState('');
  const [hasLivret, setHasLivret] = useState(false);
  const [notesLibres, setNotesLibres] = useState('');
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_assurance-collective_pdf');
  const {
    stepIndex, currentStepId, isResult, questionCount, progress: wizardProgress,
    selectAndAdvance, advanceFrom, goBack,
  } = useCampagneWizard(COLLECTIVE_STEP_IDS, {
    onReachResult: () => trackEvent('select_content', { content_type: 'tool_result', item_id: 'campagne_assurance-collective_result' }),
  });

  const rdvPath = buildCampagneRdvPath('assurance-collective', location.search);
  const multiPalier = structureInvalidite === 'paliers';

  const invaliditeChiffresOk = multiPalier
    ? Boolean(pctCourtTerme.trim() || pctLongTerme.trim() || notesPaliers.trim()) &&
      Boolean(delaiJours.trim()) &&
      Boolean(definition)
    : Boolean(pctInvalidite.trim() && delaiJours.trim() && definition);

  const milestones = useMemo(
    () => [
      { id: 'invalidite', done: invaliditeChiffresOk },
      { id: 'vieSante', done: Boolean(capitalVie.trim() && sante.trim()) },
      { id: 'depart', done: Boolean(depart) },
      { id: 'livret', done: hasLivret },
      { id: 'employeur', done: Boolean(employeur.trim()) },
    ],
    [invaliditeChiffresOk, capitalVie, sante, depart, hasLivret, employeur]
  );

  const doneCount = milestones.filter((m) => m.done).length;
  const total = milestones.length;
  const progress = Math.round((doneCount / total) * 100);
  const missingCount = total - doneCount;

  const invaliditePartial =
    Boolean(pctInvalidite.trim()) ||
    Boolean(pctCourtTerme.trim()) ||
    Boolean(pctLongTerme.trim()) ||
    Boolean(delaiJours.trim()) ||
    Boolean(definition) ||
    Boolean(notesPaliers.trim());
  const invaliditeDone = milestones[0].done;
  const invaliditeWarn = !invaliditeDone;

  const invaliditeValue = invaliditeDone
    ? multiPalier
      ? `Paliers Â· ${delaiJours.trim()} j`
      : `${pctInvalidite.trim()} % Â· ${delaiJours.trim()} j`
    : invaliditePartial
      ? 'Partiel'
      : 'Ã€ trouver';

  const invaliditeDetail = invaliditeDone
    ? multiPalier
      ? `${definitionLabel(definition)}. Couverture en plusieurs paliers â€” vÃ©rifie toujours ton livret (court / long terme peuvent diffÃ©rer).`
      : `${definitionLabel(definition)}. Câ€™est ce que ton assurance collective tâ€™offre si tu ne peux plus travailler.`
    : invaliditePartial
      ? 'ComplÃ¨te dÃ©lai, dÃ©finition et % (ou paliers). Câ€™est Ã©crit dans le livret â€” pas sur la carte.'
      : 'Sans % ni dÃ©lai, tu dÃ©couvres le filet le jour dâ€™une rÃ©clamation. Ouvre la section invaliditÃ© â€” un % ou plusieurs paliers.';

  const capitalFmt = formatMoney(capitalVie);
  const vieSanteDone = milestones[1].done;
  const vieSantePartial = Boolean(capitalVie.trim()) || Boolean(sante.trim());

  const vieSanteValue = vieSanteDone
    ? capitalFmt || 'NotÃ©'
    : vieSantePartial
      ? 'Partiel'
      : 'Ã€ trouver';

  const vieSanteDetail = vieSanteDone
    ? `Vie : ${capitalFmt || `${capitalVie.trim()} $`}. SantÃ© : ${sante.trim()}.`
    : vieSantePartial
      ? 'Ajoute le montant vie et ce que le dentaire / les mÃ©dicaments couvrent vraiment.'
      : 'Combien pour tes proches, et quel plafond dentaire / mÃ©dicaments â€” vraiment ?';

  const departDone = milestones[2].done;
  const departValue = departDone ? departLabel(depart) : 'Ã€ clarifier';
  const departDetail = departDone
    ? trousNotes.trim()
      ? `Trous notÃ©s : ${trousNotes.trim()}`
      : 'VÃ©rifie aussi sâ€™il reste des trous (invaliditÃ© trop basse, pas de maladie graveâ€¦).'
    : 'Quand tu changes dâ€™emploi, la collective suit rarement. Note ce qui tombe avant dâ€™en avoir besoin.';

  const livretValue = hasLivret ? 'Oui' : 'Pas encore';
  const livretDetail = hasLivret
    ? 'Garde le PDF avec ton livret. Revalide si ton emploi ou ton salaire change.'
    : 'Sans le PDF RH, tu devines. Avec, tu sais ce que ton assurance collective tâ€™offre vraiment.';

  const showSoftClose = missingCount > 0 || invaliditeWarn;

  const softHeadline = showSoftClose
    ? `Tâ€™as encore ${missingCount} case${missingCount > 1 ? 's' : ''} floue${missingCount > 1 ? 's' : ''}${
        invaliditeWarn ? ' â€” dont lâ€™invaliditÃ©' : ''
      }.`
    : 'Bon rÃ©sumÃ©.';

  const softSubline = showSoftClose
    ? '15 min, on les dÃ©mÃªle ensemble, livret ouvert. Clarifier, câ€™est pas acheter.'
    : 'Range le PDF avec ton livret â€” et revalide si ton emploi ou ton salaire change.';

  const handleLivretChange = (checked) => {
    setHasLivret(checked);
    if (checked) {
      trackEvent('select_content', {
        content_type: 'tool',
        item_id: 'campagne_assurance-collective_livret_check',
      });
    }
  };

  const handleStructureChange = (value) => {
    setStructureInvalidite(value);
    if (value === 'paliers') {
      trackEvent('select_content', {
        content_type: 'tool',
        item_id: 'campagne_assurance-collective_paliers',
      });
    }
  };

  const handleDownload = () =>
    downloadPdf({
      title: 'RÃ©sumÃ© â€” ton assurance collective',
      filename: 'resume-assurance-collective.pdf',
      sections: [
        {
          heading: 'InvaliditÃ©',
          rows: [
            {
              label: 'Structure',
              value: multiPalier
                ? 'Plusieurs paliers (court / long terme)'
                : 'Un % principal (simplifiÃ©)',
            },
            ...(multiPalier
              ? [
                  { label: '% court terme', value: displayOrDash(pctCourtTerme, ' %') },
                  { label: '% long terme', value: displayOrDash(pctLongTerme, ' %') },
                  { label: 'DÃ©tails paliers', value: displayOrDash(notesPaliers) },
                ]
              : [{ label: '% du salaire remplacÃ©', value: displayOrDash(pctInvalidite, ' %') }]),
            { label: 'DÃ©lai (jours avant argent)', value: displayOrDash(delaiJours, ' jours') },
            {
              label: 'DÃ©finition',
              value: definition ? definitionLabel(definition) : 'Non renseignÃ©',
            },
          ],
        },
        {
          heading: 'Vie et santÃ©',
          rows: [
            { label: 'Capital vie', value: displayOrDash(capitalVie, ' $') },
            { label: 'SantÃ© (dentaire / mÃ©dicaments)', value: displayOrDash(sante) },
          ],
        },
        {
          heading: 'Si tu quittes / trous',
          rows: [
            {
              label: 'Si tu quittes',
              value: depart ? departLabel(depart) : 'Non renseignÃ©',
            },
            { label: 'Trous / questions', value: displayOrDash(trousNotes) },
            { label: 'AccÃ¨s au livret', value: hasLivret ? 'Oui' : 'Ã€ obtenir' },
          ],
        },
        {
          heading: 'Employeur',
          rows: [{ label: 'Employeur', value: displayOrDash(employeur) }],
        },
        ...(notesLibres.trim()
          ? [
              {
                heading: 'Notes personnelles',
                rows: [{ label: 'Notes', value: notesLibres.trim() }],
              },
            ]
          : []),
      ],
      notes: [
        `${doneCount}/${total} blocs clarifiÃ©s.`,
        'Outil simplifiÃ© : ton livret peut avoir plusieurs paliers, plafonds ou dÃ©finitions plus fines â€” câ€™est le document qui prime.',
        'Revalide ce rÃ©sumÃ© si ton emploi, ton salaire ou ton assurance collective change.',
      ],
    });


  /* immersive-wizard */
  if (immersive) {
    return (
      <div data-testid="tool-collective-checklist">
        <CampagneToolShell immersive titleAs="h1" eyebrow="Collective" title="Checklist â€” ton assurance collective" intro="Un bloc Ã  la fois. Ã€ la fin, on valide en 15 minutes." disclaimer="Illustration Ã©ducative seulement." footer={null}>
          <WizardProgress stepIndex={stepIndex} questionCount={questionCount} isResult={isResult} resultLabel="Portrait" progress={wizardProgress} />
          {!isResult && stepIndex > 0 ? <WizardBackButton onClick={goBack} /> : null}
          {currentStepId === 'invalidite' ? (
            <WizardStep id="invalidite">
              <WizardStepHeading title="InvaliditÃ©" hint="Combien, et quand lâ€™argent commence." />
              <Field id="col-wiz-pct" label="% invaliditÃ© (si simple)">
                <input id="col-wiz-pct" className={inputClass} value={pctInvalidite} onChange={(e) => setPctInvalidite(e.target.value)} />
              </Field>
              <Field id="col-wiz-delai" label="DÃ©lai (jours)">
                <input id="col-wiz-delai" className={inputClass} value={delaiJours} onChange={(e) => setDelaiJours(e.target.value)} />
              </Field>
              <Field id="col-wiz-def" label="DÃ©finition">
                <select id="col-wiz-def" className={inputClass} value={definition} onChange={(e) => setDefinition(e.target.value)}>
                  <option value="">Je ne sais pas</option>
                  {DEFINITION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </Field>
              <WizardContinueButton onClick={() => advanceFrom('invalidite')} />
            </WizardStep>
          ) : null}
          {currentStepId === 'vieSante' ? (
            <WizardStep id="vieSante">
              <WizardStepHeading title="Vie et santÃ©" hint="Capital vie + dentaire / mÃ©dicaments." />
              <Field id="col-wiz-vie" label="Capital vie">
                <input id="col-wiz-vie" className={inputClass} value={capitalVie} onChange={(e) => setCapitalVie(e.target.value)} />
              </Field>
              <Field id="col-wiz-sante" label="SantÃ© / dentaire">
                <input id="col-wiz-sante" className={inputClass} value={sante} onChange={(e) => setSante(e.target.value)} />
              </Field>
              <WizardContinueButton onClick={() => advanceFrom('vieSante')} />
            </WizardStep>
          ) : null}
          {currentStepId === 'depart' ? (
            <WizardStep id="depart">
              <WizardStepHeading title="Si tu quittes" hint="Ce qui reste / tombe." />
              <select id="col-wiz-depart" className={inputClass} value={depart} onChange={(e) => setDepart(e.target.value)}>
                <option value="">Je ne sais pas</option>
                {DEPART_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <Field id="col-wiz-trous" label="Trous notÃ©s">
                <textarea id="col-wiz-trous" className={inputClass} value={trousNotes} onChange={(e) => setTrousNotes(e.target.value)} rows={3} />
              </Field>
              <WizardContinueButton onClick={() => advanceFrom('depart')} />
            </WizardStep>
          ) : null}
          {currentStepId === 'employeur' ? (
            <WizardStep id="employeur">
              <WizardStepHeading title="Employeur (optionnel)" hint="Utile, pas bloquant." />
              <input id="col-wiz-emp" className={inputClass} value={employeur} onChange={(e) => setEmployeur(e.target.value)} placeholder="Nom de lâ€™employeur" />
              <WizardContinueButton onClick={() => advanceFrom('employeur')} />
            </WizardStep>
          ) : null}
          {isResult ? (
            <WizardStep id="result">
              <p className="font-heading text-2xl font-bold text-dark">{doneCount}/{total} blocs</p>
              <p className="mt-2 text-sm text-prestige-taupe">
                {showSoftClose
                  ? softSubline
                  : 'Portrait prÃªt â€” tu peux valider les cases floues en 15 min.'}
              </p>
              <div className="mt-5">
                <ToolSoftClose
                  headline={softHeadline || 'Portrait prÃªt'}
                  subline={
                    softSubline ||
                    '15 min pour valider les cases floues avec ton livret â€” zÃ©ro pression.'
                  }
                  rdvPath={rdvPath}
                  rdvLabel="Clarifier les cases floues â€” 15 min"
                  onRdvClick={() =>
                    trackRendezVousClick('campagne_assurance-collective_rdv_cases_floues')
                  }
                  onPdf={handleDownload}
                  pdfBusy={busy}
                />
              </div>
            </WizardStep>
          ) : null}
        </CampagneToolShell>
      </div>
    );
  }

  return (
    <div data-testid="tool-collective-checklist">
      <CampagneToolShell
        title="Checklist â€” ton assurance collective"
        intro="IdÃ©al avec le PDF RH ouvert. Remplis case par case â€” ton mini rÃ©sumÃ© se construit en direct."
        disclaimer="Contenu Ã©ducatif seulement â€” pas un conseil personnalisÃ©. Grille simplifiÃ©e : ton livret peut prÃ©voir plusieurs paliers, plafonds ou dÃ©finitions plus fines. Le livret prime toujours."
        footer={
          showSoftClose ? (
            <ToolSoftClose
              headline={softHeadline}
              subline={softSubline}
              rdvPath={rdvPath}
              rdvLabel="DÃ©mÃªler mes cases floues (15 min)"
              onRdvClick={() =>
                trackRendezVousClick('campagne_assurance-collective_rdv_cases_floues')
              }
              onPdf={handleDownload}
              pdfBusy={busy}
              pdfLabel="Garder mon rÃ©sumÃ© PDF"
            />
          ) : (
            <div className="flex flex-col gap-3">
              <p className="font-heading text-base font-semibold text-dark md:text-lg">
                {softHeadline}
              </p>
              <p className="text-sm leading-relaxed text-prestige-taupe">{softSubline}</p>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
                <ToolDownloadPdf
                  busy={busy}
                  onClick={handleDownload}
                  label="TÃ©lÃ©charger mon rÃ©sumÃ© PDF"
                />
                <Link
                  to={rdvPath}
                  onClick={() =>
                    trackRendezVousClick('campagne_assurance-collective_rdv_validation')
                  }
                  className="inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:underline sm:w-auto"
                  data-testid="campagne-tool-cta-rdv-soft"
                >
                  Valider ensemble en 15 min
                </Link>
              </div>
            </div>
          )
        }
      >
        {/* Gate livret */}
        <div
          className="mb-6 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-white px-4 py-4"
          data-testid="tool-collective-livret-gate"
        >
          <p className="text-sm font-semibold text-dark">IdÃ©al avec le PDF RH ouvert</p>
          <p className="mt-1 text-sm leading-relaxed text-prestige-taupe">
            Pas juste la carte : ouvre le document avec les % et les dÃ©lais.{' '}
            <a
              href="#faq-livret"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              OÃ¹ est mon livret ?
            </a>
          </p>
          <div className="mt-3">
            <LivretCheckbox
              id="collective-livret-gate"
              hasLivret={hasLivret}
              onChange={handleLivretChange}
            />
          </div>
        </div>

        {/* Progression â€” climax flous */}
        <div className="mb-6">
          <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                Progression
              </p>
              {missingCount > 0 ? (
                <>
                  <p className="font-heading mt-1 text-3xl font-bold tracking-tight text-amber-700 sm:text-4xl">
                    {missingCount} encore flou{missingCount > 1 ? 's' : ''}
                  </p>
                  <p className="mt-1 text-sm text-prestige-taupe">
                    {doneCount}/{total} Â· {progress} %
                  </p>
                </>
              ) : (
                <>
                  <p className="font-heading mt-1 text-3xl font-bold tracking-tight text-emerald-700 sm:text-4xl">
                    Complet
                  </p>
                  <p className="mt-1 text-sm text-prestige-taupe">
                    5/5 â€” range ton PDF avec le livret
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-prestige-beige/70">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                missingCount === 0
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-amber-400 to-amber-600'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-prestige-taupe">
            Chaque case remplie = un point de ton assurance collective que tu comprends vraiment.
          </p>
        </div>

        {/* Mini rÃ©sumÃ© */}
        <div className="mb-8">
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
              Ton mini rÃ©sumÃ©
            </p>
            <p className="mt-1 text-sm text-prestige-taupe">
              Se remplit au fur et Ã  mesure â€” rien Ã  attendre Ã  la fin.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ResultCard
              label="InvaliditÃ©"
              value={invaliditeValue}
              detail={invaliditeDetail}
              tone={invaliditeDone ? 'ok' : 'warn'}
            />
            <ResultCard
              label="Vie et santÃ©"
              value={vieSanteValue}
              detail={vieSanteDetail}
              tone={vieSanteDone ? 'ok' : 'warn'}
            />
            <ResultCard
              label="Si tu quittes"
              value={departValue}
              detail={departDetail}
              tone={departDone ? 'ok' : 'warn'}
            />
            <ResultCard
              label="Livret en main"
              value={livretValue}
              detail={livretDetail}
              tone={hasLivret ? 'ok' : 'warn'}
            />
          </div>
        </div>

        <div className="relative space-y-8 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-px before:bg-prestige-beige">
          <Block
            step={1}
            title="InvaliditÃ©"
            subtitle="Si tu ne peux plus travailler â€” combien, et quand lâ€™argent commence. Parfois le livret a plusieurs paliers."
            done={milestones[0].done}
          >
            <Field
              id="collective-structure"
              label="Dans ton livret, lâ€™invaliditÃ© câ€™estâ€¦"
              hint="Beaucoup de rÃ©gimes ont un % court terme puis un autre % (ou une autre dÃ©finition) plus tard."
              className="sm:col-span-2"
            >
              <div className="flex flex-wrap gap-2" role="group" aria-label="Structure invaliditÃ©">
                {[
                  { value: 'simple', label: 'Un % principal' },
                  { value: 'paliers', label: 'Plusieurs paliers' },
                ].map((opt) => {
                  const active = structureInvalidite === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleStructureChange(opt.value)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        active
                          ? 'bg-primary text-white'
                          : 'bg-white text-prestige-taupe shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)]'
                      }`}
                      aria-pressed={active}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </Field>

            {multiPalier ? (
              <>
                <Field
                  id="collective-pct-court"
                  label="% court terme (1er palier)"
                  hint="Souvent les premiers mois / la 1re pÃ©riode du livret."
                >
                  <div className="relative">
                    <input
                      id="collective-pct-court"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={100}
                      className={`${inputClass} pr-8`}
                      value={pctCourtTerme}
                      onChange={(e) => setPctCourtTerme(e.target.value)}
                      placeholder="70"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-prestige-taupe">
                      %
                    </span>
                  </div>
                </Field>
                <Field
                  id="collective-pct-long"
                  label="% long terme (aprÃ¨s)"
                  hint="Peut baisser, ou changer de dÃ©finition â€” note ce que dit le livret."
                >
                  <div className="relative">
                    <input
                      id="collective-pct-long"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={100}
                      className={`${inputClass} pr-8`}
                      value={pctLongTerme}
                      onChange={(e) => setPctLongTerme(e.target.value)}
                      placeholder="50"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-prestige-taupe">
                      %
                    </span>
                  </div>
                </Field>
                <Field
                  id="collective-notes-paliers"
                  label="DÃ©tails des paliers (tel que dans le livret)"
                  hint="Ex. 70 % pendant 24 mois, puis 50 % ; ou Â« propre mÃ©tier Â» puis Â« toute occupation Â»."
                  className="sm:col-span-2"
                >
                  <textarea
                    id="collective-notes-paliers"
                    rows={2}
                    className={`${inputClass} resize-y`}
                    value={notesPaliers}
                    onChange={(e) => setNotesPaliers(e.target.value)}
                    placeholder="Copie les paliers / pÃ©riodes du livretâ€¦"
                  />
                </Field>
              </>
            ) : (
              <Field
                id="collective-pct"
                label="% du salaire remplacÃ©"
                hint="Si ton livret montre plusieurs %, bascule sur Â« Plusieurs paliers Â»."
              >
                <div className="relative">
                  <input
                    id="collective-pct"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={100}
                    className={`${inputClass} pr-8`}
                    value={pctInvalidite}
                    onChange={(e) => setPctInvalidite(e.target.value)}
                    placeholder="60"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-prestige-taupe">
                    %
                  </span>
                </div>
              </Field>
            )}

            <Field
              id="collective-delai"
              label="Jours dâ€™attente avant le premier chÃ¨que"
              hint="Souvent 90 ou 120 jours. Dans le livret : Â« dÃ©lai dâ€™attente Â» ou Â« carence Â»."
            >
              <div className="relative">
                <input
                  id="collective-delai"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  className={`${inputClass} pr-14`}
                  value={delaiJours}
                  onChange={(e) => setDelaiJours(e.target.value)}
                  placeholder="90"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-prestige-taupe">
                  jours
                </span>
              </div>
            </Field>
            <Field
              id="collective-definition"
              label="Quand es-tu Â« invalide Â» selon ton contrat ?"
              hint="Regarde ton livret â€” section dÃ©finition. Choisis lâ€™option la plus proche (peut aussi changer par palier)."
              className="sm:col-span-2"
            >
              <select
                id="collective-definition"
                className={inputClass}
                value={definition}
                onChange={(e) => setDefinition(e.target.value)}
              >
                {DEFINITION_OPTIONS.map((opt) => (
                  <option key={opt.value || 'empty'} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
          </Block>

          <Block
            step={2}
            title="Vie et santÃ©"
            subtitle="Combien pour tes proches, et ce que le dentaire / les mÃ©dicaments couvrent vraiment."
            done={milestones[1].done}
          >
            <Field
              id="collective-capital"
              label="Montant dâ€™assurance vie"
              hint="VersÃ© Ã  tes proches si tu dÃ©cÃ¨des. Ex. 100 000 $ ou 2Ã— salaire â€” page assurance vie du livret."
            >
              <div className="relative">
                <input
                  id="collective-capital"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={1000}
                  className={`${inputClass} pr-8`}
                  value={capitalVie}
                  onChange={(e) => setCapitalVie(e.target.value)}
                  placeholder="100000"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-prestige-taupe">
                  $
                </span>
              </div>
            </Field>
            <Field
              id="collective-sante"
              label="Dentaire / mÃ©dicaments"
              hint="Note le % remboursÃ© ou le plafond annuel le plus clair dans ton livret."
            >
              <input
                id="collective-sante"
                className={inputClass}
                value={sante}
                onChange={(e) => setSante(e.target.value)}
                placeholder="Ex. dentaire 80 % / plafond 1 500 $"
              />
            </Field>
          </Block>

          <Block
            step={3}
            title="Si tu quittes et trous"
            subtitle="Ce que ton assurance collective gardeâ€¦ et ce qui tombe."
            done={milestones[2].done}
          >
            <Field
              id="collective-depart"
              label="Si tu quittes ton emploi"
              hint="Souvent collÃ© Ã  lâ€™emploi â€” regarde la fin du livret de ton assurance collective."
              className="sm:col-span-2"
            >
              <select
                id="collective-depart"
                className={inputClass}
                value={depart}
                onChange={(e) => setDepart(e.target.value)}
              >
                {DEPART_OPTIONS.map((opt) => (
                  <option key={opt.value || 'empty'} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              id="collective-trous"
              label="Trous / questions Ã  clarifier"
              hint="Ce qui te semble faible, flou, ou manquant â€” pour en parler aprÃ¨s."
              className="sm:col-span-2"
            >
              <textarea
                id="collective-trous"
                rows={2}
                className={`${inputClass} min-h-[4.5rem] resize-y`}
                value={trousNotes}
                onChange={(e) => setTrousNotes(e.target.value)}
                placeholder="Ex. InvaliditÃ© trop basse aprÃ¨s 2 ans ; pas de maladie graveâ€¦"
              />
            </Field>
          </Block>

          <div className="relative pl-11">
            <div
              className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                hasLivret
                  ? 'bg-primary text-white'
                  : 'bg-white text-prestige-taupe shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)]'
              }`}
              aria-hidden
            >
              {hasLivret ? (
                <Check className="h-4 w-4" strokeWidth={2.5} />
              ) : (
                <FileText className="h-3.5 w-3.5" />
              )}
            </div>
            <div className="mb-3">
              <h3 className="font-heading text-base font-semibold text-dark">Livret en main</h3>
              <p className="mt-0.5 text-sm leading-snug text-prestige-taupe">
                MÃªme case quâ€™en tÃªte â€” coche ici ou lÃ -haut.
              </p>
            </div>
            <LivretCheckbox
              id="collective-livret"
              hasLivret={hasLivret}
              onChange={handleLivretChange}
            />
            <div className="mt-3">
              <Field
                id="collective-notes"
                label="Notes pour toi (optionnel)"
                hint="Portail RH, date de ta derniÃ¨re vÃ©rif, personne Ã  contacterâ€¦"
              >
                <textarea
                  id="collective-notes"
                  rows={2}
                  className={`${inputClass} min-h-[4.5rem] resize-y`}
                  value={notesLibres}
                  onChange={(e) => setNotesLibres(e.target.value)}
                  placeholder="Ex. Portail RH ? Avantages sociaux"
                />
              </Field>
            </div>
          </div>

          <Block
            step={5}
            title="Employeur (optionnel)"
            subtitle="Pour savoir de quel contrat on parle â€” utile, pas bloquant."
            done={milestones[4].done}
          >
            <Field
              id="collective-employeur"
              label="Nom de lâ€™employeur"
              hint="Celui qui figure sur le livret de ton assurance collective."
              className="sm:col-span-2"
            >
              <input
                id="collective-employeur"
                className={inputClass}
                value={employeur}
                onChange={(e) => setEmployeur(e.target.value)}
                placeholder="Ex. ABC Inc."
                autoComplete="organization"
              />
            </Field>
          </Block>
        </div>
      </CampagneToolShell>
    </div>
  );
}

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

const DEFINITION_OPTIONS = [
  { value: '', label: 'Je ne sais pas encore' },
  {
    value: 'propre-metier',
    label: 'Seulement ton métier actuel',
  },
  {
    value: 'toute-occupation',
    label: 'N’importe quel travail que tu pourrais faire',
  },
  {
    value: 'mixte',
    label: 'Ça change après quelques mois',
  },
];

const DEPART_OPTIONS = [
  { value: '', label: 'Je ne sais pas encore' },
  { value: 'cesse', label: 'Tout s’arrête quand tu quittes' },
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
  if (!v) return 'Non renseigné';
  return suffix ? `${v}${suffix}` : v;
}

function definitionLabel(value) {
  return DEFINITION_OPTIONS.find((o) => o.value === value)?.label || 'Non renseigné';
}

function departLabel(value) {
  return DEPART_OPTIONS.find((o) => o.value === value)?.label || 'Non renseigné';
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
          J’ai le livret de mon assurance collective
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-prestige-taupe">
          Pas juste la carte — le PDF ou le document RH avec les vrais chiffres.
        </span>
      </span>
    </label>
  );
}

export function CollectiveChecklistTool() {
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
      ? `Paliers · ${delaiJours.trim()} j`
      : `${pctInvalidite.trim()} % · ${delaiJours.trim()} j`
    : invaliditePartial
      ? 'Partiel'
      : 'À trouver';

  const invaliditeDetail = invaliditeDone
    ? multiPalier
      ? `${definitionLabel(definition)}. Couverture en plusieurs paliers — vérifie toujours ton livret (court / long terme peuvent différer).`
      : `${definitionLabel(definition)}. C’est ce que ton assurance collective t’offre si tu ne peux plus travailler.`
    : invaliditePartial
      ? 'Complète délai, définition et % (ou paliers). C’est écrit dans le livret — pas sur la carte.'
      : 'Sans % ni délai, tu découvres le filet le jour d’une réclamation. Ouvre la section invalidité — un % ou plusieurs paliers.';

  const capitalFmt = formatMoney(capitalVie);
  const vieSanteDone = milestones[1].done;
  const vieSantePartial = Boolean(capitalVie.trim()) || Boolean(sante.trim());

  const vieSanteValue = vieSanteDone
    ? capitalFmt || 'Noté'
    : vieSantePartial
      ? 'Partiel'
      : 'À trouver';

  const vieSanteDetail = vieSanteDone
    ? `Vie : ${capitalFmt || `${capitalVie.trim()} $`}. Santé : ${sante.trim()}.`
    : vieSantePartial
      ? 'Ajoute le montant vie et ce que le dentaire / les médicaments couvrent vraiment.'
      : 'Combien pour tes proches, et quel plafond dentaire / médicaments — vraiment ?';

  const departDone = milestones[2].done;
  const departValue = departDone ? departLabel(depart) : 'À clarifier';
  const departDetail = departDone
    ? trousNotes.trim()
      ? `Trous notés : ${trousNotes.trim()}`
      : 'Vérifie aussi s’il reste des trous (invalidité trop basse, pas de maladie grave…).'
    : 'Quand tu changes d’emploi, la collective suit rarement. Note ce qui tombe avant d’en avoir besoin.';

  const livretValue = hasLivret ? 'Oui' : 'Pas encore';
  const livretDetail = hasLivret
    ? 'Garde le PDF avec ton livret. Revalide si ton emploi ou ton salaire change.'
    : 'Sans le PDF RH, tu devines. Avec, tu sais ce que ton assurance collective t’offre vraiment.';

  const showSoftClose = missingCount > 0 || invaliditeWarn;

  const softHeadline = showSoftClose
    ? `T’as encore ${missingCount} case${missingCount > 1 ? 's' : ''} floue${missingCount > 1 ? 's' : ''}${
        invaliditeWarn ? ' — dont l’invalidité' : ''
      }.`
    : 'Bon résumé.';

  const softSubline = showSoftClose
    ? '15 min, on les démêle ensemble, livret ouvert. Clarifier, c’est pas acheter.'
    : 'Range le PDF avec ton livret — et revalide si ton emploi ou ton salaire change.';

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
      title: 'Résumé — ton assurance collective',
      filename: 'resume-assurance-collective.pdf',
      sections: [
        {
          heading: 'Invalidité',
          rows: [
            {
              label: 'Structure',
              value: multiPalier
                ? 'Plusieurs paliers (court / long terme)'
                : 'Un % principal (simplifié)',
            },
            ...(multiPalier
              ? [
                  { label: '% court terme', value: displayOrDash(pctCourtTerme, ' %') },
                  { label: '% long terme', value: displayOrDash(pctLongTerme, ' %') },
                  { label: 'Détails paliers', value: displayOrDash(notesPaliers) },
                ]
              : [{ label: '% du salaire remplacé', value: displayOrDash(pctInvalidite, ' %') }]),
            { label: 'Délai (jours avant argent)', value: displayOrDash(delaiJours, ' jours') },
            {
              label: 'Définition',
              value: definition ? definitionLabel(definition) : 'Non renseigné',
            },
          ],
        },
        {
          heading: 'Vie et santé',
          rows: [
            { label: 'Capital vie', value: displayOrDash(capitalVie, ' $') },
            { label: 'Santé (dentaire / médicaments)', value: displayOrDash(sante) },
          ],
        },
        {
          heading: 'Si tu quittes / trous',
          rows: [
            {
              label: 'Si tu quittes',
              value: depart ? departLabel(depart) : 'Non renseigné',
            },
            { label: 'Trous / questions', value: displayOrDash(trousNotes) },
            { label: 'Accès au livret', value: hasLivret ? 'Oui' : 'À obtenir' },
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
        `${doneCount}/${total} blocs clarifiés.`,
        'Outil simplifié : ton livret peut avoir plusieurs paliers, plafonds ou définitions plus fines — c’est le document qui prime.',
        'Revalide ce résumé si ton emploi, ton salaire ou ton assurance collective change.',
      ],
    });

  return (
    <div data-testid="tool-collective-checklist">
      <CampagneToolShell
        title="Checklist — ton assurance collective"
        intro="Idéal avec le PDF RH ouvert. Remplis case par case — ton mini résumé se construit en direct."
        disclaimer="Contenu éducatif seulement — pas un conseil personnalisé. Grille simplifiée : ton livret peut prévoir plusieurs paliers, plafonds ou définitions plus fines. Le livret prime toujours."
        footer={
          showSoftClose ? (
            <ToolSoftClose
              headline={softHeadline}
              subline={softSubline}
              rdvPath={rdvPath}
              rdvLabel="Démêler mes cases floues (15 min)"
              onRdvClick={() =>
                trackRendezVousClick('campagne_assurance-collective_rdv_cases_floues')
              }
              onPdf={handleDownload}
              pdfBusy={busy}
              pdfLabel="Garder mon résumé PDF"
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
                  label="Télécharger mon résumé PDF"
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
          <p className="text-sm font-semibold text-dark">Idéal avec le PDF RH ouvert</p>
          <p className="mt-1 text-sm leading-relaxed text-prestige-taupe">
            Pas juste la carte : ouvre le document avec les % et les délais.{' '}
            <a
              href="#faq-livret"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Où est mon livret ?
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

        {/* Progression — climax flous */}
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
                    {doneCount}/{total} · {progress} %
                  </p>
                </>
              ) : (
                <>
                  <p className="font-heading mt-1 text-3xl font-bold tracking-tight text-emerald-700 sm:text-4xl">
                    Complet
                  </p>
                  <p className="mt-1 text-sm text-prestige-taupe">
                    5/5 — range ton PDF avec le livret
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

        {/* Mini résumé */}
        <div className="mb-8">
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
              Ton mini résumé
            </p>
            <p className="mt-1 text-sm text-prestige-taupe">
              Se remplit au fur et à mesure — rien à attendre à la fin.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ResultCard
              label="Invalidité"
              value={invaliditeValue}
              detail={invaliditeDetail}
              tone={invaliditeDone ? 'ok' : 'warn'}
            />
            <ResultCard
              label="Vie et santé"
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
            title="Invalidité"
            subtitle="Si tu ne peux plus travailler — combien, et quand l’argent commence. Parfois le livret a plusieurs paliers."
            done={milestones[0].done}
          >
            <Field
              id="collective-structure"
              label="Dans ton livret, l’invalidité c’est…"
              hint="Beaucoup de régimes ont un % court terme puis un autre % (ou une autre définition) plus tard."
              className="sm:col-span-2"
            >
              <div className="flex flex-wrap gap-2" role="group" aria-label="Structure invalidité">
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
                  hint="Souvent les premiers mois / la 1re période du livret."
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
                  label="% long terme (après)"
                  hint="Peut baisser, ou changer de définition — note ce que dit le livret."
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
                  label="Détails des paliers (tel que dans le livret)"
                  hint="Ex. 70 % pendant 24 mois, puis 50 % ; ou « propre métier » puis « toute occupation »."
                  className="sm:col-span-2"
                >
                  <textarea
                    id="collective-notes-paliers"
                    rows={2}
                    className={`${inputClass} resize-y`}
                    value={notesPaliers}
                    onChange={(e) => setNotesPaliers(e.target.value)}
                    placeholder="Copie les paliers / périodes du livret…"
                  />
                </Field>
              </>
            ) : (
              <Field
                id="collective-pct"
                label="% du salaire remplacé"
                hint="Si ton livret montre plusieurs %, bascule sur « Plusieurs paliers »."
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
              label="Jours d’attente avant le premier chèque"
              hint="Souvent 90 ou 120 jours. Dans le livret : « délai d’attente » ou « carence »."
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
              label="Quand es-tu « invalide » selon ton contrat ?"
              hint="Regarde ton livret — section définition. Choisis l’option la plus proche (peut aussi changer par palier)."
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
            title="Vie et santé"
            subtitle="Combien pour tes proches, et ce que le dentaire / les médicaments couvrent vraiment."
            done={milestones[1].done}
          >
            <Field
              id="collective-capital"
              label="Montant d’assurance vie"
              hint="Versé à tes proches si tu décèdes. Ex. 100 000 $ ou 2× salaire — page assurance vie du livret."
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
              label="Dentaire / médicaments"
              hint="Note le % remboursé ou le plafond annuel le plus clair dans ton livret."
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
            subtitle="Ce que ton assurance collective garde… et ce qui tombe."
            done={milestones[2].done}
          >
            <Field
              id="collective-depart"
              label="Si tu quittes ton emploi"
              hint="Souvent collé à l’emploi — regarde la fin du livret de ton assurance collective."
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
              label="Trous / questions à clarifier"
              hint="Ce qui te semble faible, flou, ou manquant — pour en parler après."
              className="sm:col-span-2"
            >
              <textarea
                id="collective-trous"
                rows={2}
                className={`${inputClass} min-h-[4.5rem] resize-y`}
                value={trousNotes}
                onChange={(e) => setTrousNotes(e.target.value)}
                placeholder="Ex. Invalidité trop basse après 2 ans ; pas de maladie grave…"
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
                Même case qu’en tête — coche ici ou là-haut.
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
                hint="Portail RH, date de ta dernière vérif, personne à contacter…"
              >
                <textarea
                  id="collective-notes"
                  rows={2}
                  className={`${inputClass} min-h-[4.5rem] resize-y`}
                  value={notesLibres}
                  onChange={(e) => setNotesLibres(e.target.value)}
                  placeholder="Ex. Portail RH → Avantages sociaux"
                />
              </Field>
            </div>
          </div>

          <Block
            step={5}
            title="Employeur (optionnel)"
            subtitle="Pour savoir de quel contrat on parle — utile, pas bloquant."
            done={milestones[4].done}
          >
            <Field
              id="collective-employeur"
              label="Nom de l’employeur"
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

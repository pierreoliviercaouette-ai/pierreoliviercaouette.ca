import { useEffect, useMemo, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { useModelPortfolioReturns } from '../../../hooks/useModelPortfolioReturns';
import {
  getBanqueAvgForProfil,
  PROFIL_RISQUE_LABELS,
} from '../../../data/comparateurRendementsRates';
import { buildCampagneRdvPath } from '../../../data/campagneAdsLandings';
import { trackEvent, trackRendezVousClick } from '../../../lib/analytics';
import { formatCad } from '../../tools/format';
import {
  CampagneToolShell,
  ToolClimaxReveal,
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

const PROFIL_OPTIONS = [
  { value: 'prudent', hint: 'Moins de hauts et de bas' },
  { value: 'modere', hint: 'Un peu plus de variation' },
  { value: 'equilibre', hint: 'Le plus courant' },
  { value: 'croissance', hint: 'Plus de variations possibles' },
  { value: 'audacieux', hint: 'Plus de risques / de potentiel' },
].map((opt) => ({
  ...opt,
  label: PROFIL_RISQUE_LABELS[opt.value] || opt.value,
}));

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

function Block({ step, title, subtitle, children, done, cols = 'sm:grid-cols-2' }) {
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
      <div className={`grid gap-3 ${cols}`}>{children}</div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  detail,
  emphasize = false,
  valueClassName = 'text-2xl',
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3.5 ${
        emphasize
          ? 'border-primary/20 bg-gradient-to-br from-primary/[0.06] to-secondary/[0.08]'
          : 'border-primary/10 bg-gradient-to-br from-primary/[0.03] to-secondary/[0.04]'
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-prestige-taupe">{label}</p>
      <p
        className={`font-heading mt-1.5 font-bold leading-tight tabular-nums text-dark ${valueClassName}`}
      >
        {value}
      </p>
      {detail ? <p className="mt-1.5 text-sm leading-relaxed text-prestige-taupe">{detail}</p> : null}
    </div>
  );
}

/** Typo climax catalogue — intensité selon % d’écart vs banque. */
function ecartValueClass(ecartAbs, baseBanque) {
  const denom = Math.max(Number(baseBanque) || 0, 1);
  const pctAbs = (Math.abs(Number(ecartAbs) || 0) / denom) * 100;
  if (pctAbs <= 25) return 'text-3xl md:text-4xl';
  if (pctAbs <= 45) return 'text-4xl md:text-5xl';
  return 'text-5xl';
}

function formatPctFr(rate) {
  const pct = Math.round(Number(rate) * 1000) / 10;
  const text = Number.isInteger(pct) ? String(pct) : String(pct).replace('.', ',');
  return `${text} %`;
}

/** Capitalisation mensuelle simple + cotisations en fin de mois. */
function futureValueMonthly(principal, monthlyContribution, years, annualRate) {
  const p = Math.max(0, Number(principal) || 0);
  const pmt = Math.max(0, Number(monthlyContribution) || 0);
  const y = Math.max(0, Number(years) || 0);
  const months = Math.round(y * 12);
  if (months <= 0) return p;

  const r = (Number(annualRate) || 0) / 12;
  if (r === 0) return p + pmt * months;

  const growth = (1 + r) ** months;
  return p * growth + pmt * ((growth - 1) / r);
}

function parsePositive(raw, fallback) {
  const n = Number(raw);
  if (raw === '' || Number.isNaN(n) || n < 0) return fallback;
  return n;
}

function hasValue(raw) {
  return String(raw ?? '').trim() !== '';
}

function pctToInput(rate) {
  const pct = Math.round(Number(rate) * 1000) / 10;
  return String(pct).replace('.', ',');
}

function parsePctInput(raw, fallbackRate) {
  const normalized = String(raw ?? '')
    .trim()
    .replace(/\s/g, '')
    .replace('%', '')
    .replace(',', '.');
  if (normalized === '') return fallbackRate;
  const n = Number(normalized);
  if (Number.isNaN(n) || n < 0 || n > 100) return fallbackRate;
  return n / 100;
}

const COMPARATEUR_STEP_IDS = ['chiffres', 'profil', 'result'];

export function ComparateurRendementsTool({ immersive = false } = {}) {
  const location = useLocation();
  const [montantInitial, setMontantInitial] = useState('10000');
  const [cotisationMensuelle, setCotisationMensuelle] = useState('200');
  const [annees, setAnnees] = useState('10');
  const [profil, setProfil] = useState('equilibre');
  const [tauxBanquePct, setTauxBanquePct] = useState(
    pctToInput(getBanqueAvgForProfil('equilibre') / 100)
  );
  const [tauxBanqueManuel, setTauxBanqueManuel] = useState(false);
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_comparateur-rendements_pdf');
  const {
    stepIndex, currentStepId, isResult, questionCount, progress: wizardProgress,
    selectAndAdvance, advanceFrom, goBack,
  } = useCampagneWizard(COMPARATEUR_STEP_IDS, {
    onReachResult: () => trackEvent('select_content', { content_type: 'tool_result', item_id: 'campagne_comparateur-rendements_result' }),
  });
  const { asOfLabel, getIaPct, ready: portfoliosReady } = useModelPortfolioReturns();
  const resultTrackedRef = useRef(false);

  /** Moyenne 5 ans net des portefeuilles modèles (points de %) → décimal. */
  const modelePctPoints = getIaPct(profil);
  const rateModele = (Number(modelePctPoints) || 0) / 100;
  const banquePresetPct = getBanqueAvgForProfil(profil) / 100;

  const applyProfil = (value) => {
    setProfil(value);
    setTauxBanquePct(pctToInput(getBanqueAvgForProfil(value) / 100));
    setTauxBanqueManuel(false);
  };

  const applyMythePreset = () => {
    setMontantInitial('50000');
    setCotisationMensuelle('0');
    setAnnees('20');
    applyProfil('equilibre');
    trackEvent('select_content', {
      content_type: 'tool_preset',
      item_id: 'campagne_comparateur-rendements_preset_mythe',
    });
  };

  const rateBanque = parsePctInput(tauxBanquePct, banquePresetPct);
  const principal = parsePositive(montantInitial, 0);
  const monthly = parsePositive(cotisationMensuelle, 0);
  const years = parsePositive(annees, 0);
  const profilOption =
    PROFIL_OPTIONS.find((o) => o.value === profil) ||
    PROFIL_OPTIONS.find((o) => o.value === 'equilibre');

  const totalBanque = futureValueMonthly(principal, monthly, years, rateBanque);
  const totalModele = futureValueMonthly(principal, monthly, years, rateModele);
  const ecart = totalModele - totalBanque;
  const capitalVerse = principal + monthly * Math.round(years * 12);
  const ecartTypo = ecartValueClass(ecart, totalBanque);
  const ecartPctAbs =
    totalBanque > 0 ? Math.round((Math.abs(ecart) / totalBanque) * 1000) / 10 : 0;

  const milestones = useMemo(
    () => [
      {
        id: 'chiffres',
        done: hasValue(montantInitial) && hasValue(cotisationMensuelle) && hasValue(annees),
      },
      {
        id: 'profil',
        done: Boolean(profil) && hasValue(tauxBanquePct) && Number(modelePctPoints) > 0,
      },
      { id: 'projection', done: years > 0 && (principal > 0 || monthly > 0) },
    ],
    [
      montantInitial,
      cotisationMensuelle,
      annees,
      profil,
      tauxBanquePct,
      modelePctPoints,
      years,
      principal,
      monthly,
    ]
  );

  const doneCount = milestones.filter((m) => m.done).length;
  const total = milestones.length;
  const progress = Math.round((doneCount / total) * 100);
  const showSoftClose = doneCount >= 3;
  const showReleveInvite = showSoftClose && !tauxBanqueManuel;

  useEffect(() => {
    if (doneCount < 3 || resultTrackedRef.current) return;
    resultTrackedRef.current = true;
    trackEvent('select_content', {
      content_type: 'tool_result',
      item_id: 'campagne_comparateur-rendements_result',
      value: Math.round(ecart),
    });
  }, [doneCount, ecart]);

  const maxTotal = Math.max(totalBanque, totalModele, 1);
  const banqueWidth = Math.round((totalBanque / maxTotal) * 100);
  const modeleWidth = Math.round((totalModele / maxTotal) * 100);

  const yearsLabel =
    years > 0 ? `${years.toLocaleString('fr-CA')} an${years > 1 ? 's' : ''}` : '…';

  const statusDetail =
    doneCount >= 2
      ? 'Regarde l’écart — mêmes chiffres, même style des deux côtés.'
      : 'Entre ton montant, ce que tu ajoutes chaque mois, et l’horizon.';

  const softCloseHeadline = `T’as ~${formatCad(ecart)} d’écart illustratif après ${yearsLabel}, à profil égal. Ça chicotte ? On colle ça à ton relevé en 15 minutes — zéro pression.`;

  const rdvPath = buildCampagneRdvPath('comparateur-rendements', location.search);

  const handleDownload = () =>
    downloadPdf({
      title: 'Résumé — banque vs modèles',
      filename: 'resume-comparateur-rendements.pdf',
      sections: [
        {
          heading: 'Tes entrées',
          rows: [
            { label: 'Montant de départ', value: formatCad(principal) },
            { label: 'Ajoute chaque mois', value: formatCad(monthly) },
            {
              label: 'Nombre d’années',
              value: `${years.toLocaleString('fr-CA')} an${years > 1 ? 's' : ''}`,
            },
            {
              label: 'Profil à risque égal',
              value: `${profilOption.label} — ${profilOption.hint}`,
            },
            {
              label: 'Taux annuel banque',
              value: `${formatPctFr(rateBanque)}${tauxBanqueManuel ? ' (saisi)' : ' (préréglage)'}`,
            },
            {
              label: 'Taux annuel modèles (5 ans net)',
              value: `${formatPctFr(rateModele)} — portefeuilles modèles${asOfLabel ? ` (au ${asOfLabel})` : ''}`,
            },
            { label: 'Capital versé (approx.)', value: formatCad(capitalVerse) },
          ],
        },
        {
          heading: 'Projection (illustration)',
          rows: [
            {
              label: `Côté banque (~${formatPctFr(rateBanque)} / an)`,
              value: formatCad(totalBanque),
            },
            {
              label: `Côté modèles (~${formatPctFr(rateModele)} / an)`,
              value: formatCad(totalModele),
            },
            { label: 'Écart illustratif', value: formatCad(ecart) },
          ],
        },
      ],
      notes: [
        'Illustration seulement — taux non garantis. Même formule des deux côtés.',
        'Côté modèles = moyenne 5 ans nette des portefeuilles modèles (série Classique 75/75), selon le profil choisi.',
        asOfLabel ? `Date de référence modèles : ${asOfLabel}.` : null,
        tauxBanqueManuel
          ? 'Taux banque saisi par le prospect — à valider avec ses relevés.'
          : 'Taux banque = préréglage illustratif pour le profil (modifiable).',
        'Produits différents (frais, structure, garanties). Passés ≠ futurs. Pas un conseil personnalisé.',
      ].filter(Boolean),
    });

  const mytheActive =
    montantInitial === '50000' &&
    cotisationMensuelle === '0' &&
    annees === '20' &&
    profil === 'equilibre' &&
    !tauxBanqueManuel;


  /* immersive-wizard */
  if (immersive) {
    return (
      <div data-testid="tool-comparateur-rendements">
        <CampagneToolShell immersive titleAs="h1" eyebrow="Rendements" title="Banque vs modèles — même départ" intro="Une question à la fois. À la fin, on lit l’écart en 15 minutes." disclaimer="Illustration éducative seulement." footer={null}>
          <WizardProgress stepIndex={stepIndex} questionCount={questionCount} isResult={isResult} resultLabel="L’écart" progress={wizardProgress} />
          {!isResult && stepIndex > 0 ? <WizardBackButton onClick={goBack} /> : null}
          {currentStepId === 'chiffres' ? (
            <WizardStep id="chiffres">
              <WizardStepHeading title="Tes chiffres de départ" hint="Même départ des deux côtés." />
              <Field id="cr-wiz-init" label="Montant initial">
                <input id="cr-wiz-init" type="number" value={montantInitial} onChange={(e) => setMontantInitial(e.target.value)} className={inputClass} />
              </Field>
              <Field id="cr-wiz-mens" label="Cotisation mensuelle">
                <input id="cr-wiz-mens" type="number" value={cotisationMensuelle} onChange={(e) => setCotisationMensuelle(e.target.value)} className={inputClass} />
              </Field>
              <Field id="cr-wiz-ans" label="Horizon (années)">
                <input id="cr-wiz-ans" type="number" value={annees} onChange={(e) => setAnnees(e.target.value)} className={inputClass} />
              </Field>
              <WizardContinueButton onClick={() => advanceFrom('chiffres')} />
            </WizardStep>
          ) : null}
          {currentStepId === 'profil' ? (
            <WizardStep id="profil">
              <WizardStepHeading title="Profil à risque égal" hint="Même profil des deux côtés." />
              <WizardChoiceList
                name="profil"
                value={profil}
                options={PROFIL_OPTIONS.map((o) => ({ value: o.value || o.id, label: o.label }))}
                onSelect={(v) => selectAndAdvance('profil', () => setProfil(v))}
              />
            </WizardStep>
          ) : null}
          {isResult ? (
            <WizardStep id="result">
              <p className="font-heading text-3xl font-bold text-dark">Écart ~{formatCad(ecart)}</p>
              <div className="mt-5">
                <ToolSoftClose
                  headline={softCloseHeadline}
                  subline="On colle ça à ton relevé en 15 minutes — zéro pression."
                  rdvPath={rdvPath}
                  rdvLabel="Lire l’écart en 15 min"
                  onRdvClick={() => trackRendezVousClick('campagne_comparateur-rendements_rdv_outil')}
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
    <div data-testid="tool-comparateur-rendements">
      <CampagneToolShell
        title="Banque vs modèles — même départ"
        intro="Même profil des deux côtés. Côté modèles : moyenne 5 ans nette de mes portefeuilles (mise à jour auto). Côté banque : préréglage ou le taux de ton relevé."
        disclaimer="Illustration seulement. Côté modèles : moyenne 5 ans nette (série Classique 75/75). Produits différents. Passés ≠ futurs. Pas un conseil personnalisé."
        footer={
          showSoftClose ? null : (
            <p className="text-sm leading-relaxed text-prestige-taupe">{statusDetail}</p>
          )
        }
      >
        <div className="mb-8">
          <div className="mb-2 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                Progression
              </p>
              <p
                className={`font-heading mt-1 font-bold text-dark ${
                  doneCount >= 3 ? 'text-xl' : 'text-2xl'
                }`}
              >
                {doneCount}
                <span className="text-base font-medium text-prestige-taupe"> / {total}</span>
              </p>
            </div>
            <p className="text-sm text-prestige-taupe">{progress} %</p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-prestige-beige/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {milestones[2].done ? (
            <p className="mt-2 text-xs text-prestige-taupe">
              Écart illustratif après {yearsLabel} :{' '}
              <span className="font-medium tabular-nums text-dark">{formatCad(ecart)}</span>
              {' · '}
              capital versé ≈ {formatCad(capitalVerse)}.
            </p>
          ) : null}
        </div>

        <div className="relative space-y-8 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-px before:bg-prestige-beige">
          <Block
            step={1}
            title="Tes chiffres"
            subtitle="Même départ des deux côtés — c’est le point."
            done={milestones[0].done}
            cols="sm:grid-cols-3"
          >
            <Field
              id="cmp-montant-initial"
              label="Montant de départ"
              hint="Ce que tu as déjà de placé (ordre de grandeur)."
            >
              <div className="relative">
                <input
                  id="cmp-montant-initial"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="100"
                  className={`${inputClass} pr-8`}
                  value={montantInitial}
                  onChange={(e) => setMontantInitial(e.target.value)}
                  placeholder="10000"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-prestige-taupe">
                  $
                </span>
              </div>
            </Field>
            <Field
              id="cmp-cotisation"
              label="Tu ajoutes chaque mois"
              hint="Même cotisation des deux côtés."
            >
              <div className="relative">
                <input
                  id="cmp-cotisation"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="25"
                  className={`${inputClass} pr-8`}
                  value={cotisationMensuelle}
                  onChange={(e) => setCotisationMensuelle(e.target.value)}
                  placeholder="200"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-prestige-taupe">
                  $
                </span>
              </div>
            </Field>
            <Field
              id="cmp-annees"
              label="Sur combien d’années"
              hint="L’horizon où l’écart peut se composer."
            >
              <div className="relative">
                <input
                  id="cmp-annees"
                  type="number"
                  inputMode="decimal"
                  min={1}
                  max={50}
                  step="1"
                  className={`${inputClass} pr-10`}
                  value={annees}
                  onChange={(e) => setAnnees(e.target.value)}
                  placeholder="10"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-prestige-taupe">
                  ans
                </span>
              </div>
            </Field>
            <div className="sm:col-span-3">
              <button
                type="button"
                onClick={applyMythePreset}
                aria-pressed={mytheActive}
                data-testid="cmp-preset-mythe"
                className={`inline-flex max-w-full items-center rounded-full px-3.5 py-1.5 text-left text-xs font-medium transition ${
                  mytheActive
                    ? 'bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(6,77,217,0.35)]'
                    : 'bg-white text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)] hover:shadow-[inset_0_0_0_1px_rgba(1,35,63,0.22)]'
                }`}
              >
                Essayer le scénario 50&nbsp;k$ · 20&nbsp;ans (mythe)
              </button>
              <p className="mt-1.5 text-xs text-prestige-taupe">
                Même illustration que le post — one tap.
              </p>
            </div>
          </Block>

          <Block
            step={2}
            title="Profil à risque égal"
            subtitle="Même profil des deux côtés. Côté modèles = moyenne 5 ans nette de mes portefeuilles."
            done={milestones[1].done}
            cols="sm:grid-cols-1"
          >
            <div
              className="flex flex-col gap-2 sm:flex-row sm:flex-wrap"
              role="radiogroup"
              aria-label="Profil de risque"
            >
              {PROFIL_OPTIONS.map((opt) => {
                const selected = profil === opt.value;
                const banqueOpt = getBanqueAvgForProfil(opt.value) / 100;
                const modeleOpt = (Number(getIaPct(opt.value)) || 0) / 100;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => applyProfil(opt.value)}
                    className={`min-w-0 flex-1 rounded-xl px-4 py-2.5 text-left transition ${
                      selected
                        ? 'bg-primary text-white'
                        : 'bg-white text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] hover:shadow-[inset_0_0_0_1px_rgba(1,35,63,0.18)]'
                    }`}
                  >
                    <span className="block text-sm font-medium">{opt.label}</span>
                    <span
                      className={`mt-0.5 block text-xs ${
                        selected ? 'text-white/80' : 'text-prestige-taupe'
                      }`}
                    >
                      {opt.hint}
                    </span>
                    <span
                      className={`mt-1.5 block text-[11px] tabular-nums ${
                        selected ? 'text-white/70' : 'text-prestige-taupe/90'
                      }`}
                    >
                      banque ~{formatPctFr(banqueOpt)} · modèles {formatPctFr(modeleOpt)}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                id="cmp-taux-banque"
                label="Taux annuel — côté banque"
                hint="Préréglage selon le profil, ou saisis le taux de ton relevé."
              >
                <div className="relative">
                  <input
                    id="cmp-taux-banque"
                    type="text"
                    inputMode="decimal"
                    className={`${inputClass} pr-8 ${
                      showReleveInvite
                        ? 'campagne-invite-pulse shadow-[inset_0_0_0_1.5px_rgba(6,77,217,0.35)]'
                        : ''
                    }`}
                    value={tauxBanquePct}
                    onChange={(e) => {
                      setTauxBanquePct(e.target.value);
                      setTauxBanqueManuel(true);
                    }}
                    placeholder="6,3"
                    aria-label="Taux annuel banque en pourcent"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-prestige-taupe">
                    %
                  </span>
                </div>
                {showReleveInvite ? (
                  <p
                    className="campagne-climax-enter mt-2 rounded-lg bg-primary/[0.06] px-2.5 py-1.5 text-xs font-medium leading-relaxed text-primary"
                    data-testid="cmp-invite-releve"
                  >
                    Pour coller ça à toi : saisis le taux de ton relevé.
                  </p>
                ) : null}
              </Field>
              <div className="min-w-0">
                <p className={labelClass}>Taux annuel — côté modèles</p>
                <div className="rounded-xl bg-gradient-to-br from-primary/[0.05] to-secondary/[0.07] px-3.5 py-2.5">
                  <p className="font-heading text-xl font-bold tabular-nums text-dark">
                    {formatPctFr(rateModele)}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-prestige-taupe">
                    Moyenne 5 ans nette · portefeuille {profilOption.label.toLowerCase()}
                    {asOfLabel ? ` · au ${asOfLabel}` : ''}
                    {!portfoliosReady ? ' · chargement…' : ''}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-prestige-taupe">
              {tauxBanqueManuel
                ? 'Taux banque saisi — un clic sur un profil remet le préréglage banque.'
                : 'Le côté modèles suit automatiquement mes portefeuilles ; seul le taux banque est modifiable.'}
            </p>
          </Block>

          <div className="relative pl-11">
            <div
              className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                milestones[2].done
                  ? 'bg-primary text-white'
                  : 'bg-white text-prestige-taupe shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)]'
              }`}
              aria-hidden
            >
              {milestones[2].done ? (
                <Check className="h-4 w-4" strokeWidth={2.5} />
              ) : (
                3
              )}
            </div>
            <div className="mb-4">
              <h3 className="font-heading text-base font-semibold text-dark">
                Résultat après {yearsLabel}
              </h3>
              <p className="mt-0.5 text-sm text-prestige-taupe">
                Profil {profilOption.label.toLowerCase()} · {formatPctFr(rateBanque)} vs{' '}
                {formatPctFr(rateModele)} (5 ans net modèles) · même formule · pas une garantie.
              </p>
            </div>

            <div className="space-y-4">
              <ToolClimaxReveal key={`ecart-${Math.round(ecart)}-${years}-${profil}`}>
                <div className="campagne-climax-pulse">
                  <ResultCard
                    label="Écart illustratif"
                    value={formatCad(ecart)}
                    detail={`≈ ${String(ecartPctAbs).replace('.', ',')} % vs côté banque · après ${yearsLabel} · ~${formatCad(capitalVerse)} versés. Mêmes chiffres, même profil.`}
                    emphasize
                    valueClassName={ecartTypo}
                  />
                </div>
              </ToolClimaxReveal>

              {showSoftClose ? (
                <ToolSoftClose
                  headline={softCloseHeadline}
                  subline="Saisis le taux de ton relevé juste au-dessus si tu veux coller ça à toi."
                  rdvPath={rdvPath}
                  rdvLabel="Réserver 15 minutes"
                  onRdvClick={() =>
                    trackRendezVousClick('campagne_comparateur-rendements_rdv_outil')
                  }
                  onPdf={handleDownload}
                  pdfBusy={busy}
                  pdfLabel="Garder mon résumé PDF"
                />
              ) : null}

              <div
                key={`bars-${profil}-${years}-${Math.round(ecart)}`}
                className="space-y-2.5 rounded-2xl bg-prestige-beige/40 px-3.5 py-3"
                aria-hidden
              >
                <div className="flex items-center gap-3">
                  <span className="w-[4.5rem] shrink-0 text-xs text-prestige-taupe">Banque</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/80">
                    <div
                      className="h-full rounded-full bg-prestige-taupe/45 transition-all duration-500 ease-out"
                      style={{ width: `${banqueWidth}%` }}
                    />
                  </div>
                  <span className="w-[5.5rem] shrink-0 text-right text-xs tabular-nums text-prestige-taupe">
                    {formatCad(totalBanque)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-[4.5rem] shrink-0 text-xs font-medium text-secondary">
                    Modèles
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/80">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
                      style={{ width: `${modeleWidth}%` }}
                    />
                  </div>
                  <span className="w-[5.5rem] shrink-0 text-right text-xs font-medium tabular-nums text-dark">
                    {formatCad(totalModele)}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <ResultCard
                  label="Côté banque"
                  value={formatCad(totalBanque)}
                  detail={`~${formatPctFr(rateBanque)} / an`}
                />
                <ResultCard
                  label="Côté modèles"
                  value={formatCad(totalModele)}
                  detail={`~${formatPctFr(rateModele)} / an`}
                />
              </div>

              {milestones[2].done ? (
                <p className="text-sm leading-relaxed text-prestige-taupe">
                  2–3 points de plus par année, ça a l’air d’un détail — jusqu’à ce que ça se
                  compose. Ici, l’illustration montre ≈ {formatCad(ecart)} après {yearsLabel}.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </CampagneToolShell>
    </div>
  );
}

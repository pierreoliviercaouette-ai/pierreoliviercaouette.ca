import { useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, AlertTriangle } from 'lucide-react';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { buildCampagneRdvPath } from '../../../data/campagneAdsLandings';
import { trackEvent, trackRendezVousClick } from '../../../lib/analytics';
import { formatCad } from '../../tools/format';
import { CampagneToolShell, ToolDownloadPdf } from '../CampagneToolShell';

/** Salaire annuel approx. → même logique interne faible / moyenne / élevée. */
const SALAIRE_OPTIONS = [
  { value: 'faible', label: 'Moins de 55 000 $', hint: '/ an' },
  { value: 'moyenne', label: '55 000 $ – 100 000 $', hint: '/ an' },
  { value: 'elevee', label: 'Plus de 100 000 $', hint: '/ an' },
];

const HORIZON_OPTIONS = [
  { value: 'court', label: 'Bientôt', hint: '< 5 ans' },
  { value: 'moyen', label: 'Moyen terme', hint: '5–15 ans' },
  { value: 'long', label: 'Longtemps', hint: '15 ans +' },
];

const LIQUIDITE_OPTIONS = [
  { value: 'oui', label: 'Oui, accessible' },
  { value: 'non', label: 'Non, je peux attendre' },
];

const MATCHING_OPTIONS = [
  { value: 'oui', label: 'Oui' },
  { value: 'non', label: 'Non' },
  { value: 'je_sais_pas', label: 'Je sais pas' },
];

const MATCH_MAX_OPTIONS = [
  { value: 'oui', label: 'Oui, je vise le match' },
  { value: 'non', label: 'Pas encore' },
  { value: 'je_sais_pas', label: 'Je sais pas' },
];

const SALAIRE_PDF = [
  { value: 'faible', label: 'Moins de 55 000 $ / an' },
  { value: 'moyenne', label: '55 000 $ – 100 000 $ / an' },
  { value: 'elevee', label: 'Plus de 100 000 $ / an' },
];

const HORIZON_PDF = [
  { value: 'court', label: 'Moins de 5 ans' },
  { value: 'moyen', label: '5 à 15 ans' },
  { value: 'long', label: '15 ans et plus' },
];

const LIQUIDITE_PDF = [
  { value: 'oui', label: 'Oui, accessible' },
  { value: 'non', label: 'Non, je peux attendre' },
];

const MATCH_MAX_PDF = [
  { value: 'oui', label: 'Oui, je vise le match' },
  { value: 'non', label: 'Pas encore' },
  { value: 'je_sais_pas', label: 'Je sais pas' },
];

const inputClass =
  'w-full rounded-2xl border-0 bg-white px-4 py-3.5 text-base text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] transition focus:outline-none focus:shadow-[inset_0_0_0_2px_rgba(6,77,217,0.45)]';

function optionLabel(options, value) {
  return options.find((o) => o.value === value)?.label || value || '—';
}

function parseMonthly(raw) {
  const n = Number(raw);
  if (raw === '' || Number.isNaN(n) || n < 0) return 0;
  return n;
}

function isCeliLocked(answers) {
  return answers.horizon === 'court' || answers.liquidite === 'oui';
}

/** Étapes dynamiques selon les réponses déjà données. */
function buildStepIds(answers) {
  const steps = ['horizon', 'liquidite', 'matching'];
  if (answers.matching === 'oui') steps.push('matchMax');
  steps.push('cotisation');
  if (!isCeliLocked(answers)) steps.push('tranche');
  steps.push('result');
  return steps;
}

/**
 * Règles éducatives simples — pas un conseil personnalisé.
 */
function buildSuggestion({ tranche, horizon, liquidite, monthly, matching, matchMax }) {
  const cotisationHint =
    monthly > 0
      ? `Avec ~${Math.round(monthly)} $ / mois, l’ordre guide où part le prochain dollar.`
      : 'Même un petit montant régulier aide : l’ordre guide où part le prochain dollar.';

  const matchingRaisons = [];
  if (matching === 'oui') {
    matchingRaisons.push(
      'Ton employeur matche souvent le REER : ce match-là se regarde souvent avant le débat perso CELI vs REER — on le chiffre en 15 minutes.'
    );
    if (matchMax === 'non') {
      matchingRaisons.push(
        'Tu n’es pas encore au max du match : souvent, on regarde d’abord cette portion « gratuite » avant le reste.'
      );
    }
    if (liquidite === 'oui') {
      matchingRaisons.push(
        'Même avec un match, ton besoin d’accès peut justifier du CELI — on démêle ça en 15 min.'
      );
    }
  }

  if (horizon === 'court' || liquidite === 'oui') {
    return {
      key: 'celi',
      value: 'CELI d’abord',
      short: 'CELI',
      tone: 'ok',
      split: { celi: 100, reer: 0 },
      leanLabel: null,
      matchingNote: matching === 'oui',
      raisons: [
        ...matchingRaisons,
        liquidite === 'oui'
          ? 'Tu veux pouvoir ressortir l’argent sans te faire mal : le CELI est souvent plus souple pour ça.'
          : 'Horizon court : tu risques d’avoir besoin de cet argent avant la retraite — le CELI colle souvent mieux.',
        'Le REER, c’est puissant, mais un retrait trop tôt peut coûter cher en impôts.',
        cotisationHint,
      ],
    };
  }

  const effectiveTranche = tranche || 'moyenne';

  if (effectiveTranche === 'elevee' && horizon === 'long') {
    return {
      key: 'reer',
      value: 'REER d’abord',
      short: 'REER',
      tone: 'ok',
      split: { celi: 0, reer: 100 },
      leanLabel: null,
      matchingNote: matching === 'oui',
      raisons: [
        ...matchingRaisons,
        'Salaire plus élevé + horizon long : le report d’impôt du REER a souvent plus de sens.',
        'Tu laisses le temps au compte de travailler avant d’avoir besoin de l’argent.',
        cotisationHint,
      ],
    };
  }

  let split = { celi: 50, reer: 50 };
  let leanLabel = '≈ 50 / 50';
  let leanDetail =
    'Un peu de CELI pour la flexibilité, un peu de REER pour le levier fiscal.';

  if (effectiveTranche === 'faible') {
    split = { celi: 70, reer: 30 };
    leanLabel = '≈ 70 % CELI / 30 % REER';
    leanDetail =
      'Salaire plus bas : forcer le REER « parce que tout le monde le fait » n’est pas toujours le meilleur réflexe.';
  } else if (effectiveTranche === 'elevee') {
    split = { celi: 40, reer: 60 };
    leanLabel = '≈ 60 % REER / 40 % CELI';
    leanDetail =
      'Salaire plus élevé, mais horizon pas encore très long : le REER pèse un peu plus, le CELI garde de la marge.';
  } else if (horizon === 'long') {
    split = { celi: 40, reer: 60 };
    leanLabel = '≈ 60 % REER / 40 % CELI';
    leanDetail =
      'Horizon long + salaire moyen : un peu plus de REER, sans tout y mettre.';
  }

  return {
    key: 'mixte',
    value: `Mixte — ${leanLabel}`,
    short: 'Mixte',
    tone: 'nuance',
    split,
    leanLabel,
    matchingNote: matching === 'oui',
    raisons: [
      ...matchingRaisons,
      'Cette piste mixte change souvent avec ton matching, tes plafonds et ce que t’as déjà — d’où les 15 minutes.',
      leanDetail,
      cotisationHint,
    ],
  };
}

function openLoopGaps(suggestion, matching) {
  const gaps = [
    'Tes vrais plafonds REER / CELI (et ce que t’as déjà dedans)',
    'Les règles exactes de ton matching employeur, s’il y en a un',
  ];
  if (suggestion.key === 'mixte') {
    gaps.push('Le bon partage du prochain dollar selon tes projets réels');
  } else if (suggestion.key === 'celi') {
    gaps.push('Si le CELI reste #1 une fois le matching et tes comptes regardés');
  } else {
    gaps.push('Si le REER reste #1 avec ta vraie situation fiscale');
  }
  if (matching === 'oui' || matching === 'je_sais_pas') {
    gaps[1] =
      matching === 'oui'
        ? 'Combien ton employeur match vraiment — et jusqu’où cotiser pour le prendre'
        : 'Si ton employeur matche (souvent ça change tout l’ordre)';
  }
  return gaps;
}

function conversionCopy({ suggestion, monthly, celiAmt, reerAmt }) {
  if (suggestion.key === 'mixte') {
    return {
      headline: 'Attention — ce mixte n’est pas encore ton plan',
      subline:
        monthly > 0
          ? `Les ~${formatCad(celiAmt)} CELI / ${formatCad(reerAmt)} REER sont une piste. Sans matching ni plafonds, tu risques de mal placer le prochain dollar.`
          : 'Cette piste mixte change souvent dès qu’on regarde matching et plafonds. Ne pars pas avec une demi-réponse.',
    };
  }

  if (suggestion.key === 'celi') {
    return {
      headline: 'Piste CELI — à valider avant de cotiser',
      subline:
        'L’outil ne voit pas ton matching ni tes droits. 15 minutes pour confirmer que le prochain dollar va au bon endroit.',
    };
  }

  return {
    headline: 'Piste REER — à valider avant de cotiser',
    subline:
      'L’outil ne voit pas ton matching ni tes droits. 15 minutes pour confirmer que le prochain dollar va au bon endroit.',
  };
}

function ChoiceCards({ options, value, onChange, columns = 1 }) {
  const colClass =
    columns === 3
      ? 'grid-cols-1 sm:grid-cols-3'
      : columns === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : 'grid-cols-1';

  return (
    <div className={`grid gap-3 ${colClass}`} role="radiogroup">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={`flex min-h-[3.25rem] w-full items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-left transition active:scale-[0.99] ${
              selected
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.1)] hover:shadow-[inset_0_0_0_1px_rgba(6,77,217,0.4)]'
            }`}
          >
            <span className="text-base font-semibold leading-snug">{opt.label}</span>
            {opt.hint ? (
              <span
                className={`shrink-0 text-sm ${selected ? 'text-white/75' : 'text-prestige-taupe'}`}
              >
                {opt.hint}
              </span>
            ) : selected ? (
              <Check className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function ResultCard({ label, value, detail, tone = 'default', className = '' }) {
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
    <div className={`rounded-2xl border px-4 py-3.5 ${toneClass} ${className}`}>
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="text-xs font-medium uppercase tracking-wide text-prestige-taupe">{label}</p>
      </div>
      <p className="font-heading mt-1.5 text-xl font-bold tabular-nums text-dark sm:text-2xl">
        {value}
      </p>
      {detail ? <p className="mt-1.5 text-sm leading-relaxed text-prestige-taupe">{detail}</p> : null}
    </div>
  );
}

function SplitBar({ celiPct, reerPct }) {
  return (
    <div className="mt-3">
      <div className="flex h-2.5 overflow-hidden rounded-full bg-prestige-beige/70">
        {celiPct > 0 ? (
          <div
            className="h-full bg-secondary transition-all duration-500 ease-out"
            style={{ width: `${celiPct}%` }}
          />
        ) : null}
        {reerPct > 0 ? (
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${reerPct}%` }}
          />
        ) : null}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-prestige-taupe">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-secondary" aria-hidden />
          CELI {celiPct} %
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
          REER {reerPct} %
        </span>
      </div>
    </div>
  );
}

const STEP_COPY = {
  horizon: {
    title: 'Tu vas avoir besoin de cet argent…',
    hint: 'Avant la retraite, ou pour un projet.',
  },
  liquidite: {
    title: 'Tu veux pouvoir le ressortir facilement ?',
    hint: 'Liquidité = accès sans te faire mal en impôts.',
  },
  matching: {
    title: 'Ton employeur matche ou cotise déjà à un REER ?',
    hint: 'Si oui, ça peut changer l’ordre du prochain dollar.',
  },
  matchMax: {
    title: 'Tu cotises déjà assez pour prendre le match ?',
    hint: 'Souvent, on regarde cette portion « gratuite » en premier.',
  },
  cotisation: {
    title: 'Combien tu pourrais mettre de côté par mois ?',
    hint: 'Optionnel — sert à illustrer le partage en dollars.',
  },
  tranche: {
    title: 'Ton salaire annuel approx. est plutôt…',
    hint: 'Ordre de grandeur — pas besoin du chiffre exact.',
  },
};

export function RetraiteReerCeliTool({ immersive = false } = {}) {
  const location = useLocation();
  const [answers, setAnswers] = useState({
    horizon: null,
    liquidite: null,
    matching: null,
    matchMax: null,
    cotisation: '500',
    tranche: null,
  });
  const [stepIndex, setStepIndex] = useState(0);
  const [pdfReady, setPdfReady] = useState(false);
  const resultTrackedRef = useRef(false);
  const advanceTimerRef = useRef(null);
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_retraite-reer-celi_pdf');

  const stepIds = useMemo(() => buildStepIds(answers), [answers]);
  const currentStepId = stepIds[Math.min(stepIndex, stepIds.length - 1)];
  const isResult = currentStepId === 'result';
  const questionSteps = stepIds.filter((id) => id !== 'result');
  const progress = isResult
    ? 100
    : Math.round(((stepIndex + 1) / questionSteps.length) * 100);

  const monthly = parseMonthly(answers.cotisation);
  const suggestion = buildSuggestion({
    tranche: answers.tranche,
    horizon: answers.horizon,
    liquidite: answers.liquidite,
    monthly,
    matching: answers.matching,
    matchMax: answers.matchMax,
  });

  const celiAmt = monthly > 0 ? Math.round((monthly * suggestion.split.celi) / 100) : 0;
  const reerAmt = monthly > 0 ? Math.max(0, Math.round(monthly) - celiAmt) : 0;

  const mixteWithDollars = suggestion.key === 'mixte' && monthly > 0;
  const snapshotDominant = mixteWithDollars
    ? `${formatCad(celiAmt)} / ${formatCad(reerAmt)}`
    : suggestion.key === 'mixte'
      ? suggestion.leanLabel || suggestion.short
      : suggestion.short;
  const snapshotSub = mixteWithDollars
    ? 'Mixte illustratif — CELI / REER'
    : suggestion.key === 'mixte'
      ? 'Mixte — à coller à ton dossier'
      : suggestion.value;

  const splitDetail =
    monthly > 0
      ? `Sur ${formatCad(monthly)} / mois → CELI ${formatCad(celiAmt)}, REER ${formatCad(reerAmt)}.`
      : 'Indique un montant mensuel pour voir le partage en dollars.';

  const { headline: convHeadline, subline: convSubline } = conversionCopy({
    suggestion,
    monthly,
    celiAmt,
    reerAmt,
  });
  const gaps = openLoopGaps(suggestion, answers.matching);

  const rdvPath = buildCampagneRdvPath('retraite-reer-celi', location.search);

  const goToResultTracking = () => {
    if (resultTrackedRef.current) return;
    resultTrackedRef.current = true;
    trackEvent('select_content', {
      content_type: 'tool_result',
      item_id: 'campagne_retraite-reer-celi_result',
    });
  };

  const advanceFrom = (fromStepId, nextAnswers) => {
    const nextSteps = buildStepIds(nextAnswers);
    const fromIdx = nextSteps.indexOf(fromStepId);
    const nextIdx = Math.min(fromIdx + 1, nextSteps.length - 1);
    if (nextSteps[nextIdx] === 'result') goToResultTracking();
    setStepIndex(nextIdx);
  };

  const selectAndAdvance = (field, value, fromStepId) => {
    setPdfReady(false);
    const nextAnswers = { ...answers, [field]: value };
    if (field === 'matching' && value !== 'oui') {
      nextAnswers.matchMax = null;
    }
    if (field === 'matching' && value === 'oui') {
      trackEvent('select_content', {
        content_type: 'tool_climax',
        item_id: 'campagne_retraite-reer-celi_matching_oui',
      });
    }
    setAnswers(nextAnswers);

    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = setTimeout(() => {
      advanceFrom(fromStepId, nextAnswers);
    }, 220);
  };

  const goBack = () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const skipCotisation = () => {
    const nextAnswers = { ...answers, cotisation: '' };
    setAnswers(nextAnswers);
    setPdfReady(false);
    advanceFrom('cotisation', nextAnswers);
  };

  const continueCotisation = () => {
    setPdfReady(false);
    advanceFrom('cotisation', answers);
  };

  const restart = () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    setAnswers({
      horizon: null,
      liquidite: null,
      matching: null,
      matchMax: null,
      cotisation: '500',
      tranche: null,
    });
    setStepIndex(0);
    setPdfReady(false);
    resultTrackedRef.current = false;
  };

  const handleDownload = async () => {
    await downloadPdf({
      title: 'Résumé — REER ou CELI en premier',
      filename: 'resume-retraite-reer-celi.pdf',
      sections: [
        {
          heading: 'Tes réponses',
          rows: [
            { label: 'Horizon', value: optionLabel(HORIZON_PDF, answers.horizon) },
            {
              label: 'Besoin de liquidité',
              value: optionLabel(LIQUIDITE_PDF, answers.liquidite),
            },
            {
              label: 'Matching employeur',
              value: optionLabel(MATCHING_OPTIONS, answers.matching),
            },
            ...(answers.matching === 'oui'
              ? [
                  {
                    label: 'Match déjà pris',
                    value: optionLabel(MATCH_MAX_PDF, answers.matchMax),
                  },
                ]
              : []),
            {
              label: 'Cotisation mensuelle possible',
              value:
                answers.cotisation.trim() === ''
                  ? 'Non renseigné'
                  : formatCad(monthly),
            },
            ...(answers.tranche
              ? [
                  {
                    label: 'Salaire annuel approx.',
                    value: optionLabel(SALAIRE_PDF, answers.tranche),
                  },
                ]
              : []),
          ],
        },
        {
          heading: 'Suggestion (illustration)',
          rows: [
            { label: 'Ordre suggéré', value: suggestion.value },
            {
              label: 'Répartition illustrative',
              value: `CELI ${suggestion.split.celi} % / REER ${suggestion.split.reer} %`,
            },
            ...(monthly > 0
              ? [
                  {
                    label: 'Partage mensuel (illustration)',
                    value: `CELI ${formatCad(celiAmt)} / REER ${formatCad(reerAmt)}`,
                  },
                ]
              : []),
            ...suggestion.raisons.map((raison, i) => ({
              label: `Raison ${i + 1}`,
              value: raison,
            })),
          ],
        },
      ],
      notes: [
        'Illustration éducative seulement — pas un conseil personnalisé.',
        'Valide l’ordre avec ta vraie situation (projets, revenu, comptes déjà ouverts, règles du régime employeur).',
      ],
    });
    setPdfReady(true);
  };

  const stepCopy = STEP_COPY[currentStepId];

  return (
    <div data-testid="tool-retraite-reer-celi">
      <CampagneToolShell
        immersive={immersive}
        titleAs={immersive ? 'h1' : 'h2'}
        eyebrow={immersive ? 'REER · CELI' : 'Outil interactif'}
        title={
          immersive
            ? 'REER ou CELI : où va le prochain dollar ?'
            : 'Où va ton prochain dollar ?'
        }
        intro={
          immersive
            ? 'Une question à la fois. À la fin, on valide ton ordre en 15 minutes.'
            : 'Une question à la fois — ton ordre REER / CELI se construit au fil des réponses.'
        }
        disclaimer="Illustration éducative seulement. Pas un conseil personnalisé."
        footer={
          immersive && !isResult ? null : (
            <p className="text-sm leading-relaxed text-prestige-taupe">
              {isResult
                ? 'Illustration éducative — pas un conseil personnalisé. 15 min soft pour coller l’ordre à ton dossier.'
                : 'Réponds — chaque choix adapte la suite.'}
            </p>
          )
        }
      >
        {/* Progress */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
              {isResult
                ? 'Ton ordre'
                : `Question ${stepIndex + 1} / ${questionSteps.length}`}
            </p>
            <p className="text-xs text-prestige-taupe">{progress} %</p>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-prestige-beige/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-400 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {!isResult && stepIndex > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-prestige-taupe transition-colors hover:text-primary"
            data-testid="retraite-wizard-back"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Retour
          </button>
        ) : null}

        {/* Question steps */}
        {!isResult && stepCopy ? (
          <div
            key={currentStepId}
            className="campagne-climax-enter space-y-5"
            data-testid={`retraite-step-${currentStepId}`}
          >
            <div>
              <h3 className="font-heading text-xl font-bold leading-snug text-dark sm:text-2xl">
                {stepCopy.title}
              </h3>
              {stepCopy.hint ? (
                <p className="mt-2 text-sm leading-relaxed text-prestige-taupe">{stepCopy.hint}</p>
              ) : null}
            </div>

            {currentStepId === 'horizon' ? (
              <ChoiceCards
                options={HORIZON_OPTIONS}
                value={answers.horizon}
                onChange={(v) => selectAndAdvance('horizon', v, 'horizon')}
              />
            ) : null}

            {currentStepId === 'liquidite' ? (
              <ChoiceCards
                options={LIQUIDITE_OPTIONS}
                value={answers.liquidite}
                onChange={(v) => selectAndAdvance('liquidite', v, 'liquidite')}
                columns={1}
              />
            ) : null}

            {currentStepId === 'matching' ? (
              <ChoiceCards
                options={MATCHING_OPTIONS}
                value={answers.matching}
                onChange={(v) => selectAndAdvance('matching', v, 'matching')}
                columns={1}
              />
            ) : null}

            {currentStepId === 'matchMax' ? (
              <ChoiceCards
                options={MATCH_MAX_OPTIONS}
                value={answers.matchMax}
                onChange={(v) => selectAndAdvance('matchMax', v, 'matchMax')}
                columns={1}
              />
            ) : null}

            {currentStepId === 'cotisation' ? (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    id="retraite-cotisation"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={25}
                    className={`${inputClass} pr-10`}
                    value={answers.cotisation}
                    onChange={(e) => {
                      setPdfReady(false);
                      setAnswers((prev) => ({ ...prev, cotisation: e.target.value }));
                    }}
                    placeholder="500"
                    autoFocus
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-prestige-taupe">
                    $
                  </span>
                </div>
                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <button
                    type="button"
                    onClick={continueCotisation}
                    className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-dark sm:w-auto"
                    data-testid="retraite-cotisation-continue"
                  >
                    Continuer
                  </button>
                  <button
                    type="button"
                    onClick={skipCotisation}
                    className="inline-flex w-full items-center justify-center rounded-full border border-prestige-beige bg-white px-6 py-3.5 text-sm font-semibold text-dark transition-colors hover:border-primary/30 hover:text-primary sm:w-auto"
                  >
                    Passer
                  </button>
                </div>
              </div>
            ) : null}

            {currentStepId === 'tranche' ? (
              <ChoiceCards
                options={SALAIRE_OPTIONS}
                value={answers.tranche}
                onChange={(v) => selectAndAdvance('tranche', v, 'tranche')}
                columns={1}
              />
            ) : null}

            {isCeliLocked(answers) &&
            (currentStepId === 'matching' || currentStepId === 'matchMax') ? (
              <p className="text-xs leading-relaxed text-prestige-taupe">
                Avec ton horizon / besoin d’accès, on penche déjà CELI — le salaire sera sauté.
              </p>
            ) : null}
          </div>
        ) : null}

        {/* Result */}
        {isResult ? (
          <div className="campagne-climax-enter space-y-6" data-testid="retraite-step-result">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                Ordre illustratif
              </p>
              <p
                className={`font-heading mt-1 font-bold tracking-tight tabular-nums text-dark ${
                  mixteWithDollars ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
                }`}
              >
                {snapshotDominant}
              </p>
              <p className="mt-1 text-sm text-prestige-taupe">{snapshotSub}</p>
              {suggestion.matchingNote ? (
                <span
                  className="mt-2 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                  data-testid="retraite-matching-chip"
                >
                  Match employeur noté
                </span>
              ) : null}
              <SplitBar
                key={`${suggestion.split.celi}-${suggestion.split.reer}`}
                celiPct={suggestion.split.celi}
                reerPct={suggestion.split.reer}
              />
              {monthly > 0 && !mixteWithDollars ? (
                <p className="mt-2 text-xs text-prestige-taupe">{splitDetail}</p>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {suggestion.key === 'mixte' ? (
                <>
                  <ResultCard
                    className="sm:col-span-2"
                    label="Partage du prochain dollar"
                    value={
                      monthly > 0
                        ? `${formatCad(celiAmt)} / ${formatCad(reerAmt)}`
                        : `${suggestion.split.celi} % / ${suggestion.split.reer} %`
                    }
                    detail={
                      monthly > 0
                        ? `CELI ${formatCad(celiAmt)} · REER ${formatCad(reerAmt)} — illustration seulement.`
                        : splitDetail
                    }
                    tone="nuance"
                  />
                  <ResultCard
                    className="sm:col-span-2"
                    label="Ordre suggéré"
                    value={suggestion.value}
                    detail="Piste seulement — matching et plafonds manquent encore."
                    tone="nuance"
                  />
                </>
              ) : (
                <>
                  <ResultCard
                    label="Ordre suggéré"
                    value={suggestion.value}
                    detail="Piste seulement — matching et plafonds manquent encore."
                    tone={suggestion.tone}
                  />
                  <ResultCard
                    label="Partage du prochain dollar"
                    value={
                      monthly > 0
                        ? `${formatCad(celiAmt)} / ${formatCad(reerAmt)}`
                        : `${suggestion.split.celi} % / ${suggestion.split.reer} %`
                    }
                    detail={
                      monthly > 0
                        ? `CELI ${formatCad(celiAmt)} · REER ${formatCad(reerAmt)} — illustration seulement.`
                        : splitDetail
                    }
                    tone={suggestion.tone}
                  />
                </>
              )}
            </div>

            <ul className="space-y-2.5">
              {suggestion.raisons.map((raison) => (
                <li
                  key={raison}
                  className="flex gap-2.5 text-sm leading-relaxed text-prestige-taupe"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>{raison}</span>
                </li>
              ))}
            </ul>

            <div
              className="campagne-soft-close-enter space-y-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-white to-secondary/[0.08] px-4 py-5 shadow-[0_8px_28px_rgba(1,35,63,0.08)] md:px-5"
              data-testid="retraite-rdv-tool"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                  Prochaine étape
                </p>
                <p className="font-heading mt-1.5 text-lg font-bold leading-snug text-dark md:text-xl">
                  {convHeadline}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-prestige-taupe">{convSubline}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-prestige-taupe">
                  Ce que l’outil ne peut pas savoir
                </p>
                <ul className="mt-2 space-y-2">
                  {gaps.map((gap) => (
                    <li
                      key={gap}
                      className="flex gap-2.5 text-sm leading-relaxed text-dark"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary"
                        aria-hidden
                      />
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-3 py-2.5 shadow-[inset_0_0_0_1px_rgba(1,35,63,0.06)]">
                <img
                  src="/seo/portrait.jpg"
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 shrink-0 rounded-full object-cover"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-dark">Pierre-Olivier Caouette</p>
                  <p className="text-xs text-prestige-taupe">
                    CSF · Victoriaville · 15 min, zéro pitch
                  </p>
                </div>
              </div>

              <Link
                to={rdvPath}
                onClick={() =>
                  trackRendezVousClick('campagne_retraite-reer-celi_rdv_tool')
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-semibold text-white shadow-md transition-colors hover:bg-dark"
                data-testid="campagne-tool-cta-rdv"
              >
                Valider mon ordre en 15 minutes
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
              <p className="text-center text-xs leading-relaxed text-prestige-taupe">
                Gratuit · sans pression · on colle l’ordre à ton dossier réel
              </p>

              <div className="flex flex-col items-stretch gap-2 border-t border-prestige-beige/80 pt-3 sm:flex-row sm:items-center sm:justify-between">
                <ToolDownloadPdf
                  onClick={handleDownload}
                  busy={busy}
                  label={
                    pdfReady ? 'PDF prêt — télécharger à nouveau' : 'Garder mon résumé PDF'
                  }
                  variant="ghost"
                />
                <button
                  type="button"
                  onClick={restart}
                  className="text-sm font-medium text-prestige-taupe underline-offset-2 hover:text-primary hover:underline"
                  data-testid="retraite-wizard-restart"
                >
                  Recommencer
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </CampagneToolShell>
    </div>
  );
}

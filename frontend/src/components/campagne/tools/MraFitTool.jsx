import { useEffect, useMemo, useState } from 'react';
import { Check, Clock, Settings2, Users } from 'lucide-react';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { trackEvent } from '../../../lib/analytics';
import { CampagneToolShell, ToolSoftClose } from '../CampagneToolShell';
import {
  useCampagneWizard,
  WizardProgress,
  WizardBackButton,
  WizardChoiceList,
  WizardContinueButton,
  WizardStep,
  WizardStepHeading,
} from '../CampagneWizard';

const MRA_STEP_IDS = ['equipe', 'situation', 'contrib', 'piliers', 'result'];

export const MRA_FIT_STORAGE_KEY = 'campagne_programme-mra_fit';

const inputClass =
  'w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-sm text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] transition focus:outline-none focus:shadow-[inset_0_0_0_2px_rgba(6,77,217,0.45)]';

const labelClass = 'mb-1.5 block text-xs font-medium text-prestige-taupe';

const SITUATIONS = [
  { id: 'aucune', label: 'Pas d’assurance collective en place', short: 'pas de collective' },
  { id: 'couteuse', label: 'Collective trop chère / trop rigide', short: 'collective trop chère / rigide' },
  { id: 'choix', label: 'Les employés veulent plus de choix', short: 'besoin de plus de choix' },
  { id: 'explorer', label: 'Je veux juste comparer les options', short: 'en mode comparaison' },
];

const CONTRIB = [
  { id: 'zero', label: 'Sans cotiser (accès seulement)', short: 'sans cotiser' },
  { id: 'pct', label: 'Je pourrais cotiser un %', short: 'cotisation %' },
  { id: 'plafond', label: 'Je préfère un plafond $ / personne', short: 'plafond $ / personne' },
  { id: 'indetermine', label: 'Pas encore décidé', short: 'cotisation pas encore décidée' },
];

const PILLARS = [
  {
    id: 'flex',
    icon: Settings2,
    title: 'Flexibilité',
    employeur: 'Tu peux cotiser ou non, fixer ton %, créer des catégories, couvrir qui tu veux.',
    employe:
      'Chacun choisit ses protections (invalidité court/long terme, individuel, couple, famille…).',
  },
  {
    id: 'simple',
    icon: Users,
    title: 'Simplicité',
    employeur: 'Tu décides surtout le % et/ou le budget max — tu ne choisis pas les plans pour eux.',
    employe: 'Une rencontre avec un conseiller ; preuves d’assurabilité réduites* ; ajustable dans le temps.',
  },
  {
    id: 'rapide',
    icon: Clock,
    title: 'Rapidité',
    employeur: 'Environ 2 rencontres pour la mise en place.',
    employe: '30 à 45 minutes par personne — entrée en vigueur souvent le 1er du mois suivant*.',
  },
];

const BADGE_STYLES = {
  'Bon fit': 'bg-secondary/15 text-secondary',
  'À explorer': 'bg-amber-100 text-amber-900',
  'Moins prioritaire': 'bg-prestige-beige text-prestige-taupe',
};

function ChipGroup({ id, options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-labelledby={id}>
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`rounded-full px-3.5 py-2 text-left text-sm font-medium transition ${
              active
                ? 'bg-primary text-white'
                : 'bg-white text-prestige-taupe shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)] hover:text-dark'
            }`}
            aria-pressed={active}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function scoreFit(n, situation) {
  if (!n || n <= 0) {
    return { badge: null, tone: 'default' };
  }
  if (n > 80) {
    return { badge: 'Moins prioritaire', tone: 'muted' };
  }
  if (n >= 5 && n <= 40 && ['aucune', 'couteuse', 'choix'].includes(situation)) {
    return { badge: 'Bon fit', tone: 'ok' };
  }
  return { badge: 'À explorer', tone: 'warn' };
}

function contribHook(contrib, badge) {
  if (badge === 'Moins prioritaire') {
    return 'On peut quand même clarifier si MRa (ou autre) a du sens pour ta taille.';
  }
  if (badge === 'À explorer') {
    return 'Ça vaut une présentation pour comparer avec ce que tu as aujourd’hui.';
  }
  if (contrib === 'zero') {
    return 'Surtout si tu veux offrir l’accès sans cotiser.';
  }
  if (contrib === 'pct' || contrib === 'plafond') {
    return 'Surtout si tu veux un % ou un plafond sans gérer les plans.';
  }
  return 'Même si t’as pas encore décidé comment cotiser.';
}

function buildFitBlurb(n, situation, contrib, badge) {
  if (!n || n <= 0) {
    return 'Indique la taille de ton équipe pour personnaliser le résumé.';
  }
  const sit = SITUATIONS.find((s) => s.id === situation);
  const situationCourte = sit?.short || 'ta situation';
  const hook = contribHook(contrib, badge);
  return `Pour ~${n} employés (${situationCourte}), t’as un ${badge}. ${hook}`;
}

function buildBridgeMessage(n, situation, contrib, badge) {
  const sit = SITUATIONS.find((s) => s.id === situation);
  const con = CONTRIB.find((c) => c.id === contrib);
  return `Fit outil : ~${n} | ${sit?.short || situation} | ${con?.short || contrib} | score ${badge}`;
}

/**
 * Fit check PME — programme MRa vs logique collective traditionnelle.
 * Soft close = Lead form (#demande), pas Bookings.
 */
export function MraFitTool({ immersive = false } = {}) {
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_programme-mra_pdf');
  const [employes, setEmployes] = useState('8');
  const [situation, setSituation] = useState('aucune');
  const [contrib, setContrib] = useState('indetermine');
  const [checked, setChecked] = useState({ flex: false, simple: false, rapide: false });

  const {
    stepIndex,
    currentStepId,
    isResult,
    questionCount,
    progress: wizardProgress,
    selectAndAdvance,
    advanceFrom,
    goBack,
  } = useCampagneWizard(MRA_STEP_IDS, {
    onReachResult: () =>
      trackEvent('select_content', {
        content_type: 'tool_result',
        item_id: 'campagne_programme-mra_result',
      }),
  });

  const nEmployes = useMemo(() => {
    const n = parseInt(String(employes).replace(/\D/g, ''), 10);
    return Number.isFinite(n) ? Math.max(1, Math.min(500, n)) : 0;
  }, [employes]);

  const situationLabel = SITUATIONS.find((s) => s.id === situation)?.label || '';
  const contribLabel = CONTRIB.find((c) => c.id === contrib)?.label || '';
  const pillarsOn = PILLARS.filter((p) => checked[p.id]).length;

  const fit = useMemo(() => scoreFit(nEmployes, situation), [nEmployes, situation]);
  const badge = fit.badge;

  const fitBlurb = useMemo(
    () => buildFitBlurb(nEmployes, situation, contrib, badge || 'À explorer'),
    [nEmployes, situation, contrib, badge]
  );

  const softHeadline = useMemo(() => {
    if (!badge || !nEmployes) return 'Indique ta taille d’équipe pour voir ton fit.';
    return `Pour ~${nEmployes} employés — ${badge}`;
  }, [badge, nEmployes]);

  const softSubline = useMemo(() => {
    if (!badge || !nEmployes) return 'Je te rappelle — sans Bookings ni pression.';
    const hook = contribHook(contrib, badge);
    return `${hook} Laisse ton entreprise + ton cell — je te rappelle pour une présentation MRa.`;
  }, [badge, nEmployes, contrib]);

  useEffect(() => {
    if (typeof sessionStorage === 'undefined' || !badge || !nEmployes) return;
    const payload = {
      message: buildBridgeMessage(nEmployes, situation, contrib, badge),
      teamSize: nEmployes,
      fitScore: badge,
      situation,
      contrib,
      blurb: fitBlurb,
      updatedAt: Date.now(),
    };
    try {
      sessionStorage.setItem(MRA_FIT_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore quota / private mode */
    }
  }, [nEmployes, situation, contrib, badge, fitBlurb]);

  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const goToForm = () => {
    if (badge && nEmployes) {
      trackEvent('select_content', {
        content_type: 'tool_to_form',
        item_id: 'campagne_programme-mra_tool_to_form',
        fit_score: badge,
        team_size: nEmployes,
      });
    }
    document.getElementById('demande')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePdf = () =>
    downloadPdf({
      title: 'Programme MRa — résumé pour PME',
      filename: 'resume-programme-mra.pdf',
      sections: [
        {
          heading: 'Ta situation',
          rows: [
            {
              label: 'Taille approx. de l’équipe',
              value: nEmployes ? `${nEmployes} personnes` : 'Non indiqué',
            },
            { label: 'Contexte', value: situationLabel || 'Non indiqué' },
            { label: 'Contribution employeur', value: contribLabel || 'Non indiqué' },
            { label: 'Score fit', value: badge || 'À préciser' },
          ],
        },
        {
          heading: 'Points retenus',
          rows: PILLARS.filter((p) => checked[p.id]).map((p) => ({
            label: p.title,
            value: `Employeur: ${p.employeur} | Employé: ${p.employe}`,
          })),
        },
        {
          heading: 'Lecture',
          rows: [{ label: 'Résumé', value: fitBlurb }],
        },
      ],
      notes: [
        'Document éducatif non contractuel. Le programme MRa repose sur des contrats individuels avec sélection médicale.',
        'Refus, exclusions ou surprimes possibles. Primes et garanties selon les contrats. Preuves d’assurabilité réduites selon conditions.',
        'Prochaine étape typique : je te rappelle pour une présentation — puis ~2 rencontres entreprise, 30-45 min par employé intéressé. Pas de calendrier Bookings imposé.',
      ],
      trackParams: badge ? { fit_score: badge, team_size: nEmployes } : undefined,
    });

  const softClose = (
    <ToolSoftClose
      formMode
      headline={softHeadline}
      subline={softSubline}
      formLabel="Recevoir une présentation"
      onFormClick={goToForm}
      onPdf={handlePdf}
      pdfBusy={busy}
      pdfLabel="Télécharger mon résumé PDF"
    />
  );

  if (immersive) {
    return (
      <div data-testid="tool-mra-fit">
        <CampagneToolShell
          immersive
          titleAs="h1"
          eyebrow="Programme MRa"
          title="MRa pour ta PME : est-ce que ça colle ?"
          intro="Une question à la fois. À la fin, tu peux demander une présentation."
          disclaimer="Illustration éducative — pas une soumission."
          footer={null}
        >
          <WizardProgress
            stepIndex={stepIndex}
            questionCount={questionCount}
            isResult={isResult}
            resultLabel="Ton fit"
            progress={wizardProgress}
          />
          {!isResult && stepIndex > 0 ? <WizardBackButton onClick={goBack} /> : null}

          {currentStepId === 'equipe' ? (
            <WizardStep id="equipe">
              <WizardStepHeading
                title="Combien de personnes dans l’équipe ?"
                hint="Ordre de grandeur — approx."
              />
              <input
                id="mra-wiz-employes"
                type="number"
                min={1}
                max={500}
                value={employes}
                onChange={(e) => setEmployes(e.target.value)}
                className={inputClass}
              />
              <WizardContinueButton
                disabled={!nEmployes}
                onClick={() => advanceFrom('equipe')}
              />
            </WizardStep>
          ) : null}

          {currentStepId === 'situation' ? (
            <WizardStep id="situation">
              <WizardStepHeading title="Ta situation aujourd’hui ?" />
              <WizardChoiceList
                name="situation"
                value={situation}
                options={SITUATIONS.map((s) => ({ value: s.id, label: s.label }))}
                onSelect={(v) => selectAndAdvance('situation', () => setSituation(v))}
              />
            </WizardStep>
          ) : null}

          {currentStepId === 'contrib' ? (
            <WizardStep id="contrib">
              <WizardStepHeading title="Contribution employeur (idée) ?" />
              <WizardChoiceList
                name="contrib"
                value={contrib}
                options={CONTRIB.map((c) => ({ value: c.id, label: c.label }))}
                onSelect={(v) => selectAndAdvance('contrib', () => setContrib(v))}
              />
            </WizardStep>
          ) : null}

          {currentStepId === 'piliers' ? (
            <WizardStep id="piliers">
              <WizardStepHeading
                title="Qu’est-ce qui te parle ?"
                hint="Coche les piliers — optionnel."
              />
              <ul className="space-y-2.5">
                {PILLARS.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => toggle(p.id)}
                      aria-pressed={Boolean(checked[p.id])}
                      className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-left ${
                        checked[p.id]
                          ? 'bg-gradient-to-br from-primary/[0.08] to-secondary/[0.1] shadow-[inset_0_0_0_2px_rgba(6,77,217,0.35)]'
                          : 'bg-white shadow-[inset_0_0_0_1px_rgba(1,35,63,0.1)]'
                      }`}
                    >
                      <span className="text-sm font-semibold text-dark">{p.title}</span>
                      <Check
                        className={`h-4 w-4 ${checked[p.id] ? 'text-primary' : 'text-transparent'}`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
              <WizardContinueButton
                onClick={() => advanceFrom('piliers')}
                label="Voir mon fit"
              />
            </WizardStep>
          ) : null}

          {isResult ? (
            <WizardStep id="result">
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                Lecture fit
              </p>
              {nEmployes > 0 && badge ? (
                <>
                  <p className="font-heading mt-2 text-4xl font-bold text-dark">
                    ~{nEmployes}
                  </p>
                  <span
                    className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      BADGE_STYLES[badge] || BADGE_STYLES['À explorer']
                    }`}
                  >
                    {badge}
                  </span>
                  <p className="mt-3 text-base leading-relaxed text-dark">{fitBlurb}</p>
                </>
              ) : (
                <p className="mt-2 text-sm text-prestige-taupe">{fitBlurb}</p>
              )}
              <div className="mt-5">{softClose}</div>
              <p className="mt-2 text-center text-xs text-prestige-taupe">
                Je te rappelle — sans Bookings
              </p>
            </WizardStep>
          ) : null}
        </CampagneToolShell>
      </div>
    );
  }

  return (
    <CampagneToolShell
      immersive={false}
      titleAs="h2"
      eyebrow="Outil interactif"
      title="MRa pour ta PME : est-ce que ça colle ?"
      intro="Alternative à la collective traditionnelle : tu offres l’accès, ils choisissent, on accompagne. Indique ta taille et ta situation — tu obtiens une lecture fit, puis tu peux demander une présentation."
      footer={
        <div className="flex flex-col gap-3">
          <p className="text-sm text-prestige-taupe">
            {pillarsOn}/3 piliers cochés
            {badge ? ` · ${badge}` : ''}
            {nEmployes ? ` · ~${nEmployes} employés` : ''}
          </p>
          {softClose}
        </div>
      }
      disclaimer="Illustration éducative — pas une soumission. Contrats individuels, sélection médicale, garanties selon contrats. Preuves d’assurabilité réduites sous conditions. Le fit n’est pas une admissibilité assureur."
    >
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="mra-employes" className={labelClass}>
              Combien de personnes dans l’équipe ? (approx.)
            </label>
            <input
              id="mra-employes"
              type="number"
              min={1}
              max={500}
              value={employes}
              onChange={(e) => setEmployes(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <p id="mra-contrib-label" className={labelClass}>
              Contribution employeur (idée)
            </p>
            <ChipGroup
              id="mra-contrib-label"
              options={CONTRIB}
              value={contrib}
              onChange={setContrib}
            />
          </div>
        </div>

        <div>
          <p id="mra-sit-label" className={labelClass}>
            Ta situation aujourd’hui
          </p>
          <ChipGroup id="mra-sit-label" options={SITUATIONS} value={situation} onChange={setSituation} />
        </div>

        <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.04] to-secondary/[0.06] px-4 py-5 md:px-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Lecture fit</p>
          {nEmployes > 0 && badge ? (
            <>
              <p className="font-heading mt-2 text-4xl font-bold tracking-tight text-dark md:text-5xl">
                ~{nEmployes}
              </p>
              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${BADGE_STYLES[badge] || BADGE_STYLES['À explorer']}`}
              >
                {badge}
              </span>
              <p className="mt-3 text-base leading-relaxed text-dark">{fitBlurb}</p>
            </>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-prestige-taupe">{fitBlurb}</p>
          )}
        </div>

        <div className="space-y-2">
          {softClose}
          <p className="text-center text-xs text-prestige-taupe sm:text-left">
            Je te rappelle — sans Bookings
          </p>
        </div>

        <div>
          <h3 className="font-heading mb-3 text-base font-semibold text-dark">
            3 raisons souvent citées (coche ce qui te parle)
          </h3>
          <ul className="space-y-3">
            {PILLARS.map((p) => {
              const on = Boolean(checked[p.id]);
              const Icon = p.icon;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => toggle(p.id)}
                    className={`flex w-full gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
                      on
                        ? 'border-primary/25 bg-primary/[0.04]'
                        : 'border-prestige-beige bg-white hover:border-primary/15'
                    }`}
                    aria-pressed={on}
                  >
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        on ? 'bg-primary text-white' : 'bg-gray-100 text-prestige-taupe'
                      }`}
                    >
                      {on ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Icon className="h-4 w-4" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="font-heading block text-sm font-semibold text-dark">{p.title}</span>
                      <span className="mt-1 block text-sm text-prestige-taupe">
                        <strong className="font-medium text-dark/80">Toi : </strong>
                        {p.employeur}
                      </span>
                      <span className="mt-1 block text-sm text-prestige-taupe">
                        <strong className="font-medium text-dark/80">Eux : </strong>
                        {p.employe}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="rounded-xl bg-gray-50 px-4 py-3 text-xs leading-relaxed text-prestige-taupe">
          MRa = contrats individuels via l’entreprise. Sélection médicale possible. Prochaine étape :
          je te rappelle pour une présentation — pas de calendrier imposé.
        </p>
      </div>
    </CampagneToolShell>
  );
}

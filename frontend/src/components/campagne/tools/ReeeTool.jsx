import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Check, GraduationCap, TrendingUp } from 'lucide-react';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { buildCampagneRdvPath } from '../../../data/campagneAdsLandings';
import { trackEvent, trackRendezVousClick } from '../../../lib/analytics';
import { formatCad } from '../../tools/format';
import {
  CampagneToolShell,
  ToolSoftClose,
} from '../CampagneToolShell';

/** Illustration SCEE (fédérale) — ~20 % sur les premiers 2 500 $ / an. */
const SCEE_TAUX = 0.2;
const SCEE_BASE_ANNUELLE = 2500;
const SCEE_MAX_ANNUEL = 500;
/** Plafond à vie SCEE illustratif (base). */
const SCEE_PLAFOND_VIE = 7200;
const AGE_ETUDES = 17;
const RENDEMENT_OPTIONNEL = 0.04;

const COTISATION_PRESETS = [1000, 2500, 5000];

const inputClass =
  'w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-sm text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] transition focus:outline-none focus:shadow-[inset_0_0_0_2px_rgba(6,77,217,0.45)]';

const labelClass = 'mb-1.5 block text-xs font-medium text-prestige-taupe';

/** Points fixes — utiles même sans dossier. */
const A_RETENIR = [
  'REEE = le compte pour les études. SCEE = la subvention fédérale (~20 ¢ par dollar).',
  `Souvent, ~${SCEE_BASE_ANNUELLE.toLocaleString('fr-CA')} $ / an maximise la SCEE (~${SCEE_MAX_ANNUEL.toLocaleString('fr-CA')} $ / an).`,
  `Plafond à vie SCEE illustratif : ~${SCEE_PLAFOND_VIE.toLocaleString('fr-CA')} $ — au-delà, plus de subvention fédérale de base.`,
  'Au Québec, d’autres aides (ex. IQEE) peuvent s’ajouter — à revalider selon les règles en vigueur.',
];

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

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function sceeAnnuelle(cotisation) {
  const base = Math.min(Math.max(0, cotisation), SCEE_BASE_ANNUELLE);
  return Math.min(base * SCEE_TAUX, SCEE_MAX_ANNUEL);
}

/**
 * Projette cotisations + SCEE sur N années, avec plafond à vie.
 * Si rendement > 0 : capitalisation annuelle en fin d’année (illustration).
 * `sceeDejaRecues` seed le cumul SCEE déjà versée (réduit le room restant).
 */
function projeterReee(cotisationAnnuelle, annees, tauxRendement = 0, sceeDejaRecues = 0) {
  const cotisation = Math.max(0, cotisationAnnuelle);
  const years = Math.max(0, Math.floor(annees));
  const rate = Math.max(0, tauxRendement);
  const sceeDeja = Math.min(SCEE_PLAFOND_VIE, Math.max(0, sceeDejaRecues));

  let totalCotise = 0;
  let totalSubventions = sceeDeja;
  let solde = sceeDeja;

  for (let i = 0; i < years; i += 1) {
    const room = Math.max(0, SCEE_PLAFOND_VIE - totalSubventions);
    const grant = Math.min(sceeAnnuelle(cotisation), room);
    totalCotise += cotisation;
    totalSubventions += grant;
    solde = (solde + cotisation + grant) * (1 + rate);
  }

  return {
    totalCotise,
    totalSubventions,
    sceeDeja,
    totalIllustratif: rate > 0 ? solde : totalCotise + totalSubventions,
    plafondAtteint: totalSubventions >= SCEE_PLAFOND_VIE - 1e-9,
    years,
    laisseSurTable: Math.max(0, SCEE_PLAFOND_VIE - totalSubventions),
  };
}

function buildLecture(result) {
  const {
    cotisation,
    years,
    sceeParAn,
    totalCotise,
    totalSubventions,
    totalIllustratif,
    plafondAtteint,
    avecRendement,
    laisseSurTable,
    sceeDeja,
  } = result;

  if (years <= 0 || cotisation <= 0) {
    return {
      headline: 'Il manque encore un chiffre',
      detail:
        'Indique l’âge (ou les années avant les études) et combien tu mets par année — on te montre les subventions.',
      points: [],
      sousMaxAnnuel: false,
      ecartAnnuel: 0,
      ecartProjection: 0,
    };
  }

  const points = [];
  const sousMaxAnnuel = cotisation > 0 && cotisation < SCEE_BASE_ANNUELLE;
  const ecartAnnuel = sousMaxAnnuel ? Math.max(0, SCEE_MAX_ANNUEL - sceeParAn) : 0;
  const ecartProjection = ecartAnnuel * years;

  if (laisseSurTable > 0 && !plafondAtteint) {
    points.push(
      sceeDeja > 0
        ? `Avec ce que t’as déjà, il resterait encore ~${formatCad(laisseSurTable)} de subventions possibles avant le max à vie.`
        : `Il resterait encore ~${formatCad(laisseSurTable)} de subventions possibles avant le max à vie — souvent en cotisant plus longtemps ou un peu plus tôt.`
    );
  }

  if (sousMaxAnnuel) {
    points.push(
      `Tu mets ${formatCad(cotisation)} / an → ~${formatCad(sceeParAn)} de subvention fédérale. Vers ${formatCad(SCEE_BASE_ANNUELLE)} / an, tu maximises souvent (~${formatCad(SCEE_MAX_ANNUEL)} / an). Écart ≈ ${formatCad(ecartAnnuel)} / an.`
    );
  } else if (cotisation >= SCEE_BASE_ANNUELLE) {
    points.push(
      `Avec ${formatCad(cotisation)} / an, tu maximises la SCEE annuelle (~${formatCad(SCEE_MAX_ANNUEL)}) tant que le plafond à vie n’est pas atteint.`
    );
  }

  points.push(
    `Sur ${years} an${years > 1 ? 's' : ''}, tu mets ${formatCad(totalCotise)} et le gouvernement ajoute ~${formatCad(Math.max(0, totalSubventions - sceeDeja))} de nouvelles SCEE (cumul illustratif ~${formatCad(totalSubventions)}).`
  );

  if (plafondAtteint) {
    points.push(
      `Tu touches le max à vie (~${formatCad(SCEE_PLAFOND_VIE)}) dans ce scénario.`
    );
  }

  if (avecRendement) {
    points.push(
      `Avec 4 % / an (illustration, pas une garantie), le total estimé monte à ~${formatCad(totalIllustratif)}.`
    );
  } else {
    points.push(
      'Sans rendement : le total = ce que tu mets + les subventions. Tu peux cocher 4 % pour une illustration.'
    );
  }

  const regretHeadline =
    sceeDeja > 0
      ? `Avec ce que t’as déjà, il resterait encore ~${formatCad(laisseSurTable)}`
      : `Il resterait encore ~${formatCad(laisseSurTable)} avant le max`;

  return {
    headline: plafondAtteint
      ? 'Tu touches le max de subventions'
      : laisseSurTable > 0
        ? regretHeadline
        : `Environ ${formatCad(totalIllustratif)} pour les études`,
    detail: avecRendement
      ? `Ton argent + subventions, avec 4 % / an sur ${years} an${years > 1 ? 's' : ''} (pas une garantie).`
      : `Ce que tu mets + les subventions — sur ${years} an${years > 1 ? 's' : ''}.`,
    points,
    sousMaxAnnuel,
    ecartAnnuel,
    ecartProjection,
  };
}

export function ReeeTool() {
  const location = useLocation();
  const [age, setAge] = useState('5');
  const [cotisationAnnuelle, setCotisationAnnuelle] = useState('2500');
  const [anneesRestantes, setAnneesRestantes] = useState(String(AGE_ETUDES - 5));
  const [sceeDejaRecues, setSceeDejaRecues] = useState('0');
  const [avecRendement, setAvecRendement] = useState(false);
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_reee_pdf');
  const climaxTracked = useRef(false);
  const sousMaxTracked = useRef(false);
  const sceeDejaTracked = useRef(false);

  const handleAgeChange = (value) => {
    setAge(value);
    const a = Math.max(0, Math.min(AGE_ETUDES, Math.floor(toNumber(value, 0))));
    setAnneesRestantes(String(Math.max(0, AGE_ETUDES - a)));
  };

  const result = useMemo(() => {
    const cotisation = Math.max(0, toNumber(cotisationAnnuelle));
    const years = Math.max(0, Math.floor(toNumber(anneesRestantes)));
    const sceeDeja = Math.min(SCEE_PLAFOND_VIE, Math.max(0, toNumber(sceeDejaRecues)));
    const taux = avecRendement ? RENDEMENT_OPTIONNEL : 0;
    return {
      ...projeterReee(cotisation, years, taux, sceeDeja),
      sceeParAn: sceeAnnuelle(cotisation),
      cotisation,
      avecRendement,
    };
  }, [cotisationAnnuelle, anneesRestantes, sceeDejaRecues, avecRendement]);

  const lecture = useMemo(() => buildLecture(result), [result]);
  const laisseSurTable = result.laisseSurTable;
  const showRegret = laisseSurTable > 0 && !result.plafondAtteint;
  const plafondProgress = Math.min(
    100,
    Math.round((result.totalSubventions / SCEE_PLAFOND_VIE) * 100)
  );

  const milestones = useMemo(
    () => [
      { id: 'enfant', done: age !== '' && toNumber(anneesRestantes) >= 0 },
      {
        id: 'cotisation',
        done: cotisationAnnuelle !== '' && result.cotisation > 0,
      },
      { id: 'horizon', done: result.years > 0 },
      {
        id: 'lecture',
        done: result.cotisation > 0 && result.years > 0,
      },
    ],
    [age, anneesRestantes, cotisationAnnuelle, result.cotisation, result.years]
  );

  const doneCount = milestones.filter((m) => m.done).length;
  const total = milestones.length;
  const lectureReady = milestones[3].done;

  useEffect(() => {
    if (!lectureReady || laisseSurTable <= 0 || climaxTracked.current) return;
    climaxTracked.current = true;
    trackEvent('select_content', {
      content_type: 'tool_climax',
      item_id: 'campagne_reee_laisse_sur_table',
      value: laisseSurTable,
    });
  }, [lectureReady, laisseSurTable]);

  useEffect(() => {
    if (!lectureReady || !lecture.sousMaxAnnuel || sousMaxTracked.current) return;
    sousMaxTracked.current = true;
    trackEvent('select_content', {
      content_type: 'tool_insight',
      item_id: 'campagne_reee_sous_max_annuel',
      value: lecture.ecartAnnuel,
    });
  }, [lectureReady, lecture.sousMaxAnnuel, lecture.ecartAnnuel]);

  useEffect(() => {
    if (!lectureReady || result.sceeDeja <= 0 || sceeDejaTracked.current) return;
    sceeDejaTracked.current = true;
    trackEvent('select_content', {
      content_type: 'tool_insight',
      item_id: 'campagne_reee_scee_deja',
      value: result.sceeDeja,
    });
  }, [lectureReady, result.sceeDeja]);

  const softCloseHeadline = result.plafondAtteint
    ? 'Tu touches le max de subventions dans ce scénario.'
    : laisseSurTable > 0
      ? `Il resterait encore ~${formatCad(laisseSurTable)} avant le max à vie (SCEE illustratif).`
      : 'C’est prêt — on peut coller ça à ton cadre.';

  const softCloseSubline = result.plafondAtteint
    ? '15 min pour valider le cadre (autres enfants, déjà en place) — zéro pression.'
    : laisseSurTable > 0
      ? 'En 15 minutes, on regarde ce qui est déjà en place pis un rythme qui tient avec ton budget — calme, concret, zéro pression.'
      : '15 min pour caler âge, budget, déjà en place — zéro pression.';

  const softCloseRdvLabel = result.plafondAtteint
    ? 'Valider mon cadre — 15 min'
    : 'Relier ça à mon budget — 15 min';

  const handleDownload = () =>
    downloadPdf({
      title: 'Résumé — REEE / SCEE',
      filename: 'resume-reee.pdf',
      sections: [
        {
          heading: 'Tes entrées',
          rows: [
            {
              label: "Âge de l'enfant",
              value: `${toNumber(age).toLocaleString('fr-CA')} ans`,
            },
            {
              label: 'Combien tu mets par année',
              value: formatCad(result.cotisation),
            },
            {
              label: 'Années avant les études',
              value: `${result.years} an${result.years > 1 ? 's' : ''}`,
            },
            {
              label: 'SCEE déjà reçues',
              value: formatCad(result.sceeDeja),
            },
            {
              label: 'Avec rendement 4 %',
              value: result.avecRendement ? 'Oui' : 'Non',
            },
          ],
        },
        {
          heading: 'Projection',
          rows: [
            {
              label: 'Encore possibles avant le max (SCEE)',
              value: formatCad(laisseSurTable),
            },
            { label: 'Ce que tu mets', value: formatCad(result.totalCotise) },
            {
              label: 'Subventions du gouvernement (SCEE)',
              value: formatCad(result.totalSubventions),
            },
            {
              label: result.avecRendement
                ? 'Total estimé (avec 4 %)'
                : 'Total estimé',
              value: formatCad(result.totalIllustratif),
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
          heading: 'À retenir',
          rows: A_RETENIR.map((point, i) => ({
            label: `${i + 1}`,
            value: point,
          })),
        },
      ],
      notes: [
        'Illustration seulement — pas un conseil. SCEE fédérale de base (~20 %, max ~500 $/an, plafond vie ~7 200 $).',
        'Autres aides (IQEE, etc.) à revalider selon les règles en vigueur.',
      ],
    });

  const rdvPath = buildCampagneRdvPath('reee', location.search);

  return (
    <div data-testid="tool-reee">
      <CampagneToolShell
        title="Combien pour les études ?"
        intro="REEE = compte. SCEE = ~20 ¢ / $. Entre l’âge et ton rythme — subventions, total, et ce qui reste avant ~7 200 $."
        disclaimer="Illustration seulement — pas un conseil. Chiffre principal = SCEE fédérale de base (~20 % sur les premiers ~2 500 $/an, max ~500 $/an, plafond à vie illustratif ~7 200 $). Autres aides (IQEE, etc.) : hors total — à revalider. Le rendement 4 % est optionnel et non garanti."
        footer={
          lectureReady ? (
            <ToolSoftClose
              headline={softCloseHeadline}
              subline={softCloseSubline}
              rdvPath={rdvPath}
              rdvLabel={softCloseRdvLabel}
              onRdvClick={() => trackRendezVousClick('campagne_reee_rdv_outil')}
              onPdf={handleDownload}
              pdfBusy={busy}
              pdfLabel="Télécharger mon résumé PDF"
            />
          ) : (
            <p className="text-sm leading-relaxed text-prestige-taupe">
              Entre l’âge et combien tu mets — on te montre la subvention et ce qui resterait sur
              la table.
            </p>
          )
        }
      >
        <div className="mb-8">
          <div className="mb-2 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                Vers le max de subventions
              </p>
              <p className="font-heading mt-1 text-2xl font-bold text-dark">
                {formatCad(result.totalSubventions)}
                <span className="text-base font-medium text-prestige-taupe">
                  {' '}
                  / {formatCad(SCEE_PLAFOND_VIE)}
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
            Max à vie SCEE ~{SCEE_PLAFOND_VIE.toLocaleString('fr-CA')} $ — {doneCount}/
            {total} infos remplies.
          </p>
        </div>

        <div className="relative space-y-8 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-px before:bg-prestige-beige">
          <Block
            step={1}
            title="Ton enfant"
            subtitle="On calcule les années jusqu’à 17 ans — tu peux ajuster."
            done={milestones[0].done && milestones[2].done}
          >
            <Field id="reee-age" label="Âge de ton enfant">
              <div className="relative">
                <input
                  id="reee-age"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={AGE_ETUDES}
                  step={1}
                  className={`${inputClass} pr-12`}
                  value={age}
                  onChange={(e) => handleAgeChange(e.target.value)}
                  placeholder="5"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-prestige-taupe">
                  ans
                </span>
              </div>
            </Field>
            <Field
              id="reee-annees"
              label="Années avant les études"
              hint="On part de 17 ans. Change si ton projet d’études est plus tôt ou plus tard."
            >
              <div className="relative">
                <input
                  id="reee-annees"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={AGE_ETUDES}
                  step={1}
                  className={`${inputClass} pr-12`}
                  value={anneesRestantes}
                  onChange={(e) => setAnneesRestantes(e.target.value)}
                  placeholder="12"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-prestige-taupe">
                  ans
                </span>
              </div>
            </Field>
          </Block>

          <Block
            step={2}
            title="Ton épargne"
            subtitle={`Avec ${SCEE_BASE_ANNUELLE.toLocaleString('fr-CA')} $ / an, tu maximises souvent la subvention (~${SCEE_MAX_ANNUEL.toLocaleString('fr-CA')} $).`}
            done={milestones[1].done}
          >
            <Field
              id="reee-scee-deja"
              label="SCEE déjà reçues (approx.)"
              hint="Pas le solde du compte : le cumul de SCEE déjà versée. 0 si tu sais pas."
            >
              <div className="relative">
                <input
                  id="reee-scee-deja"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={SCEE_PLAFOND_VIE}
                  step={100}
                  className={`${inputClass} pr-8`}
                  value={sceeDejaRecues}
                  onChange={(e) => setSceeDejaRecues(e.target.value)}
                  placeholder="0"
                  data-testid="reee-scee-deja"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-prestige-taupe">
                  $
                </span>
              </div>
            </Field>
            <div className="flex items-end">
              <p className="pb-2.5 text-sm leading-relaxed text-prestige-taupe">
                {result.sceeDeja > 0
                  ? `Déjà ~${formatCad(result.sceeDeja)} de SCEE reçues — le max restant illustratif baisse d’autant.`
                  : `Max à vie SCEE illustratif ~${formatCad(SCEE_PLAFOND_VIE)}. Mets 0 si tu n’as pas encore de compte.`}
              </p>
            </div>
            <Field
              id="reee-cotisation"
              label="Combien tu mets par année"
              hint="Un ordre de grandeur suffit. Tu peux utiliser les raccourcis ci-dessous."
            >
              <div className="relative">
                <input
                  id="reee-cotisation"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={100}
                  className={`${inputClass} pr-8`}
                  value={cotisationAnnuelle}
                  onChange={(e) => setCotisationAnnuelle(e.target.value)}
                  placeholder="2500"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-prestige-taupe">
                  $
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {COTISATION_PRESETS.map((preset) => {
                  const active = toNumber(cotisationAnnuelle) === preset;
                  const isMaxScee = preset === SCEE_BASE_ANNUELLE;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCotisationAnnuelle(String(preset))}
                      className={`min-h-11 rounded-lg px-3 py-2 text-xs font-medium transition ${
                        active
                          ? 'bg-primary text-white shadow-sm'
                          : isMaxScee
                            ? 'bg-white font-semibold text-primary shadow-[inset_0_0_0_2px_rgba(6,77,217,0.35)] hover:bg-primary/[0.04]'
                            : 'bg-white text-prestige-taupe shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)] hover:text-dark'
                      }`}
                    >
                      {preset.toLocaleString('fr-CA')} $
                      {isMaxScee ? ' · max SCEE' : ''}
                    </button>
                  );
                })}
              </div>
            </Field>
            <div className="flex items-end">
              <div className="w-full space-y-2">
                <div className="rounded-2xl bg-prestige-beige/50 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-prestige-taupe">
                    Subvention / an (SCEE)
                  </p>
                  <p className="font-heading mt-0.5 text-xl font-bold text-dark">
                    {formatCad(result.sceeParAn)}
                  </p>
                  {!lecture.sousMaxAnnuel && result.sceeParAn >= SCEE_MAX_ANNUEL ? (
                    <p className="mt-1.5 text-xs leading-relaxed text-prestige-taupe">
                      Tu maximises la subvention annuelle dans ce scénario.
                    </p>
                  ) : null}
                </div>
                {lecture.sousMaxAnnuel ? (
                  <div
                    className="rounded-xl border border-primary/25 bg-primary/[0.05] px-3.5 py-3"
                    data-testid="reee-sous-max-callout"
                  >
                    <p className="text-sm font-semibold text-dark">
                      Tu laisses une partie de la SCEE annuelle sur la table
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-prestige-taupe">
                      Avec {formatCad(result.cotisation)} / an → ~{formatCad(result.sceeParAn)} de
                      SCEE. Vers {formatCad(SCEE_BASE_ANNUELLE)} / an, tu maximises souvent (~
                      {formatCad(SCEE_MAX_ANNUEL)} / an). Écart ≈{' '}
                      <span className="font-semibold text-primary">
                        {formatCad(lecture.ecartAnnuel)} / an
                      </span>
                      {result.years > 0 ? (
                        <>
                          {' '}
                          · sur {result.years} an{result.years > 1 ? 's' : ''} ≈{' '}
                          <span className="font-semibold text-dark">
                            {formatCad(lecture.ecartProjection)}
                          </span>{' '}
                          (illustration · le plafond à vie peut limiter).
                        </>
                      ) : null}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </Block>

          <div className="relative pl-11">
            <div
              className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                avecRendement
                  ? 'bg-primary text-white'
                  : 'bg-white text-prestige-taupe shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)]'
              }`}
              aria-hidden
            >
              {avecRendement ? (
                <Check className="h-4 w-4" strokeWidth={2.5} />
              ) : (
                <TrendingUp className="h-3.5 w-3.5" />
              )}
            </div>
            <label
              htmlFor="reee-rendement"
              className="flex cursor-pointer items-start gap-3 rounded-2xl bg-gradient-to-br from-primary/[0.04] to-secondary/[0.06] px-4 py-3.5"
            >
              <input
                id="reee-rendement"
                type="checkbox"
                checked={avecRendement}
                onChange={(e) => setAvecRendement(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <span>
                <span className="block text-sm font-semibold text-dark">
                  Ajouter un rendement de 4 % / an
                </span>
                <span className="mt-0.5 block text-xs text-prestige-taupe">
                  Optionnel. Sinon, on montre juste ce que tu mets + les subventions.
                </span>
              </span>
            </label>
          </div>

          <div className="relative pl-11">
            <div
              className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                milestones[3].done
                  ? 'bg-primary text-white'
                  : 'bg-white text-prestige-taupe shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)]'
              }`}
              aria-hidden
            >
              {milestones[3].done ? (
                <Check className="h-4 w-4" strokeWidth={2.5} />
              ) : (
                <GraduationCap className="h-3.5 w-3.5" />
              )}
            </div>

            <div className="mb-3">
              <h3 className="font-heading text-base font-semibold text-dark">
                Pour les études
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
              {showRegret ? (
                <div
                  key={`regret-${laisseSurTable}`}
                  className="animate-[fadeIn_0.3s_ease-out]"
                  data-testid="reee-laisse-sur-table"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                    Encore possibles avant le max à vie (SCEE)
                  </p>
                  <p className="font-heading mt-1 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                    ~{formatCad(laisseSurTable)}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-prestige-taupe">
                    Ce n’est pas « dû » — c’est de la place illustrée selon ce rythme
                    {result.sceeDeja > 0
                      ? ` (après ~${formatCad(result.sceeDeja)} déjà reçues)`
                      : ''}
                    .
                  </p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-prestige-taupe">
                    Total estimé pour les études
                  </p>
                  <p className="font-heading mt-1 text-xl font-bold tracking-tight text-dark sm:text-2xl">
                    {formatCad(result.totalIllustratif)}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-prestige-taupe">
                    {lecture.detail}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                    {result.plafondAtteint ? 'Max de subventions' : 'Total estimé'}
                  </p>
                  <p className="font-heading mt-1 text-3xl font-bold tracking-tight text-dark sm:text-4xl">
                    {formatCad(result.totalIllustratif)}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-prestige-taupe">
                    {lecture.detail}
                  </p>
                </>
              )}

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

              <div className="mt-5 grid gap-4 border-t border-dark/5 pt-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-prestige-taupe">Ce que tu mets</p>
                  <p className="mt-0.5 font-heading text-lg font-semibold text-dark">
                    {formatCad(result.totalCotise)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-prestige-taupe">Subventions (SCEE)</p>
                  <p className="mt-0.5 font-heading text-lg font-semibold text-dark">
                    {formatCad(result.totalSubventions)}
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

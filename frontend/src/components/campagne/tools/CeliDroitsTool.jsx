import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Check, AlertTriangle } from 'lucide-react';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { buildCampagneRdvPath } from '../../../data/campagneAdsLandings';
import { trackEvent, trackRendezVousClick } from '../../../lib/analytics';
import { formatCad } from '../../tools/format';
import { CampagneToolShell, ToolSoftClose } from '../CampagneToolShell';

/** Plafonds annuels CELI (2009–2026). Validé ARC 2026-11 — revalider à chaque nouvel indice annuel. */
const PLAFONDS_ANNUELS = {
  2009: 5000,
  2010: 5000,
  2011: 5000,
  2012: 5000,
  2013: 5500,
  2014: 5500,
  2015: 10000,
  2016: 5500,
  2017: 5500,
  2018: 5500,
  2019: 6000,
  2020: 6000,
  2021: 6000,
  2022: 6000,
  2023: 6500,
  2024: 7000,
  2025: 7000,
  2026: 7000,
};

const ANNEE_COURANTE = 2026;
const ANNEE_MIN_CELI = 2009;
const PLAFOND_ANNUEL = PLAFONDS_ANNUELS[ANNEE_COURANTE] ?? 7000;

const ARC_DOSSIER_URL =
  'https://www.canada.ca/fr/agence-revenu/services/services-electroniques/services-electroniques-particuliers/dossier-particuliers.html';

const USAGE_OPTIONS = [
  { id: 'urgence', label: 'Fonds d’urgence', soft: 'fonds d’urgence' },
  { id: 'projet', label: 'Projet court terme', soft: 'projet court terme' },
  { id: 'long_terme', label: 'Long terme / retraite', soft: 'long terme / retraite' },
];

const A_RETENIR = [
  'Les droits inutilisés ne disparaissent pas au 31 décembre — ils s’accumulent.',
  'Le plafond de l’année ≠ la place totale qu’il te reste.',
  'Cotiser « pour cotiser » sans objectif, ça ne remplace pas un plan.',
  'Le solde officiel, c’est Mon Dossier ARC — pas cette estimation.',
];

const inputClass =
  'w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-sm text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] transition focus:outline-none focus:shadow-[inset_0_0_0_2px_rgba(6,77,217,0.45)]';

const labelClass = 'mb-1.5 block text-xs font-medium text-prestige-taupe';

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function plafondPourAnnee(year) {
  if (PLAFONDS_ANNUELS[year] != null) return PLAFONDS_ANNUELS[year];
  return year >= 2024 ? 7000 : 5500;
}

function droitsCumulesDepuis(annee18) {
  const debut = Math.max(ANNEE_MIN_CELI, Math.floor(annee18));
  let total = 0;
  for (let y = debut; y <= ANNEE_COURANTE; y += 1) {
    total += plafondPourAnnee(y);
  }
  return total;
}

function usageMeta(usage) {
  return USAGE_OPTIONS.find((opt) => opt.id === usage) || null;
}

function ArcLink({ children = 'Mon Dossier ARC' }) {
  return (
    <a
      href={ARC_DOSSIER_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 text-primary hover:text-dark"
    >
      {children}
    </a>
  );
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

function MoneyInput({ id, value, onChange, placeholder }) {
  return (
    <div className="relative">
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={0}
        step="100"
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

function ResultCard({ label, value, detail, tone = 'default' }) {
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

function buildLecture(result, usage) {
  const {
    year18,
    cumules,
    deja,
    placeRestante,
    cotisationEffective,
    placeApres,
    depassement,
    prevu,
    coupeParPlafondAnnuel,
    plafondAnnuel,
  } = result;

  if (depassement) {
    return {
      headline: 'Chiffre à vérifier',
      detail:
        'Ton total cotisé dépasse l’estimation des droits cumulés. Soit l’année de 18 ans est trop récente, soit Mon Dossier ARC a un autre solde — c’est lui qui fait foi.',
      points: [
        `Estimation des droits depuis ${year18} : ${formatCad(cumules)}.`,
        `Tu as indiqué ${formatCad(deja)} déjà cotisé à vie.`,
        'Avant de cotiser davantage, ouvre Mon Dossier ARC et compare.',
      ],
      tone: 'warn',
    };
  }

  const points = [];

  points.push(
    `Depuis ${year18}, on estime ${formatCad(cumules)} de droits cumulés (plafonds illustratifs).`
  );

  if (deja <= 0) {
    points.push(
      'Tu n’as rien indiqué en cotisations à vie — toute la place estimée serait encore disponible.'
    );
  } else {
    points.push(
      `Tu as déjà cotisé ${formatCad(deja)} : il resterait environ ${formatCad(placeRestante)} de place.`
    );
  }

  if (prevu > 0) {
    if (coupeParPlafondAnnuel) {
      points.push(
        `Tu visais ${formatCad(prevu)} cette année, mais le plafond annuel illustratif est ${formatCad(plafondAnnuel)} — on retient ${formatCad(cotisationEffective)}.`
      );
    } else if (prevu > placeRestante) {
      points.push(
        `Tu visais ${formatCad(prevu)}, mais la place restante estimée est ${formatCad(placeRestante)} — on calcule avec ça.`
      );
    } else {
      points.push(
        `Avec ${formatCad(cotisationEffective)} cette année, il resterait ${formatCad(placeApres)} après.`
      );
    }
  } else {
    points.push(
      `Le plafond ${ANNEE_COURANTE} illustratif est ${formatCad(plafondAnnuel)} — ce n’est qu’une tranche de ta place totale.`
    );
  }

  if (usage === 'urgence' && placeRestante > 0) {
    points.push(
      `Avec ~${formatCad(placeRestante)} de place, un fonds d’urgence liquide dans le CELI peut précéder le « maxer pour maxer ».`
    );
  } else if (usage === 'projet' && placeRestante > 0) {
    points.push(
      `Place estimée ~${formatCad(placeRestante)} : utile pour un projet à horizon court — sans confondre solde et droits.`
    );
  } else if (usage === 'long_terme' && placeRestante > 0) {
    points.push(
      `~${formatCad(placeRestante)} de place : horizon long / retraite possible — l’ordre avec REER se regarde au cas par cas.`
    );
  } else if (placeRestante > plafondAnnuel * 2) {
    points.push(
      'Beaucoup de place qui dort : avant de « maxer », décide à quoi sert cet argent (urgence, projet, long terme).'
    );
  } else if (placeRestante > 0 && placeRestante <= plafondAnnuel) {
    points.push(
      'Tu es près du plafond cumulé estimé — chaque cotisation compte davantage. Vérifie ARC avant d’ajouter.'
    );
  } else if (placeRestante <= 0) {
    points.push(
      'Selon ces chiffres, tu n’aurais plus de place. Confirme dans Mon Dossier ARC avant toute cotisation.'
    );
  }

  return {
    headline:
      placeRestante <= 0
        ? 'Peu ou pas de place restante (estimé)'
        : `Environ ${formatCad(placeRestante)} de place restante`,
    detail:
      placeRestante <= 0
        ? 'Illustration seulement — le vrai solde est dans Mon Dossier ARC.'
        : `Cumulés ${formatCad(cumules)} · déjà ${formatCad(deja)} · plafond ${ANNEE_COURANTE} : ${formatCad(plafondAnnuel)}.`,
    points,
    tone: placeRestante <= 0 ? 'warn' : 'ok',
  };
}

function softCloseCopy(result, usage) {
  const meta = usageMeta(usage);
  const x = formatCad(result.placeRestante);

  if (result.depassement || result.placeRestante <= 0) {
    return {
      headline: 'Chiffre à vérifier avec Mon Dossier ARC.',
      subline:
        '15 minutes pour comparer l’ordre de grandeur — sans cotiser dans le vide.',
      rdvLabel: 'Vérifier avec quelqu’un — 15 min',
    };
  }

  if (meta) {
    return {
      headline: `~${x} estimés · usage ${meta.soft}.`,
      subline:
        'Avant de maxer pour maxer — on colle ça à ton plan en 15 minutes. Soft. Zéro pression de cotiser demain.',
      rdvLabel: 'Coller un usage — 15 min',
    };
  }

  return {
    headline: `T’as ~${x} de place estimée.`,
    subline: 'Choisis un usage ci-dessus — ou on le tranche ensemble en 15 minutes.',
    rdvLabel: 'Trancher l’usage — 15 min',
  };
}

export function CeliDroitsTool() {
  const location = useLocation();
  const [anneeNaissance, setAnneeNaissance] = useState('1992');
  const [dejaCotise, setDejaCotise] = useState('20000');
  const [cotisationAnnee, setCotisationAnnee] = useState('7000');
  const [usage, setUsage] = useState(null);
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_celi-droits_pdf');

  const rdvPath = buildCampagneRdvPath('celi-droits', location.search);

  const result = useMemo(() => {
    const birthYear = Math.floor(toNumber(anneeNaissance, 1992));
    const rawYear18 = birthYear + 18;
    const year18 = Math.max(
      ANNEE_MIN_CELI,
      Math.min(ANNEE_COURANTE, rawYear18)
    );
    const deja = Math.max(0, toNumber(dejaCotise));
    const prevu = Math.max(0, toNumber(cotisationAnnee));
    const plafondAnnuel = plafondPourAnnee(ANNEE_COURANTE);

    const cumules = droitsCumulesDepuis(year18);
    const placeRestante = Math.max(0, cumules - deja);
    const cotisationEffective = Math.min(prevu, placeRestante, plafondAnnuel);
    const placeApres = Math.max(0, placeRestante - cotisationEffective);
    const coupeParPlafondAnnuel =
      prevu > plafondAnnuel && placeRestante > plafondAnnuel;

    return {
      birthYear,
      rawYear18,
      year18,
      cumules,
      deja,
      placeRestante,
      cotisationEffective,
      placeApres,
      depassement: deja > cumules,
      prevu,
      plafondAnnuel,
      coupeParPlafondAnnuel,
    };
  }, [anneeNaissance, dejaCotise, cotisationAnnee]);

  const lecture = useMemo(() => buildLecture(result, usage), [result, usage]);
  const soft = useMemo(() => softCloseCopy(result, usage), [result, usage]);
  const showUsageChips = !result.depassement && result.placeRestante > 0;
  const selectedUsage = usageMeta(usage);

  const milestones = useMemo(
    () => [
      {
        id: 'annee',
        done: Boolean(String(anneeNaissance).trim()) && result.birthYear > 1900,
      },
      {
        id: 'montants',
        done:
          Boolean(String(dejaCotise).trim()) || Boolean(String(cotisationAnnee).trim()),
      },
      {
        id: 'resultat',
        done: result.cumules > 0,
      },
    ],
    [anneeNaissance, dejaCotise, cotisationAnnee, result.birthYear, result.cumules]
  );

  const doneCount = milestones.filter((m) => m.done).length;
  const total = milestones.length;

  const usedPct =
    result.cumules > 0
      ? Math.min(100, Math.round((Math.min(result.deja, result.cumules) / result.cumules) * 100))
      : 0;

  const statusDetail = result.depassement
    ? 'Écart vs l’estimation — vérifie Mon Dossier ARC, ou réserve 15 min pour comparer.'
    : doneCount < 2
      ? 'Indique ton année de naissance et ce que tu as déjà cotisé.'
      : selectedUsage
        ? `~${formatCad(result.placeRestante)} estimés · usage ${selectedUsage.soft}. Compare avec ARC — ou colle le plan en 15 min.`
        : 'Estimation prête. Choisis un usage, télécharge le PDF, ou réserve 15 min.';

  const handleUsageSelect = (id) => {
    setUsage(id);
    trackEvent('select_content', {
      content_type: 'tool_usage',
      item_id: `campagne_celi-droits_usage_${id}`,
    });
  };

  const handleDownload = () =>
    downloadPdf({
      title: 'Résumé — place restante CELI',
      filename: 'resume-celi-droits.pdf',
      sections: [
        {
          heading: 'Tes entrées',
          rows: [
            { label: 'Année de naissance', value: String(result.birthYear) },
            {
              label: 'Année des 18 ans (calculée)',
              value: `${result.rawYear18}${result.rawYear18 < ANNEE_MIN_CELI ? ` → droits depuis ${ANNEE_MIN_CELI}` : ''}`,
            },
            { label: 'Déjà cotisé à vie (cotisations)', value: formatCad(result.deja) },
            { label: 'Cotisation prévue cette année', value: formatCad(result.prevu) },
            {
              label: 'Usage choisi',
              value: selectedUsage?.label || 'Non choisi',
            },
          ],
        },
        {
          heading: 'Estimation',
          rows: [
            { label: 'Droits cumulés (estimés)', value: formatCad(result.cumules) },
            { label: 'Place restante', value: formatCad(result.placeRestante) },
            {
              label: `Plafond annuel ${ANNEE_COURANTE} (illustratif)`,
              value: formatCad(result.plafondAnnuel),
            },
            {
              label: 'Cotisation possible cette année',
              value: formatCad(result.cotisationEffective),
            },
            { label: 'Place après cotisation', value: formatCad(result.placeApres) },
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
        'Estimation illustrative seulement — plafonds approximatifs.',
        'Le solde officiel est dans Mon Dossier ARC.',
        'Cotisations à vie ≠ valeur du compte (les gains ne consomment pas de droits).',
        'Retraits : droits souvent rétablis l’année suivante — non modélisés ici.',
        'Clarifier l’usage en 15 min — soft. Pas une obligation de cotiser.',
      ],
    });

  return (
    <div data-testid="tool-celi-droits">
      <CampagneToolShell
        title="Combien de place te reste dans ton CELI ?"
        intro="Les droits inutilisés s’accumulent. Entre ton année de naissance, ce que tu as déjà cotisé (pas le solde), et ce que tu vises cette année — on estime la place. Ensuite, tu peux coller un usage."
        disclaimer={
          <>
            Illustration seulement. Plafonds approximatifs. Le vrai solde est dans{' '}
            <ArcLink />. Retraits non modélisés. Pas un conseil personnalisé.
          </>
        }
        footer={
          <p className="text-sm leading-relaxed text-prestige-taupe">{statusDetail}</p>
        }
      >
        <div className="mb-3">
          <span className="inline-flex rounded-full bg-prestige-beige/70 px-3 py-1 text-xs text-prestige-taupe">
            Sans compte · sans formulaire · estimation
          </span>
        </div>

        <div className="mb-8">
          <div className="mb-2 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                Place utilisée (estimée)
              </p>
              <p className="font-heading mt-1 text-2xl font-bold text-dark">
                {formatCad(Math.min(result.deja, result.cumules))}
                <span className="text-base font-medium text-prestige-taupe">
                  {' '}
                  / {formatCad(result.cumules)}
                </span>
              </p>
            </div>
            <p className="text-sm text-prestige-taupe">{usedPct} %</p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-prestige-beige/70">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                result.depassement
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-primary to-secondary'
              }`}
              style={{ width: `${result.depassement ? 100 : usedPct}%` }}
              role="progressbar"
              aria-valuenow={result.depassement ? 100 : usedPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Place CELI utilisée estimée : ${usedPct} %`}
            />
          </div>
          <p className="mt-2 text-xs text-prestige-taupe">
            {doneCount}/{total} étapes · reste estimé {formatCad(result.placeRestante)}.
          </p>
        </div>

        <div className="relative space-y-8 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-px before:bg-prestige-beige">
          <Block
            step={1}
            title="Depuis quand tu accumules"
            subtitle="On part de ton année de naissance — les droits CELI commencent l’année de tes 18 ans (ou 2009 si tu étais déjà majeur)."
            done={milestones[0].done}
          >
            <Field
              id="celi-droits-naissance"
              label="Année de naissance"
              hint={`Ex. 1992 → 18 ans en 2010. Si tu avais 18 ans avant ${ANNEE_MIN_CELI}, les droits partent de ${ANNEE_MIN_CELI}.`}
            >
              <input
                id="celi-droits-naissance"
                type="number"
                inputMode="numeric"
                min={1940}
                max={ANNEE_COURANTE - 18}
                step="1"
                className={inputClass}
                value={anneeNaissance}
                onChange={(e) => setAnneeNaissance(e.target.value)}
                placeholder="1992"
              />
            </Field>
            <div className="flex items-end">
              <div className="w-full rounded-2xl bg-gradient-to-br from-primary/[0.04] to-secondary/[0.06] px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-secondary">
                  Droits cumulés (estimés)
                </p>
                <p className="font-heading mt-1 text-xl font-bold tabular-nums text-dark">
                  {formatCad(result.cumules)}
                </p>
                <p className="mt-0.5 text-xs text-prestige-taupe">
                  18 ans en {result.rawYear18}
                  {result.rawYear18 < ANNEE_MIN_CELI ? ` → depuis ${ANNEE_MIN_CELI}` : ''} · jusqu’à{' '}
                  {ANNEE_COURANTE}
                </p>
              </div>
            </div>
          </Block>

          <Block
            step={2}
            title="Ce que tu as déjà mis — et ce que tu vises"
            subtitle="Cotisations à vie, pas la valeur du compte (les gains ne consomment pas de droits)."
            done={milestones[1].done}
          >
            <Field
              id="celi-droits-deja"
              label="Déjà cotisé (à vie)"
              hint="Somme des cotisations seulement — pas le solde actuel avec rendement."
            >
              <MoneyInput
                id="celi-droits-deja"
                value={dejaCotise}
                onChange={setDejaCotise}
                placeholder="20000"
              />
            </Field>
            <Field
              id="celi-droits-prevu"
              label="Cotisation prévue (cette année)"
              hint={`Plafond ${ANNEE_COURANTE} illustratif : ${formatCad(PLAFOND_ANNUEL)}. Au-delà, on plafonne.`}
            >
              <MoneyInput
                id="celi-droits-prevu"
                value={cotisationAnnee}
                onChange={setCotisationAnnee}
                placeholder="7000"
              />
            </Field>
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
              {milestones[2].done ? <Check className="h-4 w-4" strokeWidth={2.5} /> : 3}
            </div>
            <div className="mb-3">
              <h3 className="font-heading text-base font-semibold text-dark">
                Ce que ça veut dire
              </h3>
              <p className="mt-0.5 text-sm text-prestige-taupe">
                Place restante, cotisation possible, et lecture simple — pas juste des chiffres.
              </p>
            </div>

            <div
              className={`rounded-2xl px-5 py-5 ${
                lecture.tone === 'warn'
                  ? 'bg-gradient-to-br from-amber-50 to-white shadow-[inset_0_0_0_1px_rgba(245,158,11,0.25)]'
                  : 'bg-gradient-to-br from-primary/[0.04] to-secondary/[0.06]'
              }`}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-dark/[0.06] bg-white/60 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-prestige-taupe">
                    Plafond {ANNEE_COURANTE}
                  </p>
                  <p className="font-heading mt-1 text-lg font-semibold tabular-nums text-dark sm:text-xl">
                    {formatCad(result.plafondAnnuel)}
                  </p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-primary/[0.06] to-secondary/[0.08] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                    {result.depassement ? 'À vérifier' : 'Place restante estimée'}
                  </p>
                  <p
                    className={`font-heading mt-1 text-3xl font-bold tracking-tight tabular-nums sm:text-4xl ${
                      lecture.tone === 'warn' ? 'text-amber-700' : 'text-dark'
                    }`}
                  >
                    {formatCad(result.placeRestante)}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-prestige-taupe">{lecture.detail}</p>

              {showUsageChips ? (
                <div className="mt-4 border-t border-dark/[0.06] pt-4">
                  <p className="text-sm font-medium text-dark">À quoi servirait cette place ?</p>
                  <p className="mt-0.5 text-xs text-prestige-taupe">
                    Une intention, pas un engagement à cotiser demain.
                  </p>
                  <div
                    className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap"
                    role="radiogroup"
                    aria-label="Usage de la place CELI"
                  >
                    {USAGE_OPTIONS.map((opt) => {
                      const selected = usage === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => handleUsageSelect(opt.id)}
                          className={`min-h-11 flex-1 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
                            selected
                              ? 'border-primary bg-primary text-white'
                              : 'border-prestige-beige bg-white text-dark hover:border-primary/40'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
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
                          lecture.tone === 'warn' ? 'bg-amber-500' : 'bg-primary'
                        }`}
                        aria-hidden
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ResultCard
                label="Cotisation possible cette année"
                value={formatCad(result.cotisationEffective)}
                detail={
                  result.coupeParPlafondAnnuel
                    ? `Plafonnée à ${formatCad(result.plafondAnnuel)} (plafond annuel illustratif).`
                    : `Dans la limite du plafond ${ANNEE_COURANTE} et de ta place restante.`
                }
              />
              <ResultCard
                label="Place après cotisation"
                value={formatCad(result.placeApres)}
                detail={
                  result.placeApres <= 0
                    ? 'Plus de marge estimée après cette cotisation.'
                    : 'Ce qui resterait encore disponible ensuite (estimé).'
                }
                tone={result.placeApres <= 0 ? 'warn' : 'default'}
              />
            </div>

            <div className="mt-4">
              <ToolSoftClose
                headline={soft.headline}
                subline={soft.subline}
                rdvPath={rdvPath}
                rdvLabel={soft.rdvLabel}
                onRdvClick={() => trackRendezVousClick('campagne_celi-droits_rdv_outil')}
                onPdf={handleDownload}
                pdfBusy={busy}
                pdfLabel="Garder mon résumé PDF"
              />
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

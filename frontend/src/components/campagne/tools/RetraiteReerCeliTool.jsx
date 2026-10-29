import { useState } from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { formatCad } from '../../tools/format';
import { CampagneToolShell, ToolDownloadPdf } from '../CampagneToolShell';

const TRANCHE_OPTIONS = [
  { value: 'faible', label: 'Faible', hint: '< 30 %' },
  { value: 'moyenne', label: 'Moyenne', hint: '30–40 %' },
  { value: 'elevee', label: 'Élevée', hint: '> 40 %' },
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

const TRANCHE_PDF = [
  { value: 'faible', label: 'Faible (< 30 %)' },
  { value: 'moyenne', label: 'Moyenne (30–40 %)' },
  { value: 'elevee', label: 'Élevée (> 40 %)' },
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

const inputClass =
  'w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-sm text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] transition focus:outline-none focus:shadow-[inset_0_0_0_2px_rgba(6,77,217,0.45)]';

const labelClass = 'mb-1.5 block text-xs font-medium text-prestige-taupe';

function optionLabel(options, value) {
  return options.find((o) => o.value === value)?.label || value;
}

function parseMonthly(raw) {
  const n = Number(raw);
  if (raw === '' || Number.isNaN(n) || n < 0) return 0;
  return n;
}

/**
 * Règles éducatives simples — pas un conseil personnalisé.
 * Priorité : liquidité / horizon court → CELI ; tranche élevée + horizon long → REER ;
 * sinon mixte avec répartition illustrative.
 */
function buildSuggestion({ tranche, horizon, liquidite, monthly }) {
  const cotisationHint =
    monthly > 0
      ? `Avec ~${Math.round(monthly)} $ / mois, l’ordre guide où part le prochain dollar.`
      : 'Même un petit montant régulier aide : l’ordre guide où part le prochain dollar.';

  if (horizon === 'court' || liquidite === 'oui') {
    const raisons = [
      liquidite === 'oui'
        ? 'Tu veux pouvoir ressortir l’argent sans te faire mal : le CELI est souvent plus souple pour ça.'
        : 'Horizon court : tu risques d’avoir besoin de cet argent avant la retraite — le CELI colle souvent mieux.',
      'Le REER, c’est puissant, mais un retrait trop tôt peut coûter cher en impôts.',
      cotisationHint,
    ];
    return {
      key: 'celi',
      value: 'CELI d’abord',
      short: 'CELI',
      tone: 'ok',
      split: { celi: 100, reer: 0 },
      raisons,
    };
  }

  if (tranche === 'elevee' && horizon === 'long') {
    return {
      key: 'reer',
      value: 'REER d’abord',
      short: 'REER',
      tone: 'ok',
      split: { celi: 0, reer: 100 },
      raisons: [
        'Tranche élevée + horizon long : le report d’impôt du REER a souvent plus de sens.',
        'Tu laisses le temps au compte de travailler avant d’avoir besoin de l’argent.',
        cotisationHint,
      ],
    };
  }

  // Mixte — répartition illustrative selon tranche / horizon
  let split = { celi: 50, reer: 50 };
  let leanLabel = '50 / 50';
  let leanDetail =
    'Un peu de CELI pour la flexibilité, un peu de REER pour le levier fiscal.';

  if (tranche === 'faible') {
    split = { celi: 70, reer: 30 };
    leanLabel = '≈ 70 % CELI / 30 % REER';
    leanDetail =
      'Tranche plus basse : forcer le REER « parce que tout le monde le fait » n’est pas toujours le meilleur réflexe.';
  } else if (tranche === 'elevee') {
    split = { celi: 40, reer: 60 };
    leanLabel = '≈ 60 % REER / 40 % CELI';
    leanDetail =
      'Tranche élevée, mais horizon pas encore très long : le REER pèse un peu plus, le CELI garde de la marge.';
  } else if (horizon === 'long') {
    split = { celi: 40, reer: 60 };
    leanLabel = '≈ 60 % REER / 40 % CELI';
    leanDetail =
      'Horizon long + tranche moyenne : un peu plus de REER, sans tout y mettre.';
  }

  return {
    key: 'mixte',
    value: `Mixte — ${leanLabel}`,
    short: 'Mixte',
    tone: 'warn',
    split,
    raisons: [
      'Pas de gagnant automatique : ça dépend de tes projets, de ton revenu demain, et de ce que t’as déjà.',
      leanDetail,
      cotisationHint,
    ],
  };
}

function Field({ id, label, hint, children, className = '' }) {
  return (
    <div className={`min-w-0 ${className}`}>
      {id ? (
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
      ) : (
        <p className={labelClass}>{label}</p>
      )}
      {children}
      {hint ? <p className="mt-1.5 text-xs leading-relaxed text-prestige-taupe/80">{hint}</p> : null}
    </div>
  );
}

function ChoiceGroup({ name, options, value, onChange, columns = 3 }) {
  const colClass = columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3';

  return (
    <div className={`grid gap-2 ${colClass}`} role="radiogroup" aria-label={name}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={`rounded-xl px-3 py-2.5 text-left transition ${
              selected
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] hover:shadow-[inset_0_0_0_1px_rgba(6,77,217,0.35)]'
            }`}
          >
            <span className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-semibold leading-tight">{opt.label}</span>
              {opt.hint ? (
                <span
                  className={`shrink-0 text-[11px] leading-tight ${
                    selected ? 'text-white/75' : 'text-prestige-taupe'
                  }`}
                >
                  {opt.hint}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
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
      {children}
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
      <p className="font-heading mt-1.5 text-xl font-bold text-dark sm:text-2xl">{value}</p>
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
            title={`CELI ${celiPct} %`}
          />
        ) : null}
        {reerPct > 0 ? (
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${reerPct}%` }}
            title={`REER ${reerPct} %`}
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

export function RetraiteReerCeliTool() {
  const [tranche, setTranche] = useState('moyenne');
  const [horizon, setHorizon] = useState('moyen');
  const [liquidite, setLiquidite] = useState('non');
  const [cotisationMensuelle, setCotisationMensuelle] = useState('500');
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_retraite-reer-celi_pdf');

  const monthly = parseMonthly(cotisationMensuelle);
  const suggestion = buildSuggestion({
    tranche,
    horizon,
    liquidite,
    monthly,
  });

  const celiAmt = monthly > 0 ? Math.round((monthly * suggestion.split.celi) / 100) : 0;
  const reerAmt = monthly > 0 ? Math.max(0, Math.round(monthly) - celiAmt) : 0;

  const cotisationDisplay =
    monthly >= 0 && String(cotisationMensuelle).trim() !== ''
      ? formatCad(monthly)
      : 'Non renseigne';

  const isClear = suggestion.tone === 'ok';
  const answered = Boolean(tranche && horizon && liquidite);

  const statusDetail = isClear
    ? 'Ordre illustratif — télécharge le PDF et garde-le sous la main.'
    : 'Répartition illustrative — le PDF sert de base à clarifier en 15 minutes.';

  const splitDetail =
    monthly > 0
      ? `Sur ${formatCad(monthly)} / mois → CELI ${formatCad(celiAmt)}, REER ${formatCad(reerAmt)}.`
      : 'Indique un montant mensuel pour voir le partage en dollars.';

  const handleDownload = () =>
    downloadPdf({
      title: 'Resume — REER ou CELI en premier',
      filename: 'resume-retraite-reer-celi.pdf',
      sections: [
        {
          heading: 'Tes reponses',
          rows: [
            {
              label: "Tranche d'imposition",
              value: optionLabel(TRANCHE_PDF, tranche),
            },
            {
              label: 'Horizon',
              value: optionLabel(HORIZON_PDF, horizon),
            },
            {
              label: 'Besoin de liquidite',
              value: optionLabel(LIQUIDITE_PDF, liquidite),
            },
            {
              label: 'Cotisation mensuelle possible',
              value: cotisationDisplay,
            },
          ],
        },
        {
          heading: 'Suggestion (illustration)',
          rows: [
            { label: 'Ordre suggere', value: suggestion.value },
            {
              label: 'Repartition illustrative',
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
        'Illustration educative seulement — pas un conseil personnalise.',
        'Valide l’ordre avec ta vraie situation (projets, revenu, comptes deja ouverts).',
      ],
    });

  return (
    <div data-testid="tool-retraite-reer-celi">
      <CampagneToolShell
        title="REER ou CELI en premier ?"
        intro="Quatre réponses. On te propose un ordre illustratif — et un partage du prochain dollar."
        disclaimer="Illustration éducative seulement. Pas un conseil personnalisé."
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-prestige-taupe">{statusDetail}</p>
            <ToolDownloadPdf
              busy={busy}
              onClick={handleDownload}
              label="Télécharger mon résumé PDF"
            />
          </div>
        }
      >
        {/* Snapshot */}
        <div className="mb-8">
          <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                Ordre illustratif
              </p>
              <p className="font-heading mt-1 text-2xl font-bold tracking-tight text-dark">
                {suggestion.short}
              </p>
            </div>
            <p className="max-w-xs text-right text-sm text-prestige-taupe">
              {suggestion.value}
            </p>
          </div>
          <SplitBar celiPct={suggestion.split.celi} reerPct={suggestion.split.reer} />
          {monthly > 0 ? (
            <p className="mt-2 text-xs text-prestige-taupe">{splitDetail}</p>
          ) : null}
        </div>

        <div className="relative space-y-8 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-px before:bg-prestige-beige">
          <Block
            step={1}
            title="Tes réponses"
            subtitle="Tranche, horizon, liquidité, et ce que tu peux mettre de côté."
            done={answered}
          >
            <div className="space-y-5">
              <Field
                label="Ta tranche d’impôt est plutôt…"
                hint="Ordre de grandeur — pas besoin du chiffre exact."
              >
                <ChoiceGroup
                  name="Tranche d’imposition"
                  options={TRANCHE_OPTIONS}
                  value={tranche}
                  onChange={setTranche}
                />
              </Field>

              <Field
                label="Tu vas avoir besoin de cet argent…"
                hint="Avant la retraite, ou pour un projet."
              >
                <ChoiceGroup
                  name="Horizon"
                  options={HORIZON_OPTIONS}
                  value={horizon}
                  onChange={setHorizon}
                />
              </Field>

              <Field label="Tu veux pouvoir le ressortir facilement ?">
                <ChoiceGroup
                  name="Liquidité"
                  options={LIQUIDITE_OPTIONS}
                  value={liquidite}
                  onChange={setLiquidite}
                  columns={2}
                />
              </Field>

              <Field
                id="retraite-cotisation"
                label="Combien tu pourrais mettre de côté par mois ?"
                hint="Optionnel — sert à illustrer le partage en dollars."
              >
                <div className="relative max-w-xs">
                  <input
                    id="retraite-cotisation"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={25}
                    className={`${inputClass} pr-8`}
                    value={cotisationMensuelle}
                    onChange={(e) => setCotisationMensuelle(e.target.value)}
                    placeholder="500"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-prestige-taupe">
                    $
                  </span>
                </div>
              </Field>
            </div>
          </Block>

          <Block
            step={2}
            title="Ce que ça veut dire"
            subtitle="Ordre, partage illustratif, et pourquoi."
            done={answered}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <ResultCard
                label="Ordre suggéré"
                value={suggestion.value}
                detail="À valider avec ta vraie situation — projets, revenu, comptes déjà ouverts."
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
            </div>

            <ul className="mt-4 space-y-2.5">
              {suggestion.raisons.map((raison) => (
                <li key={raison} className="flex gap-2.5 text-sm leading-relaxed text-prestige-taupe">
                  <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                      isClear ? 'bg-primary' : 'bg-prestige-taupe/50'
                    }`}
                    aria-hidden
                  />
                  <span>{raison}</span>
                </li>
              ))}
            </ul>
          </Block>
        </div>
      </CampagneToolShell>
    </div>
  );
}

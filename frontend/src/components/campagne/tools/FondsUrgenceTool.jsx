import { useMemo, useState } from 'react';
import { Check, AlertTriangle, LifeBuoy } from 'lucide-react';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { formatCad } from '../../tools/format';
import { CampagneToolShell, ToolDownloadPdf } from '../CampagneToolShell';

const MOIS_OPTIONS = [
  { value: '3', label: '3 mois — revenu stable' },
  { value: '6', label: '6 mois — courant' },
  { value: '9', label: '9 mois — revenu moins stable' },
  { value: '12', label: '12 mois — autonome / précaire' },
];

/** Points fixes — utiles même sans dossier. */
const A_RETENIR = [
  'Fonds d’urgence = argent accessible si tu perds ton job ou qu’un gros imprévu arrive.',
  'Cible typique : 3 à 6 mois de dépenses essentielles (plus si le revenu est fragile).',
  'Garde-le liquide (épargne, CPG rachetable, CELI en liquidités) — pas dans des placements qui peuvent baisser.',
  'Une fois le filet solide, le surplus peut aller vers dettes chères, CELI ou REER — selon ta situation.',
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

function buildLecture({ cible, ecart, manquant, surplus, moisPourCombler, epargneParMois, rythme12, mois }) {
  if (cible <= 0) {
    return {
      headline: 'Il manque encore un chiffre',
      detail: 'Indique tes dépenses essentielles et combien de mois tu vises — on calcule la cible.',
      points: [],
      tone: 'default',
    };
  }

  if (surplus > 0) {
    return {
      headline: 'Filet déjà atteint',
      detail: `Tu as environ ${formatCad(surplus)} de plus que la cible illustrée. Le prochain sujet, c’est souvent où oriente le surplus — pas d’ajouter encore au coussin.`,
      points: [
        `Cible : ${formatCad(cible)} (${mois} mois de dépenses).`,
        'Garde ce coussin accessible — ce n’est pas de l’argent « long terme ».',
        'Surplus : dettes chères, CELI, REER… selon ta situation (à clarifier).',
      ],
      tone: 'ok',
    };
  }

  const points = [
    `Il te manque ${formatCad(manquant)} pour atteindre ${formatCad(cible)}.`,
  ];

  if (moisPourCombler == null) {
    points.push('Avec 0 $ ajouté par mois, l’écart ne bouge pas — monte un peu pour voir un délai.');
  } else if (moisPourCombler === 0) {
    points.push('Rien à combler au rythme actuel.');
  } else {
    points.push(
      `Au rythme de ${formatCad(epargneParMois)} / mois : environ ${formatDureeMois(moisPourCombler)}.`
    );
    if (moisPourCombler > 12 && rythme12 > 0) {
      points.push(
        `Pour y arriver en ~12 mois : viser environ ${formatCad(rythme12)} / mois (illustration).`
      );
    }
  }

  points.push(
    'Sépare ce coussin du reste : compte accessible, pas ton REER ni un portefeuille volatil.'
  );

  const long = moisPourCombler != null && moisPourCombler > 24;
  return {
    headline: long ? 'Écart encore large — un palier d’abord' : 'Voici ton écart',
    detail: long
      ? 'Pas besoin de tout remplir d’un coup. Un premier mois de dépenses de côté réduit déjà le stress ; tu montes ensuite.'
      : 'Ajuste les montants — le délai et le rythme se mettent à jour tout de suite.',
    points,
    tone: 'warn',
  };
}

export function FondsUrgenceTool() {
  const [depensesMensuelles, setDepensesMensuelles] = useState('3500');
  const [moisCibles, setMoisCibles] = useState('6');
  const [dejaMisDeCote, setDejaMisDeCote] = useState('5000');
  const [epargneMensuelle, setEpargneMensuelle] = useState('300');
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_fonds-urgence_pdf');

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
        ecart,
        manquant,
        surplus,
        moisPourCombler,
        epargneParMois,
        rythme12,
        mois,
      }),
    [cible, ecart, manquant, surplus, moisPourCombler, epargneParMois, rythme12, mois]
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
    ? 'Indique tes dépenses essentielles et combien de mois tu vises.'
    : atteint
      ? 'Filet atteint dans ce scénario. Télécharge le PDF pour le garder.'
      : moisPourCombler == null
        ? 'Ajoute un montant mensuel pour estimer le délai — puis télécharge le PDF.'
        : 'Ajuste, regarde le délai, puis télécharge ton PDF.';

  const dureeLabel = formatDureeMois(moisPourCombler);
  const moisPdfValue =
    moisPourCombler === null
      ? 'Non estimable (epargne mensuelle = 0)'
      : dureeLabel || String(moisPourCombler);

  const handleDownload = () =>
    downloadPdf({
      title: "Resume — fonds d'urgence",
      filename: 'resume-fonds-urgence.pdf',
      sections: [
        {
          heading: 'Tes entrees',
          rows: [
            {
              label: 'Depenses essentielles / mois',
              value: formatCad(depenses),
            },
            { label: 'Mois a couvrir', value: `${mois} mois` },
            { label: 'Deja de cote', value: formatCad(epargneActuelle) },
            {
              label: 'Ajout possible / mois',
              value: formatCad(epargneParMois),
            },
          ],
        },
        {
          heading: 'Resultats',
          rows: [
            { label: 'Montant a viser', value: formatCad(cible) },
            {
              label: atteint ? 'Surplus' : 'Il te manque',
              value: formatCad(atteint ? surplus : manquant),
            },
            { label: 'Progression', value: `${pctVersCible} %` },
            { label: 'Delai au rythme actuel', value: moisPdfValue },
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
          heading: 'A retenir',
          rows: A_RETENIR.map((point, i) => ({
            label: `${i + 1}`,
            value: point,
          })),
        },
      ],
      notes: [
        "Fonds d'urgence = argent accessible si tu perds ton job ou un gros imprevu.",
        'Illustration educative seulement — pas un plan sur mesure.',
      ],
    });

  return (
    <div data-testid="tool-fonds-urgence">
      <CampagneToolShell
        title="Combien mettre de côté ?"
        intro="Un fonds d’urgence, c’est de l’argent accessible si tu perds ton job ou qu’un gros imprévu arrive. On calcule la cible, l’écart, et en combien de temps tu peux y arriver."
        disclaimer="Illustration éducative seulement — pas un plan sur mesure. L’argent doit rester accessible : pas un conseil de placement."
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
                ? ' · filet atteint dans ce scénario.'
                : ` · il manque ${formatCad(manquant)}.`
              : '.'}
          </p>
        </div>

        <div className="relative space-y-8 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-px before:bg-prestige-beige">
          <Block
            step={1}
            title="Combien viser"
            subtitle="Dépenses essentielles × nombre de mois à couvrir."
            done={milestones[0].done}
          >
            <Field
              id="fu-depenses"
              label="Dépenses essentielles / mois"
              hint="Loyer, bouffe, transport, assurances, minimums de dettes — pas les sorties."
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
              label="Mois à couvrir"
              hint="3–6 mois si le revenu est stable ; plus si autonome, contractuel ou un seul salaire."
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
                  Montant à viser
                </p>
                <p className="font-heading mt-1 text-xl font-bold tabular-nums text-dark">
                  {formatCad(cible)}
                </p>
                <p className="mt-0.5 text-xs text-prestige-taupe">
                  {mois} mois × {formatCad(depenses)}
                </p>
              </div>
            </div>
          </Block>

          <Block
            step={2}
            title="Où tu en es"
            subtitle="Ce que t’as déjà d’accessible, et ce que tu peux ajouter chaque mois."
            done={milestones[1].done}
          >
            <Field
              id="fu-deja"
              label="Déjà de côté (accessible)"
              hint="Compte d’épargne, liquidités — pas ton REER ni un portefeuille long terme."
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
                Écart, délai, et quoi retenir — sans jargon.
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
                {atteint ? 'de surplus vs la cible' : 'à combler'}
              </p>
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
                label="Délai au rythme actuel"
                value={dureeLabel ?? '—'}
                detail={
                  moisPourCombler === null
                    ? 'Monte l’ajout mensuel pour voir un délai.'
                    : moisPourCombler === 0
                      ? 'Rien à combler.'
                      : `À ${formatCad(epargneParMois)} / mois.`
                }
                tone={atteint ? 'ok' : moisPourCombler == null || moisPourCombler > 24 ? 'warn' : 'default'}
              />
              <Metric
                label={atteint ? 'Filet' : 'Pour y arriver en ~12 mois'}
                value={atteint ? 'Atteint' : rythme12 > 0 ? formatCad(rythme12) : '—'}
                detail={
                  atteint
                    ? 'Cible illustrée déjà couverte.'
                    : rythme12 > 0
                      ? 'Par mois, illustration seulement.'
                      : 'Complète la cible pour voir un rythme.'
                }
                tone={atteint ? 'ok' : 'default'}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-prestige-beige/35 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">À retenir</p>
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

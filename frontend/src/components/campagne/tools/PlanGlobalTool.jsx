import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, FileText, ListOrdered } from 'lucide-react';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { trackRendezVousClick } from '../../../lib/analytics';
import { buildCampagneRdvPath } from '../../../data/campagneAdsLandings';
import {
  CampagneToolShell,
  ToolDownloadPdf,
  ToolSoftClose,
} from '../CampagneToolShell';

/** Coche → ordre d’attaque (urgence d’abord). Labels sans jargon. */
const ITEMS = [
  {
    id: 'fondsUrgenceFaible',
    label: 'J’ai peu ou pas d’argent de côté pour les imprévus',
    hint: 'Sans coussin, un imprévu force souvent la carte de crédit.',
    order: 'Mettre de l’argent de côté',
    why: 'Filet d’abord — sinon le reste du plan casse au premier choc.',
  },
  {
    id: 'dettesCheres',
    label: 'J’ai des dettes qui coûtent cher (cartes, etc.)',
    hint: 'Les intérêts élevés mangent l’épargne avant qu’elle serve.',
    order: 'Baisser les dettes qui coûtent cher',
    why: 'Chaque dollar d’intérêt évité bat souvent un placement « moyen ».',
  },
  {
    id: 'hypoSansVie',
    label: 'J’ai une hypothèque ou des dettes, sans vraiment d’assurance vie',
    hint: 'Si le revenu disparaît, qui paie la maison ?',
    order: 'Protéger la famille / l’hypothèque',
    why: 'Dettes + proches qui comptent sur toi = risque de transmission.',
  },
  {
    id: 'revenuNonProtege',
    label: 'Si je peux plus travailler, mon salaire n’est pas protégé',
    hint: 'Le salaire est souvent le plus gros actif — et le moins assuré.',
    order: 'Protéger mon salaire',
    why: 'Sans revenu, épargne et dettes basculent vite.',
  },
  {
    id: 'epargneSansOrdre',
    label: 'J’épargne sans savoir où mettre l’argent en premier',
    hint: 'REER, CELI, cash : l’ordre change le résultat net.',
    order: 'Épargner dans le bon ordre',
    why: 'Des produits ouverts ≠ une feuille de route.',
  },
  {
    id: 'projetCourt',
    label: 'J’ai un gros projet dans moins de 5 ans',
    hint: 'Horizon court : liquidité avant de maximiser le rendement.',
    order: 'Préparer mon projet bientôt',
    why: 'Un projet proche change le risque qu’on peut se permettre.',
  },
  {
    id: 'successionFloue',
    label: 'Je ne sais pas clairement qui reçoit quoi si je meurs',
    hint: 'Bénéficiaires et liquidités : souvent oubliés jusqu’au jour J.',
    order: 'Clarifier qui reçoit quoi',
    why: 'Clarté pour la famille — avant le notaire et les délais.',
  },
];

/** urgence → dettes chères → salaire → vie/hypothèque → épargne → projet → succession */
const PRIORITY_IDS = [
  'fondsUrgenceFaible',
  'dettesCheres',
  'revenuNonProtege',
  'hypoSansVie',
  'epargneSansOrdre',
  'projetCourt',
  'successionFloue',
];

/** Paliers ads Ad2 — ordre dans un tier = PRIORITY_IDS */
const TIER_BY_ID = {
  fondsUrgenceFaible: 'urgent',
  dettesCheres: 'urgent',
  revenuNonProtege: 'important',
  hypoSansVie: 'important',
  epargneSansOrdre: 'later',
  projetCourt: 'later',
  successionFloue: 'later',
};

const TIER_SECTIONS = [
  {
    id: 'urgent',
    title: 'Urgent',
    aide: 'À traiter avant d’optimiser le reste',
  },
  {
    id: 'important',
    title: 'Important',
    aide: 'Protection et risques qui pèsent lourd',
  },
  {
    id: 'later',
    title: 'Plus tard',
    aide: 'Utile — sans culpabilité de ne pas tout faire maintenant',
  },
];

const BY_ID = Object.fromEntries(ITEMS.map((item) => [item.id, item]));
const INITIAL_CHECKED = Object.fromEntries(ITEMS.map((item) => [item.id, false]));

const inputClass =
  'w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-sm text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] transition focus:outline-none focus:shadow-[inset_0_0_0_2px_rgba(6,77,217,0.45)]';

const labelClass = 'mb-1.5 block text-xs font-medium text-prestige-taupe';

function statusDetail(count) {
  if (count === 0) {
    return 'Coche ce qui est vrai chez toi — l’ordre d’attaque se construit en bas.';
  }
  if (count === 1) {
    return 'Ton n°1 est clair. 15 min pour l’ancrer — ou PDF pour le garder.';
  }
  if (count <= 3) {
    return 'Quelques fronts ouverts. L’ordre évite de tout attaquer en même temps.';
  }
  return 'Plusieurs priorités. Ton n°1 d’abord — PDF pour garder l’ordre, 15 min pour coller ça à ta vie.';
}

function SoftCheckItem({ id, checked, onChange, label, hint }) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-3 rounded-2xl px-4 py-3.5 transition-colors ${
        checked
          ? 'bg-gradient-to-br from-primary/[0.06] to-secondary/[0.08]'
          : 'bg-white shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] hover:shadow-[inset_0_0_0_1px_rgba(6,77,217,0.25)]'
      }`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 rounded border-input text-primary focus:ring-primary"
      />
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-dark">{label}</span>
        {hint ? (
          <span className="mt-0.5 block text-xs leading-relaxed text-prestige-taupe">{hint}</span>
        ) : null}
      </span>
    </label>
  );
}

export function PlanGlobalTool() {
  const location = useLocation();
  const [checked, setChecked] = useState(INITIAL_CHECKED);
  const [notesLibres, setNotesLibres] = useState('');
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_plan-global_pdf');

  const selectedOrdered = useMemo(
    () => PRIORITY_IDS.filter((id) => checked[id]).map((id) => BY_ID[id]),
    [checked]
  );

  const doneCount = selectedOrdered.length;
  const total = ITEMS.length;
  const barWidth = Math.round((doneCount / total) * 100);
  const detail = statusDetail(doneCount);
  const first = selectedOrdered[0] || null;
  const rest = selectedOrdered.slice(1);
  const restByTier = useMemo(() => {
    const grouped = { urgent: [], important: [], later: [] };
    selectedOrdered.slice(1).forEach((item) => {
      const tier = TIER_BY_ID[item.id];
      if (tier && grouped[tier]) grouped[tier].push(item);
    });
    return grouped;
  }, [selectedOrdered]);
  const rdvPath = buildCampagneRdvPath('plan-global', location.search);
  const counterLabel =
    doneCount === 0
      ? `0 / ${total}`
      : `${doneCount} cochée${doneCount > 1 ? 's' : ''} · Ordre prêt`;
  const softHeadline =
    doneCount === 1
      ? `Un seul front clair : ${first.order}.`
      : `Ton n°1 : ${first?.order}.`;
  const softSubline =
    doneCount === 1
      ? '15 min pour le coller à ta situation — ou garde le PDF pour plus tard.'
      : '15 minutes pour l’ancrer à ta vraie vie — soft, zéro pitch. Zéro pile de produits.';

  const toggle = (id) => (value) => {
    setChecked((prev) => ({ ...prev, [id]: value }));
  };

  const handleDownload = () =>
    downloadPdf({
      title: 'Résumé — ordre d’attaque',
      filename: 'resume-plan-global.pdf',
      sections: [
        {
          heading: 'Chez toi (coché)',
          rows: ITEMS.map((item) => ({
            label: item.label,
            value: checked[item.id] ? 'Oui' : 'Non',
          })),
        },
        {
          heading: 'Ordre d’attaque',
          rows:
            selectedOrdered.length === 0
              ? [{ label: 'Ordre', value: 'Rien de coché' }]
              : selectedOrdered.map((item, i) => ({
                  label: `${i + 1}.`,
                  value: `${item.order} — ${item.why}`,
                })),
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
        doneCount === 0
          ? 'Coche ce qui est vrai chez toi pour voir un ordre.'
          : `Ordre : ${selectedOrdered.map((item) => item.order).join(' → ')}.`,
        'Illustration éducative seulement — pas un conseil personnalisé. Des produits ouverts ne font pas un plan.',
      ],
    });

  const handleRdvOutil = () => trackRendezVousClick('campagne_plan-global_rdv_outil');
  const handleRdvFooter = () => trackRendezVousClick('campagne_plan-global_rdv_outil_footer');

  return (
    <div data-testid="tool-plan-global">
      <CampagneToolShell
        title="Ton ordre d’attaque"
        intro="Coche ce qui est vrai chez toi. On range urgent → important → plus tard. Brouillon éducatif, pas un plan sur mesure."
        disclaimer="Illustration éducative seulement — pas un conseil personnalisé. Des produits côte à côte ≠ une feuille de route."
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-prestige-taupe">{detail}</p>
            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              {doneCount > 0 ? (
                <Link
                  to={rdvPath}
                  onClick={handleRdvFooter}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-dark sm:w-auto"
                  data-testid="campagne-plan-global-rdv-footer"
                >
                  Ancrer mon n°1 — 15 min
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
              <ToolDownloadPdf
                busy={busy}
                onClick={handleDownload}
                label="Télécharger mon ordre PDF"
                variant="ghost"
              />
            </div>
          </div>
        }
      >
        <div className="mb-8">
          <div className="mb-2 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                Situations cochées
              </p>
              <p className="font-heading mt-1 text-2xl font-bold text-dark">
                {doneCount}
                <span className="text-base font-medium text-prestige-taupe"> / {total}</span>
              </p>
            </div>
            <p className="text-sm font-medium text-dark">{counterLabel}</p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-prestige-beige/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
              style={{ width: `${barWidth}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-prestige-taupe">Urgent d’abord — pas un score</p>
        </div>

        <div className="space-y-2" aria-label="Situations à cocher">
          {ITEMS.map((item) => (
            <SoftCheckItem
              key={item.id}
              id={`plan-global-${item.id}`}
              checked={Boolean(checked[item.id])}
              onChange={toggle(item.id)}
              label={item.label}
              hint={item.hint}
            />
          ))}
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-start gap-3">
            <div
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-secondary shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)]"
              aria-hidden
            >
              <ListOrdered className="h-3.5 w-3.5" strokeWidth={2.25} />
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold text-dark">
                Résultat — par où commencer
              </h3>
              <p className="mt-0.5 text-sm text-prestige-taupe">
                {doneCount === 0
                  ? 'Rien encore — coche au moins une case.'
                  : 'Urgent d’abord. Le reste ensuite — pas tout en même temps.'}
              </p>
            </div>
          </div>

          {doneCount === 0 ? (
            <div className="rounded-2xl bg-prestige-beige/30 px-4 py-6 text-center">
              <p className="text-sm text-prestige-taupe">
                Coche ce qui te parle. L’ordre apparaît ici, n°1 en premier.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.04] to-secondary/[0.05] px-4 py-3.5">
                <p className="text-xs font-medium uppercase tracking-wide text-prestige-taupe">
                  Commence ici
                </p>
                <p className="font-heading mt-1.5 text-xl font-bold leading-snug text-dark sm:text-2xl">
                  1. {first.order}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-prestige-taupe">{first.why}</p>
              </div>

              <ToolSoftClose
                headline={softHeadline}
                subline={softSubline}
                rdvPath={rdvPath}
                rdvLabel="Ancrer mon n°1 — 15 min"
                onRdvClick={handleRdvOutil}
                onPdf={handleDownload}
                pdfBusy={busy}
                pdfLabel="Télécharger mon ordre PDF"
              />

              {rest.length > 0 ? (
                <div className="space-y-4" data-testid="plan-global-buckets">
                  {TIER_SECTIONS.map((section) => {
                    const items = restByTier[section.id];
                    if (!items.length) return null;
                    return (
                      <section key={section.id} aria-labelledby={`plan-global-tier-${section.id}`}>
                        <div className="mb-2">
                          <p
                            id={`plan-global-tier-${section.id}`}
                            className="text-xs font-semibold uppercase tracking-wide text-secondary"
                          >
                            {section.title}
                          </p>
                          <p className="mt-0.5 text-xs leading-relaxed text-prestige-taupe">
                            {section.aide}
                          </p>
                        </div>
                        <ul className="space-y-2">
                          {items.map((item) => {
                            const rank = selectedOrdered.findIndex((row) => row.id === item.id) + 1;
                            return (
                              <li
                                key={item.id}
                                className="flex items-start gap-3 rounded-2xl bg-prestige-beige/25 px-4 py-3"
                              >
                                <span
                                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)]"
                                  aria-hidden
                                >
                                  {rank}
                                </span>
                                <span className="min-w-0">
                                  <span className="block text-sm font-medium text-dark">
                                    {item.order}
                                  </span>
                                  <span className="mt-0.5 block text-xs leading-relaxed text-prestige-taupe">
                                    {item.why}
                                  </span>
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </section>
                    );
                  })}
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="mt-8 relative pl-11">
          <div
            className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              notesLibres.trim()
                ? 'bg-primary text-white'
                : 'bg-white text-prestige-taupe shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)]'
            }`}
            aria-hidden
          >
            <FileText className="h-3.5 w-3.5" strokeWidth={2.25} />
          </div>
          <div>
            <label htmlFor="plan-global-notes" className={labelClass}>
              Notes pour toi (optionnel)
            </label>
            <textarea
              id="plan-global-notes"
              rows={2}
              className={`${inputClass} resize-y`}
              value={notesLibres}
              onChange={(e) => setNotesLibres(e.target.value)}
              placeholder="Ex. Prochaine étape, date de rappel, question pour le RDV…"
            />
          </div>
        </div>
      </CampagneToolShell>
    </div>
  );
}

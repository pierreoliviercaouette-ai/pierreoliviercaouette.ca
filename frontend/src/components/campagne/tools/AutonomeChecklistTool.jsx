import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertTriangle, Check, FileText } from 'lucide-react';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { buildCampagneRdvPath } from '../../../data/campagneAdsLandings';
import { trackEvent, trackRendezVousClick } from '../../../lib/analytics';
import {
  CampagneToolShell,
  ToolSoftClose,
} from '../CampagneToolShell';

/**
 * Ordre du filet minimal (ads + bullets) :
 * liquidité → revenu → proches / hypothèque → structure / reste.
 */
const ITEMS = [
  {
    id: 'urgence',
    pillar: 'liquidite',
    short: 'Fonds d’urgence',
    label: 'Argent de côté pour 3 à 6 mois de dépenses',
    hint: 'Disponible vite si un mois (ou trois) est mauvais.',
    next: 'Mettre de l’argent de côté accessible (3 à 6 mois).',
  },
  {
    id: 'factures',
    pillar: 'liquidite',
    short: 'Factures fixes 3 mois',
    label: 'Mes factures fixes tiennent 3 mois sans facturer',
    hint: 'Hypothèque, taxes, essentiels — même si le revenu tombe à zéro.',
    next: 'Vérifier si hypothèque + essentiels tiennent 3 mois sans facturer.',
  },
  {
    id: 'invalidite',
    pillar: 'revenu',
    short: 'Protection du revenu',
    label: 'Assurance si je ne peux plus travailler',
    hint: 'Pour remplacer une partie du revenu quand tu ne peux plus travailler — sans filet d’employeur.',
    next: 'Regarder une protection si tu ne peux plus travailler.',
  },
  {
    id: 'vie',
    pillar: 'proches',
    short: 'Vie / proches',
    label: 'Assurance vie si j’ai une hypothèque, un conjoint ou des enfants',
    hint: 'Pour que les proches ne se retrouvent pas coincés (hypo / conjoint / enfants).',
    next: 'Clarifier hypothèque / conjoint / enfants : qui assume si tu n’es plus là.',
  },
  {
    id: 'comptes',
    pillar: 'structure',
    short: 'Comptes séparés',
    label: 'Compte perso et compte entreprise séparés',
    hint: 'Pour voir clairement ce qui rentre et ce qui sort.',
    next: 'Séparer compte perso et compte entreprise.',
  },
  {
    id: 'epargne',
    pillar: 'structure',
    short: 'Épargne planifiée',
    label: 'Épargne planifiée chaque mois (même petit montant)',
    hint: 'Un montant décidé d’avance, pas au feeling des bons mois.',
    next: 'Fixer un montant d’épargne automatique chaque mois.',
  },
  {
    id: 'rc',
    pillar: 'structure',
    short: 'Responsabilité',
    label: 'Assurance responsabilité si mon métier l’exige',
    hint: 'Pas toujours nécessaire — seulement si ton métier le demande.',
    next: 'Vérifier si ton métier exige une assurance responsabilité.',
  },
];

const PILLARS = [
  {
    id: 'liquidite',
    title: '1 · Liquidité',
    subtitle: 'Tenir quand un mois (ou trois) est mauvais.',
  },
  {
    id: 'revenu',
    title: '2 · Revenu',
    subtitle: 'Si tu ne peux plus travailler — sans filet d’employeur.',
  },
  {
    id: 'proches',
    title: '3 · Proches / hypothèque',
    subtitle: 'Qui assume si tu n’es plus là.',
  },
  {
    id: 'structure',
    title: '4 · Structure',
    subtitle: 'Clarté au quotidien — après le filet de base.',
  },
];

const INITIAL_CHECKED = Object.fromEntries(ITEMS.map((item) => [item.id, false]));
const ITEM_INDEX = Object.fromEntries(ITEMS.map((item, i) => [item.id, i + 1]));

const inputClass =
  'w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-sm text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] transition focus:outline-none focus:shadow-[inset_0_0_0_2px_rgba(6,77,217,0.45)]';

const labelClass = 'mb-1.5 block text-xs font-medium text-prestige-taupe';

function ResultCard({ label, value, detail, tone = 'default' }) {
  const toneClass =
    tone === 'warn'
      ? 'border-amber-200/80 bg-gradient-to-br from-amber-50 to-white'
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

function statusDetail(doneCount, missingCount, nextItem) {
  if (doneCount >= 6) {
    return 'Bonne base. Garde le résumé sous la main — revalide si ton revenu ou ta famille change. Apporte-le aux 15 min si tu veux.';
  }
  if (doneCount >= 3) {
    return nextItem
      ? `Du progrès, mais ${missingCount} trou${missingCount > 1 ? 's' : ''} restent. Prochaine case : ${nextItem.short.toLowerCase()}. Si un mois (ou trois) est mauvais, rien ne tombe automatiquement.`
      : 'Du progrès, mais des trous restent. Si un mois (ou trois) est mauvais, rien ne tombe automatiquement.';
  }
  return nextItem
    ? `Le filet est mince. Si un mois est mauvais, rien ne tombe auto. Commence par : ${nextItem.next}`
    : 'Le filet est mince. Si un mois est mauvais, rien ne tombe automatiquement — construis-le une case à la fois.';
}

function softCloseCopy(filetValue, nextItem, missingCount) {
  if (filetValue === 'Solide') {
    return {
      headline: 'Bonne base.',
      subline:
        'Garde le PDF à jour — ou 15 min si une case te chicotte encore. Clarifier ≠ acheter · sans pression.',
      rdvLabel: 'Clarifier en 15 min',
    };
  }
  if (filetValue === 'En cours' && nextItem) {
    return {
      headline: `Du progrès — il reste ${missingCount} trou${missingCount > 1 ? 's' : ''}. Prochaine case : ${nextItem.short}.`,
      subline: 'On priorise ensemble en 15 min si tu veux. Clarifier ≠ acheter · sans pression.',
      rdvLabel: `Clarifier : ${nextItem.short} en 15 min`,
    };
  }
  if (nextItem) {
    return {
      headline: `Ton filet est mince — prochaine case : ${nextItem.short}.`,
      subline:
        '15 min pour décider si tu commences par la liquidité ou le revenu qui stoppe. Clarifier ≠ acheter · sans pression.',
      rdvLabel: `Clarifier : ${nextItem.short} en 15 min`,
    };
  }
  return {
    headline: 'Ton filet se construit.',
    subline: '15 min pour prioriser tes prochaines cases. Clarifier ≠ acheter · sans pression.',
    rdvLabel: 'Clarifier en 15 min',
  };
}

function pillarTone(done, total) {
  if (done === total) return 'ok';
  if (done === 0) return 'warn';
  return 'default';
}

export function AutonomeChecklistTool() {
  const location = useLocation();
  const [checked, setChecked] = useState(INITIAL_CHECKED);
  const [notesLibres, setNotesLibres] = useState('');
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_travailleur-autonome_pdf');
  const progressSent = useRef(new Set());
  const filetMinceSent = useRef(false);

  const doneCount = useMemo(
    () => ITEMS.reduce((sum, item) => sum + (checked[item.id] ? 1 : 0), 0),
    [checked],
  );

  const total = ITEMS.length;
  const missingCount = total - doneCount;
  const progress = Math.round((doneCount / total) * 100);

  const missingOrdered = useMemo(
    () => ITEMS.filter((item) => !checked[item.id]),
    [checked],
  );

  const nextItem = missingOrdered[0] || null;
  const detail = statusDetail(doneCount, missingCount, nextItem);

  const pillarStats = useMemo(
    () =>
      PILLARS.map((pillar) => {
        const items = ITEMS.filter((item) => item.pillar === pillar.id);
        const done = items.filter((item) => checked[item.id]).length;
        return { ...pillar, done, total: items.length, items };
      }),
    [checked],
  );

  const filetTone = doneCount >= 6 ? 'ok' : doneCount >= 3 ? 'default' : 'warn';
  const filetValue =
    doneCount === 0
      ? 'À construire'
      : doneCount >= 6
        ? 'Solide'
        : doneCount >= 3
          ? 'En cours'
          : 'Mince';

  const filetDetail =
    doneCount === 0
      ? 'Aucune case cochée. Le filet, c’est toi qui le bâtis — personne n’envoie le PDF annuel.'
      : doneCount >= 6
        ? `${doneCount}/${total} en place. Garde le PDF à jour.`
        : `${doneCount}/${total} en place · ${missingCount} à faire.`;

  const nextValue = nextItem ? nextItem.short : 'Rien de prioritaire';
  const nextDetail = nextItem
    ? nextItem.next
    : 'Toutes les cases cochées. Garde le PDF à jour.';

  const showSoftClose = doneCount >= 1;
  const soft = showSoftClose ? softCloseCopy(filetValue, nextItem, missingCount) : null;
  const rdvPath = buildCampagneRdvPath('travailleur-autonome', location.search);

  useEffect(() => {
    if (doneCount === 1 || doneCount === 3) {
      if (!progressSent.current.has(doneCount)) {
        progressSent.current.add(doneCount);
        trackEvent('select_content', {
          content_type: 'tool',
          item_id: 'campagne_travailleur-autonome_progress',
          done_count: doneCount,
          filet_value: filetValue,
        });
      }
    }
    if (filetValue === 'Mince' && doneCount >= 1 && !filetMinceSent.current) {
      filetMinceSent.current = true;
      trackEvent('select_content', {
        content_type: 'tool',
        item_id: 'campagne_travailleur-autonome_filet_mince',
        next: nextItem?.id || null,
      });
    }
  }, [doneCount, filetValue, nextItem]);

  const toggle = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownload = () =>
    downloadPdf({
      title: 'Résumé — filet travailleur autonome',
      filename: 'checklist-travailleur-autonome.pdf',
      sections: [
        {
          heading: 'Checklist',
          rows: ITEMS.map((item) => ({
            label: item.label,
            value: checked[item.id] ? 'Fait' : 'À faire',
          })),
        },
        {
          heading: 'Filet',
          rows: [
            { label: 'Progression', value: `${doneCount}/${total}` },
            { label: 'État', value: filetValue },
            {
              label: 'Prochaine étape',
              value: nextItem ? nextItem.next : 'Rien de prioritaire',
            },
            { label: 'Lecture', value: detail },
          ],
        },
        {
          heading: 'Trous restants (ordre)',
          rows:
            missingOrdered.length === 0
              ? [{ label: 'Trous', value: 'Aucun' }]
              : missingOrdered.map((item, i) => ({
                  label: `${i + 1}.`,
                  value: item.next,
                })),
        },
        ...(notesLibres.trim()
          ? [
              {
                heading: 'Notes',
                rows: [{ label: 'Notes', value: notesLibres.trim() }],
              },
            ]
          : []),
      ],
      notes: [
        `${doneCount}/${total} points cochés.`,
        'Pas d’assurance collective fournie — chaque case non cochée, c’est toi qui assumes.',
        'Contenu éducatif seulement — pas un conseil personnalisé.',
        'Apporte ce résumé aux 15 min si tu veux — Clarifier ≠ acheter.',
      ],
    });

  return (
    <div data-testid="tool-autonome-checklist">
      <CampagneToolShell
        title="Checklist : ton filet d’autonome"
        intro="Pas d’assurance collective fournie. Coche ce qui est vraiment en place — ton ordre d’attaque se construit en direct."
        disclaimer="Contenu éducatif seulement — pas un conseil personnalisé. Les cases et l’ordre sont illustratifs — montants et priorités dépendent de ton revenu net et de ta situation."
        footer={
          <p className="text-sm leading-relaxed text-prestige-taupe">{detail}</p>
        }
      >
        <div className="mb-6">
          <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                Progression
              </p>
              <p className="font-heading mt-1 text-2xl font-bold text-dark">
                {doneCount}
                <span className="text-base font-medium text-prestige-taupe"> / {total}</span>
              </p>
            </div>
            <p className="text-sm text-prestige-taupe">
              {missingCount === 0
                ? 'Complet'
                : `${missingCount} à faire · ${progress} %`}
            </p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-prestige-beige/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-prestige-taupe">
            Ordre : liquidité → revenu → proches / hypothèque → structure.
          </p>
        </div>

        <div
          className="relative mb-8 space-y-8 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-px before:bg-prestige-beige"
          aria-label="Checklist travailleur autonome"
        >
          {pillarStats.map((pillar) => (
            <div key={pillar.id} className="relative space-y-3 pl-11">
              <div
                className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  pillar.done === pillar.total
                    ? 'bg-primary text-white'
                    : 'bg-white text-prestige-taupe shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)]'
                }`}
                aria-hidden
              >
                {pillar.done === pillar.total ? (
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                ) : (
                  pillar.title.charAt(0)
                )}
              </div>
              <div className="mb-1">
                <h3 className="font-heading text-base font-semibold text-dark">{pillar.title}</h3>
                <p className="mt-0.5 text-sm leading-snug text-prestige-taupe">{pillar.subtitle}</p>
              </div>
              <div className="space-y-2">
                {pillar.items.map((item) => {
                  const done = Boolean(checked[item.id]);
                  const inputId = `autonome-${item.id}`;
                  return (
                    <label
                      key={item.id}
                      htmlFor={inputId}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl px-4 py-3.5 transition ${
                        done
                          ? 'bg-gradient-to-br from-primary/[0.06] to-secondary/[0.08]'
                          : 'bg-white shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] hover:shadow-[inset_0_0_0_1px_rgba(6,77,217,0.25)]'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors ${
                          done
                            ? 'bg-primary text-white'
                            : 'bg-white shadow-[inset_0_0_0_1px_rgba(1,35,63,0.14)]'
                        }`}
                        aria-hidden
                      >
                        {done ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
                      </span>
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={done}
                        onChange={() => toggle(item.id)}
                        className="sr-only"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-dark">{item.label}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-prestige-taupe">
                          {item.hint}
                        </span>
                      </span>
                      <span className="ml-auto shrink-0 pt-0.5 text-[11px] tabular-nums text-prestige-taupe/80">
                        {ITEM_INDEX[item.id]}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="relative pl-11">
            <div
              className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                notesLibres.trim()
                  ? 'bg-primary text-white'
                  : 'bg-white text-prestige-taupe shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)]'
              }`}
              aria-hidden
            >
              {notesLibres.trim() ? (
                <Check className="h-4 w-4" strokeWidth={2.5} />
              ) : (
                <FileText className="h-3.5 w-3.5" />
              )}
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold text-dark">Notes</h3>
              <p className="mt-0.5 text-sm text-prestige-taupe">Optionnel — pour toi</p>
              <div className="mt-3">
                <label htmlFor="autonome-notes-libres" className={labelClass}>
                  À retenir
                </label>
                <textarea
                  id="autonome-notes-libres"
                  rows={2}
                  className={`${inputClass} resize-y`}
                  value={notesLibres}
                  onChange={(e) => setNotesLibres(e.target.value)}
                  placeholder="Ex. assureur, date, question…"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
              Ton filet
            </p>
            <p className="mt-1 text-sm text-prestige-taupe">
              {doneCount === 0
                ? 'Coche pour voir ton filet se remplir.'
                : 'Se remplit au fur et à mesure — prochaine étape claire.'}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ResultCard
              label="État du filet"
              value={filetValue}
              detail={filetDetail}
              tone={filetTone}
            />
            <ResultCard
              label="Prochaine étape"
              value={nextValue}
              detail={nextDetail}
              tone={nextItem ? 'warn' : 'ok'}
            />
          </div>

          {missingOrdered.length === 0 && doneCount > 0 ? (
            <div className="mt-4 rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white px-4 py-4">
              <p className="text-sm font-semibold text-dark">Filet complet sur cette liste</p>
              <p className="mt-0.5 text-xs leading-relaxed text-prestige-taupe">
                Garde le PDF à jour. Revalide si ton revenu, ta famille ou ton métier change.
              </p>
            </div>
          ) : doneCount > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                Trous restants (ordre)
              </p>
              <ol className="mt-2 space-y-2">
                {missingOrdered.map((item, i) => (
                  <li
                    key={item.id}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
                      i === 0
                        ? 'bg-gradient-to-br from-amber-50 to-white shadow-[inset_0_0_0_1px_rgba(245,158,11,0.25)]'
                        : 'bg-prestige-beige/25'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        i === 0
                          ? 'bg-amber-500 text-white'
                          : 'bg-white text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)]'
                      }`}
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 text-sm font-medium text-dark">
                      {item.next}
                      {i === 0 ? (
                        <span className="ml-2 text-xs font-normal text-amber-700">
                          {' '}
                          en premier
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {pillarStats.map((pillar) => (
              <div
                key={pillar.id}
                className={`rounded-xl border px-3 py-2.5 ${
                  pillarTone(pillar.done, pillar.total) === 'ok'
                    ? 'border-emerald-200/80 bg-emerald-50/60'
                    : pillarTone(pillar.done, pillar.total) === 'warn'
                      ? 'border-amber-200/70 bg-amber-50/40'
                      : 'border-primary/10 bg-white/70'
                }`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide text-prestige-taupe">
                  {pillar.title}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-dark">
                  {pillar.done}/{pillar.total}
                </p>
              </div>
            ))}
          </div>

          {soft ? (
            <div className="mt-5">
              <ToolSoftClose
                headline={soft.headline}
                subline={soft.subline}
                rdvPath={rdvPath}
                rdvLabel={soft.rdvLabel}
                onRdvClick={() =>
                  trackRendezVousClick('campagne_travailleur-autonome_rdv_tool')
                }
                onPdf={handleDownload}
                pdfBusy={busy}
                pdfLabel="Garder mon résumé PDF"
              />
            </div>
          ) : null}
        </div>
      </CampagneToolShell>
    </div>
  );
}

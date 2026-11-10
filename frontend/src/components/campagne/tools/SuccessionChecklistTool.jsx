import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertTriangle, Check, FileText, Scale } from 'lucide-react';
import { buildCampagneRdvPath } from '../../../data/campagneAdsLandings';
import { useCampagneToolPdf } from '../../../hooks/useCampagneToolPdf';
import { trackRendezVousClick } from '../../../lib/analytics';
import {
  CampagneToolShell,
  ToolSoftClose,
} from '../CampagneToolShell';

/** Ordre = priorité campagne (liquidité → qui reçoit → cadre). */
const ITEMS = [
  {
    id: 'liquidites',
    group: 'liquidite',
    short: 'Liquidité',
    label: 'Argent accessible (liquidité)',
    hint: 'Comptes bloqués ≠ épicerie et hypothèque payées. Qui paie en attendant ?',
  },
  {
    id: 'besoins-rapides',
    group: 'liquidite',
    short: 'Besoins rapides',
    label: 'Ce dont la famille a besoin vite',
    hint: 'Les premiers mois : revenu, dettes, hypothèque — un plan clair pour ne pas laisser ça en suspens.',
  },
  {
    id: 'beneficiaires',
    group: 'documents',
    short: 'Bénéficiaires',
    label: 'Polices, REER, CELI et régime collectif à jour (bénéficiaires)',
    hint: 'L’argent va à qui tu veux vraiment, pas à une ancienne version de ta vie.',
  },
  {
    id: 'testament',
    group: 'documents',
    short: 'Testament',
    label: 'Un testament existe et est à jour',
    hint: 'Qui reçoit quoi — pas juste « j’y penserai ».',
  },
  {
    id: 'coherence',
    group: 'documents',
    short: 'Cohérence',
    label: 'Testament et contrats se parlent',
    hint: 'Bénéficiaires, polices et testament : est-ce que ça colle ensemble ?',
  },
  {
    id: 'notaire',
    group: 'cadre',
    short: 'Notaire',
    label: 'Le notaire a revu la situation',
    hint: 'Le cadre légal reste chez le notaire — cette checklist ne le remplace pas.',
  },
];

const GROUPS = [
  {
    id: 'liquidite',
    title: 'Argent accessible',
    subtitle: 'Ce dont la famille a besoin vite — liquidité ≠ actifs sur papier.',
  },
  {
    id: 'documents',
    title: 'Qui reçoit quoi',
    subtitle: 'Bénéficiaires, testament et contrats : est-ce qu’ils se parlent ?',
  },
  {
    id: 'cadre',
    title: 'Cadre légal',
    subtitle: 'Le notaire reste essentiel pour le juridique.',
  },
];

const INITIAL_CHECKED = Object.fromEntries(ITEMS.map((item) => [item.id, false]));

const inputClass =
  'w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-sm text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] transition focus:outline-none focus:shadow-[inset_0_0_0_2px_rgba(6,77,217,0.45)]';

const labelClass = 'mb-1.5 block text-xs font-medium text-prestige-taupe';

function statusDetail(count, nextShort) {
  if (count >= 5) {
    return 'Bonne base. Tu peux valider liquidité & bénéficiaires en 15 min ; un notaire reste essentiel pour le cadre légal.';
  }
  if (count >= 3) {
    return nextShort
      ? `Quelques bases, mais des trous restent. Prochaine case utile : ${nextShort}.`
      : 'Quelques bases, mais des trous restent. Liquidité, bénéficiaires, testament : c’est souvent là que ça coince.';
  }
  if (count === 0) {
    return 'Coche seulement ce qui est vrai aujourd’hui. Ton portrait des trous se remplit en direct.';
  }
  return nextShort
    ? `C’est un début. Prochaine case utile : ${nextShort}.`
    : 'C’est un début. Continue — chaque case cochée clarifie ce qui arrive à ta famille.';
}

/** Next-step branché CSF vs notaire. */
function nextStepFor(nextItem) {
  if (!nextItem) {
    return {
      value: 'Valider · notaire',
      detail:
        'PDF à jour + notaire pour le légal ; option 15 min CSF pour valider liquidité / bénéficiaires.',
      pdfValue: 'Valider · notaire (liquidité & bénéficiaires en 15 min)',
    };
  }
  switch (nextItem.id) {
    case 'liquidites':
      return {
        value: 'Liquidité',
        detail: 'Argent accessible les premiers mois — souvent le 1er vrai trou.',
        pdfValue: 'Liquidité — argent accessible les premiers mois',
      };
    case 'besoins-rapides':
      return {
        value: 'Besoins rapides',
        detail: 'Ce dont la famille a besoin vite (revenu, dettes, hypo).',
        pdfValue: 'Besoins rapides — ce dont la famille a besoin vite',
      };
    case 'beneficiaires':
      return {
        value: 'Bénéficiaires',
        detail: 'Polices, REER, CELI et régime collectif à jour.',
        pdfValue: 'Bénéficiaires — polices, REER, CELI, régime collectif',
      };
    case 'testament':
      return {
        value: 'Testament',
        detail: 'Un testament existe et est à jour.',
        pdfValue: 'Testament — existe et est à jour',
      };
    case 'coherence':
      return {
        value: 'Cohérence',
        detail: 'Testament et contrats se parlent.',
        pdfValue: 'Cohérence — testament et contrats se parlent',
      };
    case 'notaire':
      return {
        value: 'Notaire',
        detail: 'Le notaire a revu la situation — cadre légal.',
        pdfValue: 'Notaire — a revu la situation',
      };
    default:
      return {
        value: nextItem.short,
        detail: nextItem.label,
        pdfValue: nextItem.label,
      };
  }
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

export function SuccessionChecklistTool() {
  const location = useLocation();
  const [checked, setChecked] = useState(INITIAL_CHECKED);
  const [notesLibres, setNotesLibres] = useState('');
  const { busy, downloadPdf } = useCampagneToolPdf('campagne_succession-bases_pdf');
  const rdvPath = buildCampagneRdvPath('succession-bases', location.search);

  const count = useMemo(
    () => ITEMS.reduce((sum, item) => sum + (checked[item.id] ? 1 : 0), 0),
    [checked]
  );

  const total = ITEMS.length;
  const missing = useMemo(() => ITEMS.filter((item) => !checked[item.id]), [checked]);
  const missingCount = missing.length;
  const progress = Math.round((count / total) * 100);
  const nextItem = missing[0] || null;
  const detail = statusDetail(count, nextItem?.short);
  const nextStep = nextStepFor(nextItem);
  const showPortrait = count >= 1;
  const showSoftClose = count >= 1;
  const dontLiquidite = nextItem?.id === 'liquidites' ? ' — dont la liquidité' : '';

  const softCloseHeadline =
    missingCount === 0
      ? 'Belle base.'
      : `T’as ${missingCount} case${missingCount > 1 ? 's' : ''} vide${missingCount > 1 ? 's' : ''}${dontLiquidite}.`;
  const softCloseSubline =
    missingCount === 0
      ? 'On peut valider liquidité & bénéficiaires en 15 min ; le notaire garde le juridique.'
      : 'En 15 minutes on relie ça à ta vie ; le notaire reste pour le testament. Clarifier, c’est pas acheter.';

  const pillarScores = GROUPS.map((group) => {
    const groupItems = ITEMS.filter((item) => item.group === group.id);
    const done = groupItems.filter((item) => checked[item.id]).length;
    return {
      id: group.id,
      title: group.title,
      done,
      total: groupItems.length,
      complete: done === groupItems.length,
    };
  });

  const pillarsOk = pillarScores.filter((p) => p.complete).length;

  const etatTone = count >= 5 ? 'ok' : count >= 1 ? 'warn' : 'default';
  const etatValue =
    count === 0 ? 'À démarrer' : missingCount === 0 ? 'Complet' : `${count}/${total} en place`;
  const etatDetail =
    count === 0
      ? 'Rien coché encore — commence par la liquidité si tu ne sais pas par où.'
      : missingCount === 0
        ? 'Les six points sont cochés. Tu peux valider liquidité & bénéficiaires en 15 min ; le notaire reste pour le légal.'
        : `${missingCount} point${missingCount > 1 ? 's' : ''} encore flou${missingCount > 1 ? 's' : ''}.`;

  const trousValue =
    missingCount === 0
      ? 'Aucun'
      : missing
          .slice(0, 3)
          .map((item) => item.short)
          .join(' · ');
  const trousDetail =
    missingCount === 0
      ? 'Tu as coché l’essentiel de cette liste. Le notaire reste central pour le cadre légal.'
      : missingCount > 3
        ? `+ ${missingCount - 3} autre${missingCount - 3 > 1 ? 's' : ''}. Commence par la liquidité, puis qui reçoit quoi.`
        : 'Ce sont les cases encore vides — souvent là que ça coince le jour J.';

  const toggle = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownload = () =>
    downloadPdf({
      title: 'Résumé — portrait successoral',
      filename: 'resume-succession-bases.pdf',
      sections: [
        {
          heading: 'Checklist',
          rows: ITEMS.map((item) => ({
            label: item.label,
            value: checked[item.id] ? 'Fait' : 'À faire',
          })),
        },
        {
          heading: 'Portrait des trous',
          rows: [
            { label: 'Points clarifiés', value: `${count}/${total}` },
            {
              label: 'Piliers OK (liquidité / documents / cadre)',
              value: `${pillarsOk}/3`,
            },
            {
              label: 'Trous prioritaires',
              value:
                missingCount === 0
                  ? 'Aucun'
                  : missing.map((item) => item.short).join(', '),
            },
            {
              label: 'Prochaine étape',
              value: nextStep.pdfValue,
            },
            { label: 'Lecture', value: detail },
          ],
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
        `${count}/${total} points cochés dans la checklist.`,
        'Ne remplace pas un notaire ni un avis juridique.',
      ],
    });

  return (
    <div data-testid="tool-succession-checklist">
      <CampagneToolShell
        title="Checklist — 6 questions"
        intro="Coche ce qui est vrai aujourd’hui. Tu vois tout de suite les trous à combler."
        disclaimer="Contenu éducatif seulement — pas un conseil personnalisé. Ne remplace pas un notaire ni un avis juridique."
        footer={
          showSoftClose ? null : (
            <p className="text-sm leading-relaxed text-prestige-taupe">{detail}</p>
          )
        }
      >
        <div className="mb-6">
          <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                Progression
              </p>
              <p className="font-heading mt-1 text-2xl font-bold text-dark">
                {count}
                <span className="text-base font-medium text-prestige-taupe"> / {total}</span>
              </p>
            </div>
            <p className="text-sm text-prestige-taupe">
              {missingCount === 0 ? 'Complet' : `${missingCount} à clarifier · ${progress} %`}
            </p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-prestige-beige/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-prestige-taupe">
            {nextItem?.id === 'liquidites' && showPortrait
              ? 'Argent accessible ≠ maison sur papier — souvent le 1er vrai trou.'
              : 'Chaque case cochée = un point de succession que tu ne laisses plus au hasard.'}
          </p>
        </div>

        <div className="mb-8">
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
              Ton portrait des trous
            </p>
            <p className="mt-1 text-sm text-prestige-taupe">
              {showPortrait
                ? 'Se remplit au fur et à mesure — rien à attendre à la fin.'
                : 'Commence par cocher — le portrait des trous apparaît ensuite.'}
            </p>
          </div>

          {showPortrait ? (
            <div className="animate-fade-in space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <ResultCard
                  label="État"
                  value={etatValue}
                  detail={etatDetail}
                  tone={etatTone}
                />
                <ResultCard
                  label="Trous prioritaires"
                  value={trousValue}
                  detail={trousDetail}
                  tone={missingCount === 0 ? 'ok' : 'warn'}
                />
                <ResultCard
                  label="Prochaine étape"
                  value={nextStep.value}
                  detail={nextStep.detail}
                  tone={nextItem ? 'default' : 'ok'}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {pillarScores.map((pillar, index) => (
                  <div
                    key={pillar.id}
                    className={`rounded-xl px-3 py-2.5 text-center ${
                      pillar.complete
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-prestige-beige/50 text-prestige-taupe'
                    }`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide">
                      {index + 1} · {pillar.title}
                    </p>
                    <p className="font-heading mt-0.5 text-sm font-bold tabular-nums text-dark">
                      {pillar.done}/{pillar.total}
                    </p>
                  </div>
                ))}
              </div>
              {showSoftClose ? (
                <div data-testid="succession-rdv-tool">
                  <ToolSoftClose
                    headline={softCloseHeadline}
                    subline={softCloseSubline}
                    rdvPath={rdvPath}
                    rdvLabel="Réserver 15 minutes"
                    onRdvClick={() =>
                      trackRendezVousClick('campagne_succession-bases_rdv_tool')
                    }
                    onPdf={handleDownload}
                    pdfBusy={busy}
                    pdfLabel="Télécharger mon résumé PDF"
                  />
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.04] to-secondary/[0.05] px-4 py-4">
              <p className="font-heading text-base font-semibold text-dark">
                Commence par la liquidité
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-prestige-taupe">
                Coche seulement ce qui est vrai aujourd’hui. Ton portrait des trous se construit en
                direct — sans jugement à froid.
              </p>
            </div>
          )}
        </div>

        <div
          className="relative space-y-8 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-px before:bg-prestige-beige"
          aria-label="Checklist succession"
        >
          {GROUPS.map((group, groupIndex) => {
            const groupItems = ITEMS.filter((item) => item.group === group.id);
            const groupDone = groupItems.every((item) => checked[item.id]);

            return (
              <div key={group.id} className="relative pl-11">
                <div
                  className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    groupDone
                      ? 'bg-primary text-white'
                      : 'bg-white text-prestige-taupe shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)]'
                  }`}
                  aria-hidden
                >
                  {groupDone ? <Check className="h-4 w-4" strokeWidth={2.5} /> : groupIndex + 1}
                </div>
                <div className="mb-3">
                  <h3 className="font-heading text-base font-semibold text-dark">{group.title}</h3>
                  <p className="mt-0.5 text-sm leading-snug text-prestige-taupe">{group.subtitle}</p>
                </div>
                <div className="space-y-3">
                  {groupItems.map((item) => {
                    const done = Boolean(checked[item.id]);
                    const inputId = `succession-${item.id}`;

                    return (
                      <label
                        key={item.id}
                        htmlFor={inputId}
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl px-4 py-3.5 transition-colors ${
                          done
                            ? 'bg-gradient-to-br from-primary/[0.06] to-secondary/[0.08]'
                            : 'bg-white/60 hover:bg-white'
                        }`}
                      >
                        <input
                          id={inputId}
                          type="checkbox"
                          checked={done}
                          onChange={() => toggle(item.id)}
                          className="mt-1 h-4 w-4 shrink-0 rounded border-input text-primary focus:ring-primary"
                        />
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-dark">{item.label}</span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-prestige-taupe">
                            {item.hint}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="relative pl-11">
            <div
              className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-white text-secondary shadow-[inset_0_0_0_1px_rgba(1,35,63,0.12)]"
              aria-hidden
            >
              <Scale className="h-3.5 w-3.5" />
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-primary/[0.04] to-secondary/[0.06] px-4 py-3.5">
              <p className="text-sm font-semibold text-dark">Rappel — vois un notaire</p>
              <p className="mt-0.5 text-xs leading-relaxed text-prestige-taupe">
                Cette liste aide à voir les trous de liquidité et de clarté. Elle ne remplace pas un
                notaire pour le testament et le cadre légal.
              </p>
            </div>
          </div>

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
              <p className="mt-0.5 text-sm text-prestige-taupe">Optionnel</p>
              <div className="mt-3">
                <label htmlFor="succession-notes-libres" className={labelClass}>
                  À retenir
                </label>
                <textarea
                  id="succession-notes-libres"
                  rows={2}
                  className={`${inputClass} resize-y`}
                  value={notesLibres}
                  onChange={(e) => setNotesLibres(e.target.value)}
                  placeholder="Ex. Nom du notaire, date du testament, qui a les accès…"
                />
              </div>
            </div>
          </div>
        </div>
      </CampagneToolShell>
    </div>
  );
}

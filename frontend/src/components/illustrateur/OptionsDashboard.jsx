import { useMemo } from 'react';
import { formatCad, formatPct } from '../../lib/illustrateur';
import { summarizeOptionCard } from '../../lib/illustrateur/planningModules';
import { usePlan } from './PlanContext';

const LETTER_BADGE = {
  A: 'bg-[#064dd9] text-white',
  B: 'bg-teal-700 text-white',
  C: 'bg-amber-700 text-white',
};

/**
 * Lecture client simple : une carte par module sélectionné (option A/B/C du module).
 */
export function OptionsDashboard({ presentation = false }) {
  const { modulesBundle, setWorkflowStep, openProposalPresentation, setPresentPage } = usePlan();

  const selectedSections = useMemo(
    () => (modulesBundle?.sections || []).filter((s) => s.selected),
    [modulesBundle],
  );

  const baseline = modulesBundle?.baseline;
  const composed = modulesBundle?.composed;

  if (!modulesBundle?.hasSelections) {
    return (
      <div className="rounded-2xl border border-dashed border-prestige-beige bg-white/70 px-6 py-16 text-center">
        <p className="font-heading text-2xl text-dark">Aucune option sélectionnée</p>
        <p className="mx-auto mt-2 max-w-lg text-sm text-prestige-taupe">
          Crée des options A-B-C dans chaque facette (assurance vie, placement, etc.), puis
          sélectionne-en une par module. La lecture simple et le dashboard chiffré s’assemblent
          automatiquement.
        </p>
        <button
          type="button"
          onClick={() => setWorkflowStep('modules')}
          className="mt-6 rounded-full bg-dark px-5 py-2.5 text-sm font-semibold text-white"
        >
          Ouvrir les modules
        </button>
      </div>
    );
  }

  const deltaNw =
    (composed?.summary?.netWorthEnd || 0) - (baseline?.summary?.netWorthEnd || 0);

  return (
    <div className="space-y-8">
      <header className={presentation ? '' : 'rounded-2xl border border-prestige-beige bg-white p-6 md:p-8'}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-prestige-taupe">
          Lecture simple · proposition assemblée
        </p>
        <h2 className="mt-2 font-heading text-3xl text-dark md:text-4xl">
          {modulesBundle.title || 'Votre planification'}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-prestige-taupe md:text-base">
          Voici les choix retenus par domaine. Chaque carte correspond à l’option A, B ou C sélectionnée
          dans ce module — sans noyer le client dans tous les graphiques.
        </p>
        {!presentation && (
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setWorkflowStep('dashboard')}
              className="rounded-full bg-dark px-4 py-2 text-sm font-semibold text-white"
            >
              Ouvrir le dashboard chiffré
            </button>
            <button
              type="button"
              onClick={openProposalPresentation}
              className="rounded-full border border-prestige-beige px-4 py-2 text-sm font-semibold"
            >
              Mode présentation
            </button>
          </div>
        )}
        {presentation && (
          <button
            type="button"
            onClick={() => setPresentPage('dashboard')}
            className="mt-5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white print:hidden"
          >
            Voir les graphiques détaillés →
          </button>
        )}
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryTile
          label={baseline?.label || 'Situation actuelle'}
          value={formatCad(baseline?.summary?.netWorthEnd)}
          hint="VN horizon"
        />
        <SummaryTile
          label="Proposition assemblée"
          value={formatCad(composed?.summary?.netWorthEnd)}
          hint="VN horizon"
          emphasize
        />
        <SummaryTile
          label="Écart"
          value={`${deltaNw >= 0 ? '+' : ''}${formatCad(deltaNw)}`}
          hint={`${formatPct(
            baseline?.summary?.netWorthEnd
              ? (deltaNw / Math.abs(baseline.summary.netWorthEnd)) * 100
              : 0,
          )}`}
        />
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        {selectedSections.map((sec) => {
          const bullets = summarizeOptionCard(sec.id, sec.selected);
          return (
            <article
              key={sec.id}
              className="rounded-3xl border border-prestige-beige bg-white p-6"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-heading text-lg ${
                    LETTER_BADGE[sec.selectedLetter] || 'bg-dark text-white'
                  }`}
                >
                  {sec.selectedLetter}
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-prestige-taupe">{sec.label}</p>
                  <h3 className="font-heading text-xl text-dark">{sec.selected.name}</h3>
                  {sec.selected.recommended && (
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                      Recommandée
                    </p>
                  )}
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-dark/80">{sec.selected.pitch}</p>
              <ul className="mt-4 space-y-1 text-sm text-prestige-taupe">
                {bullets.map((b) => (
                  <li key={b}>· {b}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <p className="text-center text-xs text-prestige-taupe">
        Illustration éducative — hypothèses non garanties. Conseiller en sécurité financière.
      </p>
    </div>
  );
}

function SummaryTile({ label, value, hint, emphasize }) {
  return (
    <div
      className={`rounded-2xl border px-5 py-4 ${
        emphasize ? 'border-primary/30 bg-primary/[0.04]' : 'border-prestige-beige bg-white'
      }`}
    >
      <p className="text-[10px] uppercase tracking-[0.14em] text-prestige-taupe">{label}</p>
      <p className="mt-2 font-heading text-2xl tabular-nums text-dark">{value}</p>
      {hint && <p className="mt-1 text-xs text-prestige-taupe">{hint}</p>}
    </div>
  );
}

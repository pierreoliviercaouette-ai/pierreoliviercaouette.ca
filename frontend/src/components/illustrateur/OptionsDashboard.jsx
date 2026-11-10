import { useMemo } from 'react';
import {
  buildOptionDeltas,
  optionHeadline,
  plainDelta,
} from '../../lib/illustrateur/scenarios';
import { formatCad } from '../../lib/illustrateur';
import { usePlan } from './PlanContext';

const LETTER_STYLES = {
  A: 'border-[#064dd9]/30 bg-[#064dd9]/[0.04]',
  B: 'border-teal-700/30 bg-teal-700/[0.04]',
  C: 'border-amber-700/30 bg-amber-700/[0.05]',
};

const LETTER_BADGE = {
  A: 'bg-[#064dd9] text-white',
  B: 'bg-teal-700 text-white',
  C: 'bg-amber-700 text-white',
};

/**
 * Dashboard client simple : explique les options A-B-C sans surcharge de graphiques.
 */
export function OptionsDashboard({ presentation = false }) {
  const { proposalBundle, setTab, openProposalPresentation, setPresentPage } = usePlan();
  const deltas = useMemo(() => buildOptionDeltas(proposalBundle), [proposalBundle]);
  const baseline = proposalBundle.baseline;

  if (!proposalBundle.hasOptions) {
    return (
      <div className="rounded-2xl border border-dashed border-prestige-beige bg-white/70 px-6 py-16 text-center">
        <p className="font-heading text-2xl text-dark">Aucune option A-B-C pour l’instant</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-prestige-taupe">
          Va dans l’onglet Scénarios, ajuste le dossier, puis enregistre une option. Les deux dashboards
          (simple + chiffré) s’activent automatiquement.
        </p>
        <button
          type="button"
          onClick={() => setTab('scenarios')}
          className="mt-6 rounded-full bg-dark px-5 py-2.5 text-sm font-semibold text-white"
        >
          Créer des options
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className={presentation ? '' : 'rounded-2xl border border-prestige-beige bg-white p-6 md:p-8'}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-prestige-taupe">
          Lecture simple
        </p>
        <h2 className="mt-2 font-heading text-3xl text-dark md:text-4xl">
          {proposalBundle.title || 'Vos options'}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-prestige-taupe md:text-base">
          Voici {deltas.length === 1 ? 'une trajectoire' : `${deltas.length} trajectoires`} possible
          {deltas.length > 1 ? 's' : ''} par rapport à votre {baseline.label?.toLowerCase() || 'situation actuelle'}.
          On regarde d’abord l’essentiel — les chiffres détaillés sont dans le dashboard complet.
        </p>
        {!presentation && (
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTab('dashboard')}
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

      <section className="rounded-2xl border border-prestige-beige bg-[#01233f] px-5 py-5 text-white md:px-8">
        <p className="text-[11px] uppercase tracking-[0.16em] text-white/55">{baseline.label}</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <BaselineStat label="Valeur nette horizon" value={formatCad(baseline.summary.netWorthEnd)} />
          <BaselineStat label="Cashflow an 0" value={formatCad(baseline.summary.cashflowYear0)} />
          <BaselineStat
            label="Succession nette illustrée"
            value={
              baseline.summary.deathNetEstate != null
                ? formatCad(baseline.summary.deathNetEstate)
                : '—'
            }
          />
        </div>
      </section>

      <div className={`grid gap-5 ${deltas.length >= 3 ? 'lg:grid-cols-3' : deltas.length === 2 ? 'lg:grid-cols-2' : ''}`}>
        {deltas.map((delta) => (
          <article
            key={delta.letter}
            className={`relative rounded-3xl border p-6 md:p-7 ${LETTER_STYLES[delta.letter] || 'border-prestige-beige bg-white'}`}
          >
            {delta.recommended && (
              <span className="absolute right-4 top-4 rounded-full bg-dark px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                Recommandée
              </span>
            )}
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full font-heading text-lg ${
                  LETTER_BADGE[delta.letter] || 'bg-dark text-white'
                }`}
              >
                {delta.letter}
              </span>
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-prestige-taupe">Option {delta.letter}</p>
                <h3 className="font-heading text-xl text-dark">{delta.name}</h3>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-dark/80">{delta.pitch}</p>
            <p className="mt-3 text-xs font-medium text-prestige-taupe">{optionHeadline(delta)}</p>

            <dl className="mt-5 space-y-3 border-t border-prestige-beige/80 pt-4">
              <Row label="Valeur nette à l’horizon" value={formatCad(delta.netWorthEnd)} delta={plainDelta(delta.deltaNetWorthEnd)} />
              <Row label="Croissance projetée" value={formatCad(delta.growthCad)} delta={plainDelta(delta.deltaGrowthCad)} />
              <Row label="Cashflow an 0" value={formatCad(delta.cashflowYear0)} delta={plainDelta(delta.deltaCashflow)} />
              {delta.deathNetEstate != null && (
                <Row
                  label="Succession nette illustrée"
                  value={formatCad(delta.deathNetEstate)}
                  delta={delta.deltaDeath != null ? plainDelta(delta.deltaDeath) : null}
                />
              )}
            </dl>
          </article>
        ))}
      </div>

      <p className="text-center text-xs text-prestige-taupe">
        Illustration éducative — hypothèses non garanties. À valider avec votre conseiller en sécurité financière,
        un fiscaliste ou un juriste selon le cas.
      </p>
    </div>
  );
}

function BaselineStat({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.14em] text-white/50">{label}</p>
      <p className="mt-1 font-heading text-2xl tabular-nums">{value}</p>
    </div>
  );
}

function Row({ label, value, delta }) {
  const positive = typeof delta === 'string' && delta.startsWith('+');
  const negative = typeof delta === 'string' && delta.startsWith('-');
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <dt className="text-[10px] uppercase tracking-[0.12em] text-prestige-taupe">{label}</dt>
        <dd className="font-heading text-lg tabular-nums text-dark">{value}</dd>
      </div>
      {delta && delta !== '—' && (
        <span
          className={`text-sm font-semibold tabular-nums ${
            positive ? 'text-emerald-700' : negative ? 'text-rose-700' : 'text-prestige-taupe'
          }`}
        >
          {delta}
        </span>
      )}
    </div>
  );
}

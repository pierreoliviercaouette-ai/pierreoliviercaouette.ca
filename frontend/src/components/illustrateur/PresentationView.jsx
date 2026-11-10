import { PLANNING_MODULES } from '../../lib/illustrateur/planningModules';
import { formatCad } from '../../lib/illustrateur';
import { OptionsDashboard } from './OptionsDashboard';
import { DashboardTab } from './DashboardTab';
import { usePlan } from './PlanContext';

const DECK = [
  { id: 'ouverture', label: '1 · Ouverture' },
  { id: 'priorites', label: '2 · Priorités' },
  { id: 'options', label: '3 · Options' },
  { id: 'dashboard', label: '4 · Trajectoire' },
  { id: 'prochaines', label: '5 · Suite' },
];

export function PresentationView() {
  const {
    plan,
    setPlan,
    modulesBundle,
    gapsBundle,
    presentPage,
    setPresentPage,
    setPresentMode,
  } = usePlan();
  const hasOptions = modulesBundle?.hasSelections;
  const priorities = plan.priorities || [];
  const addressed = (gapsBundle?.ordered || []).filter(
    (g) => priorities.includes(g.moduleId) || modulesBundle?.sections?.some((s) => s.id === g.moduleId && s.selected),
  );

  return (
    <div className="min-h-screen bg-[#f0ebe3] text-dark">
      <header className="border-b border-prestige-beige bg-dark text-white print:hidden">
        <div className="container-max flex flex-wrap items-center justify-between gap-4 px-4 py-5 md:px-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">Présentation client</p>
            <h1 className="mt-1 font-heading text-2xl md:text-3xl">
              {plan.meta?.clientLabel || plan.meta?.name || modulesBundle?.title || 'Proposition'}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {DECK.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => setPresentPage(page.id)}
                className={`rounded-full px-3 py-2 text-xs font-semibold md:text-sm ${
                  presentPage === page.id ? 'bg-white text-dark' : 'border border-white/30 text-white'
                }`}
              >
                {page.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPresentMode(false)}
              className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold"
            >
              Quitter
            </button>
          </div>
        </div>
      </header>

      <div className="container-max px-4 py-8 md:px-8 md:py-12">
        {presentPage === 'ouverture' && (
          <section className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-prestige-taupe">
              Pierre-Olivier Caouette · CSF
            </p>
            <h2 className="mt-4 font-heading text-4xl text-dark md:text-5xl">
              {modulesBundle?.title || 'Votre planification'}
            </h2>
            <p className="mt-4 text-lg text-prestige-taupe">
              {plan.meta?.clientLabel || plan.meta?.name || 'Client'}
            </p>
            {plan.meta?.notes && (
              <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-dark/75">{plan.meta.notes}</p>
            )}
            <button
              type="button"
              onClick={() => setPresentPage('priorites')}
              className="mt-10 rounded-full bg-dark px-6 py-3 text-sm font-semibold text-white"
            >
              Voir les priorités →
            </button>
          </section>
        )}

        {presentPage === 'priorites' && (
          <section className="mx-auto max-w-3xl space-y-6">
            <header>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-prestige-taupe">
                Ce que nous priorisons
              </p>
              <h2 className="mt-2 font-heading text-3xl text-dark">Objectifs du rendez-vous</h2>
            </header>
            {priorities.length ? (
              <ol className="space-y-4">
                {priorities.map((id, i) => {
                  const mod = PLANNING_MODULES.find((m) => m.id === id);
                  const gap = addressed.find((g) => g.moduleId === id);
                  return (
                    <li key={id} className="rounded-2xl border border-prestige-beige bg-white p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                        Priorité {i + 1}
                      </p>
                      <p className="mt-1 font-heading text-2xl text-dark">{mod?.label || id}</p>
                      {gap && <p className="mt-2 text-sm text-prestige-taupe">{gap.summary}</p>}
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="text-sm text-prestige-taupe">
                Aucune priorité cochée — les options sélectionnées guident tout de même la suite.
              </p>
            )}
            <button
              type="button"
              onClick={() => setPresentPage(hasOptions ? 'options' : 'dashboard')}
              className="rounded-full bg-dark px-5 py-2.5 text-sm font-semibold text-white"
            >
              {hasOptions ? 'Voir les options →' : 'Voir la trajectoire →'}
            </button>
          </section>
        )}

        {presentPage === 'options' && (
          <div>
            {hasOptions ? (
              <OptionsDashboard presentation />
            ) : (
              <p className="text-center text-sm text-prestige-taupe">
                Aucune option sélectionnée. Revenez aux modules pour en choisir.
              </p>
            )}
          </div>
        )}

        {presentPage === 'dashboard' && <DashboardTab presentation />}

        {presentPage === 'prochaines' && (
          <section className="mx-auto max-w-2xl space-y-6">
            <header>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-prestige-taupe">
                Prochaines étapes
              </p>
              <h2 className="mt-2 font-heading text-3xl text-dark">Ce que nous faisons ensuite</h2>
            </header>
            <div className="rounded-2xl border border-prestige-beige bg-white p-6">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-dark/80">
                {plan.nextStepsNotes ||
                  'Finaliser les illustrations assureur, confirmer les cotisations automatiques, et planifier le suivi.'}
              </p>
              <label className="mt-6 block text-xs print:hidden">
                <span className="text-prestige-taupe">Notes conseiller (éditables)</span>
                <textarea
                  className="mt-1 w-full rounded-lg border border-prestige-beige px-3 py-2 text-sm"
                  rows={5}
                  value={plan.nextStepsNotes || ''}
                  onChange={(e) => setPlan((p) => ({ ...p, nextStepsNotes: e.target.value }))}
                />
              </label>
            </div>
            {modulesBundle?.composed?.summary && (
              <p className="text-sm text-prestige-taupe">
                Valeur nette horizon illustrée :{' '}
                <span className="font-semibold text-dark">
                  {formatCad(modulesBundle.composed.summary.netWorthEnd)}
                </span>
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

import { OptionsDashboard } from './OptionsDashboard';
import { DashboardTab } from './DashboardTab';
import { usePlan } from './PlanContext';

export function PresentationView() {
  const { plan, modulesBundle, presentPage, setPresentPage, setPresentMode } = usePlan();
  const hasOptions = modulesBundle?.hasSelections;

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
            {hasOptions && (
              <>
                <button
                  type="button"
                  onClick={() => setPresentPage('options')}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    presentPage === 'options' ? 'bg-white text-dark' : 'border border-white/30 text-white'
                  }`}
                >
                  1 · Lecture simple
                </button>
                <button
                  type="button"
                  onClick={() => setPresentPage('dashboard')}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    presentPage === 'dashboard' ? 'bg-white text-dark' : 'border border-white/30 text-white'
                  }`}
                >
                  2 · Dashboard chiffré
                </button>
              </>
            )}
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

      <div className="container-max px-4 py-8 md:px-8 md:py-10">
        {hasOptions && presentPage === 'options' ? (
          <OptionsDashboard presentation />
        ) : (
          <DashboardTab presentation />
        )}
      </div>
    </div>
  );
}

import { visibleSidebarSteps } from '../../lib/illustrateur/workflow';
import { usePlan } from './PlanContext';

export function CollectShell({ title, right, children }) {
  const { plan, workflowStep, setWorkflowStep } = usePlan();
  const steps = visibleSidebarSteps(plan);

  return (
    <div className="min-h-[70vh]">
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setWorkflowStep('hub')}
          className="text-sm font-semibold text-[#0b4ea2] hover:underline"
        >
          ← Accueil
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_280px]">
        <nav className="rounded-xl border border-[#d7dee8] bg-white py-3 shadow-sm">
          <ul className="space-y-0.5">
            {steps.map((step) => {
              const active = workflowStep === step.id;
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => setWorkflowStep(step.id)}
                    className={`flex w-full items-center border-l-4 px-3 py-2.5 text-left text-sm transition ${
                      active
                        ? 'border-[#0b4ea2] bg-[#eaf2fb] font-semibold text-[#0b4ea2]'
                        : 'border-transparent text-[#3d4f66] hover:bg-[#f4f7fb]'
                    }`}
                  >
                    {step.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0">
          {title}
          {children}
        </div>

        <div className="hidden xl:block">{right}</div>
      </div>

      {right && <div className="mt-6 xl:hidden">{right}</div>}
    </div>
  );
}

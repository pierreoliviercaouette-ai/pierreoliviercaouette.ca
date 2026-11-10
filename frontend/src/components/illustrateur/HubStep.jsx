import { evaluateDossierReadiness } from '../../lib/illustrateur/workflow';
import { SectionCard } from './Field';
import { usePlan } from './PlanContext';

export function HubStep({ onImportClick }) {
  const {
    plan,
    setWorkflowStep,
    loadDemo,
    loadEmpty,
    openProposalPresentation,
    modulesBundle,
  } = usePlan();
  const readiness = evaluateDossierReadiness(plan);
  const hasOptions = modulesBundle?.hasSelections;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-prestige-beige bg-dark px-6 py-10 text-white md:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
          Planification locale · session navigateur
        </p>
        <h2 className="mt-3 max-w-2xl font-heading text-3xl md:text-4xl">
          {plan.meta?.clientLabel || plan.meta?.name || 'Nouveau parcours client'}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
          Trois phases : capturer le dossier, prioriser les gaps avec le client, puis présenter les options
          préparées. Aucun stockage cloud — export JSON pour conserver le travail.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setWorkflowStep('profil')}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Continuer le dossier →
          </button>
          {hasOptions && (
            <button
              type="button"
              onClick={openProposalPresentation}
              className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold"
            >
              Présenter au client
            </button>
          )}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <PhaseCard
          n="1"
          title="Dossier"
          body="Profil, bilan, revenus, événements et besoins de protection."
          onClick={() => setWorkflowStep('profil')}
        />
        <PhaseCard
          n="2"
          title="Plan"
          body="Gaps automatiques, priorités RDV, puis options A-B-C manuelles."
          onClick={() => setWorkflowStep(readiness.ready ? 'gaps' : 'besoins')}
        />
        <PhaseCard
          n="3"
          title="Présenter"
          body="Lecture simple et dashboard assemblé pour le rendez-vous."
          onClick={() => setWorkflowStep(hasOptions ? 'lecture' : 'modules')}
        />
      </div>

      <SectionCard title="Dossier session">
        <ul className="mb-4 space-y-2 text-sm">
          {readiness.checks.map((c) => (
            <li key={c.id} className="flex gap-2">
              <span className={c.ok ? 'text-green-700' : 'text-amber-700'}>{c.ok ? '✓' : '○'}</span>
              {c.label}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          <Action onClick={loadDemo}>Charger démo</Action>
          <Action onClick={loadEmpty}>Nouveau dossier</Action>
          <Action onClick={onImportClick}>Import JSON</Action>
        </div>
      </SectionCard>
    </div>
  );
}

function PhaseCard({ n, title, body, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-prestige-beige bg-white p-5 text-left shadow-sm transition hover:border-primary/40"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-prestige-taupe">Phase {n}</p>
      <p className="mt-1 font-heading text-xl text-dark">{title}</p>
      <p className="mt-2 text-sm text-prestige-taupe">{body}</p>
    </button>
  );
}

function Action({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-prestige-beige px-4 py-2 text-sm font-semibold hover:border-primary"
    >
      {children}
    </button>
  );
}

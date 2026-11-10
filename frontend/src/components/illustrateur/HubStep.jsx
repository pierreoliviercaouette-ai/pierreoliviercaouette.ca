import { evaluateDossierReadiness } from '../../lib/illustrateur/workflow';
import { formatCad } from '../../lib/illustrateur';
import { ATTAINMENT_DOMAIN_LABELS } from '../../lib/illustrateur/attainment';
import { CollectCard } from './collectUi';
import { usePlan } from './PlanContext';

export function HubStep({ onImportClick }) {
  const {
    plan,
    setWorkflowStep,
    loadDemo,
    loadEmpty,
    openProposalPresentation,
    modulesBundle,
    attainment,
  } = usePlan();
  const readiness = evaluateDossierReadiness(plan);
  const hasOptions = modulesBundle?.hasSelections;
  const client =
    [plan.person?.firstName, plan.person?.lastName].filter(Boolean).join(' ') ||
    plan.meta?.clientLabel ||
    plan.meta?.name ||
    'Nouveau parcours client';

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-[#d7dee8] bg-[#0a2a4a] px-6 py-10 text-white md:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
          Collecte SAAS · session navigateur
        </p>
        <h2 className="mt-3 max-w-2xl font-heading text-3xl md:text-4xl">{client}</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
          Sidebar d’étapes, gaps live à droite, recommandations manuelles, puis options A-B-C et présentation
          client — sans stockage cloud.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setWorkflowStep('personnelles')}
            className="rounded-md bg-[#0b4ea2] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Continuer la collecte →
          </button>
          {hasOptions && (
            <button
              type="button"
              onClick={openProposalPresentation}
              className="rounded-md border border-white/30 px-5 py-2.5 text-sm font-semibold"
            >
              Présenter au client
            </button>
          )}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <PhaseCard
          n="1"
          title="Collecte"
          body="Infos, objectifs, bilan, revenus, urgence, décès, invalidité, MG, projets, retraite."
          onClick={() => setWorkflowStep('personnelles')}
        />
        <PhaseCard
          n="2"
          title="Plan"
          body="Recommandations + options A-B-C pour couvrir les gaps prioritaires."
          onClick={() => setWorkflowStep(readiness.ready ? 'recommandations' : 'personnelles')}
        />
        <PhaseCard
          n="3"
          title="Rapport"
          body="Synthèse, présentation plein écran et export PDF/JSON."
          onClick={() => setWorkflowStep('rapport')}
        />
      </div>

      <CollectCard title="Aperçu des gaps">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(ATTAINMENT_DOMAIN_LABELS).map(([key, label]) => {
            const a = attainment?.[key];
            if (!a) return null;
            return (
              <button
                key={key}
                type="button"
                onClick={() =>
                  setWorkflowStep(
                    key === 'criticalIllness'
                      ? 'maladie_grave'
                      : key === 'death'
                        ? 'deces'
                        : key === 'emergency'
                          ? 'urgence'
                          : key === 'disability'
                            ? 'invalidite'
                            : 'retraite',
                  )
                }
                className="rounded-lg border border-[#d7dee8] bg-white p-3 text-left text-sm hover:border-[#0b4ea2]"
              >
                <p className="font-semibold text-[#0b4ea2]">{label}</p>
                <p className="mt-1 tabular-nums">{a.pct} %</p>
                <p className="text-xs text-red-600">Manque {formatCad(a.shortfall)}</p>
              </button>
            );
          })}
        </div>
      </CollectCard>

      <CollectCard title="Dossier session">
        <ul className="mb-4 space-y-2 text-sm">
          {readiness.checks.map((c) => (
            <li key={c.id} className="flex gap-2">
              <span className={c.ok ? 'text-emerald-700' : 'text-amber-700'}>{c.ok ? '✓' : '○'}</span>
              {c.label}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          <Action onClick={loadDemo}>Charger démo</Action>
          <Action onClick={loadEmpty}>Nouveau dossier</Action>
          <Action onClick={onImportClick}>Import JSON / PDF parcours</Action>
        </div>
      </CollectCard>
    </div>
  );
}

function PhaseCard({ n, title, body, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-[#d7dee8] bg-white p-5 text-left shadow-sm transition hover:border-[#0b4ea2]"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5a6b7d]">Phase {n}</p>
      <p className="mt-1 font-heading text-xl text-[#12263a]">{title}</p>
      <p className="mt-2 text-sm text-[#5a6b7d]">{body}</p>
    </button>
  );
}

function Action({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-[#d7dee8] px-4 py-2 text-sm font-semibold hover:border-[#0b4ea2]"
    >
      {children}
    </button>
  );
}

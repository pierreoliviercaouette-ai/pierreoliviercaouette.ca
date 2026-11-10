import { useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { downloadCampagneToolPdf } from '../lib/campagneToolPdf';
import { formatCad, formatPct, summarizeProjection } from '../lib/illustrateur';
import { ATTAINMENT_DOMAIN_LABELS } from '../lib/illustrateur/attainment';
import { PLANNING_MODULES } from '../lib/illustrateur/planningModules';
import { useSeoMeta } from '../lib/seo';
import { BudgetStep } from '../components/illustrateur/BudgetStep';
import { CollectBilanStep } from '../components/illustrateur/CollectBilanStep';
import { CollectRevenusStep } from '../components/illustrateur/CollectRevenusStep';
import { CollectShell } from '../components/illustrateur/CollectShell';
import { CorporatifStep } from '../components/illustrateur/CorporatifStep';
import { FiscaliteStep } from '../components/illustrateur/FiscaliteStep';
import { FluxTresorerieStep } from '../components/illustrateur/FluxTresorerieStep';
import { HubStep } from '../components/illustrateur/HubStep';
import { ModulesTab } from '../components/illustrateur/ModulesTab';
import {
  CriticalIllnessStep,
  DeathNeedsStep,
  DisabilityStep,
  EmergencyStep,
  ProjectsStep,
  RetirementStep,
} from '../components/illustrateur/NeedsCollectSteps';
import { ObjectivesStep } from '../components/illustrateur/ObjectivesStep';
import { PersonalInfoStep } from '../components/illustrateur/PersonalInfoStep';
import { PlanProvider, usePlan } from '../components/illustrateur/PlanContext';
import { PresentationView } from '../components/illustrateur/PresentationView';
import { RecommendationsStep, RapportStep } from '../components/illustrateur/RecommendationsStep';
import { StepFooter, StepTitle } from '../components/illustrateur/collectUi';

const PATH = '/admin/illustrateur-patrimonial';

function AccessGate({ user }) {
  const location = useLocation();
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#eef2f7] px-4">
      <div className="max-w-md space-y-4 rounded-2xl border border-[#d7dee8] bg-white p-8 text-center shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-[#5a6b7d]">Dossier privé</p>
        <h1 className="font-heading text-2xl text-[#12263a]">Accès réservé à l’administration</h1>
        <p className="text-sm leading-relaxed text-[#5a6b7d]">
          {user
            ? 'Ce compte ne peut pas ouvrir l’illustrateur patrimonial.'
            : 'Connectez-vous avec un compte administrateur pour ouvrir l’outil.'}
        </p>
        {!user && (
          <Link
            to="/connexion"
            state={{ from: location }}
            className="inline-flex items-center justify-center rounded-full bg-[#0b4ea2] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Se connecter
          </Link>
        )}
      </div>
    </div>
  );
}

function ModulesInShell() {
  const { goWorkflowPrev, goWorkflowNext } = usePlan();
  return (
    <CollectShell title={<StepTitle>Options A-B-C</StepTitle>}>
      <ModulesTab />
      <StepFooter onPrev={goWorkflowPrev} onNext={goWorkflowNext} nextLabel="Rapport" />
    </CollectShell>
  );
}

function IllustrateurShell() {
  const {
    plan,
    workflowStep,
    presentMode,
    setPresentMode,
    loadDemo,
    loadEmpty,
    clearSession,
    exportJson,
    importFile,
    projection,
    modulesBundle,
    attainment,
    openProposalPresentation,
  } = usePlan();
  const fileRef = useRef(null);
  const summary = useMemo(() => summarizeProjection(projection), [projection]);
  const hasOptions = modulesBundle?.hasSelections;

  const exportPdf = async () => {
    const priorityLabels = (plan.priorities || [])
      .map((id) => PLANNING_MODULES.find((m) => m.id === id)?.label || id)
      .join(', ');
    const optionRows = (modulesBundle?.sections || [])
      .filter((s) => s.selected)
      .map((s) => ({ label: `${s.label} (${s.selectedLetter})`, value: s.selected?.name || '—' }));
    const gapRows = Object.entries(ATTAINMENT_DOMAIN_LABELS).map(([key, label]) => ({
      label,
      value: attainment?.[key]
        ? `${attainment[key].pct}% · manque ${formatCad(attainment[key].shortfall)}`
        : '—',
    }));
    const recoRows = (plan.recommendations || []).map((r, i) => ({
      label: `Reco ${i + 1} (${r.domain})`,
      value: r.text,
    }));

    await downloadCampagneToolPdf({
      title: plan.meta?.name || 'Planification patrimoniale',
      filename: 'illustrateur-patrimonial.pdf',
      sections: [
        {
          heading: 'Synthèse',
          rows: [
            {
              label: 'Client',
              value:
                [plan.person?.firstName, plan.person?.lastName].filter(Boolean).join(' ') ||
                plan.meta?.clientLabel ||
                '—',
            },
            { label: 'Valeur nette actuelle', value: formatCad(summary.netWorthNow) },
            { label: 'Valeur nette horizon', value: formatCad(summary.netWorthEnd) },
            { label: 'Croissance', value: formatCad(summary.growthCad) },
          ],
        },
        ...(priorityLabels
          ? [{ heading: 'Priorités RDV', rows: [{ label: 'Objectifs modules', value: priorityLabels }] }]
          : []),
        { heading: 'Gaps illustratifs', rows: gapRows },
        ...(recoRows.length ? [{ heading: 'Recommandations', rows: recoRows }] : []),
        ...(optionRows.length ? [{ heading: 'Options retenues', rows: optionRows }] : []),
      ],
      notes: plan.meta?.notes ? [plan.meta.notes] : [],
      disclaimer:
        'Illustration éducative destinée au conseiller en sécurité financière. Hypothèses non garanties.',
    });
  };

  if (presentMode) return <PresentationView />;

  return (
    <div className="min-h-screen bg-[#eef2f7] text-[#12263a]" data-testid="illustrateur-patrimonial">
      <header className="border-b border-[#d7dee8] bg-[#0a2a4a] text-white">
        <div className="container-max flex flex-wrap items-start justify-between gap-4 px-4 py-5 md:px-8">
          <div>
            <div className="flex items-center gap-3">
              <Link to="/admin" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
                Admin
              </Link>
              <span className="text-white/30">/</span>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Collecte SAAS locale</p>
            </div>
            <h1 className="mt-2 font-heading text-2xl md:text-3xl">
              {[plan.person?.firstName, plan.person?.lastName].filter(Boolean).join(' ') ||
                plan.meta?.clientLabel ||
                plan.meta?.name ||
                'Illustrateur patrimonial'}
            </h1>
            <p className="mt-1 text-sm text-white/65">
              Session navigateur · JSON · gaps live · options A-B-C · présentation
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {hasOptions && (
              <button
                type="button"
                onClick={openProposalPresentation}
                className="rounded-md bg-[#0b4ea2] px-4 py-2 text-sm font-semibold text-white"
              >
                Présenter
              </button>
            )}
            <button
              type="button"
              onClick={() => setPresentMode(true)}
              className="rounded-md border border-white/25 px-4 py-2 text-sm font-semibold"
            >
              Mode présentation
            </button>
          </div>
        </div>
        {workflowStep !== 'hub' && (
          <div className="container-max grid gap-3 px-4 pb-5 sm:grid-cols-2 lg:grid-cols-4 md:px-8">
            <HeaderStat label="Valeur nette" value={formatCad(summary.netWorthNow)} />
            <HeaderStat label="Croissance" value={formatCad(summary.growthCad)} sub={formatPct(summary.growthPct)} />
            <HeaderStat
              label="Gap décès"
              value={formatCad(attainment?.death?.shortfall)}
              sub={`${attainment?.death?.pct ?? 0} %`}
            />
            <HeaderStat
              label="Gap invalidité /mois"
              value={formatCad(attainment?.disability?.shortfall)}
              sub={`${attainment?.disability?.pct ?? 0} %`}
            />
          </div>
        )}
      </header>

      <div className="border-b border-[#d7dee8] bg-white/80 px-4 py-2 md:px-8">
        <div className="container-max flex flex-wrap gap-1.5">
          <ActionBtn onClick={loadDemo}>Démo</ActionBtn>
          <ActionBtn onClick={loadEmpty}>Nouveau</ActionBtn>
          <ActionBtn onClick={exportJson}>JSON</ActionBtn>
          <ActionBtn onClick={exportPdf}>PDF</ActionBtn>
          <ActionBtn onClick={() => fileRef.current?.click()}>Import</ActionBtn>
          <ActionBtn onClick={clearSession}>Effacer</ActionBtn>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                await importFile(file);
              } catch (err) {
                window.alert(err?.message || 'Import impossible');
              }
              e.target.value = '';
            }}
          />
        </div>
      </div>

      <div className="container-max px-4 py-6 md:px-8 md:py-8">
        {workflowStep === 'hub' && <HubStep onImportClick={() => fileRef.current?.click()} />}
        {workflowStep === 'personnelles' && <PersonalInfoStep />}
        {workflowStep === 'objectifs' && <ObjectivesStep />}
        {workflowStep === 'bilan' && <CollectBilanStep />}
        {workflowStep === 'revenus' && <CollectRevenusStep />}
        {workflowStep === 'budget' && <BudgetStep />}
        {workflowStep === 'corporatif' && <CorporatifStep />}
        {workflowStep === 'fiscalite' && <FiscaliteStep />}
        {workflowStep === 'flux' && <FluxTresorerieStep />}
        {workflowStep === 'urgence' && <EmergencyStep />}
        {workflowStep === 'deces' && <DeathNeedsStep />}
        {workflowStep === 'invalidite' && <DisabilityStep />}
        {workflowStep === 'maladie_grave' && <CriticalIllnessStep />}
        {workflowStep === 'projets' && <ProjectsStep />}
        {workflowStep === 'retraite' && <RetirementStep />}
        {workflowStep === 'recommandations' && <RecommendationsStep />}
        {workflowStep === 'modules' && <ModulesInShell />}
        {workflowStep === 'rapport' && <RapportStep />}
      </div>

      <footer className="border-t border-[#d7dee8] bg-white/70 px-4 py-6 text-center text-xs text-[#5a6b7d] md:px-8">
        Illustration éducative destinée au conseiller en sécurité financière. Hypothèses non garanties.
      </footer>
    </div>
  );
}

function HeaderStat({ label, value, sub }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-white/50">{label}</p>
      <p className="mt-1 font-heading text-xl tabular-nums text-white">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-white/45">{sub}</p>}
    </div>
  );
}

function ActionBtn({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-[#d7dee8] bg-white px-3 py-1.5 text-xs font-semibold text-[#12263a] hover:border-[#0b4ea2]"
    >
      {children}
    </button>
  );
}

export const IllustrateurPatrimonial = () => {
  const { user, loading } = useAuth();

  useSeoMeta({
    title: 'Illustrateur patrimonial | Admin',
    description: 'Outil interne de collecte et planification. Accès administrateur seulement.',
    canonicalPath: PATH,
    noindex: true,
  });

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#eef2f7]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0b4ea2] border-t-transparent" />
      </div>
    );
  }

  if (!user?.is_admin) return <AccessGate user={user} />;

  return (
    <PlanProvider>
      <IllustrateurShell />
    </PlanProvider>
  );
};

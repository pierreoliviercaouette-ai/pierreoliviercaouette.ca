import { useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { downloadCampagneToolPdf } from '../lib/campagneToolPdf';
import { formatCad, formatPct, summarizeProjection } from '../lib/illustrateur';
import { useSeoMeta } from '../lib/seo';
import { AnalyseTab } from '../components/illustrateur/AnalyseTab';
import { BilanTab } from '../components/illustrateur/BilanTab';
import { DashboardTab } from '../components/illustrateur/DashboardTab';
import { OptionsDashboard } from '../components/illustrateur/OptionsDashboard';
import { PlanProvider, usePlan } from '../components/illustrateur/PlanContext';
import { PlanificationTab } from '../components/illustrateur/PlanificationTab';
import { PresentationView } from '../components/illustrateur/PresentationView';
import { RevenusTab } from '../components/illustrateur/RevenusTab';
import { ScenariosTab } from '../components/illustrateur/ScenariosTab';

const PATH = '/admin/illustrateur-patrimonial';

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'options', label: 'Options A-B-C' },
  { id: 'scenarios', label: 'Scénarios' },
  { id: 'bilan', label: 'Bilan' },
  { id: 'revenus', label: 'Revenus' },
  { id: 'plan', label: 'Planification' },
  { id: 'analyse', label: 'Analyse' },
];

function AccessGate({ user }) {
  const location = useLocation();
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#f4f1eb] px-4">
      <div className="max-w-md space-y-4 rounded-2xl border border-prestige-beige bg-white p-8 text-center shadow-ia">
        <p className="text-xs uppercase tracking-[0.18em] text-prestige-taupe">Dossier privé</p>
        <h1 className="font-heading text-2xl text-dark">Accès réservé à l’administration</h1>
        <p className="text-sm leading-relaxed text-prestige-taupe">
          {user
            ? 'Ce compte ne peut pas ouvrir l’illustrateur patrimonial.'
            : 'Connectez-vous avec un compte administrateur pour ouvrir l’outil.'}
        </p>
        {!user && (
          <Link
            to="/connexion"
            state={{ from: location }}
            className="inline-flex items-center justify-center rounded-full bg-dark px-5 py-2.5 text-sm font-semibold text-white"
          >
            Se connecter
          </Link>
        )}
      </div>
    </div>
  );
}

function IllustrateurShell() {
  const {
    plan,
    tab,
    setTab,
    presentMode,
    setPresentMode,
    loadDemo,
    loadEmpty,
    clearSession,
    exportJson,
    importFile,
    projection,
    proposalBundle,
    openProposalPresentation,
  } = usePlan();
  const fileRef = useRef(null);
  const summary = useMemo(() => summarizeProjection(projection), [projection]);
  const hasOptions = proposalBundle?.hasOptions;

  const exportPdf = async () => {
    await downloadCampagneToolPdf({
      title: plan.meta?.name || 'Illustrateur patrimonial',
      filename: 'illustrateur-patrimonial.pdf',
      sections: [
        {
          heading: 'Synthèse',
          rows: [
            { label: 'Valeur nette actuelle', value: formatCad(summary.netWorthNow) },
            { label: 'Valeur nette horizon', value: formatCad(summary.netWorthEnd) },
            { label: 'Croissance', value: formatCad(summary.growthCad) },
            { label: 'Cashflow an 0', value: formatCad(summary.cashflowYear0) },
            {
              label: 'Succession nette illustrée',
              value: summary.deathNetEstate != null ? formatCad(summary.deathNetEstate) : '—',
            },
          ],
        },
      ],
      notes: plan.meta?.notes ? [plan.meta.notes] : [],
      disclaimer:
        'Illustration éducative destinée au conseiller en sécurité financière. Hypothèses non garanties. Ne remplace pas fiscaliste, juriste ou illustration d’assureur.',
    });
  };

  if (presentMode) {
    return <PresentationView />;
  }

  return (
    <div className="min-h-screen bg-[#f0ebe3] text-dark" data-testid="illustrateur-patrimonial">
      <header className="border-b border-prestige-beige bg-dark text-white">
        <div className="container-max px-4 py-6 md:px-8 md:py-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Link
                  to="/admin"
                  className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50 hover:text-white"
                >
                  Admin
                </Link>
                <span className="text-white/30">/</span>
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Illustrateur</p>
              </div>
              <h1 className="mt-2 font-heading text-2xl md:text-3xl">
                {plan.meta?.clientLabel || plan.meta?.name || 'Illustrateur patrimonial'}
              </h1>
              <p className="mt-1 text-sm text-white/65">
                Proposition A-B-C · dashboard live · session navigateur seulement
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {hasOptions && (
                <button
                  type="button"
                  onClick={openProposalPresentation}
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                >
                  Présenter A-B-C
                </button>
              )}
              <button
                type="button"
                onClick={() => setPresentMode(true)}
                className="rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white"
              >
                Mode présentation
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <HeaderStat label="Valeur nette" value={formatCad(summary.netWorthNow)} />
            <HeaderStat
              label="Croissance horizon"
              value={formatCad(summary.growthCad)}
              sub={formatPct(summary.growthPct)}
            />
            <HeaderStat label="Cashflow an 0" value={formatCad(summary.cashflowYear0)} />
            <HeaderStat
              label="Endettement"
              value={formatPct(summary.debtRatioNow)}
              sub={`→ ${formatPct(summary.debtRatioEnd)}`}
            />
          </div>
        </div>
      </header>

      <nav className="sticky top-20 z-40 border-b border-prestige-beige bg-[#f0ebe3]/95 backdrop-blur print:hidden">
        <div className="container-max flex items-center gap-2 overflow-x-auto px-4 py-3 md:px-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                tab === t.id
                  ? 'bg-dark text-white shadow-sm'
                  : 'bg-white/70 text-dark/75 hover:bg-white hover:text-dark'
              }`}
            >
              {t.label}
            </button>
          ))}
          <div className="ml-auto flex shrink-0 flex-wrap gap-1.5">
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
      </nav>

      <div className="container-max px-4 py-6 md:px-8 md:py-8">
        {tab === 'dashboard' && <DashboardTab />}
        {tab === 'options' && <OptionsDashboard />}
        {tab === 'scenarios' && <ScenariosTab />}
        {tab === 'bilan' && <BilanTab />}
        {tab === 'revenus' && <RevenusTab />}
        {tab === 'plan' && <PlanificationTab />}
        {tab === 'analyse' && <AnalyseTab />}
      </div>

      <footer className="border-t border-prestige-beige bg-white/70 px-4 py-6 text-center text-xs text-prestige-taupe md:px-8">
        Illustration éducative destinée au conseiller en sécurité financière. Hypothèses non garanties. Ne remplace
        pas un fiscaliste, un juriste ou une illustration d’assureur.
      </footer>
    </div>
  );
}

function HeaderStat({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
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
      className="rounded-full border border-prestige-beige bg-white px-3 py-1.5 text-xs font-semibold hover:border-primary"
    >
      {children}
    </button>
  );
}

export const IllustrateurPatrimonial = () => {
  const { user, loading } = useAuth();

  useSeoMeta({
    title: 'Illustrateur patrimonial | Admin',
    description: 'Outil interne de projection patrimoniale. Accès administrateur seulement.',
    canonicalPath: PATH,
    noindex: true,
  });

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f4f1eb]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user?.is_admin) {
    return <AccessGate user={user} />;
  }

  return (
    <PlanProvider>
      <IllustrateurShell />
    </PlanProvider>
  );
};

import { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { downloadCampagneToolPdf } from '../lib/campagneToolPdf';
import { formatCad, summarizeProjection } from '../lib/illustrateur';
import { useSeoMeta } from '../lib/seo';
import { AnalyseTab } from '../components/illustrateur/AnalyseTab';
import { BilanTab } from '../components/illustrateur/BilanTab';
import { PlanProvider, usePlan } from '../components/illustrateur/PlanContext';
import { PlanificationTab } from '../components/illustrateur/PlanificationTab';
import { PresentationView } from '../components/illustrateur/PresentationView';
import { RevenusTab } from '../components/illustrateur/RevenusTab';

const PATH = '/admin/illustrateur-patrimonial';

const TABS = [
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
  } = usePlan();
  const fileRef = useRef(null);

  const exportPdf = async () => {
    const summary = summarizeProjection(projection);
    await downloadCampagneToolPdf({
      title: plan.meta?.name || 'Illustrateur patrimonial',
      filename: 'illustrateur-patrimonial.pdf',
      sections: [
        {
          heading: 'Synthèse',
          rows: [
            { label: 'Valeur nette actuelle', value: formatCad(summary.netWorthNow) },
            { label: 'Valeur nette horizon', value: formatCad(summary.netWorthEnd) },
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
    <div className="bg-[#f4f1eb] text-dark" data-testid="illustrateur-patrimonial">
      <nav className="sticky top-20 z-40 border-b border-prestige-beige bg-[#f4f1eb]/95 backdrop-blur print:hidden">
        <div className="container-max flex items-center gap-4 overflow-x-auto px-4 py-3 md:px-8">
          <Link
            to="/admin"
            className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-prestige-taupe hover:text-dark"
          >
            Admin
          </Link>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${
                tab === t.id ? 'bg-dark text-white' : 'text-dark/80 hover:text-dark'
              }`}
            >
              {t.label}
            </button>
          ))}
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setPresentMode(true)}
              className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white"
            >
              Présentation
            </button>
          </div>
        </div>
      </nav>

      <header className="border-b border-prestige-beige bg-dark text-white">
        <div className="container-max px-4 py-10 md:px-8 md:py-14">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Outil conseiller</p>
          <h1 className="mt-2 font-heading text-3xl md:text-4xl">Illustrateur patrimonial</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
            Projection multi-années (moteur ImmoIQ) — fiscalité, assurances, PFI, valeur nette et scénarios.
            Aucune donnée client n’est enregistrée dans Supabase : session navigateur + export JSON seulement.
          </p>
          <p className="mt-2 text-sm text-white/80">{plan.meta?.name}</p>
        </div>
      </header>

      <div className="container-max space-y-4 px-4 py-4 print:hidden md:px-8">
        <div className="flex flex-wrap gap-2">
          <ActionBtn onClick={loadDemo}>Dossier démo</ActionBtn>
          <ActionBtn onClick={loadEmpty}>Nouveau vide</ActionBtn>
          <ActionBtn onClick={exportJson}>Exporter JSON</ActionBtn>
          <ActionBtn onClick={exportPdf}>PDF synthèse</ActionBtn>
          <ActionBtn onClick={() => fileRef.current?.click()}>Importer JSON</ActionBtn>
          <ActionBtn onClick={clearSession}>Effacer session</ActionBtn>
          <Link
            to="/admin/assurance-vie-actif"
            className="rounded-full border border-prestige-beige bg-white px-3 py-1.5 text-xs font-semibold"
          >
            Vie / levier
          </Link>
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

      <div className="container-max px-4 pb-16 md:px-8">
        {tab === 'bilan' && <BilanTab />}
        {tab === 'revenus' && <RevenusTab />}
        {tab === 'plan' && <PlanificationTab />}
        {tab === 'analyse' && <AnalyseTab />}
      </div>

      <footer className="border-t border-prestige-beige bg-white/70 px-4 py-6 text-center text-xs text-prestige-taupe md:px-8">
        Illustration éducative destinée au conseiller en sécurité financière. Hypothèses non garanties. Ne remplace
        pas un fiscaliste, un juriste ou une illustration d’assureur. Titre réglementaire : conseiller en sécurité
        financière — jamais « planificateur financier » non autorisé.
      </footer>
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

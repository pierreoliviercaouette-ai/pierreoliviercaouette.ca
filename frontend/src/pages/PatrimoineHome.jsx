import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Handshake,
  Landmark,
  Scale,
  Shield,
  TrendingUp,
  Users,
  UserCheck,
  GitBranch,
} from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { DEFAULT_OG_IMAGE, useSeoMeta } from '../lib/seo';
import { AMF_REGISTRE_URL } from '../lib/branding';
import { FormationsTeaser } from '../components/formations/FormationsTeaser';

const trackCta = (itemId) =>
  trackEvent('select_content', { content_type: 'cta', item_id: itemId });

const AUDIENCE_PROFILES = [
  {
    title: 'Vous y êtes déjà',
    description:
      'Patrimoine substantiel, société, surplus de liquidités : vous voulez structurer, protéger et transmettre sans improvisation.',
  },
  {
    title: 'Vous êtes en voie',
    description:
      'Revenus en hausse, entreprise qui grandit, actifs qui s’accumulent : les bons choix aujourd’hui évitent les détours coûteux demain.',
  },
  {
    title: 'Vous voulez vous y rendre',
    description:
      'Ambition claire de bâtir un patrimoine plus élevé. On pose des fondations solides — protection, épargne, fiscalité — dès maintenant.',
  },
];

const OFFERS = [
  {
    id: 'patrimoine',
    icon: Landmark,
    title: 'Maximisation du patrimoine',
    description:
      'Vision d’ensemble des actifs personnels et corporatifs pour protéger et faire croître le capital.',
  },
  {
    id: 'optimisation-fiscale',
    icon: Scale,
    title: 'Optimisation fiscale',
    description:
      'Véhicules d’épargne, assurance et détention — dans le cadre des règles, validés avec vos experts au besoin.',
  },
  {
    id: 'entreprise',
    icon: Users,
    title: 'Stratégie corporative',
    description:
      'Personne clé, convention entre actionnaires et continuité de l’entreprise.',
  },
  {
    id: 'assurances-employes',
    icon: Building2,
    title: 'Assurances pour employés',
    description:
      'Régimes pour attirer et retenir les talents, tout en protégeant l’organisation.',
  },
];

const STRATEGIES = [
  {
    id: 'liquidite',
    number: '01',
    icon: Landmark,
    title: 'Liquidité successorale',
    profile: 'Famille / patrimoine en croissance',
    hook: 'Éviter de vendre des actifs au mauvais moment.',
    summary:
      'Utiliser l’assurance vie permanente pour créer des liquidités au décès et limiter la pression de vendre des actifs au mauvais moment.',
    outcomes: ['Couvrir l’impôt latent estimé', 'Protéger le conjoint et les héritiers', 'Garder le contrôle sur le timing des ventes'],
    href: '/services/patrimoine',
  },
  {
    id: 'surplus',
    number: '02',
    icon: Scale,
    title: 'Surplus corporatif + assurance',
    profile: 'Professionnel incorporé / PME',
    hook: 'Quand REER et CELI ne suffisent plus.',
    summary:
      'Quand le CELI et le REER sont maximisés, évaluer si une portion du surplus de société peut soutenir une stratégie d’assurance corporative.',
    outcomes: ['Clarifier perso vs corpo', 'Croissance dans le contrat, selon les règles', 'Préparer une sortie ou une transmission'],
    href: '/services/optimisation-fiscale',
  },
  {
    id: 'convention',
    number: '03',
    icon: Handshake,
    title: 'Convention entre actionnaires',
    profile: 'Associés / actionnaires',
    hook: 'Protéger l’entreprise et les familles.',
    summary:
      'Financer le rachat d’actions si un associé décède ou devient invalide — pour que l’entreprise et les familles restent protégées.',
    outcomes: ['Prix et modalités clairs', 'Financement via assurance', 'Continuité sans conflit inutile'],
    href: '/services/entreprise',
  },
  {
    id: 'personne-cle',
    number: '04',
    icon: UserCheck,
    title: 'Personne clé',
    profile: 'Entreprise en croissance',
    hook: 'Acheter du temps si un talent clé disparaît.',
    summary:
      'Protéger la société contre la perte d’un cadre ou d’un associé indispensable au chiffre d’affaires.',
    outcomes: ['Capital pour recruter ou stabiliser', 'Rassurer créanciers et partenaires', 'Continuité pour la direction'],
    href: '/services/entreprise',
  },
  {
    id: 'egalisation',
    number: '05',
    icon: GitBranch,
    title: 'Égalisation successorale',
    profile: 'Famille entrepreneuriale',
    hook: 'Équité entre héritiers, entreprise intacte.',
    summary:
      'Un enfant reprend l’entreprise, les autres reçoivent une part équitable via une couverture d’assurance — sans forcer le démembrement de l’actif.',
    outcomes: ['Équité entre héritiers', 'Entreprise intacte', 'Moins de tensions familiales'],
    href: '/services/patrimoine',
  },
  {
    id: 'employes',
    number: '06',
    icon: Building2,
    title: 'Régimes pour employés et cadres',
    profile: 'PME qui recrute',
    hook: 'Attirer et retenir les bons talents.',
    summary:
      'Mettre en place une couverture collective et des protections complémentaires pour retenir les talents et sécuriser l’équipe.',
    outcomes: ['Offre d’emploi plus compétitive', 'Protection invalidité / vie', 'Options pour cadres clés'],
    href: '/services/assurances-employes',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Diagnostic',
    description: 'Objectifs, actifs, cash-flow, risques. On voit où vous en êtes — et où vous voulez aller.',
  },
  {
    number: '02',
    title: 'Priorités',
    description: 'Ce qui est urgent, ce qui construit le patrimoine, ce qui peut attendre. Une feuille de route lisible.',
  },
  {
    number: '03',
    title: 'Stratégies',
    description: 'Concepts d’assurance et d’épargne adaptés. Illustrations claires, sans jargon inutile.',
  },
  {
    number: '04',
    title: 'Action + suivi',
    description: 'Mise en œuvre, coordination avec vos experts au besoin, et révisions quand la vie change.',
  },
];

function PrimaryCta({ to, itemId, children, className = '', testId }) {
  return (
    <Link
      to={to}
      onClick={() => trackCta(itemId)}
      className={`inline-flex min-h-[52px] items-center justify-center gap-2 border-2 border-white bg-white px-8 py-3.5 text-sm font-semibold text-[#111111] transition-colors hover:bg-transparent hover:text-white ${className}`}
      data-testid={testId}
    >
      {children}
      <ArrowRight className="h-4 w-4 shrink-0" />
    </Link>
  );
}

function SecondaryCta({ to, itemId, children, className = '', light = false }) {
  const classes = `inline-flex min-h-[52px] items-center justify-center gap-2 border-2 px-8 py-3.5 text-sm font-semibold transition-colors ${
    light
      ? 'border-white/40 text-white hover:border-white hover:bg-white/5'
      : 'border-dark text-dark hover:bg-dark hover:text-white'
  } ${className}`;

  if (typeof to === 'string' && to.startsWith('#')) {
    return (
      <a href={to} onClick={() => trackCta(itemId)} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to} onClick={() => trackCta(itemId)} className={classes}>
      {children}
    </Link>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#111111]" data-testid="patrimoine-hero">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container-max relative z-10 px-5 sm:px-6 md:px-10 lg:px-14 py-16 md:py-24 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">
              Patrimoine · En chemin ou déjà là
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08] tracking-tight">
              Structurer un patrimoine qui vous mène plus loin
            </h1>
            <p className="text-white/75 text-lg md:text-xl max-w-xl leading-relaxed">
              Que vous ayez déjà un haut niveau d’actifs, que vous y soyez en voie, ou que vous
              visiez clairement d’y arriver : des stratégies d’assurance et d’épargne concrètes,
              pensées pour convertir l’ambition en plan d’action.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <PrimaryCta to="/rendez-vous" itemId="patrimoine_hero_rdv" testId="patrimoine-hero-rdv">
                <Calendar className="h-4 w-4" />
                Réserver une consultation
              </PrimaryCta>
              <SecondaryCta to="#strategies" itemId="patrimoine_hero_strategies" light>
                Voir des exemples de stratégies
              </SecondaryCta>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm text-white/55">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Première rencontre sans engagement
              </span>
              <a
                href={AMF_REGISTRE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-white transition-colors"
              >
                <Shield className="h-4 w-4" /> Inscrit AMF
              </a>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative border border-white/20 bg-white/[0.03] p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45 mb-5">
                Ce que vous repartez avec
              </p>
              <ul className="space-y-5">
                {[
                  {
                    icon: TrendingUp,
                    text: 'Une lecture claire de où vous en êtes dans votre parcours patrimonial',
                  },
                  {
                    icon: Landmark,
                    text: '2–3 pistes de stratégies adaptées à votre prochaine étape',
                  },
                  {
                    icon: CheckCircle2,
                    text: 'Des prochaines actions concrètes — pas une présentation générique',
                  },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-4 text-white/80">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-white/45" />
                    <span className="text-sm leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 border-t border-white/15 pt-6">
                <p className="text-white/90 text-sm leading-relaxed">
                  Toute l’expertise. Tous les produits. Toute notre attention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="audience-accent-bar" aria-hidden />
    </section>
  );
}

function AudienceSection() {
  return (
    <section className="section-padding bg-white" data-testid="patrimoine-audience">
      <div className="container-max">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-prestige-taupe mb-3">
            Pour qui
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4">
            Pas seulement « déjà fortuné » — aussi ceux qui construisent
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Le focus, ce n’est pas un seuil d’actifs. C’est l’intention : protéger ce qui compte,
            accélérer intelligemment, et éviter les erreurs qui coûtent cher quand le patrimoine
            grossit.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {AUDIENCE_PROFILES.map((profile) => (
            <div
              key={profile.title}
              className="border border-prestige-beige bg-zinc-50/80 p-6 flex flex-col"
            >
              <h3 className="font-heading text-xl font-semibold text-dark mb-3">{profile.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed flex-1">{profile.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center">
          <PrimaryCta
            to="/rendez-vous"
            itemId="patrimoine_audience_rdv"
            testId="patrimoine-audience-rdv"
            className="!border-dark !bg-dark !text-white hover:!bg-transparent hover:!text-dark"
          >
            <Calendar className="h-4 w-4" />
            Parler de mon étape actuelle
          </PrimaryCta>
          <p className="text-sm text-slate-500">15–30 min pour clarifier si l’approche vous convient.</p>
        </div>
      </div>
    </section>
  );
}

function StrategyDetailBody({ strategy, compact = false }) {
  return (
    <>
      <p className={`text-white/70 leading-relaxed ${compact ? 'text-sm mb-5' : 'text-base md:text-lg mb-8 max-w-xl'}`}>
        {strategy.summary}
      </p>

      <div className={compact ? 'mb-5' : 'mb-8'}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40 mb-3">
          Ce que ça permet
        </p>
        <ul className="space-y-2.5">
          {strategy.outcomes.map((item, index) => (
            <li key={item} className="flex items-start gap-3 text-white/85">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-white/25 text-[11px] font-semibold text-white/70">
                {index + 1}
              </span>
              <span className="text-sm leading-relaxed pt-0.5">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={`flex flex-col gap-2.5 ${compact ? '' : 'sm:flex-row sm:items-center'}`}>
        <Link
          to="/rendez-vous"
          onClick={() => trackCta(`patrimoine_strategy_rdv_${strategy.id}`)}
          className={`inline-flex min-h-[48px] items-center justify-center gap-2 border-2 border-white bg-white px-5 py-3 text-sm font-semibold text-[#111111] transition-colors hover:bg-transparent hover:text-white ${
            compact ? 'w-full' : ''
          }`}
        >
          Voir si ça s’applique à moi
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to={strategy.href}
          onClick={() => trackCta(`patrimoine_strategy_learn_${strategy.id}`)}
          className={`inline-flex min-h-[44px] items-center justify-center gap-2 border-2 border-white/35 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/5 ${
            compact ? 'w-full' : ''
          }`}
        >
          En savoir plus
        </Link>
      </div>
    </>
  );
}

function StrategiesSection() {
  const [activeId, setActiveId] = useState(STRATEGIES[0].id);
  const active = STRATEGIES.find((s) => s.id === activeId) ?? STRATEGIES[0];
  const ActiveIcon = active.icon;

  const toggleMobile = (id) => {
    setActiveId((prev) => (prev === id ? '' : id));
    trackCta(`patrimoine_strategy_select_${id}`);
  };

  return (
    <section
      id="strategies"
      className="relative overflow-hidden bg-[#111111] scroll-mt-24"
      data-testid="patrimoine-strategies"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="pointer-events-none absolute -right-24 top-1/4 hidden h-[420px] w-[420px] rounded-full bg-white/[0.03] lg:block" />

      <div className="container-max relative section-padding">
        <div className="mb-8 md:mb-14 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45 mb-4">
            Exemples de stratégies
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white leading-[1.1] mb-4 md:mb-5">
            Des concepts concrets — pas une liste de produits
          </h2>
          <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-2xl">
            <span className="lg:hidden">Touchez une stratégie pour voir le détail. </span>
            <span className="hidden lg:inline">Survolez ou sélectionnez une stratégie. </span>
            Illustrations typiques pour clients à haut niveau d’actifs, ou en chemin pour s’y rendre.
          </p>
        </div>

        {/* Mobile : accordéon vertical */}
        <div className="space-y-3 lg:hidden" data-testid="strategies-mobile-accordion">
          {STRATEGIES.map((strategy) => {
            const isOpen = activeId === strategy.id;
            const Icon = strategy.icon;
            const panelId = `strategy-mobile-${strategy.id}`;
            return (
              <div
                key={strategy.id}
                className={`border transition-colors duration-300 ${
                  isOpen ? 'border-white bg-white/[0.06]' : 'border-white/15 bg-white/[0.03]'
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleMobile(strategy.id)}
                  className="flex w-full min-h-[64px] items-start gap-3 px-4 py-4 text-left"
                  data-testid={`strategy-mobile-${strategy.id}`}
                >
                  <span
                    className={`font-heading text-xl font-bold tabular-nums leading-none pt-0.5 ${
                      isOpen ? 'text-white' : 'text-white/35'
                    }`}
                  >
                    {strategy.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 mb-1">
                      <Icon className={`h-4 w-4 shrink-0 ${isOpen ? 'text-white' : 'text-white/40'}`} />
                      <span className="font-heading text-base font-semibold text-white leading-snug">
                        {strategy.title}
                      </span>
                    </span>
                    <span className="block text-xs text-white/45 leading-relaxed">{strategy.hook}</span>
                  </span>
                  <ChevronDown
                    className={`mt-1 h-5 w-5 shrink-0 text-white/50 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>

                <div
                  id={panelId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-white/15 px-4 pb-5 pt-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40 mb-3">
                        {strategy.profile}
                      </p>
                      <StrategyDetailBody strategy={strategy} compact />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop : rail + panneau */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] gap-8 items-stretch">
          <div
            className="flex flex-col gap-2"
            role="tablist"
            aria-label="Stratégies patrimoniales"
          >
            {STRATEGIES.map((strategy) => {
              const isActive = strategy.id === activeId;
              const Icon = strategy.icon;
              return (
                <button
                  key={strategy.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onMouseEnter={() => setActiveId(strategy.id)}
                  onFocus={() => setActiveId(strategy.id)}
                  onClick={() => {
                    setActiveId(strategy.id);
                    trackCta(`patrimoine_strategy_select_${strategy.id}`);
                  }}
                  className={`group relative flex items-start gap-4 border px-4 py-4 text-left transition-all duration-300 ${
                    isActive
                      ? 'border-white bg-white text-[#111111]'
                      : 'border-white/15 bg-white/[0.03] text-white/70 hover:border-white/35 hover:bg-white/[0.06] hover:text-white'
                  }`}
                  data-testid={`strategy-tab-${strategy.id}`}
                >
                  <span
                    className={`font-heading text-2xl font-bold leading-none tabular-nums transition-colors ${
                      isActive ? 'text-[#111111]' : 'text-white/30 group-hover:text-white/50'
                    }`}
                  >
                    {strategy.number}
                  </span>
                  <span className="min-w-0 flex-1 pt-0.5">
                    <span className="flex items-center gap-2 mb-1">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#111111]' : 'text-white/40'}`} />
                      <span className="font-heading text-lg font-semibold leading-snug">
                        {strategy.title}
                      </span>
                    </span>
                    <span className={`block text-xs leading-relaxed ${isActive ? 'text-black/55' : 'text-white/40'}`}>
                      {strategy.hook}
                    </span>
                  </span>
                  <ArrowRight
                    className={`mt-1 h-4 w-4 shrink-0 transition-all duration-300 ${
                      isActive
                        ? 'translate-x-0 opacity-100 text-[#111111]'
                        : '-translate-x-1 opacity-0 text-white'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div
            key={active.id}
            className="relative flex min-h-[420px] flex-col border border-white/20 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-10 animate-fade-in"
            role="tabpanel"
            data-testid={`strategy-panel-${active.id}`}
          >
            <div className="absolute left-0 top-0 h-full w-1 bg-white" aria-hidden />

            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-3">
                  {active.profile}
                </p>
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex h-12 w-12 items-center justify-center border border-white/25 bg-white/5">
                    <ActiveIcon className="h-6 w-6 text-white" />
                  </span>
                  <h3 className="font-heading text-3xl font-bold text-white leading-tight">
                    {active.title}
                  </h3>
                </div>
              </div>
              <span className="font-heading text-6xl font-bold text-white/10 leading-none tabular-nums select-none">
                {active.number}
              </span>
            </div>

            <StrategyDetailBody strategy={active} />
          </div>
        </div>

        <p className="mt-8 md:mt-10 text-xs text-white/40 max-w-3xl leading-relaxed">
          <strong className="text-white/55">Important :</strong> ces exemples sont à titre
          informatif seulement. Ils ne constituent pas des conseils financiers, fiscaux ou
          juridiques personnalisés. Les produits d’assurance et de placement comportent des risques
          et ne conviennent pas à tous les profils.
        </p>
      </div>
    </section>
  );
}

function OffersSection() {
  return (
    <section className="section-padding bg-white" data-testid="patrimoine-offers">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="space-y-6 lg:sticky lg:top-28">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-prestige-taupe">
              Axes d’accompagnement
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark leading-tight">
              Quatre leviers pour avancer plus vite, avec moins d’angles morts
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Information claire + décisions actionnables. On priorise ce qui protège votre
              trajectoire et ce qui accélère la construction du patrimoine.
            </p>
            <PrimaryCta
              to="/rendez-vous"
              itemId="patrimoine_offers_rdv"
              testId="patrimoine-offers-rdv"
              className="!border-dark !bg-dark !text-white hover:!bg-transparent hover:!text-dark"
            >
              <Calendar className="h-4 w-4" />
              Planifier ma consultation
            </PrimaryCta>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {OFFERS.map((offer) => (
              <Link
                key={offer.id}
                to={`/services/${offer.id}`}
                onClick={() => trackCta(`patrimoine_offer_${offer.id}`)}
                className="group border border-prestige-beige bg-white p-5 transition-colors hover:border-dark"
                data-testid={`patrimoine-offer-${offer.id}`}
              >
                <offer.icon className="mb-4 h-6 w-6 text-dark" />
                <h3 className="font-heading text-lg font-semibold text-dark mb-2 group-hover:underline underline-offset-4">
                  {offer.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{offer.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-dark">
                  Explorer
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="section-padding bg-[#111111] text-white" data-testid="patrimoine-process">
      <div className="container-max">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45 mb-3">
            Comment ça se passe
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            De la conversation au plan — sans friction
          </h2>
          <p className="text-white/65 leading-relaxed">
            Une démarche simple, calibrée à votre étape. L’objectif de la première rencontre :
            savoir si on avance ensemble, et avec quoi.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {STEPS.map((step) => (
            <div key={step.number} className="border border-white/15 p-6">
              <span className="font-heading text-2xl font-bold text-white/90">{step.number}</span>
              <h3 className="font-heading text-lg font-semibold mt-3 mb-2">{step.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center border border-white/15 bg-white/[0.03] p-6 md:p-8">
          <div className="flex-1">
            <p className="font-heading text-xl font-semibold mb-1">Prêt à clarifier votre prochaine étape?</p>
            <p className="text-sm text-white/60">
              Consultation gratuite. Vous repartez avec des priorités concrètes.
            </p>
          </div>
          <PrimaryCta to="/rendez-vous" itemId="patrimoine_process_rdv" testId="patrimoine-process-rdv">
            <Calendar className="h-4 w-4" />
            Prendre rendez-vous
          </PrimaryCta>
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="section-padding bg-white border-t border-prestige-beige" data-testid="patrimoine-cta">
      <div className="container-max">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark">
            Votre patrimoine mérite un plan — pas seulement des produits
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Que vous soyez déjà à un haut niveau d’actifs ou en chemin pour y arriver, la bonne
            stratégie commence par une conversation honnête sur vos objectifs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <PrimaryCta
              to="/rendez-vous"
              itemId="patrimoine_final_rdv"
              testId="patrimoine-cta-rdv"
              className="!border-dark !bg-dark !text-white hover:!bg-transparent hover:!text-dark"
            >
              <Calendar className="h-4 w-4" />
              Réserver ma consultation
            </PrimaryCta>
            <SecondaryCta to="/contact" itemId="patrimoine_final_contact">
              Poser une question d’abord
            </SecondaryCta>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PatrimoineHome() {
  useSeoMeta({
    title: 'Patrimoine et stratégies avancées | En chemin ou déjà là',
    description:
      'Stratégies patrimoniales pour professionnels et entrepreneurs : en voie d’un haut niveau d’actifs ou déjà sur place. Exemples concrets et consultation gratuite.',
    canonicalPath: '/patrimoine',
    image: DEFAULT_OG_IMAGE,
    imageAlt:
      'Pierre-Olivier Caouette — Stratégies patrimoniales pour bâtir et protéger un patrimoine élevé',
  });

  return (
    <main data-testid="patrimoine-home-page" className="home-page">
      <Hero />
      <AudienceSection />
      <StrategiesSection />
      <OffersSection />
      <FormationsTeaser variant="dark" />
      <ProcessSection />
      <CtaSection />
    </main>
  );
}

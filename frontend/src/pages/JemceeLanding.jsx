import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Flag,
  Gauge,
  Heart,
  PiggyBank,
  Shield,
  Target,
  Timer,
  TrendingUp,
} from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';
import { AMF_REGISTRE_URL } from '../lib/branding';

export const JEMCEE_BOOKING_URL =
  'https://outlook.office.com/book/PierreOlivierCaouetteiAGroupefinancier@ia.ca/s/_4G_IKTvnEeGazDkP6WOUQ2?ismsaljsauthenabled';

const parallels = [
  {
    icon: Target,
    lap: '01',
    title: 'Préparation avant d’agir',
    track: 'Réglages, essais, objectifs de tour clairs.',
    finance: 'Revenus, protections et priorités de vie : un plan avant les décisions.',
  },
  {
    icon: Gauge,
    lap: '02',
    title: 'Performance mesurable',
    track: 'Temps au tour, données, ajustements continus.',
    finance: 'Épargne, couverture et fiscalité : des repères concrets pour progresser.',
  },
  {
    icon: Shield,
    lap: '03',
    title: 'Gestion du risque',
    track: 'Marge d’erreur, sécurité, décisions froides sous pression.',
    finance: 'Assurance vie, invalidité, urgences : protéger ce qui compte vraiment.',
  },
];

const focusAreas = [
  {
    icon: Shield,
    title: 'Protection',
    description:
      'Assurance vie, invalidité et maladie grave pour réduire les zones d’incertitude de votre famille.',
  },
  {
    icon: PiggyBank,
    title: 'Épargne & fiscalité',
    description:
      'REER, CELI et stratégies d’épargne adaptées à votre capacité et à votre horizon.',
  },
  {
    icon: TrendingUp,
    title: 'Patrimoine & retraite',
    description:
      'Structurer la croissance de votre patrimoine et viser la retraite avec un plan réaliste.',
  },
  {
    icon: Heart,
    title: 'Accompagnement humain',
    description:
      'Des conseils clairs, sans jargon inutile, au rythme de votre situation — pas un modèle générique.',
  },
];

const diagnosticSteps = [
  {
    step: '1',
    title: 'On clarifie votre point de départ',
    description: 'Revenus, objectifs, protections actuelles et ce qui vous préoccupe vraiment.',
  },
  {
    step: '2',
    title: 'On repère les priorités utiles',
    description: 'Ce qui mérite d’être renforcé maintenant… et ce qui peut attendre.',
  },
  {
    step: '3',
    title: 'Vous repartez avec une suite claire',
    description: 'Des prochaines étapes concrètes, sans pression et sans engagement.',
  },
];

function BookingCta({ itemId, className, children }) {
  return (
    <a
      href={JEMCEE_BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('select_content', { content_type: 'cta', item_id: itemId })}
      className={className}
      data-testid={itemId}
    >
      {children}
    </a>
  );
}

export const JemceeLanding = () => {
  useSeoMeta({
    title: 'Performance financière | Pierre-Olivier Caouette',
    description:
      'Sur la piste comme en finances, la performance se prépare. Conseiller en sécurité financière à Victoriaville — mini-diagnostic de 15-20 minutes, sans engagement.',
    canonicalPath: '/jemcee',
  });

  return (
    <main className="min-h-screen bg-white jemcee-landing" data-testid="jemcee-landing-page">
      <style>{`
        .jemcee-landing .jemcee-speed-line {
          animation: jemceeSpeed 9s linear infinite;
        }
        .jemcee-landing .jemcee-speed-line-delay {
          animation: jemceeSpeed 11s linear infinite;
          animation-delay: -4s;
        }
        .jemcee-landing .jemcee-fade-up {
          animation: jemceeFadeUp 0.7s ease-out both;
        }
        .jemcee-landing .jemcee-fade-up-delay {
          animation: jemceeFadeUp 0.7s ease-out 0.15s both;
        }
        .jemcee-landing .jemcee-fade-up-delay-2 {
          animation: jemceeFadeUp 0.7s ease-out 0.3s both;
        }
        @keyframes jemceeSpeed {
          from { transform: translateX(-30%); }
          to { transform: translateX(120%); }
        }
        @keyframes jemceeFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .jemcee-landing .jemcee-speed-line,
          .jemcee-landing .jemcee-speed-line-delay,
          .jemcee-landing .jemcee-fade-up,
          .jemcee-landing .jemcee-fade-up-delay,
          .jemcee-landing .jemcee-fade-up-delay-2 {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Hero */}
      <section
        className="relative min-h-[72vh] md:min-h-[82vh] overflow-hidden"
        aria-labelledby="jemcee-hero-title"
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#01233f_0%,#043a8c_48%,#064dd9_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.14] mix-blend-soft-light pointer-events-none"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          }}
          aria-hidden
        />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none"
          viewBox="0 0 1200 700"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <path
            d="M-40 520 C180 480 260 300 420 280 C620 255 680 420 860 400 C1020 382 1100 220 1280 190"
            fill="none"
            stroke="#fff"
            strokeWidth="28"
            strokeLinecap="round"
          />
          <path
            d="M-40 520 C180 480 260 300 420 280 C620 255 680 420 860 400 C1020 382 1100 220 1280 190"
            fill="none"
            stroke="#73c4ef"
            strokeWidth="2"
            strokeDasharray="14 18"
            opacity="0.7"
          />
        </svg>
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30" aria-hidden>
          <div className="jemcee-speed-line absolute top-[28%] left-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white to-transparent" />
          <div className="jemcee-speed-line-delay absolute top-[46%] left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-secondary to-transparent" />
          <div className="jemcee-speed-line absolute top-[62%] left-0 h-px w-3/5 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        </div>
        <div
          className="absolute top-0 bottom-0 left-[8%] w-1.5 bg-gradient-to-b from-white via-secondary to-transparent opacity-40 pointer-events-none hidden sm:block"
          aria-hidden
        />

        <div className="container-max relative z-10 flex flex-col justify-center px-4 md:px-8 py-20 md:py-24 min-h-[72vh] md:min-h-[82vh]">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center w-full">
            <div className="text-center lg:text-left space-y-6">
              <p className="jemcee-fade-up font-mono text-secondary text-xs md:text-sm tracking-[0.22em] uppercase">
                Piste et patrimoine
              </p>
              <h1
                id="jemcee-hero-title"
                className="jemcee-fade-up font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
              >
                Pierre-Olivier Caouette
              </h1>
              <p className="jemcee-fade-up-delay text-white/85 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Sur la piste comme en finances, la performance se prépare. Conseiller en sécurité
                financière à Victoriaville — fier de soutenir{' '}
                <strong className="text-white font-semibold">Jacob Moreau</strong>.
              </p>
              <div className="jemcee-fade-up-delay-2 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <BookingCta
                  itemId="jemcee_hero_diagnostic"
                  className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-10 py-4 text-base font-bold text-dark shadow-xl shadow-black/20 ring-2 ring-white/40 transition-all duration-300 hover:scale-[1.02] hover:bg-secondary hover:text-white hover:ring-secondary/50"
                >
                  Mini-diagnostic (15–20 min)
                  <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                </BookingCta>
                <a
                  href="#approche"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border-2 border-white/35 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white/95 backdrop-blur-sm transition-all duration-300 hover:border-white/55 hover:bg-white/12"
                >
                  Voir l’approche
                </a>
              </div>
              <div className="jemcee-fade-up-delay-2 flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-2 text-white/70 text-sm">
                <a
                  href={AMF_REGISTRE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent('select_content', { content_type: 'external_link', item_id: 'jemcee_amf' })
                  }
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  Inscrit AMF
                </a>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  Sans engagement
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  Basé au Québec
                </span>
              </div>
            </div>

            <div className="hidden lg:block relative jemcee-fade-up-delay">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-secondary/25 rounded-full blur-3xl" />
              <div className="relative mx-auto w-72 h-72 xl:w-80 xl:h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                <img
                  src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/DPncC0gpI0OUcDSaMWVp/media/677952146419fdc38392dfcd.png"
                  alt="Pierre-Olivier Caouette, conseiller en sécurité financière"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block w-full h-auto translate-y-px"
            aria-hidden
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Parallèle */}
      <section id="approche" className="section-padding bg-white relative overflow-hidden scroll-mt-24">
        <div className="container-max relative max-w-4xl mx-auto text-center space-y-4 mb-14">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark">
            Même logique de performance
          </h2>
          <p className="text-prestige-taupe text-lg leading-relaxed max-w-2xl mx-auto">
            En course automobile comme en finances, on ne laisse pas le résultat au hasard.
            Discipline, données et décisions au bon moment font toute la différence.
          </p>
        </div>

        <div className="container-max relative grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {parallels.map(({ icon: Icon, lap, title, track, finance }) => (
            <div key={title} className="relative space-y-4 text-center md:text-left border-l-2 border-primary/20 pl-5 md:pl-6">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="font-mono text-xs tracking-widest text-primary/70">TOUR {lap}</span>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-dark text-secondary">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
              </div>
              <h3 className="font-heading text-xl font-bold text-dark">{title}</h3>
              <p className="text-sm text-prestige-taupe leading-relaxed">
                <span className="font-semibold text-dark">Sur la piste : </span>
                {track}
              </p>
              <p className="text-sm text-prestige-taupe leading-relaxed">
                <span className="font-semibold text-dark">En finances : </span>
                {finance}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Histoire + Jacob */}
      <section className="section-padding bg-[linear-gradient(180deg,#f4f6f8_0%,#fff_100%)] relative overflow-hidden">
        <div className="container-max relative max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="space-y-6">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark">
                Qui je suis
              </h2>
              <div className="space-y-4 text-prestige-taupe leading-relaxed">
                <p>
                  Comme plusieurs, j’ai d’abord suivi une voie que je croyais faite pour moi :
                  l’automatisation industrielle. Formation, terrain, puis un déclic — j’avais déjà
                  soif de mieux comprendre et de mieux conseiller en finance personnelle
                  (dont un cours McGill vers 2017–2018).
                </p>
                <p>
                  En 2024, j’ai bifurqué vers le conseil en sécurité financière, avec certification AMF.
                  Ma mission : aider les gens à protéger et à faire croître leur patrimoine, avec des
                  conseils adaptés à leur réalité — pas un plan « générique ».
                </p>
                <p>
                  Aujourd’hui, j’accompagne des particuliers et des familles à Victoriaville et ailleurs
                  au Québec pour y voir plus clair sur leurs protections, leur épargne et leurs objectifs.
                </p>
              </div>
              <Link
                to="/a-propos"
                onClick={() =>
                  trackEvent('select_content', { content_type: 'cta', item_id: 'jemcee_to_about' })
                }
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                En savoir plus sur mon parcours
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative space-y-6 rounded-2xl bg-dark text-white p-7 md:p-9 overflow-hidden">
              <div
                className="absolute -right-8 -top-8 w-40 h-40 rounded-full border-[10px] border-white/10 pointer-events-none"
                aria-hidden
              />
              <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-secondary border border-white/15">
                <Flag className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="relative font-heading text-2xl md:text-3xl font-bold">
                Pourquoi je soutiens Jacob Moreau
              </h3>
              <div className="relative space-y-4 text-white/80 leading-relaxed">
                <p>
                  Jacob Moreau incarne ce que j’admire dans la course automobile québécoise :
                  préparation, ambition locale et performance qu’on peut mesurer, tour après tour.
                </p>
                <p>
                  Le soutenir, c’est reconnaître le travail invisible derrière chaque résultat —
                  les heures de réglages, de focus et de discipline que le public ne voit pas toujours.
                </p>
                <p>
                  C’est aussi le même esprit que j’apporte à mes clients : viser juste, ajuster, et ne rien
                  laisser au hasard quand ça compte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Domaines */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="container-max relative max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark">
              Où je peux vous aider
            </h2>
            <p className="text-prestige-taupe text-lg leading-relaxed">
              Un accompagnement concret pour protéger ce qui compte, optimiser vos épargnes
              et avancer vers vos objectifs — à votre rythme.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {focusAreas.map(({ icon: Icon, title, description }) => (
              <div key={title} className="space-y-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="font-heading text-xl font-bold text-dark">{title}</h3>
                <p className="text-prestige-taupe leading-relaxed text-sm md:text-base">{description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              onClick={() =>
                trackEvent('select_content', { content_type: 'cta', item_id: 'jemcee_to_services' })
              }
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Voir tous les services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Diagnostic */}
      <section className="section-padding bg-light/60 relative overflow-hidden">
        <div className="container-max relative max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 text-primary font-mono text-xs tracking-widest uppercase">
              <Timer className="w-4 h-4" aria-hidden />
              15 à 20 minutes
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark">
              Le mini-diagnostic, concrètement
            </h2>
            <p className="text-prestige-taupe text-lg leading-relaxed max-w-2xl mx-auto">
              Un premier échange court pour y voir plus clair — sans pression, sans engagement.
            </p>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            {diagnosticSteps.map(({ step, title, description }) => (
              <div key={step} className="flex gap-5 items-start">
                <div className="shrink-0 h-11 w-11 rounded-full bg-dark text-secondary font-mono font-bold flex items-center justify-center">
                  {step}
                </div>
                <div className="pt-1">
                  <h3 className="font-heading text-lg font-bold text-dark mb-1">{title}</h3>
                  <p className="text-prestige-taupe leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="section-padding pt-0">
        <div className="container-max">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#01233f_0%,#053a9e_55%,#064dd9_100%)]" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25" aria-hidden>
              <div className="jemcee-speed-line absolute top-1/3 left-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white to-transparent" />
              <div className="jemcee-speed-line-delay absolute top-2/3 left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-secondary to-transparent" />
            </div>

            <div className="relative px-6 py-14 md:px-12 md:py-16 text-center space-y-6">
              <h2 className="font-heading text-2xl md:text-4xl font-bold text-white">
                Prêt à clarifier votre situation ?
              </h2>
              <p className="text-white/85 text-lg max-w-2xl mx-auto leading-relaxed">
                Réservez un mini-diagnostic de 15 à 20 minutes. On regarde ensemble vos priorités
                et les prochaines étapes utiles pour vous.
              </p>
              <BookingCta
                itemId="jemcee_bottom_diagnostic"
                className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-10 py-4 text-base font-bold text-primary shadow-lg transition-all duration-300 hover:bg-secondary hover:text-white"
              >
                Réserver mon mini-diagnostic
                <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </BookingCta>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

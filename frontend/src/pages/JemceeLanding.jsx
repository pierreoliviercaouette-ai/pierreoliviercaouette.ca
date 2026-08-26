import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Flag,
  Gauge,
  Headphones,
  Shield,
  Timer,
  Users,
} from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';
import { AMF_REGISTRE_URL } from '../lib/branding';
import { useInView } from '../hooks/useInView';

export const JEMCEE_BOOKING_URL =
  'https://outlook.office.com/book/PierreOlivierCaouetteiAGroupefinancier@ia.ca/s/_4G_IKTvnEeGazDkP6WOUQ2?ismsaljsauthenabled';

const pillars = [
  {
    id: 'performance',
    lap: '01',
    title: 'Performance',
    metaphor: 'Engine bay',
    metaphorLabel: 'Le compartiment moteur',
    trackLine:
      'Comme un moteur préparé pour la piste : puissance utile, réglages précis, rien de superflu.',
    image: `${process.env.PUBLIC_URL || ''}/jemcee/engine-bay.jpg`,
    imageAlt:
      'Compartiment moteur d’une voiture de performance — métaphore de la performance financière',
    icon: Gauge,
    bullets: [
      {
        title: 'Rendements des portefeuilles',
        text: 'Des compositions modèles et des repères concrets pour faire travailler votre capital avec intention.',
      },
      {
        title: 'Optimisation fiscale',
        text: 'REER, CELI et leviers fiscaux utilisés au bon moment — pour garder plus de ce que vous gagnez.',
      },
      {
        title: 'Avantage d’un conseiller',
        text: 'Un regard externe, discipliné, qui ajuste la stratégie quand la piste change.',
      },
    ],
  },
  {
    id: 'securite',
    lap: '02',
    title: 'Sécurité',
    metaphor: 'Cage & casque',
    metaphorLabel: 'La cage et le casque',
    trackLine:
      'Harnais multi-points, cage et casque : on pousse fort seulement quand la protection est en place.',
    image: `${process.env.PUBLIC_URL || ''}/jemcee/safety-cage.jpg`,
    imageAlt:
      'Cage de sécurité et casque de course — métaphore de la protection du capital',
    icon: Shield,
    bullets: [
      {
        title: 'Protection du capital',
        text: 'Assurance vie, invalidité et filets d’urgence pour que un imprévu ne fasse pas déraper le plan.',
      },
      {
        title: 'Gestion du risque',
        text: 'Profil, horizons et marges de sécurité : avancer sans exposer inutilement ce qui compte.',
      },
    ],
  },
  {
    id: 'accompagnement',
    lap: '03',
    title: 'Accompagnement',
    metaphor: 'Co-pilote',
    metaphorLabel: 'Le co-pilote',
    trackLine:
      'Sur la piste, le co-pilote lit la route. En finances, on avance mieux à deux — avec des notes claires.',
    image: `${process.env.PUBLIC_URL || ''}/jemcee/copilot.jpg`,
    imageAlt:
      'Poste de co-pilote en course automobile — métaphore de l’accompagnement financier',
    icon: Headphones,
    bullets: [
      {
        title: 'Éducation financière',
        text: 'Comprendre vos choix, sans jargon : vous gardez le volant, avec une carte lisible.',
      },
      {
        title: 'Ajustements fiscaux',
        text: 'Revoir cotisations, retraits et structures selon votre année et vos objectifs.',
      },
      {
        title: 'Planification de retraite',
        text: 'Tracer l’horizon, estimer les besoins et aligner épargne et protections sur la durée.',
      },
    ],
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

function Reveal({ children, className = '', delayClass = '' }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`jemcee-reveal ${delayClass} ${inView ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

function PillarSection({ pillar, reverse = false }) {
  const Icon = pillar.icon;
  const { ref, inView } = useInView({ threshold: 0.12 });

  return (
    <section
      id={pillar.id}
      ref={ref}
      className={`relative scroll-mt-24 overflow-hidden ${
        reverse ? 'bg-[linear-gradient(180deg,#f4f6f8_0%,#fff_55%)]' : 'bg-white'
      }`}
      aria-labelledby={`${pillar.id}-title`}
    >
      <div className="grid lg:grid-cols-2 lg:min-h-[72vh]">
        <div
          className={`relative min-h-[42vh] lg:min-h-full overflow-hidden ${
            reverse ? 'lg:order-2' : ''
          }`}
        >
          <img
            src={pillar.image}
            alt={pillar.imageAlt}
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out ${
              inView ? 'scale-100' : 'scale-110'
            }`}
            loading="lazy"
            width={1600}
            height={900}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/25 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-dark/10 lg:to-dark/40" />
          <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10">
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-secondary mb-2">
              Sur la piste · {pillar.metaphor}
            </p>
            <p className="text-white text-lg md:text-xl font-heading font-semibold max-w-md leading-snug">
              {pillar.metaphorLabel}
            </p>
          </div>
        </div>

        <div
          className={`flex flex-col justify-center px-6 py-14 md:px-12 lg:px-16 xl:px-20 ${
            reverse ? 'lg:order-1' : ''
          }`}
        >
          <div
            className={`jemcee-reveal ${inView ? 'is-visible' : ''} space-y-6 max-w-xl`}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs tracking-widest text-primary/70">
                TOUR {pillar.lap}
              </span>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-dark text-secondary">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
            </div>
            <h2
              id={`${pillar.id}-title`}
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-dark"
            >
              {pillar.title}
            </h2>
            <p className="text-prestige-taupe text-base md:text-lg leading-relaxed">
              {pillar.trackLine}
            </p>
            <ul className="space-y-5 pt-2">
              {pillar.bullets.map((bullet, index) => (
                <li
                  key={bullet.title}
                  className={`jemcee-reveal jemcee-delay-${index + 1} ${
                    inView ? 'is-visible' : ''
                  } border-l-2 border-primary/30 pl-4`}
                >
                  <p className="font-heading font-semibold text-dark text-lg">{bullet.title}</p>
                  <p className="text-sm md:text-base text-prestige-taupe leading-relaxed mt-1">
                    {bullet.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export const JemceeLanding = () => {
  useSeoMeta({
    title: 'GP3R · Performance, sécurité, accompagnement | Pierre-Olivier Caouette',
    description:
      'Landing GP3R : performance financière (portefeuilles, fiscalité), sécurité du capital et accompagnement — sur la piste comme en finances. Mini-diagnostic 15–20 min.',
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
          animation: jemceeFadeUp 0.75s ease-out both;
        }
        .jemcee-landing .jemcee-fade-up-delay {
          animation: jemceeFadeUp 0.75s ease-out 0.15s both;
        }
        .jemcee-landing .jemcee-fade-up-delay-2 {
          animation: jemceeFadeUp 0.75s ease-out 0.3s both;
        }
        .jemcee-landing .jemcee-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease-out, transform 0.7s ease-out;
        }
        .jemcee-landing .jemcee-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .jemcee-landing .jemcee-delay-1 { transition-delay: 0.08s; }
        .jemcee-landing .jemcee-delay-2 { transition-delay: 0.16s; }
        .jemcee-landing .jemcee-delay-3 { transition-delay: 0.24s; }
        .jemcee-landing .jemcee-pillar-chip {
          transition: transform 0.25s ease, border-color 0.25s ease, background-color 0.25s ease;
        }
        .jemcee-landing .jemcee-pillar-chip:hover {
          transform: translateY(-2px);
        }
        @keyframes jemceeSpeed {
          from { transform: translateX(-30%); }
          to { transform: translateX(120%); }
        }
        @keyframes jemceeFadeUp {
          from { opacity: 0; transform: translateY(18px); }
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
          .jemcee-landing .jemcee-reveal {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* Hero full-bleed */}
      <section
        className="relative min-h-[88vh] md:min-h-[92vh] overflow-hidden"
        aria-labelledby="jemcee-hero-title"
      >
        <div className="absolute inset-0">
          <img
            src={`${process.env.PUBLIC_URL || ''}/jemcee/engine-bay.jpg`}
            alt=""
            className="h-full w-full object-cover scale-105"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(1,35,63,0.92)_0%,rgba(4,58,140,0.78)_48%,rgba(6,77,217,0.55)_100%)]" />
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-35" aria-hidden>
          <div className="jemcee-speed-line absolute top-[30%] left-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white to-transparent" />
          <div className="jemcee-speed-line-delay absolute top-[48%] left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-secondary to-transparent" />
          <div className="jemcee-speed-line absolute top-[66%] left-0 h-px w-3/5 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        </div>
        <div
          className="absolute top-0 bottom-0 left-[6%] w-1.5 bg-gradient-to-b from-white via-secondary to-transparent opacity-45 pointer-events-none hidden sm:block"
          aria-hidden
        />

        <div className="container-max relative z-10 flex flex-col justify-center px-4 md:px-8 py-20 md:py-24 min-h-[88vh] md:min-h-[92vh]">
          <div className="max-w-3xl space-y-7">
            <p className="jemcee-fade-up font-mono text-secondary text-xs md:text-sm tracking-[0.24em] uppercase">
              GP3R · Piste et patrimoine
            </p>
            <h1
              id="jemcee-hero-title"
              className="jemcee-fade-up font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05]"
            >
              Pierre-Olivier Caouette
            </h1>
            <p className="jemcee-fade-up-delay text-white/88 text-lg md:text-xl max-w-2xl leading-relaxed">
              Sur la piste comme en finances, la performance se prépare — avec{' '}
              <strong className="text-white font-semibold">sécurité</strong> et{' '}
              <strong className="text-white font-semibold">accompagnement</strong>. Fier de
              soutenir <strong className="text-white font-semibold">Jacob Moreau</strong>.
            </p>
            <div className="jemcee-fade-up-delay-2 flex flex-col sm:flex-row gap-3">
              <BookingCta
                itemId="jemcee_hero_diagnostic"
                className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-10 py-4 text-base font-bold text-dark shadow-xl shadow-black/25 ring-2 ring-white/40 transition-all duration-300 hover:scale-[1.02] hover:bg-secondary hover:text-white hover:ring-secondary/50"
              >
                Mini-diagnostic (15–20 min)
                <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </BookingCta>
              <a
                href="#piliers"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border-2 border-white/35 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white/95 backdrop-blur-sm transition-all duration-300 hover:border-white/55 hover:bg-white/12"
              >
                Les 3 piliers
              </a>
            </div>
            <div className="jemcee-fade-up-delay-2 flex flex-wrap items-center gap-5 pt-1 text-white/70 text-sm">
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
                Victoriaville, Québec
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation 3 piliers */}
      <section
        id="piliers"
        className="border-b border-prestige-beige bg-light/80 scroll-mt-24"
        aria-label="Les trois piliers"
      >
        <div className="container-max px-4 md:px-8 py-10 md:py-14">
          <Reveal className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark">
              Trois sujets. Une même logique.
            </h2>
            <p className="text-prestige-taupe text-lg leading-relaxed">
              Performance, sécurité, accompagnement — illustrés par un véhicule de performance.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <Reveal key={pillar.id} delayClass={`jemcee-delay-${index + 1}`}>
                  <a
                    href={`#${pillar.id}`}
                    className="jemcee-pillar-chip group flex flex-col items-start gap-3 rounded-2xl border border-prestige-beige bg-white px-5 py-6 hover:border-primary/40"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span className="font-mono text-[11px] tracking-widest text-primary/70">
                        {pillar.lap}
                      </span>
                      <div className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-xl bg-dark text-secondary group-hover:bg-primary transition-colors">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                    </div>
                    <p className="font-heading text-2xl font-bold text-dark">{pillar.title}</p>
                    <p className="text-sm text-prestige-taupe">{pillar.metaphorLabel}</p>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3 sections immersives */}
      {pillars.map((pillar, index) => (
        <PillarSection key={pillar.id} pillar={pillar} reverse={index % 2 === 1} />
      ))}

      {/* Bio courte + Jacob */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="container-max relative max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <Reveal className="space-y-5">
              <div className="inline-flex items-center gap-2 text-primary font-mono text-xs tracking-widest uppercase">
                <Users className="w-4 h-4" aria-hidden />
                Le conseiller
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark">
                Qui je suis
              </h2>
              <p className="text-prestige-taupe leading-relaxed">
                Conseiller en sécurité financière à Victoriaville (AMF). J’aide particuliers et
                familles à protéger et faire croître leur patrimoine — avec des conseils adaptés à
                leur réalité, pas un plan générique.
              </p>
              <Link
                to="/a-propos"
                onClick={() =>
                  trackEvent('select_content', { content_type: 'cta', item_id: 'jemcee_to_about' })
                }
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                Mon parcours
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>

            <Reveal delayClass="jemcee-delay-1" className="relative space-y-5 rounded-2xl bg-dark text-white p-7 md:p-9 overflow-hidden">
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
              <p className="relative text-white/80 leading-relaxed">
                Préparation, ambition locale et performance mesurable — le même esprit que j’apporte
                à mes clients : viser juste, ajuster, et ne rien laisser au hasard quand ça compte.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Diagnostic */}
      <section className="section-padding bg-light/60 relative overflow-hidden">
        <div className="container-max relative max-w-4xl mx-auto">
          <Reveal className="text-center space-y-4 mb-14">
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
          </Reveal>

          <div className="space-y-6 max-w-2xl mx-auto">
            {diagnosticSteps.map(({ step, title, description }, index) => (
              <Reveal key={step} delayClass={`jemcee-delay-${index + 1}`}>
                <div className="flex gap-5 items-start">
                  <div className="shrink-0 h-11 w-11 rounded-full bg-dark text-secondary font-mono font-bold flex items-center justify-center">
                    {step}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-heading text-lg font-bold text-dark mb-1">{title}</h3>
                    <p className="text-prestige-taupe leading-relaxed">{description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="section-padding pt-0">
        <div className="container-max">
          <Reveal>
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
          </Reveal>
        </div>
      </section>
    </main>
  );
};

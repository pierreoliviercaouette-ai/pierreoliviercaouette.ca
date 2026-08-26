import { useCallback, useMemo, useState } from 'react';
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
import { ScrollImageSequence } from '../components/jemcee/ScrollImageSequence';
import { JEMCEE_SEQUENCE } from '../data/jemceeSequence';

export const JEMCEE_BOOKING_URL =
  'https://outlook.office.com/book/PierreOlivierCaouetteiAGroupefinancier@ia.ca/s/_4G_IKTvnEeGazDkP6WOUQ2?ismsaljsauthenabled';

const pillars = [
  {
    id: 'performance',
    lap: '01',
    title: 'Performance',
    metaphorLabel: 'Le compartiment moteur',
    trackLine:
      'Comme un moteur préparé pour la piste : puissance utile, réglages précis, rien de superflu.',
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
    metaphorLabel: 'La cage et le casque',
    trackLine:
      'Harnais multi-points, cage et casque : on pousse fort seulement quand la protection est en place.',
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
    metaphorLabel: 'Le co-pilote',
    trackLine:
      'Sur la piste, le co-pilote lit la route. En finances, on avance mieux à deux — avec des notes claires.',
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

function chapterForFrame(frameIndex) {
  const chapters = JEMCEE_SEQUENCE.chapters || [];
  return (
    chapters.find((c) => frameIndex >= c.start && frameIndex <= c.end)?.id ||
    chapters[0]?.id ||
    'performance'
  );
}

export const JemceeLanding = () => {
  const [activeChapter, setActiveChapter] = useState('performance');
  const [showIntro, setShowIntro] = useState(true);

  const activePillar = useMemo(
    () => pillars.find((p) => p.id === activeChapter) || pillars[0],
    [activeChapter]
  );
  const ActiveIcon = activePillar.icon;

  const framePrefix = `${process.env.PUBLIC_URL || ''}/jemcee/sequence/frame-`;

  const handleProgress = useCallback((progress, frameIndex) => {
    setShowIntro(progress < 0.06);
    setActiveChapter(chapterForFrame(frameIndex));
  }, []);

  useSeoMeta({
    title: 'GP3R · Performance, sécurité, accompagnement | Pierre-Olivier Caouette',
    description:
      'Landing GP3R cinématique : séquence 24 fps pilotée par le scroll — performance, sécurité du capital et accompagnement financier.',
    canonicalPath: '/jemcee',
  });

  return (
    <main className="min-h-screen bg-white jemcee-landing" data-testid="jemcee-landing-page">
      <style>{`
        .jemcee-landing .jemcee-reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.65s ease-out, transform 0.65s ease-out;
        }
        .jemcee-landing .jemcee-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .jemcee-landing .jemcee-delay-1 { transition-delay: 0.08s; }
        .jemcee-landing .jemcee-delay-2 { transition-delay: 0.16s; }
        .jemcee-landing .jemcee-delay-3 { transition-delay: 0.24s; }
        .jemcee-landing .jemcee-overlay-card {
          transition: opacity 0.45s ease, transform 0.45s ease;
        }
        .jemcee-landing .jemcee-chapter-dot {
          transition: background-color 0.3s ease, transform 0.3s ease, width 0.3s ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .jemcee-landing .jemcee-reveal {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* Séquence cinématique 24 fps — scrub scroll */}
      <ScrollImageSequence
        frameCount={JEMCEE_SEQUENCE.frameCount}
        framePathPrefix={framePrefix}
        frameExt={JEMCEE_SEQUENCE.ext}
        frameDigits={JEMCEE_SEQUENCE.digits}
        scrollHeightVh={360}
        onProgress={handleProgress}
      >
        {/* Intro (début de séquence) */}
        <div
          className={`pointer-events-none absolute inset-0 flex flex-col justify-end md:justify-center px-5 md:px-12 pb-24 md:pb-0 transition-opacity duration-500 ${
            showIntro ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="container-max pointer-events-auto max-w-3xl space-y-5">
            <p className="font-mono text-secondary text-xs md:text-sm tracking-[0.24em] uppercase">
              GP3R · {JEMCEE_SEQUENCE.fps} fps · scroll
            </p>
            <h1
              id="jemcee-hero-title"
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05]"
            >
              Pierre-Olivier Caouette
            </h1>
            <p className="text-white/88 text-lg md:text-xl max-w-2xl leading-relaxed">
              Sur la piste comme en finances — faites défiler pour explorer performance, sécurité et
              accompagnement.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <BookingCta
                itemId="jemcee_hero_diagnostic"
                className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-10 py-4 text-base font-bold text-dark shadow-xl shadow-black/25 transition-all duration-300 hover:bg-secondary hover:text-white"
              >
                Mini-diagnostic (15–20 min)
                <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </BookingCta>
            </div>
            <div className="flex flex-wrap items-center gap-5 pt-1 text-white/70 text-sm">
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
                Fier de soutenir Jacob Moreau
              </span>
            </div>
            <p className="font-mono text-[11px] tracking-widest uppercase text-white/50 pt-4 md:pt-8">
              ↓ Défilez pour lancer la séquence
            </p>
          </div>
        </div>

        {/* Overlay chapitre actif */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 md:inset-y-0 md:left-auto md:right-0 md:w-[min(28rem,42vw)] flex items-end md:items-center p-5 md:p-10 transition-opacity duration-500 ${
            showIntro ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="jemcee-overlay-card pointer-events-auto w-full rounded-2xl border border-white/15 bg-[#01233f]/78 backdrop-blur-md p-5 md:p-7 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[11px] tracking-widest text-secondary">
                TOUR {activePillar.lap}
              </span>
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-secondary">
                <ActiveIcon className="h-4 w-4" aria-hidden />
              </div>
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white">
              {activePillar.title}
            </h2>
            <p className="text-secondary/90 text-sm mt-1">{activePillar.metaphorLabel}</p>
            <p className="text-white/75 text-sm md:text-base leading-relaxed mt-3">
              {activePillar.trackLine}
            </p>
            <ul className="mt-4 space-y-2.5">
              {activePillar.bullets.map((b) => (
                <li key={b.title} className="border-l border-secondary/40 pl-3">
                  <p className="text-white font-semibold text-sm">{b.title}</p>
                  <p className="text-white/65 text-xs md:text-sm leading-snug mt-0.5">{b.text}</p>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center gap-2" aria-hidden>
              {pillars.map((p) => (
                <span
                  key={p.id}
                  className={`jemcee-chapter-dot h-1.5 rounded-full ${
                    p.id === activeChapter ? 'w-8 bg-secondary' : 'w-1.5 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </ScrollImageSequence>

      {/* Ancre 3 piliers (après la séquence) */}
      <section id="piliers" className="border-b border-prestige-beige bg-light/80 scroll-mt-24">
        <div className="container-max px-4 md:px-8 py-12 md:py-16">
          <Reveal className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark">
              Trois sujets. Une même logique.
            </h2>
            <p className="text-prestige-taupe text-lg leading-relaxed">
              La séquence ci-dessus relie la piste à vos finances — voici le détail de chaque pilier.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <Reveal key={pillar.id} delayClass={`jemcee-delay-${index + 1}`}>
                  <div className="h-full rounded-2xl border border-prestige-beige bg-white px-5 py-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] tracking-widest text-primary/70">
                        {pillar.lap}
                      </span>
                      <div className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-xl bg-dark text-secondary">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-dark">{pillar.title}</h3>
                    <p className="text-sm text-primary font-medium">{pillar.metaphorLabel}</p>
                    <p className="text-sm text-prestige-taupe leading-relaxed">{pillar.trackLine}</p>
                    <ul className="pt-2 space-y-2">
                      {pillar.bullets.map((b) => (
                        <li key={b.title} className="text-sm text-prestige-taupe">
                          <span className="font-semibold text-dark">{b.title}</span>
                          {' — '}
                          {b.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bio courte + Jacob */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="container-max relative max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <Reveal className="space-y-5">
              <div className="inline-flex items-center gap-2 text-primary font-mono text-xs tracking-widest uppercase">
                <Users className="w-4 h-4" aria-hidden />
                Le conseiller
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark">Qui je suis</h2>
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

            <Reveal
              delayClass="jemcee-delay-1"
              className="relative space-y-5 rounded-2xl bg-dark text-white p-7 md:p-9 overflow-hidden"
            >
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
            <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#01233f_0%,#053a9e_55%,#064dd9_100%)] px-6 py-14 md:px-12 md:py-16 text-center space-y-6">
              <h2 className="font-heading text-2xl md:text-4xl font-bold text-white">
                Prêt à clarifier votre situation ?
              </h2>
              <p className="text-white/85 text-lg max-w-2xl mx-auto leading-relaxed">
                Réservez un mini-diagnostic de 15 à 20 minutes. On regarde ensemble vos priorités et
                les prochaines étapes utiles pour vous.
              </p>
              <BookingCta
                itemId="jemcee_bottom_diagnostic"
                className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-10 py-4 text-base font-bold text-primary shadow-lg transition-all duration-300 hover:bg-secondary hover:text-white"
              >
                Réserver mon mini-diagnostic
                <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </BookingCta>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
};

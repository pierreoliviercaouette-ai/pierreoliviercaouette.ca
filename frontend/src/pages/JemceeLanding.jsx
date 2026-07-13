import { ArrowRight, Flag, Gauge, Shield, Target, Timer } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';

export const JEMCEE_BOOKING_URL =
  'https://outlook.office.com/book/PierreOlivierCaouetteiAGroupefinancier@ia.ca/s/_4G_IKTvnEeGazDkP6WOUQ2?ismsaljsauthenabled';

const parallels = [
  {
    icon: Target,
    lap: '01',
    title: 'Préparation avant la course',
    track: 'Réglages, essais, objectifs de tour.',
    finance: 'Revenus, protections, priorités de vie — un plan avant d’agir.',
  },
  {
    icon: Gauge,
    lap: '02',
    title: 'Performance mesurable',
    track: 'Temps au tour, données, ajustements continus.',
    finance: 'Épargne, couverture, fiscalité : des repères concrets pour progresser.',
  },
  {
    icon: Shield,
    lap: '03',
    title: 'Gestion du risque',
    track: 'Marge d’erreur, sécurité, décisions froides sous pression.',
    finance: 'Assurance vie, invalidité, urgences : protéger ce qui compte vraiment.',
  },
];

function CheckeredStrip({ className = '', invert = false }) {
  return (
    <div
      className={`h-2.5 w-full ${className}`}
      style={{
        backgroundImage: invert
          ? 'repeating-linear-gradient(90deg, #fff 0 12px, #01233f 12px 24px)'
          : 'repeating-linear-gradient(90deg, #01233f 0 12px, #fff 12px 24px)',
      }}
      aria-hidden
    />
  );
}

function RacingStartLights() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="h-2.5 w-2.5 rounded-full bg-red-500/90 shadow-[0_0_8px_rgba(239,68,68,0.55)] jemcee-start-light"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  );
}

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
    title: 'Commandite Jemcee | Performance financiere | Pierre-Olivier Caouette',
    description:
      'Accueilli depuis le reportage Jemcee sur le GP3R, le Circuit Gilles-Villeneuve et Jacob Moreau : parallele piste et securite financiere, puis mini-diagnostic de 15-20 minutes.',
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
        .jemcee-landing .jemcee-start-light {
          animation: jemceePulse 2.2s ease-in-out infinite;
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
        @keyframes jemceePulse {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 1; }
        }
        @keyframes jemceeFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .jemcee-landing .jemcee-speed-line,
          .jemcee-landing .jemcee-speed-line-delay,
          .jemcee-landing .jemcee-start-light,
          .jemcee-landing .jemcee-fade-up,
          .jemcee-landing .jemcee-fade-up-delay,
          .jemcee-landing .jemcee-fade-up-delay-2 {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Hero circuit */}
      <section
        className="relative min-h-[72vh] md:min-h-[82vh] overflow-hidden"
        aria-labelledby="jemcee-hero-title"
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#01233f_0%,#043a8c_48%,#064dd9_100%)]" />

        {/* Asphalt grain */}
        <div
          className="absolute inset-0 opacity-[0.14] mix-blend-soft-light pointer-events-none"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          }}
          aria-hidden
        />

        {/* Track curve silhouette */}
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

        {/* Speed lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30" aria-hidden>
          <div className="jemcee-speed-line absolute top-[28%] left-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white to-transparent" />
          <div className="jemcee-speed-line-delay absolute top-[46%] left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-secondary to-transparent" />
          <div className="jemcee-speed-line absolute top-[62%] left-0 h-px w-3/5 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        </div>

        {/* Racing stripe */}
        <div
          className="absolute top-0 bottom-0 left-[8%] w-1.5 bg-gradient-to-b from-white via-secondary to-transparent opacity-40 pointer-events-none hidden sm:block"
          aria-hidden
        />

        <CheckeredStrip className="absolute top-0 left-0 right-0 z-20 opacity-90" />

        <div className="container-max relative z-10 flex flex-col justify-center px-4 md:px-8 py-20 md:py-24 min-h-[72vh] md:min-h-[82vh] text-center">
          <div className="jemcee-fade-up inline-flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <RacingStartLights />
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white/90 text-sm font-medium font-mono tracking-wide">
              <Flag className="w-3.5 h-3.5 text-secondary" aria-hidden />
              Jemcee · GP3R · Gilles-Villeneuve
            </span>
          </div>

          <p className="jemcee-fade-up font-mono text-secondary text-xs md:text-sm tracking-[0.25em] uppercase mb-3">
            Commandite · Performance
          </p>

          <h1
            id="jemcee-hero-title"
            className="jemcee-fade-up font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight"
          >
            Pierre-Olivier Caouette
          </h1>

          <p className="jemcee-fade-up-delay text-white/85 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Sur la piste comme en finances : la performance se prépare. Conseiller en sécurité financière
            à Victoriaville — fier de soutenir des courseurs québécois, dont Jacob Moreau.
          </p>

          <div className="jemcee-fade-up-delay-2 mt-8 flex justify-center">
            <BookingCta
              itemId="jemcee_hero_diagnostic"
              className="group relative inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-10 py-4 text-base font-bold text-dark shadow-xl shadow-black/20 ring-2 ring-white/40 transition-all duration-300 hover:scale-[1.02] hover:bg-secondary hover:text-white hover:ring-secondary/50 overflow-hidden"
            >
              <span
                className="absolute left-0 top-0 bottom-0 w-2 opacity-80"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(180deg, #01233f 0 6px, #fff 6px 12px)',
                }}
                aria-hidden
              />
              Réserver un mini-diagnostic (15–20 min)
              <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
            </BookingCta>
          </div>
        </div>

        <CheckeredStrip className="absolute bottom-0 left-0 right-0 z-20" invert />
      </section>

      {/* Parallèles */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div
          className="absolute -right-24 top-1/3 w-72 h-72 rounded-full border-[18px] border-dark/[0.04] pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute -left-16 bottom-10 w-48 h-48 rounded-full border-[12px] border-primary/[0.06] pointer-events-none"
          aria-hidden
        />

        <div className="container-max relative max-w-4xl mx-auto text-center space-y-4 mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-dark text-white rounded-sm text-xs font-mono tracking-widest uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden />
            Piste ↔ patrimoine
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark">
            Même logique de performance
          </h2>
          <p className="text-prestige-taupe text-lg leading-relaxed max-w-2xl mx-auto">
            Un tour rapide au Circuit Gilles-Villeneuve ou une saison en GP3R, ça ne s’improvise pas.
            Votre situation financière non plus : discipline, données et décisions prises au bon moment.
          </p>
        </div>

        <div className="container-max relative grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {parallels.map(({ icon: Icon, lap, title, track, finance }) => (
            <div
              key={title}
              className="relative space-y-4 text-center md:text-left border-l-2 border-primary/20 pl-5 md:pl-6"
            >
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

      {/* Histoire */}
      <section className="section-padding bg-[linear-gradient(180deg,#f4f6f8_0%,#fff_100%)] relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 w-3 opacity-80 pointer-events-none hidden md:block"
          style={{
            backgroundImage:
              'repeating-linear-gradient(180deg, #01233f 0 10px, #fff 10px 20px)',
          }}
          aria-hidden
        />

        <div className="container-max relative max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start">
            <div className="space-y-6">
              <span className="inline-block px-4 py-1 bg-secondary/15 text-dark rounded-sm text-xs font-mono tracking-widest uppercase">
                Mon histoire
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark">
                De l’industrie à la sécurité financière
              </h2>
              <div className="space-y-4 text-prestige-taupe leading-relaxed">
                <p>
                  Comme plusieurs, j’ai d’abord suivi une voie que je croyais faite pour moi : l’automatisation
                  industrielle. Formation, terrain, puis un déclic — j’avais déjà soif de mieux comprendre
                  et de mieux conseiller en finance personnelle (dont un cours McGill vers 2017–2018).
                </p>
                <p>
                  En 2024, j’ai bifurqué vers le conseil en sécurité financière, avec certification AMF.
                  La mission est claire : aider les gens à protéger et à faire croître leur patrimoine,
                  avec des conseils adaptés à leur réalité — pas un plan « générique ».
                </p>
              </div>
            </div>

            <div className="relative space-y-6 lg:pt-6 rounded-2xl bg-dark text-white p-7 md:p-8 overflow-hidden">
              <div
                className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, #fff 0 8px, transparent 8px 16px), repeating-linear-gradient(-45deg, #fff 0 8px, transparent 8px 16px)',
                  backgroundSize: '16px 16px',
                }}
                aria-hidden
              />
              <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-secondary border border-white/15">
                <Flag className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="relative font-heading text-2xl font-bold">
                Pourquoi j’encourage les courseurs
              </h3>
              <div className="relative space-y-4 text-white/80 leading-relaxed">
                <p>
                  La course automobile québécoise — GP3R, Circuit Gilles-Villeneuve, talents comme{' '}
                  <strong className="text-white">Jacob Moreau</strong> — incarne ce que j’admire :
                  préparation, ambition locale et performance qu’on peut mesurer, tour après tour.
                </p>
                <p>
                  Soutenir ces courseurs, c’est reconnaître le travail invisible derrière chaque résultat.
                  C’est aussi le même esprit que j’apporte à mes clients : viser juste, ajuster, et ne rien
                  laisser au hasard quand ça compte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="section-padding pt-0">
        <div className="container-max">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#01233f_0%,#053a9e_55%,#064dd9_100%)]" />
            <CheckeredStrip className="absolute top-0 left-0 right-0 opacity-90" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25" aria-hidden>
              <div className="jemcee-speed-line absolute top-1/3 left-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white to-transparent" />
              <div className="jemcee-speed-line-delay absolute top-2/3 left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-secondary to-transparent" />
            </div>

            <div className="relative px-6 py-14 md:px-12 md:py-16 text-center space-y-6">
              <div className="inline-flex items-center gap-2 mx-auto px-4 py-2 bg-white/10 backdrop-blur-sm rounded-sm border border-white/20 text-white/90 text-sm font-mono tracking-wide">
                <Timer className="w-4 h-4 text-secondary" aria-hidden />
                15–20 min · sans engagement
              </div>
              <h2 className="font-heading text-2xl md:text-4xl font-bold text-white">
                Mini-diagnostic de votre situation
              </h2>
              <p className="text-white/85 text-lg max-w-2xl mx-auto leading-relaxed">
                Un premier échange court pour y voir plus clair : priorités, zones d’incertitude,
                et prochaines étapes utiles — que vous arriviez via le reportage de Jemcee ou non.
              </p>
              <BookingCta
                itemId="jemcee_bottom_diagnostic"
                className="group relative inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-10 py-4 text-base font-bold text-primary shadow-lg transition-all duration-300 hover:bg-secondary hover:text-white overflow-hidden"
              >
                <span
                  className="absolute left-0 top-0 bottom-0 w-2"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(180deg, #01233f 0 6px, #fff 6px 12px)',
                  }}
                  aria-hidden
                />
                Réserver mon mini-diagnostic
                <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </BookingCta>
            </div>

            <CheckeredStrip className="absolute bottom-0 left-0 right-0" invert />
          </div>
        </div>
      </section>
    </main>
  );
};

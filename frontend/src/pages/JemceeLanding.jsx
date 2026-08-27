import { trackEvent } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';
import { AppleCinematicScroll } from '../components/jemcee/AppleCinematicScroll';
import { JEMCEE_SEQUENCE } from '../data/jemceeSequence';

export const JEMCEE_BOOKING_URL =
  'https://outlook.office.com/book/PierreOlivierCaouetteiAGroupefinancier@ia.ca/s/_4G_IKTvnEeGazDkP6WOUQ2?ismsaljsauthenabled';

const PHONE = '819 806-1164';
const PHONE_LINK = 'tel:+18198061164';
const EMAIL = 'p-o.caouette@agc.ia.ca';

const asset = (path) => `${process.env.PUBLIC_URL || ''}${path}`;

const CHAPTERS = [
  {
    id: 'performance',
    chapterLabel: 'CHAPITRE 01 — PERFORMANCE',
    title: 'Hauts rendements. Haute performance.',
    description:
      'Votre argent mérite mieux qu’un compte dormant. Une stratégie calibrée pour accélérer — sans perdre le contrôle.',
    align: 'left',
    anchor: 0.23,
    start: 0.1,
    peakIn: 0.14,
    peakOut: 0.3,
    end: 0.36,
    bullets: [
      {
        num: '01',
        title: 'Puissance de placement',
        text: 'Portefeuilles construits pour performer selon votre horizon — chaque dollar au travail.',
      },
      {
        num: '02',
        title: 'Optimisation fiscale maximale',
        text: 'REER, CELI, CELIAPP, REEE : chaque avantage fiscal capturé, chaque dollar mieux placé.',
      },
      {
        num: '03',
        title: 'L’avantage du pro',
        text: 'Discipline, rééquilibrage et décisions prises à froid — l’écart qui se creuse avec le temps.',
      },
    ],
  },
  {
    id: 'securite',
    chapterLabel: 'CHAPITRE 02 — PROTECTION',
    title: 'Vos proches. Votre filet.',
    description:
      'La vraie performance, c’est d’avancer sans peur. On verrouille la protection avant d’appuyer sur l’accélérateur.',
    align: 'right',
    anchor: 0.49,
    start: 0.36,
    peakIn: 0.4,
    peakOut: 0.56,
    end: 0.62,
    bullets: [
      {
        num: '04',
        title: 'Protection de vos proches',
        text: 'Assurance vie taillée pour votre famille, votre hypothèque et votre héritage.',
      },
      {
        num: '05',
        title: 'Revenu blindé',
        text: 'Invalidité et maladies graves : votre salaire protégé quand la vie dérape.',
      },
      {
        num: '06',
        title: 'Zéro faille',
        text: 'Fonds d’urgence, testament, mandat : la structure qui tient quand tout change.',
      },
    ],
  },
  {
    id: 'accompagnement',
    chapterLabel: 'CHAPITRE 03 — COPILOTE',
    title: 'Notes claires. Timing précis.',
    description:
      'Le siège de droite, c’est le mien : lire la route, anticiper les virages, et vous garder concentré sur l’essentiel.',
    align: 'left',
    anchor: 0.75,
    start: 0.62,
    peakIn: 0.66,
    peakOut: 0.82,
    end: 0.88,
    bullets: [
      {
        num: '07',
        title: 'Décisions sans jargon',
        text: 'Chaque choix expliqué clairement — vous savez pourquoi on agit, pas seulement quoi faire.',
      },
      {
        num: '08',
        title: 'Vision d’ensemble',
        text: 'Placements, fiscalité, protection et retraite lus comme une seule feuille de route.',
      },
      {
        num: '09',
        title: 'Présence dans la durée',
        text: 'Quand la vie change, on recalibre ensemble. Vous n’êtes plus seul face aux décisions.',
      },
    ],
  },
];

function trackCta(itemId) {
  trackEvent('select_content', { content_type: 'cta', item_id: itemId });
}

export const JemceeLanding = () => {
  useSeoMeta({
    title: 'Pilotez votre patrimoine | Pierre-Olivier Caouette',
    description:
      'Performance, protection et accompagnement : une approche rallye de la sécurité financière. Rendements, optimisation fiscale, gestion du risque et planification de retraite.',
    canonicalPath: '/jemcee',
  });

  const videoSrc = asset(JEMCEE_SEQUENCE.videoSrc);
  const posterSrc = asset(JEMCEE_SEQUENCE.posterSrc);
  const outroPoster = asset('/jemcee/copilot.jpg');

  return (
    <div
      className="jemcee-landing relative bg-dark text-white overflow-visible"
      data-testid="jemcee-landing-page"
    >
      <style>{`
        .jemcee-landing {
          --jemcee-ember: linear-gradient(135deg, #064dd9 0%, #053a9e 55%, #73c4ef 100%);
          --jemcee-ember-shadow: 0 12px 40px rgba(6, 77, 217, 0.35);
        }
        .jemcee-landing .jemcee-cta-primary {
          background-image: var(--jemcee-ember);
          box-shadow: var(--jemcee-ember-shadow);
        }
      `}</style>

      <AppleCinematicScroll
        videoSrc={videoSrc}
        posterSrc={posterSrc}
        framesPath={JEMCEE_SEQUENCE.framesPath}
        frameCount={JEMCEE_SEQUENCE.frameCount}
        scrollHeightVh={1100}
        chapters={CHAPTERS}
        intro={() => (
          <>
            <p className="font-heading text-sm tracking-[0.45em] text-secondary">
              CONSEILLER EN SÉCURITÉ FINANCIÈRE
            </p>
            <h1 className="mt-4 max-w-4xl font-heading text-5xl leading-[0.92] text-white md:text-7xl lg:text-8xl">
              Votre patrimoine mérite{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'var(--jemcee-ember)' }}
              >
                une préparation de rallye
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/70">
              Hauts rendements, protection sans faille, copilote à vos côtés. La stratégie
              financière qui donne envie de prendre le départ maintenant.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={JEMCEE_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCta('jemcee_hero_depart')}
                className="pointer-events-auto inline-flex items-center px-8 py-4 font-heading text-lg tracking-widest shadow-[0_12px_40px_rgba(255,255,255,0.22)] transition hover:bg-secondary"
                style={{ backgroundColor: '#ffffff', color: '#01233f' }}
              >
                PRENDRE LE DÉPART
              </a>
              <a
                href="#performance"
                onClick={() => trackCta('jemcee_hero_capot')}
                className="pointer-events-auto inline-flex items-center border-2 border-white/70 bg-white/10 px-8 py-4 font-heading text-lg tracking-widest backdrop-blur-sm transition-colors hover:border-white hover:bg-white/20"
                style={{ color: '#ffffff' }}
              >
                VOIR SOUS LE CAPOT
              </a>
            </div>
          </>
        )}
        outro={() => (
          <div className="mx-auto w-full max-w-3xl text-center">
            <p className="font-heading text-sm tracking-[0.45em] text-secondary">LIGNE DE DÉPART</p>
            <h2 className="mt-4 font-heading text-4xl leading-[0.95] text-white sm:text-5xl md:text-7xl">
              Prêt à accélérer ?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-white/85 sm:text-lg">
              30 minutes. Gratuit. Sans engagement. Un plan clair pour faire croître et protéger votre
              patrimoine — et vous repartez avec une clarté que peu de gens ont.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href={JEMCEE_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCta('jemcee_outro_booking')}
                className="jemcee-cta-solid pointer-events-auto inline-flex items-center px-10 py-5 font-heading text-lg tracking-widest shadow-[0_12px_40px_rgba(255,255,255,0.25)] transition hover:bg-secondary"
                style={{ backgroundColor: '#ffffff', color: '#01233f' }}
              >
                RÉSERVER MA RENCONTRE
              </a>
              <a
                href={PHONE_LINK}
                onClick={() => trackCta('jemcee_outro_phone')}
                className="pointer-events-auto inline-flex items-center border-2 border-white/80 bg-white/10 px-9 py-5 font-heading text-lg tracking-widest backdrop-blur-sm transition-colors hover:border-white hover:bg-white/20"
                style={{ color: '#ffffff' }}
              >
                PARLER MAINTENANT
              </a>
            </div>
            <div className="mx-auto mt-14 grid max-w-3xl gap-6 border-t border-white/20 pt-8 text-left sm:grid-cols-3 sm:gap-8">
              <div>
                <p className="font-heading text-3xl text-secondary sm:text-4xl">0-100</p>
                <p className="mt-2 text-sm text-white/70">Plan structuré dès la 1ʳᵉ rencontre</p>
              </div>
              <div>
                <p className="font-heading text-3xl text-secondary sm:text-4xl">360°</p>
                <p className="mt-2 text-sm text-white/70">
                  Placements, assurance, fiscalité, succession
                </p>
              </div>
              <div>
                <p className="font-heading text-3xl text-secondary sm:text-4xl">1 copilote</p>
                <p className="mt-2 text-sm text-white/70">Suivi humain, année après année</p>
              </div>
            </div>
          </div>
        )}
      />

      <section
        id="contact"
        className="relative scroll-mt-24 border-t border-white/10 px-6 py-14 text-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(1,28,50,0.92) 0%, rgba(1,20,40,0.98) 100%), url(${outroPoster})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
        }}
      >
        <p className="text-sm text-white/55">
          <a href={`mailto:${EMAIL}`} className="hover:text-secondary transition-colors">
            {EMAIL}
          </a>
          {' · '}
          <a href={PHONE_LINK} className="hover:text-secondary transition-colors">
            {PHONE}
          </a>
        </p>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} — Pierre-Olivier Caouette, conseiller en sécurité financière.
        Les rendements passés ne garantissent pas les rendements futurs.
      </footer>
    </div>
  );
};

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
    anchor: 0.26,
    start: 0.12,
    peakIn: 0.18,
    peakOut: 0.32,
    end: 0.38,
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
    anchor: 0.52,
    start: 0.4,
    peakIn: 0.46,
    peakOut: 0.58,
    end: 0.64,
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
    title: 'Réservez. On démarre.',
    description:
      '30 minutes gratuites. Un plan clair. Un conseiller qui lit la route avec vous — et qui reste dans le siège à droite.',
    align: 'left',
    anchor: 0.88,
    start: 0.68,
    peakIn: 0.76,
    peakOut: 0.94,
    end: 1,
    bullets: [
      {
        num: '07',
        title: 'Rencontre découverte offerte',
        text: 'Sans frais, sans engagement. On ouvre le capot de votre situation en 30 minutes.',
      },
      {
        num: '08',
        title: 'Plan 360° sur mesure',
        text: 'Placements, assurance, fiscalité, retraite — une feuille de route qui fait du sens.',
      },
      {
        num: '09',
        title: 'Suivi qui tient la distance',
        text: 'Vous n’êtes plus seul. Ajustements, rappels, décisions — année après année.',
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
        scrollHeightVh={720}
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
                href="#contact"
                onClick={() => trackCta('jemcee_hero_depart')}
                className="jemcee-cta-primary pointer-events-auto inline-flex items-center px-8 py-4 font-heading text-lg tracking-widest text-white"
              >
                PRENDRE LE DÉPART
              </a>
              <a
                href="#performance"
                onClick={() => trackCta('jemcee_hero_capot')}
                className="pointer-events-auto inline-flex items-center border border-white/25 px-8 py-4 font-heading text-lg tracking-widest text-white transition-colors hover:border-secondary hover:text-secondary"
              >
                VOIR SOUS LE CAPOT
              </a>
            </div>
          </>
        )}
      />

      <section id="contact" className="relative scroll-mt-24 border-t border-white/10 px-6 py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-heading text-sm tracking-[0.4em] text-secondary">LIGNE DE DÉPART</p>
          <h2 className="mt-4 font-heading text-5xl leading-[0.95] text-white md:text-7xl">
            Prêt à accélérer ?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-white/65">
            30 minutes gratuites. On ouvre le capot de votre patrimoine, on trouve les leviers, et
            vous repartez avec un plan concret — ou rien. Aucun engagement.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href={JEMCEE_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCta('jemcee_contact_booking')}
              className="jemcee-cta-primary inline-flex items-center px-9 py-4 font-heading text-lg tracking-widest text-white"
              data-testid="jemcee_contact_booking"
            >
              RÉSERVER MA RENCONTRE
            </a>
            <a
              href={PHONE_LINK}
              onClick={() => trackCta('jemcee_contact_phone')}
              className="inline-flex items-center border border-white/25 px-9 py-4 font-heading text-lg tracking-widest text-white transition-colors hover:border-secondary hover:text-secondary"
            >
              PARLER MAINTENANT
            </a>
          </div>

          <div className="mt-16 grid gap-8 border-t border-white/10 pt-10 text-left sm:grid-cols-3">
            <div>
              <p className="font-heading text-4xl text-secondary">0-100</p>
              <p className="mt-2 text-sm text-white/60">Un plan structuré dès la première rencontre</p>
            </div>
            <div>
              <p className="font-heading text-4xl text-secondary">360°</p>
              <p className="mt-2 text-sm text-white/60">
                Placements, assurance, fiscalité et succession
              </p>
            </div>
            <div>
              <p className="font-heading text-4xl text-secondary">1 copilote</p>
              <p className="mt-2 text-sm text-white/60">Un suivi humain, année après année</p>
            </div>
          </div>

          <p className="mt-12 text-sm text-white/45">
            <a href={`mailto:${EMAIL}`} className="hover:text-secondary transition-colors">
              {EMAIL}
            </a>
            {' · '}
            <a href={PHONE_LINK} className="hover:text-secondary transition-colors">
              {PHONE}
            </a>
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} — Pierre-Olivier Caouette, conseiller en sécurité financière.
        Les rendements passés ne garantissent pas les rendements futurs.
      </footer>
    </div>
  );
};

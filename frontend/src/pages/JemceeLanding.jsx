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
    chapterLabel: 'CHAPITRE 01 — LE MOTEUR',
    title: 'La performance sous le capot',
    description:
      'Le capot s’ouvre : voici ce qui propulse votre stratégie. Chaque composant est choisi, réglé et mesuré.',
    align: 'left',
    anchor: 0.14,
    start: 0.12,
    peakIn: 0.18,
    peakOut: 0.34,
    end: 0.4,
    bullets: [
      {
        num: '01',
        title: 'Rendements',
        text: 'Des portefeuilles diversifiés et calibrés selon votre horizon, pour convertir la puissance en distance parcourue.',
      },
      {
        num: '02',
        title: 'Optimisation fiscale',
        text: 'REER, CELI, CELIAPP, REEE et société de gestion : chaque dollar placé au bon endroit, au bon moment.',
      },
      {
        num: '03',
        title: 'Avantage du conseiller',
        text: 'Discipline, rééquilibrage et décisions prises à froid — l’écart qui se creuse sur la durée d’une course.',
      },
    ],
  },
  {
    id: 'securite',
    chapterLabel: 'CHAPITRE 02 — L’HABITACLE',
    title: 'La sécurité avant la vitesse',
    description:
      'Baquet, harnais six points, arceau et casque. On n’accélère jamais sans que la structure tienne le choc.',
    align: 'right',
    anchor: 0.42,
    start: 0.38,
    peakIn: 0.44,
    peakOut: 0.6,
    end: 0.66,
    bullets: [
      {
        num: '04',
        title: 'Protection du capital',
        text: 'Assurance vie, invalidité et maladies graves : le harnais qui garde votre famille en place à l’impact.',
      },
      {
        num: '05',
        title: 'Gestion du risque',
        text: 'Répartition d’actifs, fonds d’urgence et scénarios de marché testés avant le départ, pas pendant la spéciale.',
      },
      {
        num: '06',
        title: 'Structure éprouvée',
        text: 'Testament, mandat de protection et liquidités : l’arceau qui protège tout ce que vous avez bâti.',
      },
    ],
  },
  {
    id: 'accompagnement',
    chapterLabel: 'CHAPITRE 03 — LE COPILOTE',
    title: 'Personne ne gagne seul',
    description:
      'La caméra se tourne vers le siège de droite. C’est là que je m’assois : notes de route en main, virage après virage.',
    align: 'left',
    anchor: 0.68,
    start: 0.64,
    peakIn: 0.7,
    peakOut: 0.88,
    end: 0.96,
    bullets: [
      {
        num: '07',
        title: 'Éducation financière',
        text: 'Vous comprenez chaque décision avant de la prendre. Aucun jargon, seulement des notes de route claires.',
      },
      {
        num: '08',
        title: 'Ajustement fiscal',
        text: 'Révision annuelle des stratégies selon vos revenus, votre situation familiale et les changements législatifs.',
      },
      {
        num: '09',
        title: 'Planification de retraite',
        text: 'Décaissement optimisé, RRQ, PSV et rentes : un plan chronométré pour franchir l’arrivée sans panne sèche.',
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
    <div className="jemcee-landing bg-dark text-white" data-testid="jemcee-landing-page">
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
        scrollHeightVh={560}
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
              Un moteur performant, une cage de sécurité et un copilote qui lit la route. Trois
              piliers pour franchir chaque étape de votre parcours financier.
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
            Prêt pour la première spéciale ?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-white/65">
            Une rencontre découverte de 30 minutes, sans frais et sans engagement. On regarde votre
            véhicule financier ensemble et on identifie les réglages prioritaires.
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

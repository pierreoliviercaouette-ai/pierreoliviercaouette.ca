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
    chapterLabel: 'CHAPITRE 01 — PLACEMENTS',
    title: 'Faire croître votre épargne',
    description:
      'Que vous commenciez ou que vous approchiez de la retraite, vos placements doivent travailler selon votre horizon et votre tolérance au risque.',
    align: 'left',
    anchor: 0.28,
    start: 0.14,
    peakIn: 0.2,
    peakOut: 0.36,
    end: 0.42,
    bullets: [
      {
        num: '01',
        title: 'REER et CELI',
        text: 'Maximisez vos avantages fiscaux et choisissez le bon véhicule pour chaque objectif — retraite, fonds d’urgence ou études des enfants.',
      },
      {
        num: '02',
        title: 'Portefeuilles diversifiés',
        text: 'Des placements calibrés à votre profil, avec rééquilibrage régulier pour rester sur la trajectoire.',
      },
      {
        num: '03',
        title: 'Suivi personnalisé',
        text: 'Des ajustements quand votre vie change : nouveau job, achat immobilier, naissance ou retraite.',
      },
    ],
  },
  {
    id: 'securite',
    chapterLabel: 'CHAPITRE 02 — PROTECTION',
    title: 'Protéger ce qui compte',
    description:
      'Avant de viser la performance, on s’assure que votre famille et vos revenus tiennent le coup face aux imprévus.',
    align: 'right',
    anchor: 0.56,
    start: 0.38,
    peakIn: 0.46,
    peakOut: 0.66,
    end: 0.72,
    bullets: [
      {
        num: '04',
        title: 'Assurance vie',
        text: 'Une couverture adaptée à vos obligations réelles — hypothèque, enfants, conjoint survivant.',
      },
      {
        num: '05',
        title: 'Invalidité et maladies graves',
        text: 'Votre revenu protégé et un capital à diagnostic si la santé vous ralentit.',
      },
      {
        num: '06',
        title: 'Structure et liquidités',
        text: 'Fonds d’urgence, testament et mandat de protection : la base qui sécurise tout le reste.',
      },
    ],
  },
  {
    id: 'accompagnement',
    chapterLabel: 'CHAPITRE 03 — ACCOMPAGNEMENT',
    title: 'Un conseiller à vos côtés',
    description:
      'Je vous guide avec clarté — sans jargon, avec un plan que vous comprenez et que l’on révise ensemble, année après année.',
    align: 'left',
    anchor: 0.9,
    start: 0.68,
    peakIn: 0.78,
    peakOut: 0.95,
    end: 1,
    bullets: [
      {
        num: '07',
        title: 'Rencontre découverte',
        text: '30 minutes gratuites pour faire le point sur votre situation et identifier vos priorités.',
      },
      {
        num: '08',
        title: 'Plan financier global',
        text: 'Protection, épargne, fiscalité et succession intégrés dans une vision d’ensemble cohérente.',
      },
      {
        num: '09',
        title: 'Suivi annuel',
        text: 'Révisions régulières selon vos revenus, votre famille et les changements législatifs.',
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
              Placements, protection et accompagnement personnalisé : trois piliers pour bâtir et
              sécuriser votre patrimoine, avec un conseiller qui vous parle clairement.
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

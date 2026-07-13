import { ArrowRight, Flag, Gauge, Shield, Target, Timer } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { trackEvent } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';

export const JEMCEE_BOOKING_URL =
  'https://outlook.office.com/book/PierreOlivierCaouetteiAGroupefinancier@ia.ca/s/_4G_IKTvnEeGazDkP6WOUQ2?ismsaljsauthenabled';

const parallels = [
  {
    icon: Target,
    title: 'Préparation avant la course',
    track: 'Réglages, essais, objectifs de tour.',
    finance: 'Revenus, protections, priorités de vie — un plan avant d’agir.',
  },
  {
    icon: Gauge,
    title: 'Performance mesurable',
    track: 'Temps au tour, données, ajustements continus.',
    finance: 'Épargne, couverture, fiscalité : des repères concrets pour progresser.',
  },
  {
    icon: Shield,
    title: 'Gestion du risque',
    track: 'Marge d’erreur, sécurité, décisions froides sous pression.',
    finance: 'Assurance vie, invalidité, urgences : protéger ce qui compte vraiment.',
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
    title: 'Commandite Jemcee | Performance financiere | Pierre-Olivier Caouette',
    description:
      'Accueilli depuis le reportage Jemcee sur le GP3R, le Circuit Gilles-Villeneuve et Jacob Moreau : parallele piste et securite financiere, puis mini-diagnostic de 15-20 minutes.',
    canonicalPath: '/jemcee',
  });

  return (
    <main className="min-h-screen bg-white" data-testid="jemcee-landing-page">
      <PageHero
        badge="Reportage Jemcee · GP3R · Circuit Gilles-Villeneuve"
        title="Pierre-Olivier Caouette"
        description="Sur la piste comme en finances : la performance se prépare. Conseiller en sécurité financière à Victoriaville — fier de soutenir des courseurs québécois, dont Jacob Moreau."
        minHeightClass="min-h-[70vh] md:min-h-[78vh]"
      >
        <BookingCta
          itemId="jemcee_hero_diagnostic"
          className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-10 py-4 text-base font-bold text-dark shadow-xl shadow-black/15 ring-2 ring-white/40 transition-all duration-300 hover:scale-[1.02] hover:bg-secondary hover:text-white hover:ring-secondary/50"
        >
          Réserver un mini-diagnostic (15–20 min)
          <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
        </BookingCta>
      </PageHero>

      <section className="section-padding bg-white relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

        <div className="container-max relative max-w-4xl mx-auto text-center space-y-4 mb-14">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
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
          {parallels.map(({ icon: Icon, title, track, finance }) => (
            <div key={title} className="space-y-4 text-center md:text-left">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" aria-hidden />
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

      <section className="section-padding bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="container-max relative max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start">
            <div className="space-y-6">
              <span className="inline-block px-4 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
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

            <div className="space-y-6 lg:pt-10">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-dark text-secondary">
                <Flag className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="font-heading text-2xl font-bold text-dark">
                Pourquoi j’encourage les courseurs
              </h3>
              <div className="space-y-4 text-prestige-taupe leading-relaxed">
                <p>
                  La course automobile québécoise — GP3R, Circuit Gilles-Villeneuve, talents comme{' '}
                  <strong className="text-dark">Jacob Moreau</strong> — incarne ce que j’admire :
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

      <section className="section-padding pt-0">
        <div className="container-max">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 gradient-hero" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative px-6 py-12 md:px-12 md:py-16 text-center space-y-6">
              <div className="inline-flex items-center gap-2 mx-auto px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white/90 text-sm font-medium">
                <Timer className="w-4 h-4 text-secondary" aria-hidden />
                15 à 20 minutes · sans engagement
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

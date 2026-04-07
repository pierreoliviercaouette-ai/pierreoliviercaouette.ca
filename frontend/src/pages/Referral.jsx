import { Link } from 'react-router-dom';
import { Gift, Users, ArrowRight, MessageSquare, UserCheck, Trophy, Star, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';

const tiers = [
  {
    threshold: 10,
    reward: '25 $',
    name: 'Bronze',
    icon: Trophy,
    color: 'text-orange-700',
    bg: 'bg-orange-100',
    gradient: 'from-orange-600 to-orange-400',
  },
  {
    threshold: 20,
    reward: '50 $',
    name: 'Argent',
    icon: Trophy,
    color: 'text-gray-500',
    bg: 'bg-gray-100',
    gradient: 'from-gray-500 to-gray-300',
  },
  {
    threshold: 40,
    reward: '100 $',
    name: 'Or',
    icon: Trophy,
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    gradient: 'from-yellow-500 to-yellow-300',
  },
  {
    threshold: 75,
    reward: '250 $',
    name: 'Platine',
    icon: Star,
    color: 'text-cyan-600',
    bg: 'bg-cyan-100',
    gradient: 'from-cyan-500 to-cyan-300',
  },
  {
    threshold: 100,
    reward: 'Coffret Privilège',
    name: 'Privilège',
    icon: Crown,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    gradient: 'from-purple-600 to-purple-400',
  },
];

export const Referral = () => {
  const { user } = useAuth();
  useSeoMeta({
    title: 'Programme de recommandations | Victoriaville',
    description: 'Invitez des proches a decouvrir nos services via une mise en relation consentie. Programme de recommandations conforme et transparent.',
    canonicalPath: '/recommandations',
  });

  const pointsMethods = [
    {
      icon: Users,
      title: 'Mise en relation',
      points: 1,
      short: 'Une personne accepte d’être contactée via votre lien (page de consentement).',
      color: 'bg-blue-500',
    },
    {
      icon: MessageSquare,
      title: 'Avis Google',
      points: 2,
      short: 'Avis publié et reconnu selon les critères du programme.',
      color: 'bg-green-500',
    },
    {
      icon: UserCheck,
      title: 'Client existant',
      points: 2,
      short: 'Confirmation de votre statut dans notre dossier.',
      color: 'bg-purple-500',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Inscrivez-vous',
      description: 'Créez votre compte gratuit et obtenez votre lien de référencement unique.',
    },
    {
      number: '02',
      title: 'Mises en relation et interactions',
      description: 'Recommandez des proches, laissez un avis Google ou confirmez votre statut de client existant.',
    },
    {
      number: '03',
      title: 'Validation',
      description:
        'Une référence est valide lorsqu’une mise en relation est faite avec le consentement de la personne référée.',
    },
    {
      number: '04',
      title: 'Remerciement',
      description: 'Les points de remerciement sont appliqués selon les critères du programme.',
    },
  ];

  const faqs = [
    {
      question: 'Les points dépendent-ils d’un achat?',
      answer: 'Non. Ils récompensent la mise en relation ou les actions prévues au programme, pas une transaction.',
    },
    {
      question: 'Comment suivre mes points?',
      answer: 'Connectez-vous et consultez votre profil : suivi des points et des étapes.',
    },
    {
      question: 'Les paliers sont-ils cumulatifs?',
      answer: 'Oui. Les récompenses des paliers atteints s’additionnent (voir les paliers ci-dessus).',
    },
    {
      question: 'Dois-je parler de produits financiers?',
      answer: 'Non. Vous mettez en relation ; vous ne présentez pas de produits ni ne donnez de conseils.',
    },
  ];

  return (
    <main className="pt-20" data-testid="referral-page">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl opacity-10" />
        </div>

        <div className="relative section-padding">
          <div className="container-max text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <Gift className="w-5 h-5 text-secondary" />
              <span className="text-white font-medium">Recommandations</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Recommandez un proche. <span className="text-secondary">Sans pression.</span>
            </h1>

            <p className="text-white/85 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Partagez un lien : la personne choisit d’être contactée. Des remerciements peuvent s’appliquer selon le programme — sans obligation d’achat.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/profil"
                  onClick={() => trackEvent('select_content', { content_type: 'cta', item_id: 'referral_hero_profile' })}
                  className="bg-white text-primary rounded-full px-8 py-4 font-semibold hover:bg-light transition-all inline-flex items-center justify-center gap-2"
                  data-testid="referral-cta-profile"
                >
                  Voir mon profil et mon lien
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/inscription"
                    onClick={() => trackEvent('select_content', { content_type: 'cta', item_id: 'referral_hero_register' })}
                    className="bg-white text-primary rounded-full px-8 py-4 font-semibold hover:bg-light transition-all inline-flex items-center justify-center gap-2"
                    data-testid="referral-cta-register"
                  >
                    Créer mon compte
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/connexion"
                    onClick={() => trackEvent('select_content', { content_type: 'cta', item_id: 'referral_hero_login' })}
                    className="border-2 border-white text-white rounded-full px-8 py-4 font-semibold hover:bg-white/10 transition-all inline-flex items-center justify-center"
                    data-testid="referral-cta-login"
                  >
                    J’ai déjà un compte
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-3">
              Comment gagner des points
            </h2>
            <p className="text-prestige-taupe">
              Trois façons d’accumuler des points de reconnaissance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pointsMethods.map((method, index) => (
              <div
                key={method.title}
                className="relative bg-light rounded-2xl p-6 border border-prestige-beige/80"
                data-testid={`points-method-${index}`}
              >
                <div className={`w-12 h-12 rounded-xl ${method.color} flex items-center justify-center mb-4`}>
                  <method.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="font-heading text-lg font-semibold text-dark">{method.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-white text-xs font-bold ${method.color}`}>
                    +{method.points} pt{method.points > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-prestige-taupe text-sm leading-relaxed">{method.short}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-2xl mx-auto text-center text-sm text-prestige-taupe">
            Les points ne sont pas liés à la souscription d’un produit. Le programme vise à remercier les mises en relation personnelles, pas à distribuer des conseils ou des produits financiers.
          </p>
        </div>
      </section>

      <section className="section-padding gradient-prestige">
        <div className="container-max">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-3">
              Paliers de remerciement
            </h2>
            <p className="text-prestige-taupe">
              Reconnaissance cumulative : chaque palier atteint s’ajoute aux précédents (ex. à 40 points : 25 $ + 50 $ + 100 $).
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto" data-testid="referral-tiers-cards">
            {tiers.map((tier, index) => (
              <div
                key={tier.name}
                className="bg-white rounded-2xl p-5 shadow-ia text-center relative overflow-hidden"
                data-testid={`tier-card-${index}`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${tier.gradient}`} />
                <div className={`w-12 h-12 mx-auto rounded-full ${tier.bg} flex items-center justify-center mb-3 mt-1`}>
                  <tier.icon className={`w-6 h-6 ${tier.color}`} />
                </div>
                <h3 className="font-heading text-base font-bold text-dark">{tier.name}</h3>
                <p className="text-prestige-taupe text-xs mb-2">{tier.threshold} pts</p>
                <p className="font-heading text-xl font-bold text-primary">{tier.reward}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-prestige-taupe max-w-2xl mx-auto leading-relaxed">
            Chaque palier correspond à une récompense distincte ; les paliers atteints s’additionnent. Le coffret Privilège est une
            récompense non monétaire.
          </p>

          <p className="mt-8 text-center text-sm text-dark max-w-2xl mx-auto bg-white/60 rounded-xl px-4 py-3 border border-prestige-beige">
            Les récompenses ne sont pas conditionnées à l’achat d’un produit financier. Modalités détaillées dans votre espace ou sur demande.
          </p>
        </div>
      </section>

      <section className="section-padding bg-light">
        <div className="container-max">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4">
              Comment ça fonctionne ?
            </h2>
            <p className="text-prestige-taupe text-lg">Un processus simple en quatre étapes</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center" data-testid={`step-${index}`}>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-prestige-beige" aria-hidden />
                )}

                <div className="relative z-10 mb-6">
                  <div className="w-24 h-24 mx-auto rounded-full bg-white shadow-ia flex items-center justify-center">
                    <span className="font-heading text-3xl font-bold text-primary">{step.number}</span>
                  </div>
                </div>
                <h3 className="font-heading text-xl font-semibold text-dark mb-3">{step.title}</h3>
                <p className="text-prestige-taupe text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 max-w-3xl mx-auto text-center bg-white rounded-xl border border-prestige-beige p-4">
            <p className="text-sm text-prestige-taupe">
              Les points sont attribués pour la mise en relation uniquement, indépendamment des suites données.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-3">
              Questions fréquentes
            </h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-light rounded-xl p-5 border border-prestige-beige/60" data-testid={`faq-${index}`}>
                <h3 className="font-heading font-semibold text-dark text-sm mb-1.5">{faq.question}</h3>
                <p className="text-prestige-taupe text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-light pb-12">
        <div className="container-max">
          <div className="max-w-3xl mx-auto rounded-2xl bg-white border border-prestige-beige p-6 md:p-8">
            <h2 className="font-heading text-xl font-bold text-dark mb-4">
              Rappel important
            </h2>
            <ul className="space-y-2 text-prestige-taupe text-sm leading-relaxed list-disc pl-5">
              <li>Programme de reconnaissance pour des mises en relation, sans activité de distribution de produits financiers.</li>
              <li>Vous ne présentez pas de produits et ne donnez pas de conseils ; vous partagez un lien de contact.</li>
              <li>Le programme peut être modifié ; les récompenses sont habituellement des cartes-cadeaux, selon les règles en vigueur.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section-padding gradient-hero">
        <div className="container-max text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <Gift className="w-14 h-14 mx-auto text-secondary" />
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white">
              {user ? 'Votre lien et vos points' : 'Commencer'}
            </h2>
            <p className="text-white/80">
              {user
                ? 'Retrouvez votre lien de mise en relation et le suivi dans votre profil.'
                : 'Créez un compte gratuit pour obtenir votre lien personnel.'}
            </p>
            <Link
              to={user ? '/profil' : '/inscription'}
              onClick={() => trackEvent('select_content', { content_type: 'cta', item_id: user ? 'referral_final_profile' : 'referral_final_register' })}
              className="inline-flex items-center justify-center gap-2 bg-white text-primary rounded-full px-8 py-4 font-semibold hover:bg-light transition-all"
            >
              {user ? 'Ouvrir mon profil' : 'Créer mon compte'}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-6 bg-dark">
        <div className="container-max px-4 md:px-8">
          <p className="text-white/50 text-xs text-center max-w-3xl mx-auto">
            Programme soumis à conditions. Pierre-Olivier Caouette peut ajuster les modalités ; l’information à jour figure dans votre espace personnel lorsque vous y avez accès.
          </p>
        </div>
      </section>
    </main>
  );
};

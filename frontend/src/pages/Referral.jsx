import { Link } from 'react-router-dom';
import { Gift, Users, ArrowRight, MessageSquare, UserCheck, Trophy, Star, Crown, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';
import { PageHero } from '../components/layout/PageHero';
import { ReferralProgramDashboard } from '../components/referral/ReferralProgramDashboard';

const tiers = [
  { threshold: 10, reward: '25 $', name: 'Bronze', icon: Trophy, color: 'text-orange-700', bg: 'bg-orange-100', gradient: 'from-orange-600 to-orange-400' },
  { threshold: 20, reward: '50 $', name: 'Argent', icon: Trophy, color: 'text-gray-500', bg: 'bg-gray-100', gradient: 'from-gray-500 to-gray-300' },
  { threshold: 40, reward: '100 $', name: 'Or', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-100', gradient: 'from-yellow-500 to-yellow-300' },
  { threshold: 75, reward: '250 $', name: 'Platine', icon: Star, color: 'text-cyan-600', bg: 'bg-cyan-100', gradient: 'from-cyan-500 to-cyan-300' },
  { threshold: 100, reward: 'Coffret Privilège', name: 'Privilège', icon: Crown, color: 'text-purple-600', bg: 'bg-purple-100', gradient: 'from-purple-600 to-purple-400' },
];

const PublicHero = () => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0 gradient-hero" />
    <div className="absolute inset-0">
      <div className="absolute right-20 top-20 h-96 w-96 rounded-full bg-secondary opacity-20 blur-3xl" />
      <div className="absolute bottom-20 left-20 h-72 w-72 rounded-full bg-white opacity-10 blur-3xl" />
    </div>
    <div className="relative section-padding">
      <div className="container-max text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
          <Gift className="h-5 w-5 text-secondary" />
          <span className="font-medium text-white">Recommandations</span>
        </div>
        <h1 className="mb-6 font-heading text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
          Recommandez un proche. <span className="text-secondary">Sans pression.</span>
        </h1>
        <p className="mb-8 mx-auto max-w-2xl text-lg text-white/85 md:text-xl">
          Partagez un lien : la personne choisit d’être contactée. Des remerciements selon le programme — sans obligation d’achat.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/inscription"
            onClick={() => trackEvent('select_content', { content_type: 'cta', item_id: 'referral_hero_register' })}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-primary hover:bg-light"
            data-testid="referral-cta-register"
          >
            Créer mon compte
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/connexion"
            onClick={() => trackEvent('select_content', { content_type: 'cta', item_id: 'referral_hero_login' })}
            className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-4 font-semibold text-white hover:bg-white/10"
            data-testid="referral-cta-login"
          >
            J’ai déjà un compte
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const PublicProgramSections = () => {
  const pointsMethods = [
    { icon: Users, title: 'Mise en relation', points: 1, short: 'Quelqu’un accepte d’être contacté via votre lien (consentement).', color: 'bg-blue-500' },
    { icon: MessageSquare, title: 'Avis Google', points: 2, short: 'Avis publié et reconnu selon les critères du programme.', color: 'bg-green-500' },
    { icon: UserCheck, title: 'Client existant', points: 2, short: 'Confirmation de votre statut dans notre dossier.', color: 'bg-purple-500' },
  ];
  const faqs = [
    { question: 'Les points dépendent-ils d’un achat?', answer: 'Non. Ils récompensent la mise en relation ou les actions prévues au programme.' },
    { question: 'Comment suivre mes points?', answer: 'Connectez-vous : tout le suivi se fait sur cette page, dans la section membre.' },
    { question: 'Les paliers sont-ils cumulatifs?', answer: 'Oui. Les récompenses des paliers atteints s’additionnent.' },
    { question: 'Dois-je parler de produits financiers?', answer: 'Non. Vous mettez en relation ; vous ne donnez pas de conseils sur les produits.' },
  ];

  return (
    <>
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-3 font-heading text-3xl font-bold text-dark md:text-4xl">Comment gagner des points</h2>
            <p className="text-prestige-taupe">Trois façons d’accumuler des points de reconnaissance.</p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {pointsMethods.map((method, idx) => (
              <div
                key={method.title}
                className="relative rounded-2xl border border-prestige-beige/80 bg-light p-6"
                data-testid={`points-method-${idx}`}
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${method.color}`}>
                  <method.icon className="h-6 w-6 text-white" />
                </div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="font-heading text-lg font-semibold text-dark">{method.title}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold text-white ${method.color}`}>
                    +{method.points} pt{method.points > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-prestige-taupe">{method.short}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding gradient-prestige">
        <div className="container-max">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-3 font-heading text-3xl font-bold text-dark md:text-4xl">Paliers de remerciement</h2>
            <p className="text-prestige-taupe">Reconnaissance cumulative (les paliers atteints s’additionnent).</p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-5" data-testid="referral-tiers-cards">
            {tiers.map((tier, idx) => (
              <div
                key={tier.name}
                className="relative overflow-hidden rounded-2xl bg-white p-5 text-center shadow-ia"
                data-testid={`tier-card-${idx}`}
              >
                <div className={`absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r ${tier.gradient}`} />
                <div className={`mx-auto mb-3 mt-1 flex h-12 w-12 items-center justify-center rounded-full ${tier.bg}`}>
                  <tier.icon className={`h-6 w-6 ${tier.color}`} />
                </div>
                <h3 className="font-heading text-base font-bold text-dark">{tier.name}</h3>
                <p className="mb-2 text-xs text-prestige-taupe">{tier.threshold} pts</p>
                <p className="font-heading text-xl font-bold text-primary">{tier.reward}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 mx-auto max-w-2xl text-center text-sm text-prestige-taupe">
            Inscrivez-vous, partagez votre lien et suivez tout depuis cette même page une fois connecté.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <h2 className="mb-10 text-center font-heading text-3xl font-bold text-dark">Questions fréquentes</h2>
          <div className="mx-auto max-w-2xl space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-prestige-beige/60 bg-light p-5" data-testid={`faq-${i}`}>
                <h3 className="mb-1.5 font-heading text-sm font-semibold text-dark">{faq.question}</h3>
                <p className="text-sm leading-relaxed text-prestige-taupe">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-light pb-8">
        <div className="container-max">
          <div className="mx-auto max-w-3xl rounded-2xl border border-prestige-beige bg-white p-6 md:p-8">
            <h2 className="mb-4 font-heading text-xl font-bold text-dark">Rappel</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-prestige-taupe">
              <li>Programme de reconnaissance pour mises en relation, sans activité de distribution de produits.</li>
              <li>Vous partagez un lien de contact ; vous ne présentez pas de produits ni de conseils.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

const LoggedInExtraInfo = () => {
  const faqs = [
    { question: 'Les points dépendent-ils d’un achat?', answer: 'Non. Ils récompensent la mise en relation ou les actions prévues au programme.' },
    { question: 'Les paliers sont-ils cumulatifs?', answer: 'Oui. Les récompenses des paliers atteints s’additionnent.' },
    { question: 'Dois-je parler de produits financiers?', answer: 'Non. Vous mettez en relation ; vous ne présentez pas de produits.' },
  ];
  return (
    <section className="section-padding border-t border-prestige-beige bg-white">
      <div className="container-max max-w-2xl">
        <details className="group rounded-2xl border border-prestige-beige bg-light/50 open:bg-white open:shadow-ia">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-5 py-4 font-heading font-semibold text-dark marker:content-none md:px-6 [&::-webkit-details-marker]:hidden">
            Rappels sur le programme
            <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          <div className="space-y-3 border-t border-prestige-beige px-5 py-4 md:px-6">
            {faqs.map((faq, i) => (
              <div key={i}>
                <p className="text-sm font-medium text-dark">{faq.question}</p>
                <p className="mt-1 text-sm text-prestige-taupe">{faq.answer}</p>
              </div>
            ))}
            <p className="text-xs text-prestige-taupe">
              Vos outils et l’historique d’utilisation restent accessibles depuis votre profil.
            </p>
            <Link to="/profil" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Ouvrir mon profil
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </details>
      </div>
    </section>
  );
};

export const Referral = () => {
  const { user } = useAuth();
  useSeoMeta({
    title: 'Programme de recommandations | Victoriaville',
    description:
      'Lien de mise en relation, suivi des points et références : le programme de recommandations, au même endroit.',
    canonicalPath: '/recommandations',
  });

  return (
    <main className="pt-20" data-testid="referral-page">
      {user ? (
        <>
          <PageHero
            badge="Espace membre"
            title={`${user.first_name}, votre programme de recommandations`}
            description="Copiez votre lien, inscrivez une personne, suivez vos points et paliers — tout se fait ici."
            minHeightClass="min-h-[40vh] md:min-h-[48vh]"
          />
          <section className="section-padding border-t border-prestige-beige/80 bg-light">
            <div className="container-max">
              <ReferralProgramDashboard />
            </div>
          </section>
          <LoggedInExtraInfo />
        </>
      ) : (
        <>
          <PublicHero />
          <PublicProgramSections />
        </>
      )}

      <section className="bg-dark py-6">
        <div className="container-max px-4 text-center text-xs text-white/50 md:px-8">
          <p>
            Programme soumis à conditions. L’information à jour figure sur cette page et dans votre espace lorsque vous
            y êtes connecté.
          </p>
        </div>
      </section>
    </main>
  );
};

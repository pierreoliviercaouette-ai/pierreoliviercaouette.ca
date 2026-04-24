import { Link } from 'react-router-dom';
import { Gift, Users, ArrowRight, MessageSquare, UserCheck, Trophy, Star, Crown, CheckCircle2, Copy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';
import { getReferralConsentUrl } from '../lib/referralLink';
import { useReferralProgramData } from '../hooks/useReferralProgramData';
import { ReferralMemberActions } from '../components/referral/ReferralMemberActions';
import { Button } from '../components/ui/button';

const tiers = [
  { threshold: 10, reward: '25 $', name: 'Bronze', icon: Trophy, color: 'text-orange-700', bg: 'bg-orange-100', gradient: 'from-orange-600 to-orange-400' },
  { threshold: 20, reward: '50 $', name: 'Argent', icon: Trophy, color: 'text-gray-500', bg: 'bg-gray-100', gradient: 'from-gray-500 to-gray-300' },
  { threshold: 40, reward: '100 $', name: 'Or', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-100', gradient: 'from-yellow-500 to-yellow-300' },
  { threshold: 75, reward: '250 $', name: 'Platine', icon: Star, color: 'text-cyan-600', bg: 'bg-cyan-100', gradient: 'from-cyan-500 to-cyan-300' },
  { threshold: 100, reward: 'Coffret Privilège', name: 'Privilège', icon: Crown, color: 'text-purple-600', bg: 'bg-purple-100', gradient: 'from-purple-600 to-purple-400' },
];

const pointsMethods = [
  { icon: Users, title: 'Mise en relation', points: 1, short: 'Quelqu’un accepte d’être contacté via votre lien (consentement).', color: 'bg-blue-500' },
  { icon: MessageSquare, title: 'Avis Google', points: 2, short: 'Avis publié et reconnu selon les critères du programme.', color: 'bg-green-500' },
  { icon: UserCheck, title: 'Client existant', points: 2, short: 'Confirmation de votre statut dans notre dossier.', color: 'bg-purple-500' },
];

const faqs = [
  { question: 'Les points dépendent-ils d’un achat?', answer: 'Non. Ils récompensent la mise en relation ou les actions prévues au programme.' },
  { question: 'Comment suivre mes points?', answer: 'Uniquement à la connexion, sur cette même page : la structure (haut de page, barre, paliers) reste la même qu’en consultation publique ; seuls s’y ajoutent les chiffres vérifiés, votre lien de consentement et l’historique des références. Aucun compteur n’existe hors compte actif.' },
  { question: 'Les paliers sont-ils cumulatifs?', answer: 'Oui. Les récompenses des paliers atteints s’additionnent.' },
  { question: 'Dois-je parler de produits financiers?', answer: 'Non. Vous mettez en relation ; vous ne donnez pas de conseils sur les produits.' },
];

const ReferralHero = ({ user, program }) => {
  if (!user) {
    return (
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
  }

  const { loading, copyReferralLink, copied } = program;
  const first = user.first_name?.trim();
  const link = user.referral_code ? getReferralConsentUrl(user.referral_code) : '';

  return (
    <section className="relative overflow-hidden pb-4 sm:pb-6">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0">
        <div className="absolute right-20 top-20 h-96 w-96 rounded-full bg-secondary opacity-20 blur-3xl" />
        <div className="absolute bottom-20 left-20 h-72 w-72 rounded-full bg-white opacity-10 blur-3xl" />
      </div>
      <div className="relative section-padding pb-10 sm:pb-12">
        <div className="container-max text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
            <Gift className="h-5 w-5 text-secondary" />
            <span className="font-medium text-white">Espace membre</span>
          </div>
          <h1 className="mb-3 font-heading text-4xl font-bold text-white sm:text-5xl">
            {first ? `Bonjour, ${first}` : 'Bienvenue dans votre programme'}
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-base text-white/85 sm:text-lg">
            Solde et paliers dans la section suivante, puis comment gagner des points et vos outils pour agir — tout sur cette page.
          </p>

          {user.referral_code && !loading && (
            <div className="mx-auto mb-8 max-w-2xl">
              <p className="mb-2 text-left text-xs text-white/70">Lien de consentement (raccourci)</p>
              <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 p-2 sm:p-3">
                <div className="min-w-0 flex-1 truncate font-mono text-left text-xs text-white/95 sm:text-sm" data-testid="referral-hero-link">
                  {link}
                </div>
                <Button
                  type="button"
                  onClick={copyReferralLink}
                  className="h-9 w-9 shrink-0 border border-white/30 bg-white/15 p-0 text-white hover:bg-white/25"
                  data-testid="referral-hero-copy"
                >
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          <p className="text-sm text-white/60">
            <Link to="/profil" className="font-medium text-white/90 underline-offset-2 hover:underline">
              Ouvrir mon profil
            </Link>
            <span className="text-white/50"> — coordonnées, mot de passe, etc.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

const PointsHowSection = ({ memberLayout }) => (
  <section
    className={`section-padding ${memberLayout ? 'border-t border-prestige-beige/70 bg-white' : 'bg-white'}`}
    data-testid="referral-how-points"
  >
    <div className="container-max">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="mb-3 font-heading text-3xl font-bold text-dark md:text-4xl">Comment gagner des points</h2>
        <p className="text-prestige-taupe">Trois façons d’accumuler des points, une fois le compte actif. Aucun point n’est retenu tant que vous n’êtes pas connecté.</p>
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
);

const AccountGateSection = () => (
  <section className="section-padding bg-light border-y border-prestige-beige/60">
    <div className="container-max">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-prestige-beige bg-white p-8 text-center shadow-ia">
        <h2 className="mb-2 font-heading text-2xl font-bold text-dark">Passez à l’action</h2>
        <p className="mb-6 text-prestige-taupe">
          Créez un compte ou connectez-vous : mêmes paliers visuels qu’ici, avec votre solde et vos outils uniquement en session.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/inscription"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white hover:opacity-95"
            onClick={() => trackEvent('select_content', { content_type: 'cta', item_id: 'referral_gate_register' })}
          >
            S’inscrire
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/connexion"
            className="inline-flex items-center justify-center rounded-full border-2 border-primary/30 px-6 py-3 font-semibold text-primary hover:bg-primary/5"
            onClick={() => trackEvent('select_content', { content_type: 'cta', item_id: 'referral_gate_login' })}
          >
            Connexion
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const TiersSection = ({ user, referralStats, loading }) => {
  const isGuest = !user;
  const isLoading = Boolean(user) && loading;
  const total = user && !loading && referralStats != null ? referralStats.total_points : null;
  const next = referralStats?.next_tier;
  const toNext = referralStats?.points_to_next_tier;
  const clamped = Math.max(0, referralStats?.total_points ?? 0);
  const barPct = Math.min(100, (clamped / 100) * 100);

  return (
    <section className={`section-padding gradient-prestige ${!isGuest ? '-mt-px border-t border-white/10 pt-12 sm:pt-14' : ''}`}>
      <div className="container-max">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="mb-2 font-heading text-3xl font-bold text-dark md:text-4xl">Paliers de remerciement</h2>
          <p className="text-sm text-prestige-taupe md:text-base">
            {isGuest
              ? 'Cinq étapes jusqu’à 100 points — les remerciements s’additionnent. Même présentation en visite ou connecté.'
              : 'Votre position sur l’échelle : solde, prochain objectif et cartes des remerciements.'}
          </p>
        </div>

        {!isGuest && isLoading && (
          <div className="mx-auto mb-8 h-14 max-w-md animate-pulse rounded-2xl bg-prestige-beige/50" data-testid="referral-tiers-loading" />
        )}

        {!isGuest && !isLoading && (
          <div className="mx-auto mb-8 max-w-lg px-2">
            <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-ia">
              <div className="text-center sm:text-left">
                <p className="text-[11px] font-medium uppercase tracking-wide text-prestige-taupe">Solde</p>
                <p className="font-heading text-3xl font-bold text-primary" data-testid="referral-tiers-bar-points">
                  {clamped}
                  <span className="text-lg font-semibold text-prestige-taupe"> / 100</span>
                  <span className="ml-1 text-lg font-semibold text-primary">pts</span>
                </p>
              </div>
              {next && toNext > 0 ? (
                <div className="min-w-0 border-t border-prestige-beige pt-3 text-center text-sm text-prestige-taupe sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0 sm:text-left">
                  <span className="font-medium text-dark">Prochain : {next.name}</span>
                  <span className="block tabular-nums">Encore {toNext} pt · seuil {next.threshold}</span>
                </div>
              ) : clamped >= 100 ? (
                <p className="max-w-xs text-center text-sm font-medium text-dark sm:text-left">Échelle complétée — merci !</p>
              ) : null}
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-prestige-beige/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-500"
                style={{ width: `${barPct}%` }}
                data-testid="referral-tiers-progress-bar"
              />
            </div>
          </div>
        )}

        {isGuest && (
          <p className="mx-auto mb-8 max-w-md text-center text-sm text-prestige-taupe">
            Connecté, une ligne de progression et votre solde s’affichent au-dessus des mêmes cartes.
          </p>
        )}

        <div
          className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5"
          data-testid="referral-tiers-cards"
        >
          {tiers.map((tier, idx) => {
            const reached = total != null && total >= tier.threshold;
            const isNext = !reached && next && next.threshold === tier.threshold;
            const Icon = tier.icon;
            return (
              <div
                key={tier.name}
                className={`relative flex min-h-[240px] flex-col overflow-hidden rounded-2xl bg-white text-center shadow-ia transition sm:min-h-[260px] ${
                  reached ? 'ring-2 ring-primary ring-offset-2' : isNext ? 'ring-2 ring-dashed ring-primary/50' : ''
                }`}
                data-testid={`tier-card-${idx}`}
              >
                <div className={`h-2 w-full shrink-0 bg-gradient-to-r ${tier.gradient}`} />
                {reached && (
                  <span className="absolute right-2 top-3 flex items-center gap-0.5 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                    <CheckCircle2 className="h-3 w-3" aria-hidden />
                    Atteint
                  </span>
                )}
                {isNext && (
                  <span className="absolute right-2 top-3 rounded-full border border-dashed border-primary bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                    Prochain
                  </span>
                )}
                <div className="flex flex-1 flex-col items-center px-4 pb-5 pt-6">
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${tier.bg} shadow-sm`}>
                    <Icon className={`h-8 w-8 ${tier.color}`} />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-bold text-dark">{tier.name}</h3>
                  <span className="mt-2 rounded-full bg-light px-3 py-1 text-xs font-semibold tabular-nums text-dark">
                    {tier.threshold} pts
                  </span>
                  <p className="mt-auto pt-5 font-heading text-xl font-bold leading-tight text-primary sm:text-2xl">{tier.reward}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 mx-auto max-w-xl text-center text-xs text-prestige-taupe sm:text-sm">
          {user
            ? 'Les coches et la barre reflètent les points vérifiés dans votre dossier.'
            : 'Aucun solde hors session : les coches et la barre n’apparaissent qu’une fois connecté.'}
        </p>
      </div>
    </section>
  );
};

const FaqAndLegal = () => (
  <>
    <section className="section-padding bg-white">
      <div className="container-max">
        <h2 className="mb-10 text-center font-heading text-3xl font-bold text-dark">Questions fréquentes</h2>
        <div className="mx-auto max-w-2xl space-y-3">
          {faqs.map((faq, i) => (
            <div key={faq.question} className="rounded-xl border border-prestige-beige/60 bg-light p-5" data-testid={`faq-${i}`}>
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

export const Referral = () => {
  const { user } = useAuth();
  const program = useReferralProgramData(user);
  const { loading, referralStats } = program;

  useSeoMeta({
    title: 'Programme de recommandations | Victoriaville',
    description:
      'Lien de mise en relation, suivi des points et références : le programme de recommandations, au même endroit.',
    canonicalPath: '/recommandations',
  });

  return (
    <main className="pt-20" data-testid="referral-page">
      <ReferralHero user={user} program={program} />
      {user ? (
        <>
          <TiersSection user={user} referralStats={referralStats} loading={loading} />
          <PointsHowSection memberLayout />
          <section className="section-padding border-t border-prestige-beige/80 bg-light">
            <div className="container-max">
              <div className="mx-auto mb-8 max-w-3xl text-center">
                <h2 className="font-heading text-2xl font-bold text-dark md:text-3xl">Vos outils</h2>
                <p className="mt-2 text-sm text-prestige-taupe md:text-base">
                  Lien, avis Google, client existant, saisie manuelle et suivi des personnes — après la lecture du programme ci-dessus.
                </p>
              </div>
              <ReferralMemberActions user={user} program={program} />
            </div>
          </section>
        </>
      ) : (
        <>
          <PointsHowSection />
          <AccountGateSection />
          <TiersSection user={user} referralStats={referralStats} loading={false} />
        </>
      )}
      <FaqAndLegal />

      <section className="bg-dark py-6">
        <div className="container-max px-4 text-center text-xs text-white/50 md:px-8">
          <p>
            Programme soumis à conditions. L’information à jour figure sur cette page et, lorsque vous êtes connecté,
            reflète l’état vérifié de votre compte.
          </p>
        </div>
      </section>
    </main>
  );
};

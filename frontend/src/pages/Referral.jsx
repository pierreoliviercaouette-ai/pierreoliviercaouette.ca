import { Link } from 'react-router-dom';
import { Gift, Users, ArrowRight, MessageSquare, UserCheck, Trophy, Star, Crown, CheckCircle2, Copy, MapPin } from 'lucide-react';
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

  const { loading, referralStats, copyReferralLink, copied } = program;
  const first = user.first_name?.trim();
  const totalPoints = referralStats?.total_points;
  const next = referralStats?.next_tier;
  const nextLine =
    !loading && referralStats
      ? next
        ? `Prochain palier : ${next.name} — ${referralStats.points_to_next_tier} point(s) restant(s).`
        : totalPoints >= 100
          ? 'Tous les paliers du programme actuel sont atteints. Merci !'
          : null
      : null;

  const link = user.referral_code ? getReferralConsentUrl(user.referral_code) : '';

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
            <span className="font-medium text-white">Espace membre</span>
          </div>
          <h1 className="mb-4 font-heading text-4xl font-bold text-white sm:text-5xl">
            {first ? `Bonjour, ${first}` : 'Bienvenue dans votre programme'}
          </h1>
          <p className="mb-2 mx-auto max-w-2xl text-lg text-white/85">
            Même page que plus bas : ici, votre raccourci pour les points et le lien de consentement.
          </p>
          {loading ? (
            <div className="mb-6 flex justify-center">
              <div className="h-6 w-40 animate-pulse rounded bg-white/20" />
            </div>
          ) : (
            <p className="mb-1 font-heading text-3xl font-bold text-white sm:text-4xl" data-testid="referral-hero-points">
              {totalPoints} pt{totalPoints === 1 ? '' : 's'}
            </p>
          )}
          {nextLine && <p className="mb-6 text-sm text-white/80 sm:text-base">{nextLine}</p>}

          {user.referral_code && !loading && (
            <div className="mx-auto max-w-2xl">
              <p className="mb-2 text-left text-xs text-white/70">Lien de consentement</p>
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

          <p className="mt-6 text-sm text-white/60">
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

const PointsHowSection = () => (
  <section className="section-padding bg-white" data-testid="referral-how-points">
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

/** Même cadrage visuel invité / membre. Invité = référence d’interface, sans comptage (pas de suivi hors session). */
const ReferralTiersProgress = ({ user, loading, referralStats }) => {
  const isGuest = !user;
  const isLoading = Boolean(user) && loading;
  const clamped = isGuest
    ? 0
    : Math.max(0, referralStats?.total_points ?? 0);
  const barPct = Math.min(100, (clamped / 100) * 100);
  const rawLinePct = (Math.min(clamped, 100) / 100) * 100;
  const pinLinePct = Math.max(0.2, Math.min(99.8, rawLinePct));
  const next = referralStats?.next_tier;
  const toNext = referralStats?.points_to_next_tier;
  const showPin = !isGuest && !isLoading && user;

  return (
    <div
      className="mx-auto mb-10 max-w-4xl rounded-2xl border border-prestige-beige/80 bg-white/90 p-5 shadow-ia sm:p-7"
      data-testid="referral-tiers-progress"
    >
      <div className="mb-1 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="font-heading text-lg font-semibold text-dark sm:text-xl">Parcours des remerciements (0–100 pts)</h3>
          {isGuest && (
            <p className="mt-1 max-w-xl text-xs text-prestige-taupe">
              Aperçu de l’écran de suivi : mêmes jalons et même barre qu’en session membre, sans chiffre personnel.
            </p>
          )}
        </div>
        {isLoading ? (
          <div className="h-5 w-28 animate-pulse rounded bg-prestige-beige/60" />
        ) : isGuest ? (
          <span className="shrink-0 rounded-full border border-dashed border-prestige-taupe/50 bg-light px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-prestige-taupe sm:text-xs">
            Référence
          </span>
        ) : (
          <span className="font-heading text-2xl font-bold text-primary" data-testid="referral-tiers-bar-points">
            {clamped} pt{clamped === 1 ? '' : 's'}
          </span>
        )}
      </div>

      <p className="mb-5 text-sm text-prestige-taupe">
        {isGuest
          ? "Le comptage et le remplissage de la barre s’alimentent uniquement lorsque vous êtes connecté, à partir de votre dossier vérifié. Ici, vous lisez le cadre d’affichage commun — pas d’indication liée à vous hors session."
          : isLoading
            ? 'Chargement de la progression…'
            : next && toNext > 0
              ? `Prochaine récompense : ${next.name} — encore ${toNext} point(s) (palier ${next.threshold} pts).`
              : clamped >= 100
                ? "Vous avez atteint l’échelle de points du programme. Merci !"
                : "Continuez d’accumuler des points vérifiés : la barre avance en temps réel."}
      </p>

      {isLoading ? (
        <div className="h-12 w-full animate-pulse rounded-xl bg-prestige-beige/50" />
      ) : (
        <div className="relative">
          <div className="relative h-3 overflow-hidden rounded-full bg-prestige-beige/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-secondary transition-[width] duration-500 ease-out"
              style={{ width: `${isGuest ? 0 : barPct}%` }}
            />
          </div>
          <div className="relative -mt-1.5 h-8 w-full" aria-hidden>
            {tiers.map((t) => {
              const markPct = (t.threshold / 100) * 100;
              const done = isGuest ? false : clamped >= t.threshold;
              return (
                <div
                  key={t.threshold}
                  className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
                  style={{ left: `${markPct}%` }}
                  title={`${t.name} — ${t.threshold} pts — ${t.reward}`}
                >
                  <div
                    className={`h-2.5 w-2.5 rounded-full border-2 border-white shadow ${
                      done ? 'bg-primary' : isGuest ? 'bg-prestige-taupe/30' : 'bg-white ring-1 ring-prestige-beige'
                    }`}
                  />
                </div>
              );
            })}
            {showPin && (
              <div
                className="absolute -top-6 z-10 flex -translate-x-1/2 flex-col items-center sm:-top-7"
                style={{ left: `${pinLinePct}%` }}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-white shadow-md sm:h-7 sm:w-7">
                  <MapPin className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
                </span>
              </div>
            )}
          </div>
          <div className="relative mt-0 min-h-[2.75rem] w-full sm:min-h-[3rem]" aria-hidden>
            {tiers.map((t) => {
              const markPct = (t.threshold / 100) * 100;
              return (
                <div
                  key={`lbl-${t.threshold}`}
                  className="absolute top-0 w-0 -translate-x-1/2 text-center"
                  style={{ left: `${markPct}%` }}
                >
                  <span className="block w-[3.4rem] text-[10px] font-semibold leading-tight text-dark sm:w-[3.8rem] sm:text-xs">
                    {t.threshold} pts
                  </span>
                  <span className="mt-0.5 line-clamp-1 block w-[3.4rem] text-[9px] text-prestige-taupe sm:w-[3.8rem] sm:text-[10px]">
                    {t.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isGuest && !isLoading && (
        <div className="mt-10 rounded-xl border border-dashed border-prestige-beige/90 bg-light/50 px-3 py-2.5 text-center text-xs text-prestige-taupe sm:mt-12 sm:text-sm">
          Cohérence avec l’espace membre : connecté, la même barre affiche <span className="text-dark">votre</span> remplissage, la
          punaise et la couleur des jalons d’après <span className="text-dark">votre</span> solde. Déconnecté, il n’y a pas de
          mémorisation de points.
        </div>
      )}
    </div>
  );
};

const AccountGateSection = () => (
  <section className="section-padding bg-light border-y border-prestige-beige/60">
    <div className="container-max">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-prestige-beige bg-white p-8 text-center shadow-ia">
        <h2 className="mb-2 font-heading text-2xl font-bold text-dark">Passez à l’action</h2>
        <p className="mb-6 text-prestige-taupe">
          Créez un compte ou connectez-vous : sur cette page, l’en-tête, la piste 0–100 et les paliers s’animent de la même
          manière, avec l’ajout concret (lien, compteur, listes) uniquement en session.
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
  const total = user && !loading && referralStats != null ? referralStats.total_points : null;
  const next = referralStats?.next_tier;

  return (
    <section className="section-padding gradient-prestige">
      <div className="container-max">
        <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-8">
          <h2 className="mb-3 font-heading text-3xl font-bold text-dark md:text-4xl">Paliers de remerciement</h2>
          <p className="text-prestige-taupe">Reconnaissance cumulative (les paliers atteints s’additionnent).</p>
          {user && loading && <p className="mt-2 text-sm text-prestige-taupe">Chargement de votre progression…</p>}
          {total != null && !loading && (
            <p className="mt-3 text-sm font-medium text-primary" data-testid="referral-tiers-context">
              Votre solde : <span className="font-heading text-lg">{total} pt{total === 1 ? '' : 's'}</span>
              {next ? (
                <>
                  {' '}
                  — cible : {next.name} à {next.threshold} pts
                </>
              ) : null}
            </p>
          )}
        </div>
        <ReferralTiersProgress user={user} loading={loading} referralStats={referralStats} />
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-5" data-testid="referral-tiers-cards">
          {tiers.map((tier, idx) => {
            const reached = total != null && total >= tier.threshold;
            const isNext =
              !reached && next && next.threshold === tier.threshold;
            return (
              <div
                key={tier.name}
                className={`relative overflow-hidden rounded-2xl bg-white p-5 text-center shadow-ia transition ${
                  reached
                    ? 'ring-2 ring-primary ring-offset-2'
                    : isNext
                      ? 'ring-1 ring-dashed border-primary/40'
                      : ''
                }`}
                data-testid={`tier-card-${idx}`}
              >
                {reached && (
                  <span className="absolute right-2 top-2 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                    Atteint
                  </span>
                )}
                {isNext && (
                  <span className="absolute right-2 top-2 rounded border border-dashed border-primary/50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary/90">
                    Prochain
                  </span>
                )}
                <div className={`absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r ${tier.gradient}`} />
                <div className={`mx-auto mb-3 mt-1 flex h-12 w-12 items-center justify-center rounded-full ${tier.bg}`}>
                  <tier.icon className={`h-6 w-6 ${tier.color}`} />
                </div>
                <h3 className="font-heading text-base font-bold text-dark">{tier.name}</h3>
                <p className="mb-2 text-xs text-prestige-taupe">{tier.threshold} pts</p>
                <p className="font-heading text-xl font-bold text-primary">{tier.reward}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-6 mx-auto max-w-2xl text-center text-sm text-prestige-taupe">
          {user
            ? 'Les mises en jour des points s’affichent ici en fonction de ce qui a été vérifié côté programme.'
            : "Les cartes ci-dessus décrivent le programme. Le suivi personnalisé s’ouvre dès l’ouverture de session — pas de reprise de compteur en navigation anonyme."}
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
      <PointsHowSection />
      {user ? (
        <section className="section-padding border-t border-prestige-beige/80 bg-white">
          <div className="container-max">
            <div className="mb-2 text-center">
              <h2 className="font-heading text-2xl font-bold text-dark md:text-3xl">Vos outils</h2>
              <p className="mt-1 text-sm text-prestige-taupe">C’est ici que vous gagnez et suivez vos points.</p>
            </div>
            <ReferralMemberActions user={user} program={program} />
          </div>
        </section>
      ) : (
        <AccountGateSection />
      )}

      <TiersSection user={user} referralStats={referralStats} loading={user ? loading : false} />
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

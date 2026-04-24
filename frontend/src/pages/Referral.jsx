import { Link } from 'react-router-dom';
import {
  Gift,
  Users,
  ArrowRight,
  MessageSquare,
  Trophy,
  Star,
  Crown,
  CheckCircle2,
  Copy,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';
import { getReferralConsentUrl } from '../lib/referralLink';
import { useReferralProgramData } from '../hooks/useReferralProgramData';
import { ReferralMemberActions } from '../components/referral/ReferralMemberActions';
import { Button } from '../components/ui/button';
import { PageHero } from '../components/layout/PageHero';

const TIERS = [
  { threshold: 10, reward: '25 $', name: 'Bronze', icon: Trophy, color: 'text-orange-700', bg: 'bg-orange-50' },
  { threshold: 20, reward: '50 $', name: 'Argent', icon: Trophy, color: 'text-gray-600', bg: 'bg-gray-50' },
  { threshold: 40, reward: '100 $', name: 'Or', icon: Trophy, color: 'text-yellow-700', bg: 'bg-amber-50' },
  { threshold: 75, reward: '250 $', name: 'Platine', icon: Star, color: 'text-cyan-700', bg: 'bg-cyan-50' },
  { threshold: 100, reward: 'Coffret Privilège', name: 'Privilège', icon: Crown, color: 'text-purple-700', bg: 'bg-purple-50' },
];

const HOW_STEPS = [
  {
    icon: Users,
    title: 'Partager le lien',
    body: 'Vous envoyez le lien de consentement : la personne choisit librement d’être recontactée.',
    meta: '+1 pt par mise en relation qualifiée',
  },
  {
    icon: MessageSquare,
    title: 'Bonus possibles',
    body: 'Avis Google reconnu ou confirmation « client existant » dans notre dossier, selon les règles du programme.',
    meta: '+2 pts chacun lorsque vérifié',
  },
  {
    icon: Gift,
    title: 'Remerciements',
    body: 'Les points ouvrent des paliers de reconnaissance (jusqu’à 100 pts). Les récompenses des paliers atteints s’additionnent.',
    meta: 'Sans obligation d’achat',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Faut-il parler de produits financiers ?',
    a: 'Non. Vous faites une mise en relation ; vous ne présentez pas de produits ni de conseils.',
  },
  {
    q: 'Où voir mon avancement ?',
    a: 'Une fois connecté, le tableau des paliers et le bloc résumé (points, barre, lien) affichent votre situation vérifiée.',
  },
];

function ReferralPageHero({ user }) {
  if (!user) {
    return (
      <PageHero
        badge="Programme"
        title="Recommandations : un lien, des remerciements clairs"
        description="Inscrivez-vous pour obtenir votre lien personnel, puis suivez vos points et vos paliers sur cette même page."
        minHeightClass="min-h-[52vh] md:min-h-[58vh]"
      >
        <Link
          to="/inscription"
          onClick={() => trackEvent('select_content', { content_type: 'cta', item_id: 'referral_hero_register' })}
          className="btn-primary inline-flex items-center justify-center gap-2"
          data-testid="referral-cta-register"
        >
          Créer mon compte
          <ArrowRight className="h-5 w-5" />
        </Link>
        <Link
          to="/connexion"
          onClick={() => trackEvent('select_content', { content_type: 'cta', item_id: 'referral_hero_login' })}
          className="btn-secondary inline-flex items-center justify-center"
          data-testid="referral-cta-login"
        >
          J’ai déjà un compte
        </Link>
      </PageHero>
    );
  }

  const first = user.first_name?.trim();
  return (
    <PageHero
      badge="Espace membre"
      title={first ? `Bonjour, ${first}` : 'Programme de recommandations'}
      description="Paliers en premier, puis comment gagner des points, puis vos outils — dans cet ordre sur la page."
      minHeightClass="min-h-[38vh] md:min-h-[46vh]"
    >
      <Link to="/profil" className="btn-secondary inline-flex items-center justify-center gap-2 text-sm">
        Mon profil
        <ArrowRight className="h-4 w-4" />
      </Link>
    </PageHero>
  );
}

function MemberSummaryCard({ user, program }) {
  const { loading, referralStats, copyReferralLink, copied } = program;
  const link = user.referral_code ? getReferralConsentUrl(user.referral_code) : '';

  if (loading) {
    return (
      <section className="section-padding bg-light">
        <div className="container-max">
          <div className="mx-auto max-w-3xl animate-pulse rounded-2xl border border-prestige-beige bg-white p-8 shadow-ia">
            <div className="h-8 w-48 rounded bg-prestige-beige/60" />
            <div className="mt-4 h-3 w-full rounded bg-prestige-beige/40" />
          </div>
        </div>
      </section>
    );
  }

  const clamped = Math.max(0, referralStats?.total_points ?? 0);
  const next = referralStats?.next_tier;
  const toNext = referralStats?.points_to_next_tier;
  const barPct = Math.min(100, (clamped / 100) * 100);

  return (
    <section className="section-padding bg-light">
      <div className="container-max">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-prestige-beige bg-white shadow-ia">
          <div className="border-b border-prestige-beige/80 bg-gradient-to-br from-light to-white px-5 py-6 sm:px-8 sm:py-7">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-prestige-taupe">Points vérifiés</p>
                <p className="mt-1 font-heading text-4xl font-bold tabular-nums text-primary" data-testid="referral-tiers-bar-points">
                  {clamped}
                  <span className="text-xl font-semibold text-prestige-taupe"> / 100</span>
                </p>
                {next && toNext > 0 ? (
                  <p className="mt-2 text-sm text-dark">
                    Prochain palier : <span className="font-semibold">{next.name}</span> — encore{' '}
                    <span className="tabular-nums">{toNext}</span> pt (seuil {next.threshold})
                  </p>
                ) : clamped >= 100 ? (
                  <p className="mt-2 text-sm font-medium text-dark">Échelle actuelle complétée. Merci !</p>
                ) : (
                  <p className="mt-2 text-sm text-prestige-taupe">Continuez à accumuler des points vérifiés.</p>
                )}
              </div>
              {user.referral_code ? (
                <div className="min-w-0 flex-1 sm:max-w-md">
                  <p className="mb-1.5 text-xs font-medium text-prestige-taupe">Lien à partager</p>
                  <div className="flex gap-2">
                    <div
                      className="min-w-0 flex-1 truncate rounded-lg border border-prestige-beige bg-white px-3 py-2.5 font-mono text-xs text-dark"
                      data-testid="referral-summary-link"
                    >
                      {link}
                    </div>
                    <Button
                      type="button"
                      onClick={copyReferralLink}
                      className="btn-primary h-10 shrink-0 px-5 py-0 text-sm"
                      data-testid="copy-referral-link"
                    >
                      {copied ? (
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" /> Copié
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <Copy className="h-4 w-4" /> Copier
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-prestige-beige/70">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-500"
                style={{ width: `${barPct}%` }}
                data-testid="referral-tiers-progress-bar"
              />
            </div>
          </div>
          <div className="px-5 py-4 text-center text-sm text-prestige-taupe sm:px-8">
            <Link to="/profil" className="font-medium text-primary hover:underline">
              Paramètres du compte
            </Link>
            <span className="mx-2 text-prestige-beige">·</span>
            <span>coordonnées, mot de passe</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="section-padding bg-white" data-testid="referral-how-points">
      <div className="container-max">
        <h2 className="font-heading text-3xl font-bold text-dark md:text-4xl">Comment ça fonctionne</h2>
        <p className="mt-3 max-w-2xl text-base text-prestige-taupe">
          Trois idées, dans l’ordre : partage, bonus facultatifs, reconnaissance.
        </p>
        <ol className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
          {HOW_STEPS.map((step, idx) => (
            <li
              key={step.title}
              className="card-service flex flex-col p-6 md:p-7"
              data-testid={`points-method-${idx}`}
            >
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-white">
                {idx + 1}
              </span>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/60">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-dark">{step.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-prestige-taupe">{step.body}</p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-primary">{step.meta}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function TiersTable({ user, referralStats, loading }) {
  const isMember = Boolean(user);
  const total = isMember && !loading && referralStats != null ? referralStats.total_points : null;
  const next = referralStats?.next_tier;

  return (
    <section className="section-padding gradient-prestige">
      <div className="container-max">
        <h2 className="font-heading text-3xl font-bold text-dark md:text-4xl">Remerciements selon les points</h2>
        <p className="mt-3 max-w-2xl text-base text-prestige-taupe">
          {isMember
            ? 'Un seul tableau : paliers et état pour votre compte.'
            : 'Le tableau indique les seuils du programme. Votre situation personnelle n’apparaît qu’après connexion.'}
        </p>

        {isMember && loading && (
          <div className="mt-10 h-40 max-w-3xl animate-pulse rounded-2xl border border-prestige-beige bg-white shadow-ia" data-testid="referral-tiers-loading" />
        )}

        {!(isMember && loading) && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-prestige-beige bg-white shadow-ia">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[320px] text-left text-sm">
                <thead>
                  <tr className="border-b border-prestige-beige bg-light text-xs font-semibold uppercase tracking-wide text-prestige-taupe">
                    <th className="px-5 py-4 md:px-6">Palier</th>
                    <th className="px-5 py-4 md:px-6">Points cumulés</th>
                    <th className="px-5 py-4 md:px-6">Remerciement</th>
                    {isMember ? <th className="px-5 py-4 md:px-6">Votre statut</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {TIERS.map((tier, idx) => {
                    const Icon = tier.icon;
                    const reached = total != null && total >= tier.threshold;
                    const isNext = isMember && !reached && next && next.threshold === tier.threshold;
                    return (
                      <tr
                        key={tier.name}
                        className="border-b border-prestige-beige/60 last:border-0"
                        data-testid={`referral-tier-row-${idx}`}
                      >
                        <td className="px-5 py-4 md:px-6">
                          <div className="flex items-center gap-3">
                            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tier.bg}`}>
                              <Icon className={`h-5 w-5 ${tier.color}`} />
                            </span>
                            <span className="font-heading text-base font-semibold text-dark">{tier.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 tabular-nums text-prestige-taupe md:px-6">{tier.threshold} pts</td>
                        <td className="px-5 py-4 font-heading text-base font-semibold text-primary md:px-6">{tier.reward}</td>
                        {isMember ? (
                          <td className="px-5 py-4 md:px-6">
                            {reached ? (
                              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">
                                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
                                Atteint
                              </span>
                            ) : isNext ? (
                              <span className="text-sm font-semibold text-primary">Prochain</span>
                            ) : (
                              <span className="text-prestige-taupe">—</span>
                            )}
                          </td>
                        ) : null}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function DisclaimerBlock() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="mx-auto max-w-3xl rounded-2xl border border-prestige-beige bg-light/80 p-6 shadow-ia md:p-8">
          <h2 className="font-heading text-xl font-bold text-dark md:text-2xl">Avis et limites importantes</h2>
          <ul className="mt-5 space-y-4 text-sm leading-relaxed text-dark/90">
            <li className="flex gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <ChevronRight className="h-3.5 w-3.5 text-primary" aria-hidden />
              </span>
              <span>
                <strong className="font-semibold text-dark">Programme de reconnaissance</strong> pour des mises en relation — ce n’est pas
                une offre de produits ou services financiers, ni une activité de distribution.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <ChevronRight className="h-3.5 w-3.5 text-primary" aria-hidden />
              </span>
              <span>
                Vous partagez un <strong className="font-semibold text-dark">lien de contact</strong> : vous ne présentez pas de produits
                et vous ne donnez pas de conseils sur des produits financiers.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <ChevronRight className="h-3.5 w-3.5 text-primary" aria-hidden />
              </span>
              <span>
                Les <strong className="font-semibold text-dark">points et paliers</strong> dépendent de vérifications selon les règles du
                programme. L’information affichée lorsque vous êtes connecté reflète l’état connu de votre dossier à ce moment.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <ChevronRight className="h-3.5 w-3.5 text-primary" aria-hidden />
              </span>
              <span>
                <strong className="font-semibold text-dark">Aucun suivi de points</strong> n’est conservé pour les visiteurs non connectés.
                Le programme est <strong className="font-semibold text-dark">soumis à conditions</strong> ; les détails applicables
                prévalent.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function FaqCompact() {
  return (
    <section className="section-padding gradient-prestige">
      <div className="container-max">
        <h2 className="font-heading text-2xl font-bold text-dark md:text-3xl">Questions fréquentes</h2>
        <div className="mt-8 max-w-3xl space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <div key={item.q} className="card-service p-5 md:p-6" data-testid={`faq-${i}`}>
              <h3 className="font-heading text-base font-semibold text-dark">{item.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-prestige-taupe">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const Referral = () => {
  const { user } = useAuth();
  const program = useReferralProgramData(user);
  const { loading, referralStats } = program;

  useSeoMeta({
    title: 'Programme de recommandations | Victoriaville',
    description:
      'Lien de consentement, paliers de remerciement et actions : le programme de recommandations, expliqué simplement.',
    canonicalPath: '/recommandations',
  });

  return (
    <main className="min-h-screen bg-light pt-20 pb-0" data-testid="referral-page">
      <ReferralPageHero user={user} />

      {user ? (
        <>
          <TiersTable user={user} referralStats={referralStats} loading={Boolean(user) && loading} />
          <MemberSummaryCard user={user} program={program} />
          <HowItWorks />
        </>
      ) : (
        <>
          <HowItWorks />
          <TiersTable user={user} referralStats={referralStats} loading={false} />
        </>
      )}

      {user ? (
        <section className="section-padding bg-white">
          <div className="container-max">
            <h2 className="font-heading text-3xl font-bold text-dark md:text-4xl">À compléter</h2>
            <p className="mt-3 max-w-2xl text-base text-prestige-taupe">
              Avis Google, statut client, saisie d’une personne et liste de suivi — le lien à partager figure dans le bloc résumé (points
              et barre), placé sous le tableau des paliers.
            </p>
            <div className="mt-10">
              <ReferralMemberActions user={user} program={program} hideReferralLinkCard />
            </div>
          </div>
        </section>
      ) : (
        <section className="section-padding bg-white">
          <div className="container-max flex justify-center">
            <div className="w-full max-w-lg rounded-2xl border border-prestige-beige bg-light/50 p-8 text-center shadow-ia md:p-10">
              <p className="text-base text-prestige-taupe">
                Prêt à participer ? Utilisez les boutons dans l’en-tête pour vous inscrire ou vous connecter.
              </p>
              <Link
                to="/connexion"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                data-testid="referral-gate-login-link"
              >
                Connexion
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <DisclaimerBlock />
      <FaqCompact />

      <footer className="border-t border-prestige-beige/80 bg-dark py-8">
        <div className="container-max px-4 text-center text-xs leading-relaxed text-white/55 md:px-8">
          <p>
            Programme soumis à conditions. Les renseignements à jour figurent sur cette page ; en session membre, ils tiennent compte des
            vérifications effectuées.
          </p>
        </div>
      </footer>
    </main>
  );
};

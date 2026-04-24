import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Copy, Minus, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';
import { getReferralConsentUrl } from '../lib/referralLink';
import { useReferralProgramData } from '../hooks/useReferralProgramData';
import { Button } from '../components/ui/button';
import { PageHero } from '../components/layout/PageHero';

const TIERS = [
  { threshold: 10, reward: '25 $', name: 'Bronze' },
  { threshold: 20, reward: '50 $', name: 'Argent' },
  { threshold: 40, reward: '100 $', name: 'Or' },
  { threshold: 75, reward: '250 $', name: 'Platine' },
  { threshold: 100, reward: 'Coffret Privilège', name: 'Privilège' },
];

const POINT_RULES = [
  {
    label: 'Mise en relation',
    detail: 'La personne utilise votre lien de consentement et la mise en relation est qualifiée.',
    points: '+1 pt',
  },
  {
    label: 'Avis Google',
    detail: 'Après vérification de votre avis, selon les règles du programme.',
    points: '+2 pts',
  },
  {
    label: 'Client existant',
    detail: 'Si notre dossier confirme le statut, après vérification.',
    points: '+2 pts',
  },
];

function HeroBlock({ user }) {
  if (!user) {
    return (
      <PageHero
        badge="Recommandations"
        title="Un programme de points, des remerciements clairs"
        description="Vous partagez un lien de consentement : les points s’additionnent quand c’est vérifié, jusqu’à 100 points et des paliers de reconnaissance."
        minHeightClass="min-h-[48vh] md:min-h-[52vh]"
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
          Connexion
        </Link>
      </PageHero>
    );
  }

  const first = user.first_name?.trim();
  return (
    <PageHero
      badge="Espace membre"
      title={first ? `Bonjour, ${first}` : 'Votre programme'}
      description="Même parcours que tout le monde : règles, paliers, puis votre solde et votre lien. Les soumissions se font depuis votre profil."
      minHeightClass="min-h-[48vh] md:min-h-[52vh]"
    >
      <Link to="/profil" className="btn-secondary inline-flex items-center justify-center gap-2 text-sm">
        Profil
        <ArrowRight className="h-4 w-4" />
      </Link>
    </PageHero>
  );
}

function SectionHeading({ kicker, title, subtitle }) {
  return (
    <div className="mb-8 max-w-2xl">
      {kicker ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">{kicker}</p>
      ) : null}
      <h2 className="font-heading text-2xl font-bold text-dark md:text-3xl">{title}</h2>
      {subtitle ? <p className="mt-2 text-prestige-taupe">{subtitle}</p> : null}
    </div>
  );
}

function PointsSection() {
  return (
    <section className="section-padding bg-white" data-testid="referral-how-points">
      <div className="container-max">
        <SectionHeading
          kicker="Fonctionnement"
          title="Comment on gagne des points"
          subtitle="Trois sources possibles, créditées après vérification. Les récompenses des paliers atteints s’additionnent."
        />
        <ul className="mx-auto max-w-3xl divide-y divide-prestige-beige rounded-2xl border border-prestige-beige bg-light/40 shadow-ia">
          {POINT_RULES.map((row, idx) => (
            <li
              key={row.label}
              className="flex flex-col gap-2 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6"
              data-testid={`points-method-${idx}`}
            >
              <div className="min-w-0">
                <p className="font-heading font-semibold text-dark">{row.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-prestige-taupe">{row.detail}</p>
              </div>
              <p className="shrink-0 font-heading text-sm font-bold tabular-nums text-primary sm:text-right">{row.points}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function TiersSection({ user, referralStats, loading }) {
  const isMember = Boolean(user);
  const total = isMember && !loading && referralStats != null ? referralStats.total_points : null;
  const next = referralStats?.next_tier;

  return (
    <section className="section-padding bg-light">
      <div className="container-max">
        <SectionHeading
          kicker="Paliers"
          title="Remerciements"
          subtitle={
            isMember
              ? 'Jusqu’à 100 points : chaque palier débloque la récompense indiquée.'
              : 'Seuils applicables à tous les participants. Votre avancement s’affiche une fois le compte créé.'
          }
        />

        {isMember && loading && (
          <div
            className="mx-auto max-w-3xl h-40 animate-pulse rounded-2xl border border-prestige-beige bg-white shadow-ia"
            data-testid="referral-tiers-loading"
          />
        )}

        {!(isMember && loading) && (
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-prestige-beige bg-white shadow-ia">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[300px] text-left text-sm">
                <thead>
                  <tr className="border-b border-prestige-beige bg-light/80 text-xs font-semibold uppercase tracking-wide text-prestige-taupe">
                    <th className="px-4 py-3 md:px-5">Palier</th>
                    <th className="px-4 py-3 tabular-nums md:px-5">Points</th>
                    <th className="px-4 py-3 md:px-5">Récompense</th>
                    {isMember ? <th className="px-4 py-3 md:px-5">Statut</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {TIERS.map((tier, idx) => {
                    const reached = total != null && total >= tier.threshold;
                    const isNext = isMember && !reached && next && next.threshold === tier.threshold;
                    return (
                      <tr
                        key={tier.name}
                        className="border-b border-prestige-beige/50 last:border-0"
                        data-testid={`referral-tier-row-${idx}`}
                      >
                        <td className="px-4 py-3.5 font-medium text-dark md:px-5">{tier.name}</td>
                        <td className="px-4 py-3.5 tabular-nums text-prestige-taupe md:px-5">{tier.threshold}</td>
                        <td className="px-4 py-3.5 font-heading font-semibold text-primary md:px-5">{tier.reward}</td>
                        {isMember ? (
                          <td className="px-4 py-3.5 md:px-5">
                            {reached ? (
                              <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700">
                                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
                                Atteint
                              </span>
                            ) : isNext ? (
                              <span className="text-sm font-semibold text-primary">Prochain</span>
                            ) : (
                              <Minus className="h-4 w-4 text-prestige-taupe/50" aria-hidden />
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

function MemberSummarySection({ user, program }) {
  const { loading, referralStats, copyReferralLink, copied } = program;
  const link = user.referral_code ? getReferralConsentUrl(user.referral_code) : '';

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="mx-auto max-w-3xl animate-pulse rounded-2xl border border-prestige-beige bg-light/50 p-8 shadow-ia">
            <div className="h-7 w-40 rounded bg-prestige-beige/60" />
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
    <section className="section-padding bg-white">
      <div className="container-max">
        <SectionHeading
          kicker="Votre solde"
          title="Points vérifiés"
          subtitle="Barre de progression sur 100 points. Partagez votre lien pour de nouvelles mises en relation."
        />
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-prestige-beige bg-light/30 p-6 shadow-ia sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p
                className="font-heading text-4xl font-bold tabular-nums text-primary"
                data-testid="referral-tiers-bar-points"
              >
                {clamped}
                <span className="text-xl font-semibold text-prestige-taupe"> / 100</span>
              </p>
              {next && toNext > 0 ? (
                <p className="mt-2 text-sm text-dark">
                  Prochain : <span className="font-semibold">{next.name}</span> — {toNext} point{toNext > 1 ? 's' : ''} (seuil{' '}
                  {next.threshold})
                </p>
              ) : clamped >= 100 ? (
                <p className="mt-2 text-sm font-medium text-dark">Échelle complétée. Merci !</p>
              ) : (
                <p className="mt-2 text-sm text-prestige-taupe">Continuez d’accumuler des points vérifiés.</p>
              )}
            </div>
            {user.referral_code ? (
              <div className="w-full min-w-0 sm:max-w-md">
                <p className="mb-1.5 text-xs font-medium text-prestige-taupe">Lien de consentement</p>
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
                    className="btn-primary h-10 shrink-0 px-4 py-0 text-sm"
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
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-prestige-beige/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-500"
              style={{ width: `${barPct}%` }}
              data-testid="referral-tiers-progress-bar"
            />
          </div>
          <p className="mt-6 border-t border-prestige-beige/80 pt-6 text-center text-sm text-prestige-taupe">
            Avis Google, confirmation client existant ou saisie d’une personne :{' '}
            <Link to="/profil" className="font-medium text-primary hover:underline">
              ouvrir votre profil
            </Link>
            , section du programme.
          </p>
        </div>
      </div>
    </section>
  );
}

function GuestCtaSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="mx-auto max-w-xl rounded-2xl border border-prestige-beige bg-light/40 p-8 text-center shadow-ia md:p-10">
          <Sparkles className="mx-auto h-8 w-8 text-primary/80" aria-hidden />
          <h2 className="mt-4 font-heading text-xl font-bold text-dark md:text-2xl">Participer</h2>
          <p className="mt-2 text-sm text-prestige-taupe">Créez un compte pour recevoir un lien et suivre vos points ici.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/inscription"
              onClick={() => trackEvent('select_content', { content_type: 'cta', item_id: 'referral_bottom_register' })}
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              S’inscrire
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/connexion"
              className="btn-secondary inline-flex items-center justify-center"
              data-testid="referral-gate-login-link"
            >
              J’ai un compte
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function LegalLine() {
  return (
    <div className="border-t border-prestige-beige/80 bg-white py-6">
      <div className="container-max px-4 text-center text-xs leading-relaxed text-prestige-taupe md:px-8">
        <p>
          Programme de reconnaissance, sans obligation d’achat. Vous ne présentez pas de produits : vous partagez un contact. Soumis à
          conditions — les points et paliers suivent des vérifications. Pas de suivi de points pour les visiteurs non connectés.
        </p>
      </div>
    </div>
  );
}

export const Referral = () => {
  const { user } = useAuth();
  const program = useReferralProgramData(user);
  const { loading, referralStats } = program;

  useSeoMeta({
    title: 'Programme de recommandations | Victoriaville',
    description:
      'Comprenez en quelques lignes comment les points s’additionnent et quels remerciements correspondent à chaque palier.',
    canonicalPath: '/recommandations',
  });

  return (
    <main className="min-h-screen bg-light pt-20" data-testid="referral-page">
      <HeroBlock user={user} />
      <PointsSection />
      <TiersSection user={user} referralStats={referralStats} loading={Boolean(user) && loading} />
      {user ? (
        <MemberSummarySection user={user} program={program} />
      ) : (
        <GuestCtaSection />
      )}
      <LegalLine />
    </main>
  );
};

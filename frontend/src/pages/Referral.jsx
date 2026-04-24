import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Copy, Sparkles, Trophy, Star, Crown, ShieldCheck, Gift, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';
import { getReferralConsentUrl } from '../lib/referralLink';
import { useReferralProgramData } from '../hooks/useReferralProgramData';
import { Button } from '../components/ui/button';
import { PageHero } from '../components/layout/PageHero';
import { ReferralMemberActions } from '../components/referral/ReferralMemberActions';

const TIERS = [
  { threshold: 10, reward: '25 $', name: 'Bronze', icon: Trophy, tone: 'from-orange-100 to-orange-50', iconColor: 'text-orange-700' },
  { threshold: 20, reward: '50 $', name: 'Argent', icon: Trophy, tone: 'from-slate-100 to-slate-50', iconColor: 'text-slate-700' },
  { threshold: 40, reward: '100 $', name: 'Or', icon: Star, tone: 'from-amber-100 to-amber-50', iconColor: 'text-amber-700' },
  { threshold: 75, reward: '250 $', name: 'Platine', icon: Star, tone: 'from-cyan-100 to-cyan-50', iconColor: 'text-cyan-700' },
  { threshold: 100, reward: 'Coffret Privilège', name: 'Privilège', icon: Crown, tone: 'from-purple-100 to-purple-50', iconColor: 'text-purple-700' },
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

const VALUE_ITEMS = [
  {
    title: 'Simple et transparent',
    body: 'Un lien a partager, des points faciles a comprendre, des paliers visibles en tout temps.',
    icon: ShieldCheck,
  },
  {
    title: 'Reconnaissance cumulative',
    body: 'Chaque palier atteint s additionne, pour valoriser chaque recommandation verifiee.',
    icon: Gift,
  },
  {
    title: 'Pensé pour votre réseau',
    body: 'Vous mettez en relation, nous faisons le suivi, dans un cadre clair et respectueux.',
    icon: Users,
  },
];

function HeroBlock({ user }) {
  if (!user) {
    return (
      <PageHero
        badge="Recommandations"
        title="Recommandez en confiance et cumulez des remerciements"
        description="Partagez votre lien personnel, suivez vos points et debloquez des paliers Bronze, Argent, Or, Platine et Privilege."
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
      description="Votre lien, vos points et vos paliers sont reunis ici pour vous permettre de progresser rapidement."
      minHeightClass="min-h-[48vh] md:min-h-[52vh]"
    >
      <Link to="/profil" className="btn-secondary inline-flex items-center justify-center gap-2 text-sm">
        Mon profil
        <ArrowRight className="h-4 w-4" />
      </Link>
    </PageHero>
  );
}

function ValueSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Pourquoi participer</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-dark md:text-3xl">Un programme moderne, simple et motivant</h2>
          <p className="mt-3 text-prestige-taupe">
            Tout est concu pour rester clair du debut a la fin : comment gagner des points, ou vous en etes, et ce que vous debloquez.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {VALUE_ITEMS.map((item) => (
            <article key={item.title} className="rounded-2xl border border-prestige-beige bg-light/40 p-6 shadow-ia">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-dark">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-prestige-taupe">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
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
          subtitle="Trois sources possibles, creditees apres verification. Les recompenses des paliers atteints s additionnent."
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
          title="Paliers de remerciements"
          subtitle={
            isMember
              ? 'Jusqu a 100 points : chaque palier debloque la recompense indiquee.'
              : 'Du Bronze au Privilege : des seuils clairs et progressifs.'
          }
        />

        {isMember && loading && <div className="mx-auto max-w-5xl h-40 animate-pulse rounded-2xl border border-prestige-beige bg-white shadow-ia" data-testid="referral-tiers-loading" />}

        {!(isMember && loading) && (
          <div className="mx-auto max-w-5xl grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {TIERS.map((tier, idx) => {
              const Icon = tier.icon;
              const reached = total != null && total >= tier.threshold;
              const isNext = isMember && !reached && next && next.threshold === tier.threshold;
              return (
                <article
                  key={tier.name}
                  className={`rounded-2xl border p-5 shadow-ia bg-gradient-to-br ${tier.tone} ${
                    reached ? 'border-green-300/80' : isNext ? 'border-primary/50' : 'border-prestige-beige'
                  }`}
                  data-testid={`referral-tier-row-${idx}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 ${tier.iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {isMember ? (
                      reached ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Atteint
                        </span>
                      ) : isNext ? (
                        <span className="text-xs font-semibold text-primary">Prochain</span>
                      ) : null
                    ) : null}
                  </div>
                  <p className="mt-5 font-heading text-xl font-bold text-dark">{tier.name}</p>
                  <p className="mt-1 text-sm text-prestige-taupe">{tier.threshold} points</p>
                  <p className="mt-3 font-heading text-lg font-semibold text-primary">{tier.reward}</p>
                </article>
              );
            })}
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
          subtitle="Votre progression en direct sur 100 points pour garder le cap sur le prochain palier."
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
        </div>
      </div>
    </section>
  );
}

function MemberActionsSection({ user, program }) {
  return (
    <section className="section-padding bg-light">
      <div className="container-max">
        <SectionHeading
          kicker="Actions"
          title="Créditer des points"
          subtitle="Partagez votre lien, confirmez vos bonus et suivez facilement vos références."
        />
        <ReferralMemberActions user={user} program={program} hideReferralLinkCard />
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
          <h2 className="mt-4 font-heading text-xl font-bold text-dark md:text-2xl">Pret a commencer ?</h2>
          <p className="mt-2 text-sm text-prestige-taupe">
            Creez votre compte en moins de 2 minutes pour recevoir votre lien et commencer a cumuler vos points.
          </p>
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
      'Un programme de recommandations simple, moderne et motivant : points cumulatifs, paliers clairs et suivi en temps reel.',
    canonicalPath: '/recommandations',
  });

  return (
    <main className="min-h-screen bg-light pt-20" data-testid="referral-page">
      <HeroBlock user={user} />
      <ValueSection />
      <PointsSection />
      <TiersSection user={user} referralStats={referralStats} loading={Boolean(user) && loading} />
      {user ? (
        <>
          <MemberSummarySection user={user} program={program} />
          <MemberActionsSection user={user} program={program} />
        </>
      ) : (
        <GuestCtaSection />
      )}
      <LegalLine />
    </main>
  );
};

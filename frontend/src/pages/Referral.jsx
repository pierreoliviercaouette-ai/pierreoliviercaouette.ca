import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles, ShieldCheck, Gift, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';
import { useReferralProgramData } from '../hooks/useReferralProgramData';
import { PageHero } from '../components/layout/PageHero';
import { ReferralMemberActions } from '../components/referral/ReferralMemberActions';

const POINT_RULES = [
  {
    label: 'Mise en relation',
    detail: 'La personne utilise votre lien de consentement et la mise en relation est qualifiée.',
    points: '+1 pt',
  },
  {
    label: 'Avis Google',
    detail: 'Après vérification de votre avis, selon les règles du programme.',
    points: '+1 pt',
  },
  {
    label: 'Client existant',
    detail: 'Si notre dossier confirme le statut, après vérification.',
    points: '+1 pt',
  },
];

const VALUE_ITEMS = [
  {
    title: 'Simple a utiliser',
    body: 'Un lien personnel a partager, un suivi clair et des etapes faciles a comprendre.',
    icon: ShieldCheck,
  },
  {
    title: 'Des chances qui augmentent',
    body: 'Vos points s accumulent toute l annee pour augmenter vos chances a chaque tirage trimestriel.',
    icon: Gift,
  },
  {
    title: 'Respectueux et encadre',
    body: 'Vous mettez une personne en relation, nous faisons le suivi dans un cadre conforme et transparent.',
    icon: Users,
  },
];

function HeroBlock({ user }) {
  if (!user) {
    return (
      <PageHero
        badge="Recommandations"
        title="Recommandez en toute simplicite et multipliez vos chances"
        description="Accumulez vos points verifies, devenez admissible des 5 points et participez au tirage trimestriel d une valeur d environ 750 $."
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
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-white/90">Aucun achat requis</span>
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-white/90">5 points = admissible</span>
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-white/90">1 point = 1 chance</span>
        </div>
      </PageHero>
    );
  }

  const first = user.first_name?.trim();
  return (
    <PageHero
      badge="Espace membre"
      title={first ? `Bonjour, ${first}` : 'Votre programme'}
      description="Votre lien de consentement et vos points verifies sont reunis ici pour maximiser vos chances au tirage trimestriel."
      minHeightClass="min-h-[48vh] md:min-h-[52vh]"
    >
      <Link to="/profil" className="btn-secondary inline-flex items-center justify-center gap-2 text-sm">
        Mon profil
        <ArrowRight className="h-4 w-4" />
      </Link>
      <Link to="/conditions#reglement-concours" className="btn-secondary inline-flex items-center justify-center gap-2 text-sm">
        Reglement officiel
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
          <h2 className="mt-2 font-heading text-2xl font-bold text-dark md:text-3xl">Un programme moderne, simple et vraiment motivant</h2>
          <p className="mt-3 text-prestige-taupe">
            Tout est concu pour rester clair du debut a la fin: comment gagner des points, suivre votre progression et participer au tirage.
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
          subtitle="Trois sources possibles, creditees apres verification. A partir de 5 points, chaque point donne 1 chance au tirage trimestriel de 750 $."
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

function DrawSection({ user, referralStats, loading }) {
  const isMember = Boolean(user);
  const total = isMember && !loading && referralStats != null ? referralStats.total_points : null;
  const minimum = referralStats?.quarterly_draw?.minimum_points ?? 5;
  const drawValue = referralStats?.quarterly_draw?.value ?? 750;
  const chances = referralStats?.quarterly_draw?.chances ?? 0;
  const toEligibility = referralStats?.quarterly_draw?.points_to_eligibility ?? Math.max(0, minimum - (total ?? 0));
  const eligible = referralStats?.quarterly_draw?.is_eligible ?? (total != null && total >= minimum);

  return (
    <section className="section-padding bg-light">
      <div className="container-max">
        <SectionHeading
          kicker="Concours trimestriel"
          title="Un tirage d une valeur d environ 750 $ a chaque trimestre"
          subtitle={
            isMember
              ? 'Admissible des 5 points. Ensuite, chaque point accumule vous donne une chance de participation.'
              : 'Accumulez des points verifies : des 5 points, vous participez au tirage d une valeur d environ 750 $.'
          }
        />

        {isMember && loading && <div className="mx-auto max-w-3xl h-40 animate-pulse rounded-2xl border border-prestige-beige bg-white shadow-ia" data-testid="referral-draw-loading" />}

        {!(isMember && loading) && (
          <article className="mx-auto max-w-3xl rounded-2xl border border-prestige-beige bg-white p-6 shadow-ia sm:p-8" data-testid="referral-draw-card">
            <p className="font-heading text-3xl font-bold text-primary">{drawValue} $</p>
            <p className="mt-1 text-sm text-prestige-taupe">Valeur approximative du tirage a chaque trimestre</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-prestige-beige bg-light/50 px-3 py-2 text-xs text-dark">
                <p className="font-semibold">Aucun achat requis</p>
              </div>
              <div className="rounded-xl border border-prestige-beige bg-light/50 px-3 py-2 text-xs text-dark">
                <p className="font-semibold">Admissible des 5 points</p>
              </div>
              <div className="rounded-xl border border-prestige-beige bg-light/50 px-3 py-2 text-xs text-dark">
                <p className="font-semibold">1 point = 1 chance</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-dark">
              Le concours fonctionne par points verifies: vous devenez admissible a partir de 5 points, puis chaque point vaut 1 chance.
              Le tirage est realise chaque trimestre, selon les reglements complets du concours.
            </p>
            <p className="mt-2 text-sm font-medium text-dark">
              Premier tirage prevu le 1er octobre 2026.
            </p>
            {isMember ? (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-dark">
                  Vos points verifies: <span className="font-semibold">{total ?? 0}</span>
                </p>
                {eligible ? (
                  <p className="inline-flex items-center gap-2 text-sm font-medium text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Admissible — {chances} chance{chances > 1 ? 's' : ''} pour le prochain tirage
                  </p>
                ) : (
                  <p className="text-sm text-prestige-taupe">
                    Encore {toEligibility} point{toEligibility > 1 ? 's' : ''} pour devenir admissible.
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm text-prestige-taupe">Inscrivez-vous pour suivre vos points et votre admissibilite.</p>
            )}
            <div className="mt-5">
              <Link
                to="/conditions#reglement-concours"
                className="btn-secondary inline-flex items-center justify-center gap-2 text-sm"
                data-testid="referral-contest-rules-link"
              >
                Reglement officiel du concours
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}

function MemberSummarySection({ user, program }) {
  const { loading, referralStats } = program;

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
  const minPoints = referralStats?.quarterly_draw?.minimum_points ?? 5;
  const chances = referralStats?.quarterly_draw?.chances ?? 0;
  const eligible = referralStats?.quarterly_draw?.is_eligible ?? clamped >= minPoints;
  const toEligibility = referralStats?.quarterly_draw?.points_to_eligibility ?? Math.max(0, minPoints - clamped);
  const barPct = Math.min(100, (clamped / minPoints) * 100);

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <SectionHeading
          kicker="Votre solde"
          title="Points vérifiés"
          subtitle="Votre progression vers le seuil d admissibilite de 5 points pour le tirage trimestriel."
        />
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-prestige-beige bg-light/30 p-6 shadow-ia sm:p-8">
          <div>
            <div>
              <p
                className="font-heading text-4xl font-bold tabular-nums text-primary"
                data-testid="referral-tiers-bar-points"
              >
                {clamped}
                <span className="text-xl font-semibold text-prestige-taupe"> points</span>
              </p>
              {eligible ? (
                <p className="mt-2 text-sm text-dark">
                  Admissible au tirage. Chances actuelles : <span className="font-semibold">{chances}</span>
                </p>
              ) : (
                <p className="mt-2 text-sm text-prestige-taupe">
                  Il vous manque {toEligibility} point{toEligibility > 1 ? 's' : ''} pour etre admissible.
                </p>
              )}
            </div>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-prestige-beige/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-500"
              style={{ width: `${barPct}%` }}
              data-testid="referral-draw-progress-bar"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function MemberActionsSection({ user, program }) {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <SectionHeading
          kicker="Passez a l action"
          title="Votre lien et vos actions de progression"
          subtitle="Commencez par partager votre lien de consentement, puis ajoutez vos actions et suivez vos references."
        />
        <ReferralMemberActions user={user} program={program} hideReferralLinkCard={false} />
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
          <h2 className="mt-4 font-heading text-xl font-bold text-dark md:text-2xl">Pret a demarrer ?</h2>
          <p className="mt-2 text-sm text-prestige-taupe">
            Creez votre compte en moins de 2 minutes pour recevoir votre lien, suivre vos points et participer au programme des aujourd hui.
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
          conditions — les points sont vérifiés. Admissible au tirage trimestriel d une valeur d environ 750 $ dès 5 points, avec 1 point = 1 chance.
        </p>
        <p className="mt-2">
          Concours organise par Pierre-Olivier Caouette uniquement. Ce concours n est pas commandite, approuve, administre ni associe a Industrielle Alliance.
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
      'Un programme de recommandations attractif et moderne : lien de consentement, points cumulatifs et tirage trimestriel d une valeur d environ 750 $.',
    canonicalPath: '/recommandations',
  });

  return (
    <main className="min-h-screen bg-light pt-20" data-testid="referral-page">
      <HeroBlock user={user} />
      {user ? (
        <>
          <MemberActionsSection user={user} program={program} />
          <DrawSection user={user} referralStats={referralStats} loading={Boolean(user) && loading} />
          <MemberSummarySection user={user} program={program} />
          <ValueSection />
          <PointsSection />
        </>
      ) : (
        <>
          <ValueSection />
          <DrawSection user={user} referralStats={referralStats} loading={false} />
          <PointsSection />
          <GuestCtaSection />
        </>
      )}
      <LegalLine />
    </main>
  );
};

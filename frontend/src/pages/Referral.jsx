import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Gift,
  Users,
  UserPlus,
  CalendarCheck,
  Trophy,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';
import { useReferralProgramData } from '../hooks/useReferralProgramData';
import { PageHero } from '../components/layout/PageHero';
import { PartnersTrustSection } from '../components/partners/PartnersTrustSection';
import { ReferralMemberActions } from '../components/referral/ReferralMemberActions';

const HOW_IT_WORKS_STEPS = [
  {
    title: 'Référez un contact',
    body: 'Partagez votre lien de consentement ou saisissez la personne : +1 point vérifié par voie admise au programme.',
    icon: UserPlus,
  },
  {
    title: 'Rencontre qualifiée',
    body: 'Lorsque la mise en relation est complétée et qualifiée selon les règles du programme, le point est crédité.',
    icon: CalendarCheck,
  },
  {
    title: 'Accumulez des chances',
    body: 'À partir de 5 points vérifiés, chaque point donne 1 chance au tirage trimestriel (valeur d’environ 750 $).',
    icon: Trophy,
  },
];

const ENGAGEMENT_MILESTONES = [
  {
    id: 'bronze',
    name: 'Bronze',
    points: 5,
    blurb: 'Seuil d’admissibilité au tirage',
    frame:
      'border-amber-500/45 bg-gradient-to-br from-amber-500/30 via-orange-400/20 to-amber-50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.55)]',
    accent: 'text-amber-900',
    pointsClass: 'text-amber-900',
  },
  {
    id: 'argent',
    name: 'Argent',
    points: 10,
    blurb: 'Régularité de recommandation',
    frame:
      'border-slate-400/50 bg-gradient-to-br from-slate-400/35 via-sky-200/25 to-slate-50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.65)]',
    accent: 'text-slate-700',
    pointsClass: 'text-slate-700',
  },
  {
    id: 'or',
    name: 'Or',
    points: 20,
    blurb: 'Réseau actif',
    frame:
      'border-amber-400/55 bg-gradient-to-br from-yellow-400/40 via-amber-300/30 to-amber-50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)]',
    accent: 'text-yellow-900',
    pointsClass: 'text-yellow-800',
  },
  {
    id: 'platine',
    name: 'Platine',
    points: 35,
    blurb: 'Engagement maximal (symbolique)',
    frame:
      'border-violet-400/50 bg-gradient-to-br from-violet-500/30 via-indigo-400/25 to-fuchsia-50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.55)]',
    accent: 'text-violet-900',
    pointsClass: 'text-violet-800',
  },
];

const HOW_IT_WORKS_ACCENTS = [
  'bg-blue-500/15 text-blue-700 ring-1 ring-blue-200/70',
  'bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-200/70',
  'bg-violet-500/15 text-violet-700 ring-1 ring-violet-200/70',
];

const VALUE_ITEMS = [
  {
    title: 'Simple à utiliser',
    body: 'Un lien personnel à partager, un suivi clair et des étapes faciles à comprendre.',
    icon: ShieldCheck,
  },
  {
    title: 'Des chances qui augmentent',
    body: 'Vos points s’accumulent toute l’année pour augmenter vos chances à chaque tirage trimestriel.',
    icon: Gift,
  },
  {
    title: 'Respectueux et encadré',
    body: 'Vous mettez une personne en relation, nous faisons le suivi dans un cadre conforme et transparent.',
    icon: Users,
  },
];

function HeroBlock({ user }) {
  if (!user) {
    return (
      <PageHero
        badge="Recommandations"
        title="Recommandez en toute simplicité et multipliez vos chances"
        description="Accumulez vos points vérifiés, devenez admissible dès 5 points et participez au tirage trimestriel d’une valeur d’environ 750 $."
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
      description="Votre lien de consentement et vos points vérifiés sont réunis ici pour maximiser vos chances au tirage trimestriel."
      minHeightClass="min-h-[48vh] md:min-h-[52vh]"
    >
      <Link to="/profil" className="btn-secondary inline-flex items-center justify-center gap-2 text-sm">
        Mon profil
        <ArrowRight className="h-4 w-4" />
      </Link>
      <Link to="/conditions#reglement-concours" className="btn-secondary inline-flex items-center justify-center gap-2 text-sm">
        Règlement officiel
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
          <p className="mt-3 text-slate-600">
            Tout est conçu pour rester clair du début à la fin : comment gagner des points, suivre votre progression et participer au tirage.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {VALUE_ITEMS.map((item, idx) => (
            <article
              key={item.title}
              className={`rounded-2xl border border-prestige-beige/80 bg-gradient-to-b p-6 shadow-ia transition-shadow hover:shadow-lg ${
                idx === 0
                  ? 'from-white to-sky-50/60'
                  : idx === 1
                    ? 'from-white to-emerald-50/50'
                    : 'from-white to-violet-50/50'
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  idx === 0
                    ? 'bg-sky-500/15 text-sky-700'
                    : idx === 1
                      ? 'bg-emerald-500/15 text-emerald-700'
                      : 'bg-violet-500/15 text-violet-700'
                }`}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-dark">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
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
      {subtitle ? <p className="mt-2 text-slate-600">{subtitle}</p> : null}
    </div>
  );
}

function HowItWorksSection() {
  return (
    <section className="section-padding bg-white" data-testid="referral-how-points">
      <div className="container-max">
        <SectionHeading
          kicker="Fonctionnement"
          title="Comment ça fonctionne"
          subtitle="Trois étapes simples : partager, rencontrer, puis accumuler des chances au tirage trimestriel."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <article
              key={step.title}
              className="relative flex flex-col rounded-2xl border border-prestige-beige/90 bg-gradient-to-b from-white to-sky-50/50 p-6 shadow-ia transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              data-testid={`points-method-${idx}`}
            >
              <span className="absolute right-4 top-4 font-heading text-4xl font-bold tabular-nums text-primary/12">
                {idx + 1}
              </span>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Étape {idx + 1}
              </p>
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${HOW_IT_WORKS_ACCENTS[idx] ?? 'bg-primary/10 text-primary'}`}
              >
                <step.icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="font-heading text-lg font-semibold text-dark">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function JourneyMilestonesSection({ totalPoints, loading, isMember }) {
  const pts = typeof totalPoints === 'number' ? Math.max(0, totalPoints) : null;
  const cap = ENGAGEMENT_MILESTONES[ENGAGEMENT_MILESTONES.length - 1].points;

  let barLabel = '';
  let barPct = 0;
  let barIndeterminate = false;

  if (isMember && loading) {
    barLabel = 'Chargement de votre progression…';
    barPct = 8;
    barIndeterminate = true;
  } else if (isMember && pts != null) {
    if (pts >= cap) {
      barPct = 100;
      barLabel = `${pts} point${pts > 1 ? 's' : ''} — tous les jalons symboliques sont atteints.`;
    } else {
      const next = ENGAGEMENT_MILESTONES.find((m) => pts < m.points);
      if (next) {
        const prevTier = [...ENGAGEMENT_MILESTONES].reverse().find((m) => m.points <= pts);
        const prev = prevTier?.points ?? 0;
        const span = next.points - prev;
        barPct = span > 0 ? Math.min(100, Math.round(((pts - prev) / span) * 100)) : 100;
        barLabel = `Prochain jalon : ${next.name} (${next.points} pts)`;
      }
    }
  } else if (!isMember) {
    barLabel = 'Exemple : progression vers le prochain jalon symbolique';
    barPct = 42;
  }

  return (
    <section
      className="section-padding bg-gradient-to-b from-sky-50/90 via-indigo-50/40 to-slate-50"
      data-testid="referral-journey-milestones"
    >
      <div className="container-max">
        <SectionHeading
          kicker="Parcours"
          title="Jalons d’engagement"
          subtitle="Ces jalons illustrent votre progression. La récompense du programme demeure le tirage trimestriel, selon le règlement officiel."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ENGAGEMENT_MILESTONES.map((m) => {
            const unlocked = !loading && pts != null && pts >= m.points;
            return (
              <article
                key={m.id}
                className={`relative overflow-hidden rounded-2xl border p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${m.frame} ${
                  unlocked ? 'ring-2 ring-emerald-500/55 ring-offset-2 ring-offset-white' : ''
                }`}
              >
                <p className={`font-heading text-xs font-semibold uppercase tracking-wider ${m.accent}`}>{m.name}</p>
                <p
                  className={`mt-1 font-heading text-2xl font-bold tabular-nums ${m.pointsClass ?? 'text-dark'}`}
                >
                  {m.points} pts
                </p>
                <p className="mt-2 text-sm leading-snug text-slate-600">{m.blurb}</p>
                {unlocked ? (
                  <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                    Atteint
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-indigo-100/90 bg-white/95 p-5 shadow-md backdrop-blur-sm sm:p-6">
          <p className="text-sm font-semibold text-dark">{barLabel}</p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 shadow-inner">
            <div
              className={`h-full rounded-full bg-gradient-to-r from-amber-500 via-sky-500 to-violet-600 transition-[width] duration-700 ease-out ${
                barIndeterminate ? 'animate-pulse' : ''
              }`}
              style={{ width: `${barPct}%` }}
              data-testid="referral-milestone-progress-bar"
            />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-600">
            Les montants affichés sur le tirage (environ 750 $) sont décrits au règlement du concours. Aucun montant
            additionnel n’est lié à ces paliers décoratifs.
          </p>
        </div>
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
          title="Un tirage d’une valeur d’environ 750 $ à chaque trimestre"
          subtitle={
            isMember
              ? 'Admissible dès 5 points. Ensuite, chaque point accumulé vous donne une chance de participation.'
              : 'Accumulez des points vérifiés : dès 5 points, vous participez au tirage d’une valeur d’environ 750 $.'
          }
        />

        {isMember && loading && <div className="mx-auto max-w-3xl h-40 animate-pulse rounded-2xl border border-prestige-beige bg-white shadow-ia" data-testid="referral-draw-loading" />}

        {!(isMember && loading) && (
          <article
            className="mx-auto max-w-3xl rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-white via-sky-50/40 to-white p-6 shadow-ia sm:p-8"
            data-testid="referral-draw-card"
          >
            <p className="font-heading text-3xl font-bold text-primary">{drawValue} $</p>
            <p className="mt-1 text-sm text-slate-600">Valeur approximative du tirage à chaque trimestre</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-sky-200/80 bg-sky-50/90 px-3 py-2.5 text-xs text-sky-950 shadow-sm">
                <p className="font-semibold text-sky-950">Aucun achat requis</p>
              </div>
              <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-3 py-2.5 text-xs text-emerald-950 shadow-sm">
                <p className="font-semibold text-emerald-950">Admissible des 5 points</p>
              </div>
              <div className="rounded-xl border border-violet-200/80 bg-violet-50/90 px-3 py-2.5 text-xs text-violet-950 shadow-sm">
                <p className="font-semibold text-violet-950">1 point = 1 chance</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-dark">
              Le concours fonctionne par points vérifiés : vous devenez admissible à partir de 5 points, puis chaque
              point vaut 1 chance. Le tirage est réalisé chaque trimestre, selon le règlement officiel.
            </p>
            <p className="mt-2 text-sm font-medium text-dark">
              Premier tirage prévu le 1er octobre 2026.
            </p>
            {isMember ? (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-dark">
                  Vos points vérifiés : <span className="font-semibold">{total ?? 0}</span>
                </p>
                {eligible ? (
                  <p className="inline-flex items-center gap-2 text-sm font-medium text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Admissible — {chances} chance{chances > 1 ? 's' : ''} pour le prochain tirage
                  </p>
                ) : (
                  <p className="text-sm text-slate-600">
                    Encore {toEligibility} point{toEligibility > 1 ? 's' : ''} pour devenir admissible.
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600">Inscrivez-vous pour suivre vos points et votre admissibilité.</p>
            )}
            <div className="mt-5">
              <Link
                to="/conditions#reglement-concours"
                className="btn-secondary inline-flex items-center justify-center gap-2 text-sm"
                data-testid="referral-contest-rules-link"
              >
                Règlement officiel du concours
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
          subtitle="Votre progression vers le seuil d’admissibilité de 5 points pour le tirage trimestriel."
        />
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-sky-200/70 bg-gradient-to-br from-white via-sky-50/35 to-indigo-50/30 p-6 shadow-ia sm:p-8">
          <div>
            <div>
              <p
                className="font-heading text-4xl font-bold tabular-nums text-primary"
                data-testid="referral-tiers-bar-points"
              >
                {clamped}
                <span className="text-xl font-semibold text-slate-600"> points</span>
              </p>
              {eligible ? (
                <p className="mt-2 text-sm text-dark">
                  Admissible au tirage. Chances actuelles : <span className="font-semibold">{chances}</span>
                </p>
              ) : (
                <p className="mt-2 text-sm text-slate-600">
                  Il vous manque {toEligibility} point{toEligibility > 1 ? 's' : ''} pour être admissible.
                </p>
              )}
            </div>
          </div>
          <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-slate-200/90 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-sky-500 to-secondary transition-[width] duration-500"
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
          kicker="Actions rapides"
          title="Complétez votre progression en quelques étapes"
          subtitle="Ajoutez une référence, complétez les actions encore disponibles et partagez votre lien personnalisé."
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
          <h2 className="mt-4 font-heading text-xl font-bold text-dark md:text-2xl">Prêt à démarrer ?</h2>
          <p className="mt-2 text-sm text-slate-600">
            Créez votre compte en moins de 2 minutes pour recevoir votre lien, suivre vos points et participer au programme dès aujourd’hui.
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
      <div className="container-max px-4 text-center text-xs leading-relaxed text-slate-600 md:px-8">
        <p>
          Programme de reconnaissance, sans obligation d’achat. Vous ne présentez pas de produits : vous partagez un contact. Soumis à
          conditions — les points sont vérifiés. Admissible au tirage trimestriel d’une valeur d’environ 750 $ dès 5 points, avec 1 point = 1 chance.
        </p>
        <p className="mt-2">
          Concours organisé par Pierre-Olivier Caouette uniquement. Ce concours n’est pas commandité, approuvé,
          administré ni associé à Industrielle Alliance.
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
      'Un programme de recommandations attractif et moderne : lien de consentement, points cumulatifs et tirage trimestriel d’une valeur d’environ 750 $.',
    canonicalPath: '/recommandations',
  });

  return (
    <main className="min-h-screen bg-light" data-testid="referral-page">
      <HeroBlock user={user} />
      {user ? (
        <>
          <MemberSummarySection user={user} program={program} />
          <MemberActionsSection user={user} program={program} />
        </>
      ) : (
        <>
          <HowItWorksSection />
          <JourneyMilestonesSection isMember={false} loading={false} totalPoints={null} />
          <ValueSection />
          <DrawSection user={user} referralStats={referralStats} loading={false} />
          <GuestCtaSection />
        </>
      )}
      <PartnersTrustSection sectionClassName="border-t border-prestige-beige bg-white section-padding" />
      <LegalLine />
    </main>
  );
};

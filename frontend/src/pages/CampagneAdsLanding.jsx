import { useEffect } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { CampagneLeadForm } from '../components/campagne/CampagneLeadForm';
import {
  CampagneHeroChips,
  CampagneProcessStrip,
  CampagneTrustPortrait,
} from '../components/campagne/CampagneShellExtras';
import { getCampagneAdsTool } from '../components/campagne/tools';
import {
  buildCampagneRdvPath,
  getCampagneAdsLanding,
} from '../data/campagneAdsLandings';
import { trackEvent, trackRendezVousClick } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';

/**
 * Landing conversion Meta Ads (/campagnes/:slug).
 * Vague 0–2 : hero outil-first + atmosphere CSS + process strip + portrait uniforme.
 */
export function CampagneAdsLanding() {
  const { slug } = useParams();
  const location = useLocation();
  const item = getCampagneAdsLanding(slug);

  useSeoMeta(
    item
      ? {
          title: item.seoTitle,
          description: item.seoDescription,
          canonicalPath: `/campagnes/${item.slug}`,
        }
      : {
          title: 'Campagne | Pierre-Olivier Caouette',
          description: 'Page de campagne.',
          canonicalPath: '/campagnes',
        }
  );

  useEffect(() => {
    if (!item) return;
    trackEvent('view_item', {
      item_category: 'campagne_ads',
      item_id: `campagne_${item.slug}`,
    });
  }, [item]);

  if (!item) {
    return <Navigate to="/" replace />;
  }

  const rdvPath = buildCampagneRdvPath(item.slug, location.search);
  const ToolComponent = getCampagneAdsTool(item.slug);
  const isFormCta = item.ctaType === 'form';
  const secondaryIsTool = Boolean(item.secondaryIsTool);

  const scrollToOutil = () => {
    trackEvent('select_content', {
      content_type: 'cta',
      item_id: `campagne_${item.slug}_outil_scroll`,
    });
    document.getElementById('outil')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToForm = () => {
    trackEvent('select_content', {
      content_type: 'cta',
      item_id: `campagne_${item.slug}_form_cta`,
    });
    document.getElementById('demande')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toolCtaLabel = item.heroToolLabel || 'Essayer l’outil gratuit';
  const heroRdvLabel = item.heroRdvLabel || item.ctaLabel;
  const toolIntro =
    item.toolIntro !== undefined
      ? item.toolIntro
      : isFormCta
        ? 'Remplis l’outil — tu vois ton fit, puis tu demandes une présentation.'
        : 'Remplis l’outil — tu repars avec un résumé clair. Ensuite, 15 minutes si tu veux coller ça à ta situation.';
  const midHeadline =
    item.ctaHeadline ||
    (isFormCta ? 'Prêt à aller plus loin ?' : 'On regarde ton résumé ensemble ?');
  const midSubline =
    item.ctaSubline ||
    (isFormCta
      ? 'Laisse tes coordonnées — je te recontacte pour clarifier sans pression.'
      : '15 minutes, sans pression. Tu repars avec ou sans suite.');

  const processSteps = item.processSteps?.length
    ? item.processSteps
    : isFormCta
      ? ['Essayer l’outil', 'Lire ton fit', 'Demander une présentation']
      : ['Essayer l’outil', 'Lire ton chiffre', '15 min si doute'];

  return (
    <main className="min-h-screen bg-white" data-testid="campagne-ads-landing">
      <PageHero
        badge={item.badge}
        title={item.title}
        description={item.promise}
        minHeightClass="min-h-[34vh] md:min-h-[40vh]"
        atmosphere={item.atmosphere || 'default'}
        heroExtras={
          item.heroChips?.length ? <CampagneHeroChips chips={item.heroChips} /> : null
        }
      >
        <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
          {ToolComponent ? (
            <button
              type="button"
              onClick={scrollToOutil}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-primary shadow-lg transition-all duration-300 hover:bg-secondary hover:text-white sm:w-auto"
              data-testid="campagne-ads-cta-outil"
            >
              {toolCtaLabel}
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : null}
          {isFormCta ? (
            <button
              type="button"
              onClick={scrollToForm}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3 font-semibold transition-all duration-300 sm:w-auto ${
                ToolComponent
                  ? 'border border-white/40 bg-transparent text-white hover:bg-white/10'
                  : 'bg-white text-primary shadow-lg hover:bg-secondary hover:text-white'
              }`}
              data-testid="campagne-ads-cta-form"
            >
              {item.ctaLabel}
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : item.hideHeroRdv ? null : (
            <Link
              to={rdvPath}
              onClick={() => trackRendezVousClick(`campagne_${item.slug}_rdv`)}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3 font-semibold transition-all duration-300 sm:w-auto ${
                ToolComponent
                  ? 'border border-white/40 bg-transparent text-white hover:bg-white/10'
                  : 'bg-white text-primary shadow-lg hover:bg-secondary hover:text-white'
              }`}
              data-testid="campagne-ads-cta-rdv"
            >
              {heroRdvLabel}
              <ArrowRight className="h-5 w-5" />
            </Link>
          )}
        </div>
        {item.ctaMicro ? (
          <p className="mt-3 text-center text-xs text-white/75 md:text-sm">{item.ctaMicro}</p>
        ) : null}
        <p className="mt-4 text-center text-xs text-white/70 md:text-sm">
          Conseiller en sécurité financière · Victoriaville · Contenu éducatif
        </p>
      </PageHero>

      <section className="relative bg-gradient-to-b from-white via-gray-50/80 to-white">
        <div className="container-max max-w-3xl space-y-12 px-4 py-12 md:px-8 md:py-16">
          <div>
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
              En bref
            </p>
            <ul className="space-y-3">
              {item.bullets.map((bullet, index) => (
                <li
                  key={bullet}
                  className="flex gap-4 rounded-2xl border border-prestige-beige/80 bg-white px-5 py-4"
                >
                  <span
                    className="font-heading flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary"
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed text-prestige-taupe">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <CampagneProcessStrip steps={processSteps} />

          {ToolComponent ? (
            <div
              className="space-y-4"
              onFocusCapture={() =>
                trackEvent('select_content', {
                  content_type: 'tool',
                  item_id: `campagne_${item.slug}_tool`,
                })
              }
            >
              <div className="flex items-center justify-center gap-2 text-center">
                <Sparkles className="h-4 w-4 text-secondary" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                  À toi de jouer
                </p>
              </div>
              {toolIntro ? (
                <p className="mx-auto max-w-xl text-center text-sm leading-relaxed text-prestige-taupe md:text-base">
                  {toolIntro}
                </p>
              ) : null}
              <ToolComponent />
            </div>
          ) : null}

          {isFormCta ? (
            <div className="space-y-5">
              <div className="text-center">
                <h2 className="font-heading text-2xl font-bold text-dark md:text-3xl">
                  {midHeadline}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-prestige-taupe md:text-base">
                  {midSubline}
                </p>
              </div>
              <CampagneTrustPortrait />
              <CampagneLeadForm
                slug={item.slug}
                subjectDefault={
                  item.leadSubject || `Campagne ${item.slug} — demande d’info`
                }
                messagePlaceholder={
                  item.leadMessagePlaceholder ||
                  'Parle-moi un peu de ta situation…'
                }
                submitLabel={item.ctaLabel}
                successTitle={item.leadSuccessTitle || 'Demande reçue'}
                successBody={
                  item.leadSuccessBody ||
                  'Merci. Je te recontacte rapidement pour la suite.'
                }
                title={item.leadFormTitle}
                subline={item.leadFormSubline}
                requireCompany={Boolean(item.leadRequireCompany)}
                requireMessage={
                  item.leadRequireMessage === undefined
                    ? true
                    : Boolean(item.leadRequireMessage)
                }
                companyLabel={item.leadCompanyLabel}
                companyPlaceholder={item.leadCompanyPlaceholder}
                phoneHint={item.leadPhoneHint}
                trustLine={item.leadTrustLine}
              />
              <div className="text-center">
                {secondaryIsTool ? (
                  <button
                    type="button"
                    onClick={scrollToOutil}
                    className="inline-flex items-center justify-center text-sm font-medium text-primary hover:underline"
                  >
                    {item.apprendreLabel}
                  </button>
                ) : (
                  <Link
                    to={item.apprendrePath}
                    onClick={() =>
                      trackEvent('select_content', {
                        content_type: 'cta',
                        item_id: `campagne_${item.slug}_apprendre`,
                      })
                    }
                    className="inline-flex items-center justify-center text-sm font-medium text-primary hover:underline"
                  >
                    {item.apprendreLabel}
                  </Link>
                )}
              </div>
            </div>
          ) : item.hideMidCta ? null : (
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-dark px-6 py-8 text-center text-white shadow-lg md:px-10 md:py-10">
              <h2 className="font-heading text-2xl font-bold md:text-3xl">{midHeadline}</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/80 md:text-base">
                {midSubline}
              </p>
              <div className="mx-auto mt-5 flex max-w-sm justify-center">
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-2 text-left backdrop-blur-sm">
                  <img
                    src="/seo/portrait.jpg"
                    alt=""
                    width={48}
                    height={48}
                    className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white/40"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">Pierre-Olivier Caouette</p>
                    <p className="text-xs text-white/75">CSF · Victoriaville · 15 min</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Link
                  to={rdvPath}
                  onClick={() => trackRendezVousClick(`campagne_${item.slug}_rdv_mid`)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-primary transition-colors hover:bg-secondary hover:text-white"
                >
                  {item.ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {secondaryIsTool ? (
                  <button
                    type="button"
                    onClick={scrollToOutil}
                    className="inline-flex items-center justify-center rounded-full border border-white/35 px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    {item.apprendreLabel}
                  </button>
                ) : (
                  <Link
                    to={item.apprendrePath}
                    onClick={() =>
                      trackEvent('select_content', {
                        content_type: 'cta',
                        item_id: `campagne_${item.slug}_apprendre`,
                      })
                    }
                    className="inline-flex items-center justify-center rounded-full border border-white/35 px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    {item.apprendreLabel}
                  </Link>
                )}
              </div>
            </div>
          )}

          {item.faq?.length > 0 ? (
            <div className="space-y-5">
              <h2 className="font-heading text-center text-2xl font-bold text-dark">
                Questions fréquentes
              </h2>
              <div className="divide-y divide-prestige-beige overflow-hidden rounded-2xl border border-prestige-beige bg-white">
                {item.faq.map((entry) => (
                  <div
                    key={entry.question}
                    id={entry.id || undefined}
                    className={`px-5 py-5 md:px-6${entry.id ? ' scroll-mt-28' : ''}`}
                  >
                    <h3 className="font-heading mb-2 font-semibold text-dark">{entry.question}</h3>
                    <p className="leading-relaxed text-prestige-taupe">{entry.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <p className="text-center text-xs leading-relaxed text-prestige-taupe/80">
            {item.legalNote ||
              'Contenu éducatif et général. Titre autorisé : conseiller en sécurité financière. Ne constitue pas un conseil personnalisé. Chaque situation est unique.'}
          </p>
        </div>
      </section>
    </main>
  );
}

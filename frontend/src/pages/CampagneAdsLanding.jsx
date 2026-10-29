import { useEffect } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { getCampagneAdsTool } from '../components/campagne/tools';
import {
  buildCampagneRdvPath,
  getCampagneAdsLanding,
} from '../data/campagneAdsLandings';
import { trackEvent } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';

/**
 * Landing conversion Meta Ads (/campagnes/:slug).
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

  return (
    <main className="min-h-screen bg-white" data-testid="campagne-ads-landing">
      <PageHero
        badge={item.badge}
        title={item.title}
        description={item.promise}
        minHeightClass="min-h-[34vh] md:min-h-[40vh]"
      >
        <Link
          to={rdvPath}
          onClick={() =>
            trackEvent('select_content', {
              content_type: 'cta',
              item_id: `campagne_${item.slug}_rdv`,
            })
          }
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-primary shadow-lg transition-all duration-300 hover:bg-secondary hover:text-white"
          data-testid="campagne-ads-cta-rdv"
        >
          {item.ctaLabel}
          <ArrowRight className="h-5 w-5" />
        </Link>
      </PageHero>

      <section className="relative bg-gradient-to-b from-white via-gray-50/80 to-white">
        <div className="container-max max-w-3xl space-y-12 px-4 py-12 md:px-8 md:py-16">
          {/* En bref */}
          <div>
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
              En bref
            </p>
            <ul className="space-y-3">
              {item.bullets.map((bullet, index) => (
                <li
                  key={bullet}
                  className="flex gap-4 rounded-2xl bg-white px-5 py-4 shadow-[0_1px_0_rgba(1,35,63,0.04),0_8px_24px_rgba(1,35,63,0.04)]"
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

          {/* Outil */}
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
              <p className="mx-auto max-w-xl text-center text-sm leading-relaxed text-prestige-taupe md:text-base">
                Remplis l’outil — tu repars avec un résumé clair et un PDF à garder.
              </p>
              <ToolComponent />
            </div>
          ) : null}

          {/* CTA conversion */}
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-dark px-6 py-8 text-center text-white shadow-lg md:px-10 md:py-10">
            <h2 className="font-heading text-2xl font-bold md:text-3xl">
              Prêt à clarifier ta situation ?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/80 md:text-base">
              15 minutes, sans pression. On regarde ton résumé ensemble si tu veux.
            </p>
            <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                to={rdvPath}
                onClick={() =>
                  trackEvent('select_content', {
                    content_type: 'cta',
                    item_id: `campagne_${item.slug}_rdv_mid`,
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-primary transition-colors hover:bg-secondary hover:text-white"
              >
                {item.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
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
            </div>
          </div>

          {item.faq?.length > 0 ? (
            <div className="space-y-5">
              <h2 className="font-heading text-center text-2xl font-bold text-dark">
                Questions fréquentes
              </h2>
              <div className="divide-y divide-prestige-beige overflow-hidden rounded-2xl border border-prestige-beige bg-white">
                {item.faq.map((entry) => (
                  <div key={entry.question} className="px-5 py-5 md:px-6">
                    <h3 className="font-heading mb-2 font-semibold text-dark">{entry.question}</h3>
                    <p className="leading-relaxed text-prestige-taupe">{entry.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <p className="text-center text-xs leading-relaxed text-prestige-taupe/80">
            Contenu éducatif et général. Titre autorisé : conseiller en sécurité financière. Ne
            constitue pas un conseil personnalisé. Chaque situation est unique.
          </p>
        </div>
      </section>
    </main>
  );
}

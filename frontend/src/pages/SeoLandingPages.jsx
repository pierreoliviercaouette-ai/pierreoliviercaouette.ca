import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { SEO_DISCLAIMER } from '../data/seoCopy';
import { getSeoLanding } from '../data/seoLandings';
import { trackRendezVousClick } from '../lib/analytics';
import { breadcrumbSchema } from '../lib/seoArtifacts';
import { useFaqSchema, useJsonLd, useSeoMeta } from '../lib/seo';

function SeoPage({ path }) {
  const page = getSeoLanding(path);
  useSeoMeta({
    title: page.title,
    description: page.description,
    canonicalPath: page.path,
  });
  useFaqSchema(page.faqItems);
  useJsonLd(
    'breadcrumb-schema-jsonld',
    breadcrumbSchema([
      { name: 'Accueil', path: '/' },
      { name: page.h1, path: page.path },
    ])
  );

  return (
    <main className="min-h-screen bg-white" data-testid="seo-landing-page">
      <PageHero
        badge="Guide"
        title={page.h1}
        description={page.intro}
        minHeightClass="min-h-[38vh] md:min-h-[44vh]"
      />

      <section className="section-padding bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 glow-orb-soft" style={{ '--glow': 'rgba(6, 77, 217, 0.08)' }} />
        <div className="absolute bottom-20 left-10 w-48 h-48 glow-orb-soft" style={{ '--glow': 'rgba(115, 196, 239, 0.12)' }} />

        <article className="container-max max-w-4xl relative space-y-8">
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-prestige-beige">
            <h2 className="font-heading text-2xl font-bold text-dark mb-4">En bref</h2>
            <p className="text-prestige-taupe leading-relaxed">{page.enBref}</p>
          </section>

          {page.sections.map((section) => (
            <section key={section.heading}>
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-prestige-beige hover:shadow-xl transition-shadow duration-300">
                <h2 className="font-heading text-2xl font-bold text-dark mb-4">{section.heading}</h2>
                {(section.paragraphs || []).map((paragraph) => (
                  <p key={paragraph} className="text-prestige-taupe leading-relaxed mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
                {section.links?.length ? (
                  <ul className="mt-4 space-y-2">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          to={link.href}
                          className="font-semibold text-primary hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}

          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 gradient-hero" />
            <div className="absolute top-0 right-0 w-48 h-48 glow-orb" style={{ '--glow': 'rgba(115, 196, 239, 0.28)' }} />
            <div className="relative px-6 py-10 md:px-10 md:py-12 text-center">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
                Prochaine étape
              </h2>
              <p className="text-white/85 text-lg mb-8 max-w-2xl mx-auto">
                Obtenez une stratégie personnalisée selon votre situation familiale, votre budget
                et vos objectifs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/rendez-vous"
                  onClick={() => trackRendezVousClick('seo_landing_rendez_vous')}
                  className="group inline-flex items-center justify-center gap-2 bg-white text-primary rounded-full px-8 py-3 font-semibold shadow-lg hover:bg-secondary hover:text-white transition-all duration-300"
                >
                  Prendre rendez-vous
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center border-2 border-white/35 text-white rounded-full px-8 py-3 font-semibold hover:bg-white/10 transition-colors"
                >
                  Voir tous les services
                </Link>
              </div>
            </div>
          </div>

          {page.faqItems.length > 0 && (
            <section className="pt-2">
              <h2 className="font-heading text-2xl font-bold text-dark mb-6 text-center">
                Questions fréquentes
              </h2>
              <div className="space-y-4">
                {page.faqItems.map((item) => (
                  <div
                    key={item.question}
                    className="bg-white rounded-xl p-5 md:p-6 shadow-md border border-prestige-beige"
                  >
                    <h3 className="font-heading font-semibold text-dark mb-2">{item.question}</h3>
                    <p className="text-prestige-taupe leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <p className="text-sm text-prestige-taupe text-center">{SEO_DISCLAIMER}</p>
        </article>
      </section>
    </main>
  );
}

export const ConseillerFinancierVictoriaville = () => (
  <SeoPage path="/conseiller-financier-victoriaville" />
);

export const RecommanderConseillerFinancier = () => (
  <SeoPage path="/recommander-conseiller-financier" />
);

export const AssuranceVieVictoriaville = () => (
  <SeoPage path="/assurance-vie-victoriaville" />
);

export const AssuranceInvaliditeQuebec = () => (
  <SeoPage path="/assurance-invalidite-quebec" />
);

export const PlanificationFinanciereQuebec = () => (
  <SeoPage path="/planification-financiere-quebec" />
);

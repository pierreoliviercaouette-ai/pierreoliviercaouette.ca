import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { getOtherServices, getServiceById } from '../data/services';
import { trackEvent } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';

export const ServiceDetail = () => {
  const { slug } = useParams();
  const service = getServiceById(slug);

  useSeoMeta({
    title: service
      ? `${service.seoTitle} | Pierre-Olivier Caouette`
      : 'Services | Pierre-Olivier Caouette',
    description: service?.seoDescription ?? 'Decouvrez les services de Pierre-Olivier Caouette.',
    canonicalPath: service ? `/services/${service.id}` : '/services',
  });

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const Icon = service.icon;
  const others = getOtherServices(service.id);

  return (
    <main data-testid={`service-detail-${service.id}`}>
      <PageHero
        badge={service.subtitle}
        title={service.title}
        description={service.shortDescription}
        minHeightClass="min-h-[50vh] md:min-h-[58vh]"
      >
        <Link
          to="/rendez-vous"
          onClick={() =>
            trackEvent('select_content', {
              content_type: 'cta',
              item_id: `service_${service.id}_hero_rdv`,
            })
          }
          className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-10 py-4 text-base font-bold text-dark shadow-xl shadow-black/15 ring-2 ring-white/40 transition-all duration-300 hover:scale-[1.02] hover:bg-secondary hover:text-white hover:ring-secondary/50"
        >
          <Calendar className="w-5 h-5" />
          Prendre rendez-vous
          <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
        </Link>
      </PageHero>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl space-y-14">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${service.color} flex items-center justify-center`}>
                <Icon className="w-7 h-7 text-white" aria-hidden />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-dark">C’est quoi ?</h2>
            </div>
            <div className="space-y-4 text-prestige-taupe leading-relaxed text-lg">
              {service.fullDescription.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold text-dark mb-5">Points clés</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {service.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-2 p-4 bg-light rounded-xl border border-prestige-beige"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-dark font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-dark text-white p-7 md:p-9">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
              Pourquoi faire affaire avec moi
            </h2>
            <ul className="space-y-4">
              {service.whyMe.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-white/85 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-light rounded-2xl p-6 md:p-8">
            <h2 className="font-heading text-2xl font-bold text-dark mb-5">À qui ça s’adresse ?</h2>
            <ul className="space-y-3">
              {service.whoIsItFor.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-prestige-taupe">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold text-dark mb-5">Exemples concrets</h2>
            <div className="space-y-3">
              {service.examples.map((example, idx) => (
                <div
                  key={example}
                  className="flex items-start gap-3 p-4 border border-prestige-beige rounded-xl"
                >
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white text-sm font-bold">{idx + 1}</span>
                  </div>
                  <p className="text-prestige-taupe text-sm leading-relaxed">{example}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 text-center mt-6 max-w-2xl mx-auto">
              <strong>Note :</strong> Ces exemples sont à titre illustratif seulement et ne constituent
              pas des conseils financiers personnalisés.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 gradient-hero" />
            <div className="relative px-6 py-10 md:px-10 md:py-12 text-center space-y-5">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white">
                Parlons de votre situation
              </h2>
              <p className="text-white/85 text-lg max-w-xl mx-auto">
                Une première rencontre pour clarifier vos besoins et voir si une solution vous convient.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/rendez-vous"
                  onClick={() =>
                    trackEvent('select_content', {
                      content_type: 'cta',
                      item_id: `service_${service.id}_bottom_rdv`,
                    })
                  }
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary rounded-full px-8 py-3 font-semibold shadow-lg hover:bg-secondary hover:text-white transition-all"
                  data-testid="service-detail-cta-rdv"
                >
                  <Calendar className="w-5 h-5" />
                  Prendre rendez-vous
                </Link>
                <Link
                  to="/contact"
                  onClick={() =>
                    trackEvent('select_content', {
                      content_type: 'cta',
                      item_id: `service_${service.id}_bottom_contact`,
                    })
                  }
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/35 text-white rounded-full px-8 py-3 font-semibold hover:bg-white/10 transition-colors"
                >
                  En parler ensemble
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding pt-0 bg-white">
        <div className="container-max max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-dark text-center mb-8">
            Autres services
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {others.map((other) => {
              const OtherIcon = other.icon;
              return (
                <Link
                  key={other.id}
                  to={`/services/${other.id}`}
                  onClick={() =>
                    trackEvent('select_content', {
                      content_type: 'cta',
                      item_id: `service_cross_${service.id}_to_${other.id}`,
                    })
                  }
                  className="group flex items-start gap-3 p-5 rounded-xl border border-prestige-beige bg-white hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-light flex items-center justify-center group-hover:bg-primary transition-colors">
                    <OtherIcon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-dark group-hover:text-primary transition-colors">
                      {other.title}
                    </p>
                    <p className="text-sm text-primary font-medium">{other.subtitle}</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Voir tous les services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

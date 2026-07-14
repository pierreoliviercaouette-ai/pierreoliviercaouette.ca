import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { services } from '../data/services';
import { trackEvent } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';

const ServiceCard = ({ service }) => {
  const Icon = service.icon;

  return (
    <Link
      to={`/services/${service.id}`}
      id={service.id}
      onClick={() =>
        trackEvent('select_content', {
          content_type: 'cta',
          item_id: `services_grid_${service.id}`,
        })
      }
      className="group relative block overflow-hidden rounded-2xl border border-prestige-beige bg-white p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-primary hover:shadow-xl scroll-mt-24"
      data-testid={`service-card-${service.id}`}
    >
      <div
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${service.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
      />

      <div className="w-14 h-14 rounded-2xl bg-light flex items-center justify-center mb-5 group-hover:bg-primary transition-colors duration-300">
        <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-heading text-xl font-semibold text-dark group-hover:text-primary transition-colors">
            {service.title}
          </h3>
          <p className="text-primary text-sm font-medium">{service.subtitle}</p>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed">{service.shortDescription}</p>

        <ul className="space-y-2 pt-2">
          {service.features.slice(0, 2).map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <span className="inline-flex items-center gap-1 text-primary font-medium text-sm pt-2 group-hover:gap-2 transition-all">
          En savoir plus <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
};

export const Services = () => {
  useSeoMeta({
    title: 'Services financiers | Assurance vie, retraite, invalidite',
    description:
      'Decouvrez les services: assurance vie, epargne retraite, planification financiere, invalidite et strategies de protection au Quebec.',
    canonicalPath: '/services',
  });

  return (
    <main data-testid="services-page">
      <PageHero
        badge="Mes services"
        title="Comment puis-je vous aider?"
        description="Chaque situation est unique. Explorez un service pour voir comment il peut repondre a vos besoins — et pourquoi faire affaire avec moi."
      />

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-light">
        <div className="container-max px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-dark mb-4">
              Vous ne savez pas par où commencer?
            </h2>
            <p className="text-slate-600 mb-8">
              Pas de souci! Lors de notre première rencontre gratuite, nous analyserons ensemble
              votre situation pour identifier les solutions les plus pertinentes pour vous.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/rendez-vous"
                className="btn-primary inline-flex items-center justify-center gap-2"
                data-testid="services-cta-rdv"
              >
                <Calendar className="w-5 h-5" />
                Consultation gratuite
              </Link>
              <Link to="/contact" className="btn-secondary inline-flex items-center justify-center gap-2">
                Poser une question
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 bg-white border-t border-prestige-beige">
        <div className="container-max px-4 md:px-8">
          <p className="text-xs text-slate-600 text-center max-w-4xl mx-auto">
            <strong>Information importante:</strong> Les informations présentées sur cette page sont de
            nature générale et ne constituent pas des conseils financiers personnalisés. Chaque situation
            étant unique, il est recommandé de consulter un conseiller qualifié avant de prendre toute
            décision financière.
          </p>
        </div>
      </section>
    </main>
  );
};

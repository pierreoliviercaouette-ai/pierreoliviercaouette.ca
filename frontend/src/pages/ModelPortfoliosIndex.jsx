import { Link } from 'react-router-dom';
import { PORTFOLIO_PROFILE_LIST } from '../data/portfolioProfiles';
import {
  PORTFOLIO_BANNER_DISCLAIMER,
  PORTFOLIO_BANNER_PRODUCT_LINE,
  PORTFOLIO_GENERAL_DISCLAIMER,
} from '../lib/portfolioCompliance';
import { useSeoMeta } from '../lib/seo';

export const ModelPortfoliosIndex = () => {
  useSeoMeta({
    title: 'Portefeuilles modèles | Fonds distincts',
    description:
      'Illustrations de portefeuilles modèles en fonds distincts : profils, composition et rendements indicatifs.',
    canonicalPath: '/portefeuilles',
    noindex: true,
  });

  return (
    <main className="min-h-screen bg-light" data-testid="portfolios-index">
      <section className="section-padding">
        <div className="container-max max-w-4xl space-y-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-prestige-taupe mb-2">
              Fonds distincts
            </p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-dark">
              Portefeuilles modèles
            </h1>
            <p className="text-prestige-taupe mt-3 leading-relaxed max-w-2xl">
              Illustrations de compositions types selon le profil de risque du modèle. Ces pages
              sont informatives et ne remplacent pas une analyse personnalisée.
            </p>
            <p className="text-xs text-prestige-taupe mt-3 leading-relaxed">
              {PORTFOLIO_BANNER_PRODUCT_LINE}
            </p>
          </div>

          <ul className="space-y-3">
            {PORTFOLIO_PROFILE_LIST.map((p) => (
              <li key={p.key}>
                <Link
                  to={p.href}
                  className="flex items-center justify-between gap-4 rounded-xl border border-prestige-beige bg-white px-5 py-4 hover:border-primary/40 transition-colors"
                >
                  <div>
                    <p className="font-heading font-semibold text-dark text-lg">{p.name}</p>
                    <p className="text-xs text-prestige-taupe mt-0.5">
                      Risque modèle indicatif {p.riskLevel}/5
                    </p>
                  </div>
                  <span className="text-primary text-sm font-semibold shrink-0">Voir la fiche</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="text-xs text-prestige-taupe leading-relaxed space-y-2 border-t border-prestige-beige pt-4">
            <p>{PORTFOLIO_BANNER_DISCLAIMER}</p>
            <p>{PORTFOLIO_GENERAL_DISCLAIMER}</p>
            <p>
              <Link to="/conditions#fonds-distincts" className="text-primary hover:underline">
                Lire les conditions — fonds distincts
              </Link>
              {' · '}
              <Link to="/rendez-vous" className="text-primary hover:underline">
                Prendre rendez-vous
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

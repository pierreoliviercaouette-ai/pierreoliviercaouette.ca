import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { DEFAULT_MODEL_PORTFOLIOS, DEFAULT_MODEL_PORTFOLIOS_AS_OF } from '../data/modelPortfolios';
import { useSeoMeta } from '../lib/seo';
import { supabase } from '../lib/supabaseClient';

function formatReturn(value) {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  const abs = Math.abs(value).toFixed(1).replace('.', ',');
  return `${sign}${abs} %`;
}

export const ModelPortfolioDetail = () => {
  const { slug } = useParams();
  const fallbackPortfolio = DEFAULT_MODEL_PORTFOLIOS.find((item) => item.key === slug);
  const [portfolio, setPortfolio] = useState(fallbackPortfolio || null);
  const [asOfLabel, setAsOfLabel] = useState(DEFAULT_MODEL_PORTFOLIOS_AS_OF);

  useEffect(() => {
    const loadPortfolio = async () => {
      if (!slug) return;
      const { data, error } = await supabase
        .from('model_portfolios')
        .select('key,name,ytd_2026,year_2025,href,as_of_date')
        .eq('key', slug)
        .maybeSingle();

      if (error || !data) return;

      setPortfolio({
        key: data.key,
        name: data.name,
        ytd2026: Number(data.ytd_2026),
        year2025: Number(data.year_2025),
        href: data.href,
      });

      if (data.as_of_date) {
        setAsOfLabel(
          new Date(data.as_of_date).toLocaleDateString('fr-CA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        );
      }
    };
    loadPortfolio();
  }, [slug]);

  useSeoMeta({
    title: portfolio
      ? `Portefeuille ${portfolio.name} | Rendements modeles`
      : 'Portefeuille modele',
    description: portfolio
      ? `Fiche detaillee du portefeuille ${portfolio.name}: rendement 2026 depuis le 1er janvier et rendement 2025.`
      : 'Fiche portefeuille modele.',
    canonicalPath: portfolio?.href ?? '/portefeuilles',
  });

  if (!portfolio) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="pt-20 min-h-screen bg-light">
      <section className="section-padding">
        <div className="container-max max-w-3xl">
          <Link to="/" className="text-sm text-primary hover:underline">
            Retour a l accueil
          </Link>

          <div className="mt-4 bg-white border border-prestige-beige rounded-2xl p-6 md:p-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-2">
              Portefeuille {portfolio.name}
            </h1>
            <p className="text-sm text-prestige-taupe mb-6">
              Donnees au {asOfLabel}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-light border border-prestige-beige p-4">
                <p className="text-sm text-prestige-taupe">2026 (depuis le 1er janvier)</p>
                <p className="text-2xl font-semibold text-dark mt-1">{formatReturn(portfolio.ytd2026)}</p>
              </div>
              <div className="rounded-xl bg-light border border-prestige-beige p-4">
                <p className="text-sm text-prestige-taupe">2025</p>
                <p className="text-2xl font-semibold text-dark mt-1">{formatReturn(portfolio.year2025)}</p>
              </div>
            </div>

            <p className="text-sm text-prestige-taupe mt-6">
              Cette fiche sert de base pour afficher l anatomie complete du portefeuille. Vous pourrez y brancher vos
              compositions, fiches de fonds et mises a jour periodiques.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

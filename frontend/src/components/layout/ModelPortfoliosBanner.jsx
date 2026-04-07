import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { DEFAULT_MODEL_PORTFOLIOS, DEFAULT_MODEL_PORTFOLIOS_AS_OF } from '../../data/modelPortfolios';

function getReturnColor(value) {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-500';
}

function formatReturn(value) {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  const abs = Math.abs(value).toFixed(1).replace('.', ',');
  return `${sign}${abs} %`;
}

export const ModelPortfoliosBanner = () => {
  const [portfolios, setPortfolios] = useState(DEFAULT_MODEL_PORTFOLIOS);
  const [asOfLabel, setAsOfLabel] = useState(DEFAULT_MODEL_PORTFOLIOS_AS_OF);
  const [mobileIndex, setMobileIndex] = useState(0);

  useEffect(() => {
    const loadPortfolios = async () => {
      const { data, error } = await supabase
        .from('model_portfolios')
        .select('key,name,ytd_2026,year_2025,href,as_of_date')
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) return;

      const mapped = data.map((item) => ({
        key: item.key,
        name: item.name,
        ytd2026: Number(item.ytd_2026),
        year2025: Number(item.year_2025),
        href: item.href,
      }));
      setPortfolios(mapped);

      const firstDate = data[0]?.as_of_date;
      if (firstDate) {
        const formatted = new Date(firstDate).toLocaleDateString('fr-CA', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        setAsOfLabel(formatted);
      }
    };

    loadPortfolios();
  }, []);

  useEffect(() => {
    if (portfolios.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setMobileIndex((prev) => (prev + 1) % portfolios.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [portfolios.length]);

  useEffect(() => {
    if (mobileIndex >= portfolios.length) setMobileIndex(0);
  }, [mobileIndex, portfolios.length]);

  const activeMobilePortfolio = portfolios[mobileIndex];

  return (
    <section className="bg-slate-50 border-b border-slate-200/70" aria-label="Apercu des portefeuilles modeles">
      <div className="container-max px-4 md:px-8 py-4">
        <p className="text-sm font-medium text-slate-700 mb-3">
          Apercu des portefeuilles modeles
        </p>

        <div className="hidden md:grid md:grid-cols-5 gap-3">
          {portfolios.map((portfolio) => (
            <Link
              key={portfolio.key}
              to={portfolio.href}
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-slate-300 transition-colors"
              data-testid={`portfolio-card-${portfolio.key}`}
            >
              <p className="font-semibold text-slate-900 text-sm mb-2">{portfolio.name}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500 leading-tight">2026 (depuis le 1er janvier)</p>
                  <p className={`text-sm font-semibold ${getReturnColor(portfolio.ytd2026)}`}>
                    {formatReturn(portfolio.ytd2026)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 leading-tight">2025</p>
                  <p className={`text-sm font-semibold ${getReturnColor(portfolio.year2025)}`}>
                    {formatReturn(portfolio.year2025)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {activeMobilePortfolio && (
          <div className="md:hidden">
            <Link
              to={activeMobilePortfolio.href}
              className="block bg-white border border-slate-200 rounded-xl px-4 py-3"
              data-testid={`portfolio-card-mobile-${activeMobilePortfolio.key}`}
            >
              <p className="font-semibold text-slate-900 text-sm mb-2">{activeMobilePortfolio.name}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500 leading-tight">2026 (depuis le 1er janvier)</p>
                  <p className={`text-sm font-semibold ${getReturnColor(activeMobilePortfolio.ytd2026)}`}>
                    {formatReturn(activeMobilePortfolio.ytd2026)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 leading-tight">2025</p>
                  <p className={`text-sm font-semibold ${getReturnColor(activeMobilePortfolio.year2025)}`}>
                    {formatReturn(activeMobilePortfolio.year2025)}
                  </p>
                </div>
              </div>
            </Link>
            <div className="flex justify-center gap-1.5 mt-2">
              {portfolios.map((portfolio, index) => (
                <button
                  key={portfolio.key}
                  type="button"
                  onClick={() => setMobileIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === mobileIndex ? 'w-4 bg-slate-500' : 'w-1.5 bg-slate-300'
                  }`}
                  aria-label={`Voir portefeuille ${portfolio.name}`}
                />
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-slate-500 mt-3">
          Donnees au {asOfLabel}. Portefeuilles modeles a titre indicatif seulement. Les rendements passes ne
          garantissent pas les rendements futurs.
        </p>
      </div>
    </section>
  );
};

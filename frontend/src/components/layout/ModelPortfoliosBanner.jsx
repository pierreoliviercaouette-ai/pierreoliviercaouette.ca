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

  return (
    <section className="bg-slate-50 border-b border-slate-200/70" aria-label="Apercu des portefeuilles modeles">
      <div className="container-max px-4 md:px-8 py-3">
        <p className="text-xs md:text-sm font-medium text-slate-600 mb-2">
          Apercu des portefeuilles modeles
        </p>

        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
          {portfolios.map((portfolio) => (
            <Link
              key={portfolio.key}
              to={portfolio.href}
              className="shrink-0 w-[240px] md:w-[250px] bg-white border border-slate-200 rounded-xl px-3 py-2.5 hover:border-slate-300 transition-colors"
              data-testid={`portfolio-card-${portfolio.key}`}
            >
              <p className="font-semibold text-slate-900 text-sm mb-2">{portfolio.name}</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[11px] text-slate-500 leading-tight">2026 (depuis le 1er janvier)</p>
                  <p className={`text-sm font-semibold ${getReturnColor(portfolio.ytd2026)}`}>
                    {formatReturn(portfolio.ytd2026)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 leading-tight">2025</p>
                  <p className={`text-sm font-semibold ${getReturnColor(portfolio.year2025)}`}>
                    {formatReturn(portfolio.year2025)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-[11px] text-slate-500 mt-2">
          Donnees au {asOfLabel}. Portefeuilles modeles a titre indicatif seulement. Les rendements passes ne
          garantissent pas les rendements futurs.
        </p>
      </div>
    </section>
  );
};

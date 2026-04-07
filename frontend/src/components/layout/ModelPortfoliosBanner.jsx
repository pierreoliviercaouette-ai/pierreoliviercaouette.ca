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
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  const n = Number(value);
  const sign = n > 0 ? '+' : n < 0 ? '-' : '';
  const abs = Math.abs(n).toFixed(1).replace('.', ',');
  return `${sign}${abs} %`;
}

export const ModelPortfoliosBanner = () => {
  const [portfolios, setPortfolios] = useState(
    DEFAULT_MODEL_PORTFOLIOS.map((p) => ({
      key: p.key,
      name: p.name,
      ytd2026: p.ytd2026,
      yearPrev: p.year2025,
      href: p.href,
    }))
  );
  const [asOfLabel, setAsOfLabel] = useState(DEFAULT_MODEL_PORTFOLIOS_AS_OF);
  const [prevYearLabel, setPrevYearLabel] = useState(2025);
  const [mobileIndex, setMobileIndex] = useState(0);

  useEffect(() => {
    const loadPortfolios = async () => {
      const { data: nameRows } = await supabase
        .from('model_portfolios')
        .select('key,name')
        .order('display_order', { ascending: true });
      const namesByKey = new Map((nameRows || []).map((row) => [row.key, row.name]));

      const { data, error } = await supabase
        .from('portfolio_snapshots')
        .select(
          `
          ytd_pct,
          prev_civil_year,
          prev_civil_year_pct,
          as_of_date,
          computed_at,
          portfolio_definitions ( key, name, href, display_order )
        `
        )
        .order('computed_at', { ascending: false });

      if (error || !data || data.length === 0) {
        const { data: legacy } = await supabase
          .from('model_portfolios')
          .select('key,name,ytd_2026,year_2025,href,as_of_date')
          .order('display_order', { ascending: true });
        if (!legacy?.length) return;
        setPortfolios(
          legacy.map((item) => ({
            key: item.key,
            name: item.name,
            ytd2026: Number(item.ytd_2026),
            yearPrev: Number(item.year_2025),
            href: item.href,
          }))
        );
        setPrevYearLabel(new Date().getFullYear() - 1);
        const firstDate = legacy[0]?.as_of_date;
        if (firstDate) {
          setAsOfLabel(
            new Date(firstDate).toLocaleDateString('fr-CA', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          );
        }
        return;
      }

      const bestByKey = new Map();
      for (const row of data) {
        const def = row.portfolio_definitions;
        if (!def?.key) continue;
        if (!bestByKey.has(def.key)) bestByKey.set(def.key, row);
      }

      const sorted = [...bestByKey.values()].sort(
        (a, b) =>
          (a.portfolio_definitions?.display_order ?? 0) -
          (b.portfolio_definitions?.display_order ?? 0)
      );

      setPortfolios(
        sorted.map((row) => ({
          key: row.portfolio_definitions.key,
          name: namesByKey.get(row.portfolio_definitions.key) || row.portfolio_definitions.name,
          ytd2026: row.ytd_pct != null ? Number(row.ytd_pct) : null,
          yearPrev: row.prev_civil_year_pct != null ? Number(row.prev_civil_year_pct) : null,
          href: row.portfolio_definitions.href,
        }))
      );

      const py = sorted[0]?.prev_civil_year;
      if (py != null) setPrevYearLabel(py);

      const firstDate = sorted[0]?.as_of_date;
      if (firstDate) {
        setAsOfLabel(
          new Date(firstDate).toLocaleDateString('fr-CA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        );
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
  const currentYear = new Date().getFullYear();

  return (
    <section className="bg-slate-50 border-b border-slate-200/70" aria-label="Apercu des portefeuilles modeles">
      <div className="container-max px-4 md:px-8 py-4">
        <p className="text-sm font-medium text-slate-700 mb-3">Mes portefeuilles modeles</p>

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
                  <p className="text-xs text-slate-500 leading-tight">
                    {currentYear} (depuis le 1er janvier)
                  </p>
                  <p className={`text-sm font-semibold ${getReturnColor(portfolio.ytd2026)}`}>
                    {formatReturn(portfolio.ytd2026)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 leading-tight">{prevYearLabel}</p>
                  <p className={`text-sm font-semibold ${getReturnColor(portfolio.yearPrev)}`}>
                    {formatReturn(portfolio.yearPrev)}
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
                  <p className="text-xs text-slate-500 leading-tight">
                    {currentYear} (depuis le 1er janvier)
                  </p>
                  <p className={`text-sm font-semibold ${getReturnColor(activeMobilePortfolio.ytd2026)}`}>
                    {formatReturn(activeMobilePortfolio.ytd2026)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 leading-tight">{prevYearLabel}</p>
                  <p className={`text-sm font-semibold ${getReturnColor(activeMobilePortfolio.yearPrev)}`}>
                    {formatReturn(activeMobilePortfolio.yearPrev)}
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

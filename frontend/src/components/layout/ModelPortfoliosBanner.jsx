import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { DEFAULT_MODEL_PORTFOLIOS, DEFAULT_MODEL_PORTFOLIOS_AS_OF } from '../../data/modelPortfolios';

function getReturnColor(value) {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-prestige-taupe';
}

function formatReturn(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  const n = Number(value);
  const sign = n > 0 ? '+' : n < 0 ? '-' : '';
  const abs = Math.abs(n).toFixed(1).replace('.', ',');
  return `${sign}${abs} %`;
}

function formatIsoDateLabel(isoDate) {
  if (!isoDate || typeof isoDate !== 'string') return '';
  const [year, month, day] = isoDate.split('-').map((value) => Number(value));
  if (!year || !month || !day) return '';
  return new Date(year, month - 1, day).toLocaleDateString('fr-CA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
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
      const { data: rows, error } = await supabase
        .from('model_portfolios')
        .select('key,name,ytd_2026,year_2025,href,as_of_date')
        .order('display_order', { ascending: true });
      if (error || !rows?.length) return;
      setPortfolios(
        rows.map((item) => ({
          key: item.key,
          name: item.name,
          ytd2026: Number(item.ytd_2026),
          yearPrev: Number(item.year_2025),
          href: item.href,
        }))
      );
      setPrevYearLabel(new Date().getFullYear() - 1);
      const firstDate = rows[0]?.as_of_date;
      if (firstDate) {
        setAsOfLabel(formatIsoDateLabel(firstDate));
      }
    };

    loadPortfolios();
    const onModelPortfoliosUpdated = () => {
      loadPortfolios();
    };
    window.addEventListener('model-portfolios-updated', onModelPortfoliosUpdated);
    return () => {
      window.removeEventListener('model-portfolios-updated', onModelPortfoliosUpdated);
    };
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
    <section className="bg-light border-b border-prestige-beige" aria-label="Apercu des portefeuilles modeles">
      <div className="container-max px-4 md:px-8 py-5">
        <div className="mb-3">
          <p className="font-heading text-base font-semibold text-dark">Mes portefeuilles modeles</p>
          <p className="text-xs text-prestige-taupe">Apercu des rendements saisis en administration</p>
        </div>

        <div className="hidden md:grid md:grid-cols-5 gap-3">
          {portfolios.map((portfolio) => (
            <Link
              key={portfolio.key}
              to={portfolio.href}
              className="bg-white border border-prestige-beige rounded-2xl px-4 py-3 hover:border-primary/30 hover:shadow-sm transition-all"
              data-testid={`portfolio-card-${portfolio.key}`}
            >
              <p className="font-semibold text-dark text-sm mb-2">{portfolio.name}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-prestige-taupe leading-tight">
                    {currentYear} (depuis le 1er janvier)
                  </p>
                  <p className={`text-sm font-semibold ${getReturnColor(portfolio.ytd2026)}`}>
                    {formatReturn(portfolio.ytd2026)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-prestige-taupe leading-tight">{prevYearLabel}</p>
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
              className="block bg-white border border-prestige-beige rounded-2xl px-4 py-3"
              data-testid={`portfolio-card-mobile-${activeMobilePortfolio.key}`}
            >
              <p className="font-semibold text-dark text-sm mb-2">{activeMobilePortfolio.name}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-prestige-taupe leading-tight">
                    {currentYear} (depuis le 1er janvier)
                  </p>
                  <p className={`text-sm font-semibold ${getReturnColor(activeMobilePortfolio.ytd2026)}`}>
                    {formatReturn(activeMobilePortfolio.ytd2026)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-prestige-taupe leading-tight">{prevYearLabel}</p>
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
                    index === mobileIndex ? 'w-4 bg-primary' : 'w-1.5 bg-prestige-beige'
                  }`}
                  aria-label={`Voir portefeuille ${portfolio.name}`}
                />
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-prestige-taupe mt-3">
          Donnees au {asOfLabel}. Portefeuilles modeles a titre indicatif seulement. Les rendements passes ne
          garantissent pas les rendements futurs.
        </p>
      </div>
    </section>
  );
};

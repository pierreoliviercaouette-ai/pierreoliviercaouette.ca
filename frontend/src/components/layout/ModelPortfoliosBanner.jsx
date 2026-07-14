import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { DEFAULT_MODEL_PORTFOLIOS, DEFAULT_MODEL_PORTFOLIOS_AS_OF } from '../../data/modelPortfolios';
import { PORTFOLIO_PROFILE_LIST } from '../../data/portfolioProfiles';

function getReturnColor(value) {
  if (value > 0) return 'text-emerald-700';
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

function PortfolioCard({ portfolio, currentYear, prevYearLabel }) {
  return (
    <Link
      to={portfolio.href}
      className="flex items-center gap-3 rounded-lg border border-prestige-beige bg-white px-3 py-2.5 hover:border-primary/40 hover:bg-light/40 transition-colors"
      data-testid={`portfolio-card-${portfolio.key}`}
    >
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-dark text-sm truncate">{portfolio.name}</p>
        <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs">
          <span className="text-prestige-taupe">AAJ {currentYear}</span>
          <span className={`text-right font-semibold tabular-nums ${getReturnColor(portfolio.ytd2026)}`}>
            {formatReturn(portfolio.ytd2026)}
          </span>
          <span className="text-prestige-taupe">{prevYearLabel}</span>
          <span className={`text-right font-medium tabular-nums ${getReturnColor(portfolio.yearPrev)}`}>
            {formatReturn(portfolio.yearPrev)}
          </span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-prestige-taupe shrink-0" aria-hidden />
    </Link>
  );
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

  useEffect(() => {
    const loadPortfolios = async () => {
      const { data: rows, error } = await supabase
        .from('model_portfolios')
        .select('key,name,ytd_2026,year_2025,href,as_of_date')
        .order('display_order', { ascending: true });
      if (error || !rows?.length) {
        setPortfolios(
          PORTFOLIO_PROFILE_LIST.map((p) => ({
            key: p.key,
            name: p.name,
            ytd2026: p.defaults.ytd,
            yearPrev: p.defaults.prevYear,
            href: p.href,
          }))
        );
        return;
      }
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

  const currentYear = new Date().getFullYear();

  return (
    <section className="bg-light border-b border-prestige-beige" aria-label="Apercu des portefeuilles modeles">
      <div className="container-max px-4 md:px-8 py-4">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="font-heading text-base font-semibold text-dark">Portefeuilles modèles</p>
          <p className="text-xs text-prestige-taupe shrink-0">Au {asOfLabel}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {portfolios.map((portfolio) => (
            <PortfolioCard
              key={portfolio.key}
              portfolio={portfolio}
              currentYear={currentYear}
              prevYearLabel={prevYearLabel}
            />
          ))}
        </div>

        <p className="text-xs text-prestige-taupe mt-3">
          Indicatif seulement. Les rendements passés ne garantissent pas les rendements futurs.
        </p>
      </div>
    </section>
  );
};

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { DEFAULT_MODEL_PORTFOLIOS_AS_OF } from '../../data/modelPortfolios';
import {
  PORTFOLIO_BANNER_DISCLAIMER,
  formatIsoDateLabelFr,
  formatReturnWithIncomplete,
} from '../../lib/portfolioCompliance';
import {
  buildDefaultFundPerfByCode,
  buildWeightedPortfolioCards,
  loadPortfolioFundPerfMap,
} from '../../lib/portfolioFundPerf';

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
          <span className="text-right font-semibold tabular-nums text-dark">
            {formatReturnWithIncomplete(portfolio.ytd2026, portfolio.ytdIncomplete)}
          </span>
          <span className="text-prestige-taupe">{prevYearLabel}</span>
          <span className="text-right font-medium tabular-nums text-dark">
            {formatReturnWithIncomplete(portfolio.yearPrev, portfolio.prevIncomplete)}
          </span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-prestige-taupe shrink-0" aria-hidden />
    </Link>
  );
}

export const ModelPortfoliosBanner = () => {
  const [portfolios, setPortfolios] = useState(() =>
    buildWeightedPortfolioCards(buildDefaultFundPerfByCode())
  );
  const [asOfLabel, setAsOfLabel] = useState(DEFAULT_MODEL_PORTFOLIOS_AS_OF);
  const [prevYearLabel, setPrevYearLabel] = useState(() => new Date().getFullYear() - 1);

  useEffect(() => {
    const loadPortfolios = async () => {
      const { perfByCode, asOfIso } = await loadPortfolioFundPerfMap(supabase);
      setPortfolios(buildWeightedPortfolioCards(perfByCode));
      setPrevYearLabel(new Date().getFullYear() - 1);
      if (asOfIso) {
        setAsOfLabel(formatIsoDateLabelFr(asOfIso) || asOfIso);
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
          <p className="text-xs text-prestige-taupe shrink-0">Au {asOfLabel} · CAD</p>
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

        <p className="text-xs text-prestige-taupe mt-3 leading-relaxed">{PORTFOLIO_BANNER_DISCLAIMER}</p>
      </div>
    </section>
  );
};

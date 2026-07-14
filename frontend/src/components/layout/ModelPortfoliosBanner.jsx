import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { DEFAULT_MODEL_PORTFOLIOS_AS_OF } from '../../data/modelPortfolios';
import {
  PORTFOLIO_BANNER_DISCLAIMER,
  PORTFOLIO_BANNER_PRODUCT_LINE,
  formatIsoDateLabelFr,
  formatReturnWithIncomplete,
} from '../../lib/portfolioCompliance';
import {
  buildEmptyPortfolioCards,
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
  const [portfolios, setPortfolios] = useState(buildEmptyPortfolioCards);
  const [asOfLabel, setAsOfLabel] = useState(DEFAULT_MODEL_PORTFOLIOS_AS_OF);
  const [prevYearLabel, setPrevYearLabel] = useState(() => new Date().getFullYear() - 1);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const loadPortfolios = async () => {
      const { perfByCode, asOfIso, modelPortfolioRows, loadError } =
        await loadPortfolioFundPerfMap(supabase);
      const cards = buildWeightedPortfolioCards(perfByCode, modelPortfolioRows);
      const hasAny = cards.some((c) => c.ytd2026 != null || c.yearPrev != null);
      setPortfolios(cards);
      setUnavailable(Boolean(loadError) && !hasAny);
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
        <div className="mb-2 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-3">
          <p className="font-heading text-base font-semibold text-dark">Portefeuilles modèles</p>
          <p className="text-xs text-prestige-taupe shrink-0">Au {asOfLabel} · CAD</p>
        </div>
        <p className="text-xs text-prestige-taupe mb-3 leading-snug">{PORTFOLIO_BANNER_PRODUCT_LINE}</p>

        {unavailable ? (
          <p className="text-sm text-prestige-taupe mb-2">
            Données de rendement temporairement indisponibles.
          </p>
        ) : (
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
        )}

        <p className="text-xs text-prestige-taupe mt-3 leading-relaxed">{PORTFOLIO_BANNER_DISCLAIMER}</p>
        <p className="text-xs mt-1">
          <Link to="/portefeuilles" className="text-primary hover:underline font-medium">
            Voir tous les portefeuilles
          </Link>
        </p>
      </div>
    </section>
  );
};

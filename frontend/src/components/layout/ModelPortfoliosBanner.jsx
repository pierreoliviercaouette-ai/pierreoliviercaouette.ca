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

/** Carte compacte pour le carrousel mobile */
function PortfolioScrollCard({ portfolio, currentYear }) {
  return (
    <Link
      to={portfolio.href}
      className="snap-start shrink-0 w-[9.5rem] rounded-lg border border-prestige-beige bg-white px-3 py-2 hover:border-primary/40 active:bg-light/40 transition-colors"
      data-testid={`portfolio-scroll-card-${portfolio.key}`}
    >
      <p className="font-semibold text-dark text-xs truncate">{portfolio.name}</p>
      <p className="mt-1 text-[10px] text-prestige-taupe leading-none">AAJ {currentYear}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums text-dark">
        {formatReturnWithIncomplete(portfolio.ytd2026, portfolio.ytdIncomplete)}
      </p>
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
      <div className="container-max px-4 md:px-8 py-2.5 sm:py-4">
        <div className="mb-1.5 sm:mb-2 flex items-baseline justify-between gap-2">
          <p className="font-heading text-sm sm:text-base font-semibold text-dark">
            Portefeuilles modèles
          </p>
          <p className="text-[10px] sm:text-xs text-prestige-taupe shrink-0">Au {asOfLabel} · CAD</p>
        </div>
        <p className="hidden sm:block text-xs text-prestige-taupe mb-3 leading-snug">
          {PORTFOLIO_BANNER_PRODUCT_LINE}
        </p>

        {unavailable ? (
          <p className="text-sm text-prestige-taupe mb-2">
            Données de rendement temporairement indisponibles.
          </p>
        ) : (
          <>
            {/* Mobile : carrousel horizontal compact */}
            <div className="sm:hidden -mx-4">
              <div
                className="flex gap-2 overflow-x-auto px-4 pb-1 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                role="list"
                aria-label="Portefeuilles modèles"
              >
                {portfolios.map((portfolio) => (
                  <div key={portfolio.key} role="listitem">
                    <PortfolioScrollCard portfolio={portfolio} currentYear={currentYear} />
                  </div>
                ))}
                <Link
                  to="/portefeuilles"
                  className="snap-start shrink-0 w-[7rem] rounded-lg border border-dashed border-primary/40 bg-white/60 px-3 py-2 flex flex-col justify-center items-center text-center hover:border-primary active:bg-light/40 transition-colors"
                >
                  <span className="text-[10px] font-medium text-primary leading-tight">
                    Voir tous
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-primary mt-0.5" aria-hidden />
                </Link>
              </div>
            </div>

            {/* Tablette / desktop : grille */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {portfolios.map((portfolio) => (
                <PortfolioCard
                  key={portfolio.key}
                  portfolio={portfolio}
                  currentYear={currentYear}
                  prevYearLabel={prevYearLabel}
                />
              ))}
            </div>
          </>
        )}

        <p className="hidden sm:block text-xs text-prestige-taupe mt-3 leading-relaxed">
          {PORTFOLIO_BANNER_DISCLAIMER}
        </p>
        <p className="hidden sm:block text-xs mt-1">
          <Link to="/portefeuilles" className="text-primary hover:underline font-medium">
            Voir tous les portefeuilles
          </Link>
        </p>
      </div>
    </section>
  );
};

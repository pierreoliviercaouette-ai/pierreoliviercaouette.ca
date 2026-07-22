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

function PortfolioScrollCard({ portfolio, currentYear, prevYearLabel }) {
  return (
    <Link
      to={portfolio.href}
      className="block h-full rounded-xl border border-prestige-beige bg-white px-4 py-3.5 shadow-sm active:bg-light/50"
      data-testid={`portfolio-scroll-card-${portfolio.key}`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <p className="font-heading font-semibold text-dark text-lg leading-tight truncate">
          {portfolio.name}
        </p>
        <ChevronRight className="w-5 h-5 text-primary shrink-0" aria-hidden />
      </div>

      <div className="flex gap-6">
        <div className="min-w-0">
          <p className="text-xs text-prestige-taupe whitespace-nowrap">AAJ {currentYear}</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-dark">
            {formatReturnWithIncomplete(portfolio.ytd2026, portfolio.ytdIncomplete)}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-xs text-prestige-taupe whitespace-nowrap">{prevYearLabel}</p>
          <p className="mt-1 text-xl font-medium tabular-nums text-dark">
            {formatReturnWithIncomplete(portfolio.yearPrev, portfolio.prevIncomplete)}
          </p>
        </div>
      </div>
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
      <div className="container-max px-4 md:px-8 py-3 sm:py-4">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <p className="font-heading text-base font-semibold text-dark">Portefeuilles modèles</p>
          <p className="text-xs text-prestige-taupe shrink-0">Au {asOfLabel} · CAD</p>
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
            {/* Mobile: scroll horizontal — largeur fixe obligatoire pour éviter le shrink flex */}
            <div className="sm:hidden">
              <div
                className="flex gap-3 overflow-x-auto overscroll-x-contain pb-1 -mx-4 px-4 snap-x snap-mandatory"
                style={{ WebkitOverflowScrolling: 'touch' }}
                role="list"
                aria-label="Portefeuilles modèles"
              >
                {portfolios.map((portfolio) => (
                  <div
                    key={portfolio.key}
                    role="listitem"
                    className="snap-center"
                    style={{ flex: '0 0 280px', width: 280, maxWidth: 280 }}
                  >
                    <PortfolioScrollCard
                      portfolio={portfolio}
                      currentYear={currentYear}
                      prevYearLabel={prevYearLabel}
                    />
                  </div>
                ))}
                <div
                  role="listitem"
                  className="snap-center"
                  style={{ flex: '0 0 140px', width: 140, maxWidth: 140 }}
                >
                  <Link
                    to="/portefeuilles"
                    className="flex h-full min-h-[5.5rem] flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-primary/40 bg-white px-3 text-center"
                  >
                    <span className="text-sm font-semibold text-primary">Voir tous</span>
                    <ChevronRight className="w-4 h-4 text-primary" aria-hidden />
                  </Link>
                </div>
              </div>
              <p className="pt-2 text-xs text-prestige-taupe">Glissez pour les autres profils →</p>
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
        <p className="mt-2 sm:mt-1">
          <Link to="/portefeuilles" className="text-sm sm:text-xs text-primary hover:underline font-medium">
            Voir tous les portefeuilles
          </Link>
        </p>
      </div>
    </section>
  );
};

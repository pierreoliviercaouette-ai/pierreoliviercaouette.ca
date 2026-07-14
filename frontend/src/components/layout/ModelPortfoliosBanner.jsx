import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { DEFAULT_MODEL_PORTFOLIOS, DEFAULT_MODEL_PORTFOLIOS_AS_OF } from '../../data/modelPortfolios';
import { getPortfolioProfile, PORTFOLIO_PROFILE_LIST } from '../../data/portfolioProfiles';

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

function RiskBars({ level, accent }) {
  return (
    <div className="flex items-end gap-0.5" aria-label={`Niveau de risque ${level} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="w-1 rounded-sm"
          style={{
            height: `${6 + i * 2}px`,
            backgroundColor: i <= level ? accent : '#e2dcd0',
          }}
        />
      ))}
    </div>
  );
}

function PortfolioCard({ portfolio, currentYear, prevYearLabel }) {
  const profile = getPortfolioProfile(portfolio.key);
  const accent = profile?.accent || '#064dd9';
  const riskLevel = profile?.riskLevel || 3;

  return (
    <Link
      to={portfolio.href}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-prestige-beige shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
      style={{ borderTopColor: accent, borderTopWidth: 3 }}
      data-testid={`portfolio-card-${portfolio.key}`}
    >
      <div className="px-4 pt-4 pb-3 flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="font-heading font-bold text-dark text-base leading-tight">{portfolio.name}</p>
            <p className="text-[10px] uppercase tracking-wider text-prestige-taupe mt-0.5">
              Profil {riskLevel}/5
            </p>
          </div>
          <RiskBars level={riskLevel} accent={accent} />
        </div>

        <div className="space-y-2">
          <div className="rounded-xl bg-light/80 px-3 py-2">
            <p className="text-[11px] text-prestige-taupe leading-tight">AAJ {currentYear}</p>
            <p className={`text-xl font-bold tabular-nums ${getReturnColor(portfolio.ytd2026)}`}>
              {formatReturn(portfolio.ytd2026)}
            </p>
          </div>
          <div className="flex items-baseline justify-between px-1">
            <p className="text-[11px] text-prestige-taupe">{prevYearLabel}</p>
            <p className={`text-sm font-semibold tabular-nums ${getReturnColor(portfolio.yearPrev)}`}>
              {formatReturn(portfolio.yearPrev)}
            </p>
          </div>
        </div>
      </div>

      <div
        className="px-4 py-2 text-xs font-semibold text-white flex items-center justify-between"
        style={{ backgroundColor: accent }}
      >
        Voir le détail
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
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
  const [mobileIndex, setMobileIndex] = useState(0);

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
    <section
      className="bg-gradient-to-b from-light to-white border-b border-prestige-beige"
      aria-label="Apercu des portefeuilles modeles"
    >
      <div className="container-max px-4 md:px-8 py-6">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <p className="font-heading text-lg font-bold text-dark">Mes portefeuilles modèles</p>
            <p className="text-xs text-prestige-taupe">
              Cinq profils de risque — cliquez pour composition, philosophie et fiches de fonds
            </p>
          </div>
          <p className="text-[11px] text-prestige-taupe">Données au {asOfLabel}</p>
        </div>

        <div className="hidden md:grid md:grid-cols-5 gap-3">
          {portfolios.map((portfolio) => (
            <PortfolioCard
              key={portfolio.key}
              portfolio={portfolio}
              currentYear={currentYear}
              prevYearLabel={prevYearLabel}
            />
          ))}
        </div>

        {activeMobilePortfolio && (
          <div className="md:hidden">
            <PortfolioCard
              portfolio={activeMobilePortfolio}
              currentYear={currentYear}
              prevYearLabel={prevYearLabel}
            />
            <div className="flex justify-center gap-1.5 mt-3">
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

        <p className="text-xs text-prestige-taupe mt-4">
          Portefeuilles modèles à titre indicatif seulement. Les rendements passés ne garantissent
          pas les rendements futurs. Les pondérations et agrégats peuvent différer des résultats
          réels d&apos;un compte client.
        </p>
      </div>
    </section>
  );
};

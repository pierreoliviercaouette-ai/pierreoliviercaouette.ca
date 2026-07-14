import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { DEFAULT_MODEL_PORTFOLIOS, DEFAULT_MODEL_PORTFOLIOS_AS_OF } from '../data/modelPortfolios';
import { getPortfolioProfile, getProfileHoldingsResolved } from '../data/portfolioProfiles';
import {
  PORTFOLIO_GENERAL_DISCLAIMER,
  PORTFOLIO_GUARANTEE_DISCLAIMER,
  PORTFOLIO_INCOMPLETE_HISTORY_NOTE,
  PORTFOLIO_MER_NOTE,
  PORTFOLIO_METHOD_NOTE,
  PORTFOLIO_PRODUCT_NOTICE,
  PORTFOLIO_RISK_SCALE_NOTE,
  formatIsoDateLabelFr,
  formatReturnWithIncomplete,
} from '../lib/portfolioCompliance';
import { computeWeightedPeriodReturns } from '../lib/portfolioCsvImport';
import { mergeFundRowsIntoPerfMap } from '../lib/portfolioFundPerf';
import { buildGrowthSeriesFromPeriodReturns } from '../lib/portfolioGrowth';
import { getFundFicheUrl } from '../lib/portfolioFiches';
import { useSeoMeta } from '../lib/seo';
import { supabase } from '../lib/supabaseClient';

const GROWTH_PRINCIPAL = 100000;

const ALLOCATION_COLORS = {
  revenu_fixe: '#01233f',
  actions_ca: '#064dd9',
  actions_us: '#73c4ef',
  actions_intl: '#0d9488',
  liquidites: '#756b5f',
  autres: '#e2dcd0',
};

const FUND_RETURN_COLUMNS = [
  { key: 'oneMonthPct', label: '1 mois' },
  { key: 'threeMonthPct', label: '3 mois' },
  { key: 'sixMonthPct', label: '6 mois' },
  { key: 'ytdPct', label: 'AAJ' },
  { key: 'oneYearPct', label: '1 an' },
  { key: 'threeYearPct', label: '3 ans' },
  { key: 'fiveYearPct', label: '5 ans' },
  { key: 'tenYearPct', label: '10 ans' },
];

const PORTFOLIO_PERIOD_COLUMNS = [
  { key: 'oneMonth', label: '1 mois' },
  { key: 'threeMonth', label: '3 mois' },
  { key: 'sixMonth', label: '6 mois' },
  { key: 'ytd', label: 'AAJ' },
  { key: 'oneYear', label: '1 an' },
  { key: 'threeYear', label: '3 ans' },
  { key: 'fiveYear', label: '5 ans' },
  { key: 'tenYear', label: '10 ans' },
];

function formatMoneyCad(value) {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(value);
}

function RiskBars({ level, accent }) {
  return (
    <div className="space-y-1">
      <div className="flex items-end gap-1" aria-label={`Niveau de risque indicatif ${level} sur 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="w-1.5 rounded-sm"
            style={{
              height: `${8 + i * 3}px`,
              backgroundColor: i <= level ? accent : '#e2dcd0',
            }}
          />
        ))}
      </div>
      <p className="text-[10px] text-prestige-taupe max-w-[9rem] leading-snug">Risque modèle {level}/5</p>
    </div>
  );
}

export const ModelPortfolioDetail = () => {
  const { slug } = useParams();
  const profile = getPortfolioProfile(slug);
  const fallbackPortfolio = DEFAULT_MODEL_PORTFOLIOS.find((item) => item.key === slug);
  const [portfolio, setPortfolio] = useState(fallbackPortfolio || null);
  const [asOfLabel, setAsOfLabel] = useState(DEFAULT_MODEL_PORTFOLIOS_AS_OF);
  const [asOfIso, setAsOfIso] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [fundPerfByCode, setFundPerfByCode] = useState({});
  const [incompleteByPeriod, setIncompleteByPeriod] = useState({});
  const [loading, setLoading] = useState(true);

  const staticHoldings = useMemo(
    () => (slug ? getProfileHoldingsResolved(slug) : []),
    [slug]
  );

  useEffect(() => {
    const loadPortfolio = async () => {
      if (!slug) return;
      setLoading(true);

      const { data: legacyRow } = await supabase
        .from('model_portfolios')
        .select('key,name,href,as_of_date,ytd_2026,year_2025,annualized_3y,annualized_5y')
        .eq('key', slug)
        .maybeSingle();

      const { data: def } = await supabase
        .from('portfolio_definitions')
        .select('id, key, name, href')
        .eq('key', slug)
        .maybeSingle();

      let snap = null;
      if (def?.id) {
        const { data: snapRow } = await supabase
          .from('portfolio_snapshots')
          .select('*')
          .eq('portfolio_definition_id', def.id)
          .order('computed_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        snap = snapRow;
      }

      const codes = staticHoldings.map((h) => h.fuCode).filter(Boolean);
      let perfByCode = {};

      if (codes.length) {
        const { data: fundRows } = await supabase
          .from('funds')
          .select(
            'external_code, ytd_pct, prev_year_pct, one_year_pct, three_year_pct, five_year_pct, ten_year_pct, perf_as_of, metadata'
          )
          .in('external_code', codes);
        perfByCode = mergeFundRowsIntoPerfMap({}, fundRows);
      }

      const {
        periodReturns: weighted,
        incompleteByPeriod: incomplete,
      } = computeWeightedPeriodReturns(staticHoldings, perfByCode);

      setPortfolio({
        key: slug,
        name: legacyRow?.name || profile?.name || fallbackPortfolio?.name || slug,
        ytd2026:
          weighted.ytd ??
          (legacyRow?.ytd_2026 != null ? Number(legacyRow.ytd_2026) : null) ??
          null,
        year2025:
          weighted.prevYear ??
          (legacyRow?.year_2025 != null ? Number(legacyRow.year_2025) : null) ??
          null,
        annualized3y:
          weighted.threeYear ??
          (legacyRow?.annualized_3y != null ? Number(legacyRow.annualized_3y) : null) ??
          null,
        annualized5y:
          weighted.fiveYear ??
          (legacyRow?.annualized_5y != null ? Number(legacyRow.annualized_5y) : null) ??
          null,
        href: legacyRow?.href || profile?.href || `/portefeuilles/${slug}`,
        periodReturns: weighted,
      });
      setIncompleteByPeriod(incomplete || {});
      setSnapshot(snap);
      setFundPerfByCode(perfByCode);

      const asOfCandidate =
        legacyRow?.as_of_date ||
        snap?.as_of_date ||
        Object.values(perfByCode).find((p) => p.perfAsOf)?.perfAsOf;
      if (asOfCandidate) {
        setAsOfIso(asOfCandidate);
        setAsOfLabel(formatIsoDateLabelFr(asOfCandidate) || asOfCandidate);
      }

      setLoading(false);
    };
    loadPortfolio();
  }, [slug, profile, fallbackPortfolio, staticHoldings]);

  const liveGrowth = useMemo(() => {
    const periodReturns = portfolio?.periodReturns;
    if (!periodReturns) return { series: [], meta: null };
    return buildGrowthSeriesFromPeriodReturns(
      periodReturns,
      incompleteByPeriod,
      asOfIso,
      GROWTH_PRINCIPAL
    );
  }, [portfolio?.periodReturns, incompleteByPeriod, asOfIso]);

  const chartData = useMemo(() => {
    // 1) Toujours prioriser la courbe recalculée depuis les mêmes rendements pondérés (CSV)
    if (liveGrowth.series.length > 1) {
      return liveGrowth.series.map((p) => ({
        label: p.label,
        v: p.value,
        display: p.value,
        year: p.year,
      }));
    }
    // 2) Snapshot importé (si déjà stocké)
    const ws = snapshot?.wealth_series;
    if (Array.isArray(ws) && ws.length > 1) {
      return ws.map((p) => ({
        label: p.label || p.month_date?.slice(0, 7) || String(p.year),
        v: Number(p.value),
        display: Number(p.value),
        year: p.year,
      }));
    }
    return [];
  }, [liveGrowth, snapshot]);

  const chartGrowthMeta = liveGrowth.meta || snapshot?.meta?.growth || null;

  const allocationData = useMemo(() => {
    const rows = (profile?.assetAllocation || []).filter((a) => Number(a.pct) > 0);
    return rows.map((a) => ({
      name: a.label,
      value: a.pct,
      key: a.key,
      color: ALLOCATION_COLORS[a.key] || ALLOCATION_COLORS.autres,
    }));
  }, [profile]);

  const ficheHoldings = useMemo(
    () =>
      staticHoldings
        .filter((h) => h.hasFiche && getFundFicheUrl(h.fuCode))
        .map((h) => ({ ...h, ficheUrl: getFundFicheUrl(h.fuCode) })),
    [staticHoldings]
  );
  const missingFicheHoldings = useMemo(
    () => staticHoldings.filter((h) => h.fuCode && !h.hasFiche),
    [staticHoldings]
  );

  const hasIncompleteHistory = useMemo(() => {
    const fromFunds = Object.values(fundPerfByCode).some(
      (perf) => Array.isArray(perf?.incompleteFields) && perf.incompleteFields.length > 0
    );
    const fromWeighted = Object.keys(incompleteByPeriod || {}).length > 0;
    return fromFunds || fromWeighted;
  }, [fundPerfByCode, incompleteByPeriod]);

  const periodReturns = portfolio?.periodReturns || null;
  const prevYear = new Date().getFullYear() - 1;
  const currentYear = new Date().getFullYear();

  useSeoMeta({
    title: portfolio
      ? `Portefeuille ${portfolio.name} | Rendements modeles`
      : 'Portefeuille modele',
    description: portfolio
      ? `Fiche detaillee du portefeuille ${portfolio.name}: philosophie, repartition, rendements et fiches de fonds.`
      : 'Fiche portefeuille modele.',
    canonicalPath: portfolio?.href ?? '/portefeuilles',
    noindex: true,
  });

  if (!loading && !profile && !portfolio) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-light flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const accent = profile?.accent || '#064dd9';

  return (
    <main className="min-h-screen bg-light" data-testid={`portfolio-detail-${slug}`}>
      <section className="section-padding">
        <div className="container-max max-w-5xl space-y-6">
          <Link to="/portefeuilles" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Tous les portefeuilles
          </Link>

          <div className="bg-white border border-prestige-beige rounded-2xl p-6 md:p-8 shadow-ia overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: accent }} />

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-prestige-taupe mb-1">
                  Portefeuille modèle
                </p>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-dark">
                  {portfolio.name}
                </h1>
                <p className="text-sm text-prestige-taupe mt-2">
                  Données de rendement au {asOfLabel}
                  <span className="text-prestige-taupe/80"> · série Classique 75/75 · CAD</span>
                </p>
                {profile?.merPct != null && (
                  <p className="text-xs text-prestige-taupe mt-1">
                    RFG du portefeuille (illustration) : {String(profile.merPct).replace('.', ',')} %
                  </p>
                )}
              </div>
              {profile && <RiskBars level={profile.riskLevel} accent={accent} />}
            </div>

            <p className="text-xs text-prestige-taupe leading-relaxed mb-2">{PORTFOLIO_RISK_SCALE_NOTE}</p>
            {profile?.merPct != null && (
              <p className="text-xs text-prestige-taupe leading-relaxed mb-4">{PORTFOLIO_MER_NOTE}</p>
            )}

            <div className="rounded-xl border border-prestige-beige bg-light/60 p-3 mb-4 space-y-2">
              <p className="text-xs text-prestige-taupe leading-relaxed">{PORTFOLIO_PRODUCT_NOTICE}</p>
              <p className="text-xs text-prestige-taupe leading-relaxed">{PORTFOLIO_GUARANTEE_DISCLAIMER}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
              {[
                {
                  label: `${currentYear} (AAJ)`,
                  value: portfolio.ytd2026,
                  incomplete: incompleteByPeriod.ytd,
                },
                {
                  label: `${prevYear} (année civile)`,
                  value: portfolio.year2025,
                  incomplete: incompleteByPeriod.prevYear,
                },
                {
                  label: '3 ans (annualisé)',
                  value: portfolio.annualized3y,
                  incomplete: incompleteByPeriod.threeYear,
                },
                {
                  label: '5 ans (annualisé)',
                  value: portfolio.annualized5y,
                  incomplete: incompleteByPeriod.fiveYear,
                },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-2xl bg-light border border-prestige-beige p-4">
                  <p className="text-sm text-prestige-taupe">{kpi.label}</p>
                  <p className="text-2xl font-semibold text-dark mt-1 tabular-nums">
                    {formatReturnWithIncomplete(kpi.value, kpi.incomplete)}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-prestige-taupe leading-relaxed mb-10">{PORTFOLIO_METHOD_NOTE}</p>

            {profile?.philosophy && (
              <div className="mb-10">
                <h2 className="font-heading text-xl font-bold text-dark mb-3">Philosophie du modèle</h2>
                <p className="text-prestige-taupe leading-relaxed mb-4">{profile.philosophy.summary}</p>
                <ul className="space-y-2">
                  {profile.philosophy.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-prestige-taupe">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: accent }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {allocationData.length > 0 && (
              <div className="mb-10">
                <h2 className="font-heading text-xl font-bold text-dark mb-4">
                  Répartition des actifs
                </h2>
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allocationData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={90}
                          paddingAngle={2}
                        >
                          {allocationData.map((entry) => (
                            <Cell key={entry.key} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => [`${v} %`, 'Poids']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="space-y-2">
                    {allocationData.map((a) => (
                      <li
                        key={a.key}
                        className="flex items-center justify-between text-sm border-b border-prestige-beige py-2"
                      >
                        <span className="flex items-center gap-2 text-dark">
                          <span
                            className="h-3 w-3 rounded-sm"
                            style={{ backgroundColor: a.color }}
                          />
                          {a.name}
                        </span>
                        <span className="font-semibold tabular-nums">{a.value} %</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {chartData.length > 1 && (
              <details className="mb-10 group rounded-xl border border-prestige-beige p-4" open>
                <summary className="font-heading text-xl font-bold text-dark cursor-pointer list-none flex items-center justify-between gap-3">
                  <span>Croissance du placement</span>
                  <span className="text-xs font-sans font-normal text-prestige-taupe group-open:hidden">
                    Afficher
                  </span>
                </summary>
                <p className="text-sm text-prestige-taupe mt-3 mb-4">
                  Illustration d’un placement de {formatMoneyCad(GROWTH_PRINCIPAL)} compoundé au
                  rendement annualisé pondéré sur{' '}
                  {chartGrowthMeta?.horizon_years ?? '—'} ans
                  {chartGrowthMeta?.annualized_pct != null
                    ? ` (${String(chartGrowthMeta.annualized_pct).replace('.', ',')} %)`
                    : ''}
                  , au {asOfLabel}. Mêmes chiffres que le tableau de rendements (import CSV). Le
                  chemin entre les années est une approximation à taux constant — ce n’est ni une
                  projection ni une garantie de résultats futurs
                  {chartGrowthMeta?.incomplete
                    ? ' ; l’horizon utilisé comporte un historique de fonds incomplet (*)'
                    : ''}
                  .
                </p>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-prestige-beige" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis
                        domain={['auto', 'auto']}
                        tick={{ fontSize: 11 }}
                        tickFormatter={(v) => `${Math.round(Number(v))}`}
                      />
                      <Tooltip
                        formatter={(_v, _n, item) => {
                          const money = item?.payload?.display;
                          return [formatMoneyCad(money), 'Valeur'];
                        }}
                        labelFormatter={(l) => l}
                      />
                      <Line
                        type="monotone"
                        dataKey="display"
                        stroke={accent}
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: accent }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </details>
            )}

            {periodReturns && (
              <div className="mb-10">
                <h2 className="font-heading text-xl font-bold text-dark mb-2">
                  Rendements du portefeuille
                </h2>
                <p className="text-xs text-prestige-taupe mb-4">{PORTFOLIO_METHOD_NOTE}</p>
                <div className="overflow-x-auto rounded-xl border border-prestige-beige">
                  <table className="w-full text-sm">
                    <thead className="bg-light">
                      <tr>
                        {PORTFOLIO_PERIOD_COLUMNS.map((col) => (
                          <th key={col.key} className="text-right p-3 font-semibold text-dark">
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {PORTFOLIO_PERIOD_COLUMNS.map((col) => (
                          <td key={col.key} className="p-3 text-right tabular-nums font-medium">
                            {formatReturnWithIncomplete(
                              periodReturns[col.key],
                              incompleteByPeriod[col.key]
                            )}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-prestige-taupe mt-2">
                  Date de référence : {asOfLabel}. Les périodes de 3 ans et plus sont annualisées
                  lorsque disponibles.
                </p>
                {hasIncompleteHistory && (
                  <p className="text-xs text-prestige-taupe mt-1">{PORTFOLIO_INCOMPLETE_HISTORY_NOTE}</p>
                )}
              </div>
            )}

            {staticHoldings.length > 0 && (
              <div className="mb-10">
                <h2 className="font-heading text-xl font-bold text-dark mb-2">
                  Rendements par fonds
                </h2>
                <p className="text-xs text-prestige-taupe mb-4">
                  Rendements nets des fonds (série Classique 75/75), au {asOfLabel}, en CAD. Les
                  périodes multi-années sont annualisées.
                </p>
                <div className="overflow-x-auto rounded-xl border border-prestige-beige">
                  <table className="w-full text-sm min-w-[720px]">
                    <thead className="bg-light">
                      <tr>
                        <th className="text-left p-3 sticky left-0 bg-light z-10">Fonds</th>
                        <th className="text-left p-3">Code</th>
                        <th className="text-right p-3">Poids</th>
                        {FUND_RETURN_COLUMNS.map((col) => (
                          <th key={col.key} className="text-right p-3 whitespace-nowrap">
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {staticHoldings.map((h) => {
                        const perf = fundPerfByCode[h.fuCode] || {};
                        const incomplete = new Set(perf.incompleteFields || []);
                        return (
                          <tr
                            key={`${h.fuCode}-${h.illustrationCode}`}
                            className="border-t border-prestige-beige"
                          >
                            <td className="p-3 text-dark sticky left-0 bg-white z-10 max-w-[200px]">
                              <span className="line-clamp-2">{h.name}</span>
                            </td>
                            <td className="p-3 text-prestige-taupe font-mono text-xs whitespace-nowrap">
                              {h.fuCode || h.illustrationCode}
                            </td>
                            <td className="p-3 text-right font-medium tabular-nums whitespace-nowrap">
                              {h.weightPct} %
                            </td>
                            {FUND_RETURN_COLUMNS.map((col) => (
                              <td
                                key={col.key}
                                className="p-3 text-right tabular-nums whitespace-nowrap"
                              >
                                {formatReturnWithIncomplete(
                                  perf[col.key],
                                  incomplete.has(col.key)
                                )}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {hasIncompleteHistory && (
                  <p className="text-xs text-prestige-taupe mt-2">{PORTFOLIO_INCOMPLETE_HISTORY_NOTE}</p>
                )}
              </div>
            )}

            {(ficheHoldings.length > 0 || missingFicheHoldings.length > 0) && (
              <div className="mb-8">
                <h2 className="font-heading text-xl font-bold text-dark mb-4">Fiches de fonds</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {ficheHoldings.map((h) => (
                    <a
                      key={h.fuCode}
                      href={h.ficheUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-xl border border-prestige-beige bg-light/50 px-4 py-3 hover:border-primary hover:bg-white transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-dark text-sm truncate">{h.name}</p>
                        <p className="text-xs text-prestige-taupe font-mono">{h.fuCode}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold shrink-0">
                        <Download className="w-4 h-4" />
                        PDF
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </span>
                    </a>
                  ))}
                  {missingFicheHoldings.map((h) => (
                    <div
                      key={h.fuCode}
                      className="flex flex-col gap-1 rounded-xl border border-dashed border-amber-300/80 bg-amber-50/40 px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-dark text-sm truncate">{h.name}</p>
                          <p className="text-xs text-prestige-taupe font-mono">{h.fuCode}</p>
                        </div>
                        <span className="text-xs text-amber-800 shrink-0 font-medium">
                          Fiche manquante
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-900/80 leading-snug">
                        Document non inclus dans le lot fourni — à obtenir auprès d&apos;iA avant
                        usage client. Les rendements CSV restent affichés.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-prestige-taupe leading-relaxed border-t border-prestige-beige pt-4 space-y-2">
              <p>{PORTFOLIO_GENERAL_DISCLAIMER}</p>
              <p>{PORTFOLIO_PRODUCT_NOTICE}</p>
              <p>{PORTFOLIO_METHOD_NOTE}</p>
              <p>{PORTFOLIO_GUARANTEE_DISCLAIMER}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

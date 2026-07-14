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
import {
  getDefaultFundPerformance,
  getPortfolioProfile,
  getProfileHoldingsResolved,
} from '../data/portfolioProfiles';
import { useSeoMeta } from '../lib/seo';
import { supabase } from '../lib/supabaseClient';

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

function formatReturn(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  const n = Number(value);
  const sign = n > 0 ? '+' : n < 0 ? '-' : '';
  const abs = Math.abs(n).toFixed(1).replace('.', ',');
  return `${sign}${abs} %`;
}

function formatMoneyCad(value) {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(value);
}

function pickPerfField(row, meta, column, metaKey) {
  if (row?.[column] != null && row[column] !== '') return Number(row[column]);
  if (meta?.[metaKey] != null && meta[metaKey] !== '') return Number(meta[metaKey]);
  return null;
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
    <div className="flex items-end gap-1" aria-label={`Niveau de risque ${level} sur 5`}>
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
  );
}

export const ModelPortfolioDetail = () => {
  const { slug } = useParams();
  const profile = getPortfolioProfile(slug);
  const fallbackPortfolio = DEFAULT_MODEL_PORTFOLIOS.find((item) => item.key === slug);
  const [portfolio, setPortfolio] = useState(fallbackPortfolio || null);
  const [asOfLabel, setAsOfLabel] = useState(DEFAULT_MODEL_PORTFOLIOS_AS_OF);
  const [snapshot, setSnapshot] = useState(null);
  const [fundPerfByCode, setFundPerfByCode] = useState({});
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
        .select('key,name,ytd_2026,year_2025,annualized_3y,annualized_5y,href,as_of_date')
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
      const perfByCode = {};
      for (const code of codes) {
        const defaults = getDefaultFundPerformance(code);
        if (defaults) perfByCode[code] = { ...defaults };
      }
      if (codes.length) {
        const { data: fundRows } = await supabase
          .from('funds')
          .select(
            'external_code, ytd_pct, prev_year_pct, one_year_pct, three_year_pct, five_year_pct, ten_year_pct, metadata'
          )
          .in('external_code', codes);

        for (const row of fundRows || []) {
          const meta = row.metadata || {};
          const defaults = getDefaultFundPerformance(row.external_code) || {};
          perfByCode[row.external_code] = {
            ytdPct: pickPerfField(row, meta, 'ytd_pct', 'ytd_pct') ?? defaults.ytdPct ?? null,
            prevYearPct:
              pickPerfField(row, meta, 'prev_year_pct', 'prev_year_pct') ?? defaults.prevYearPct ?? null,
            oneMonthPct:
              pickPerfField(row, meta, null, 'one_month_pct') ?? defaults.oneMonthPct ?? null,
            threeMonthPct:
              pickPerfField(row, meta, null, 'three_month_pct') ?? defaults.threeMonthPct ?? null,
            sixMonthPct:
              pickPerfField(row, meta, null, 'six_month_pct') ?? defaults.sixMonthPct ?? null,
            oneYearPct:
              pickPerfField(row, meta, 'one_year_pct', 'one_year_pct') ?? defaults.oneYearPct ?? null,
            threeYearPct:
              pickPerfField(row, meta, 'three_year_pct', 'three_year_pct') ??
              defaults.threeYearPct ??
              null,
            fiveYearPct:
              pickPerfField(row, meta, 'five_year_pct', 'five_year_pct') ?? defaults.fiveYearPct ?? null,
            tenYearPct:
              pickPerfField(row, meta, 'ten_year_pct', 'ten_year_pct') ?? defaults.tenYearPct ?? null,
          };
        }
      }

      const defaults = profile?.defaults;
      setPortfolio({
        key: slug,
        name: legacyRow?.name || profile?.name || fallbackPortfolio?.name || slug,
        ytd2026: legacyRow
          ? Number(legacyRow.ytd_2026)
          : snap?.ytd_pct != null
            ? Number(snap.ytd_pct)
            : defaults?.ytd ?? fallbackPortfolio?.ytd2026 ?? null,
        year2025: legacyRow
          ? Number(legacyRow.year_2025)
          : snap?.prev_civil_year_pct != null
            ? Number(snap.prev_civil_year_pct)
            : defaults?.prevYear ?? fallbackPortfolio?.year2025 ?? null,
        annualized3y: legacyRow
          ? Number(legacyRow.annualized_3y)
          : snap?.rolling_3y_pct != null
            ? Number(snap.rolling_3y_pct)
            : defaults?.annualized3y ?? fallbackPortfolio?.annualized3y ?? null,
        annualized5y: legacyRow
          ? Number(legacyRow.annualized_5y)
          : snap?.rolling_5y_pct != null
            ? Number(snap.rolling_5y_pct)
            : defaults?.annualized5y ?? fallbackPortfolio?.annualized5y ?? null,
        href: legacyRow?.href || profile?.href || `/portefeuilles/${slug}`,
      });
      setSnapshot(snap);
      setFundPerfByCode(perfByCode);

      if (legacyRow?.as_of_date || snap?.as_of_date) {
        setAsOfLabel(formatIsoDateLabel(legacyRow?.as_of_date || snap.as_of_date));
      }

      setLoading(false);
    };
    loadPortfolio();
  }, [slug, profile, fallbackPortfolio, staticHoldings]);

  const chartData = useMemo(() => {
    const ws = snapshot?.wealth_series;
    if (Array.isArray(ws) && ws.length > 1) {
      return ws.map((p) => ({
        label: p.month_date?.slice(0, 7) || p.label,
        v: Number(p.value),
        display: Number(p.value),
      }));
    }
    const series = profile?.growthSeries;
    if (!Array.isArray(series) || series.length < 2) return [];
    const base = Number(series[0].value) || 100000;
    return series.map((p) => ({
      label: String(p.year),
      v: (Number(p.value) / base) * 100,
      display: Number(p.value),
      year: p.year,
    }));
  }, [snapshot, profile]);

  const chartIsMoney = useMemo(() => {
    const ws = snapshot?.wealth_series;
    return !(Array.isArray(ws) && ws.length > 1);
  }, [snapshot]);

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
    () => staticHoldings.filter((h) => h.fichePath),
    [staticHoldings]
  );

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
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
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
                <p className="text-sm text-prestige-taupe mt-2">Données au {asOfLabel}</p>
                {profile?.merPct != null && (
                  <p className="text-xs text-prestige-taupe mt-1">
                    RFG du portefeuille (illustration) : {String(profile.merPct).replace('.', ',')} %
                  </p>
                )}
              </div>
              {profile && <RiskBars level={profile.riskLevel} accent={accent} />}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { label: `${currentYear} (AAJ)`, value: portfolio.ytd2026 },
                { label: `${prevYear} (année civile)`, value: portfolio.year2025 },
                { label: '3 ans (annualisé)', value: portfolio.annualized3y },
                { label: '5 ans (annualisé)', value: portfolio.annualized5y },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-2xl bg-light border border-prestige-beige p-4">
                  <p className="text-sm text-prestige-taupe">{kpi.label}</p>
                  <p className="text-2xl font-semibold text-dark mt-1 tabular-nums">
                    {formatReturn(kpi.value)}
                  </p>
                </div>
              ))}
            </div>

            {profile?.philosophy && (
              <div className="mb-10">
                <h2 className="font-heading text-xl font-bold text-dark mb-3">Philosophie</h2>
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
              <div className="mb-10">
                <h2 className="font-heading text-xl font-bold text-dark mb-2">
                  Croissance du placement
                </h2>
                <p className="text-sm text-prestige-taupe mb-4">
                  {chartIsMoney
                    ? 'Illustration : évolution d’un placement de 100 000 $ (fin d’année civile).'
                    : 'Série reconstruite (base 100).'}
                </p>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-prestige-beige" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis
                        domain={['auto', 'auto']}
                        tick={{ fontSize: 11 }}
                        tickFormatter={(v) =>
                          chartIsMoney ? `${Math.round(Number(v))}` : Number(v).toFixed(0)
                        }
                      />
                      <Tooltip
                        formatter={(v, _n, item) => {
                          const money = item?.payload?.display;
                          if (chartIsMoney && money != null) {
                            return [formatMoneyCad(money), 'Valeur'];
                          }
                          return [`${Number(v).toFixed(2)}`, 'Indice'];
                        }}
                        labelFormatter={(l) => (chartIsMoney ? `Fin ${l}` : l)}
                      />
                      <Line
                        type="monotone"
                        dataKey={chartIsMoney ? 'display' : 'v'}
                        stroke={accent}
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: accent }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {profile?.periodReturns && (
              <div className="mb-10">
                <h2 className="font-heading text-xl font-bold text-dark mb-4">
                  Rendements du portefeuille
                </h2>
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
                            {formatReturn(profile.periodReturns[col.key])}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-prestige-taupe mt-2">
                  Rendements nets illustratifs (portefeuille modèle). Les périodes de 3 ans et plus sont
                  annualisées lorsque disponibles.
                </p>
              </div>
            )}

            {staticHoldings.length > 0 && (
              <div className="mb-10">
                <h2 className="font-heading text-xl font-bold text-dark mb-4">
                  Rendements par fonds
                </h2>
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
                        const perf = fundPerfByCode[h.fuCode] || getDefaultFundPerformance(h.fuCode) || {};
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
                                {formatReturn(perf[col.key])}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-prestige-taupe mt-2">
                  Rendements nets des fonds (série Classique 75/75). Mis à jour via import CSV admin ;
                  les périodes multi-années sont annualisées.
                </p>
              </div>
            )}

            {ficheHoldings.length > 0 && (
              <div className="mb-8">
                <h2 className="font-heading text-xl font-bold text-dark mb-4">Fiches de fonds</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {ficheHoldings.map((h) => (
                    <a
                      key={h.fuCode}
                      href={h.fichePath}
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
                </div>
              </div>
            )}

            <p className="text-xs text-prestige-taupe leading-relaxed border-t border-prestige-beige pt-4">
              Illustration de portefeuille modèle à titre indicatif seulement — ceci ne constitue
              pas un conseil personnalisé. Les rendements passés ne garantissent pas les
              rendements futurs. Les KPI de portefeuille mis à jour via import CSV sont des
              moyennes pondérées des rendements des fonds (méthode indicative) ; les résultats
              réels d&apos;un compte peuvent différer. Bien que les fonds distincts offrent des
              garanties, leur valeur change fréquemment.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

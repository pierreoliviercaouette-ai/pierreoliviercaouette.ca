import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { DEFAULT_MODEL_PORTFOLIOS, DEFAULT_MODEL_PORTFOLIOS_AS_OF } from '../data/modelPortfolios';
import { useSeoMeta } from '../lib/seo';
import { supabase } from '../lib/supabaseClient';

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

export const ModelPortfolioDetail = () => {
  const { slug } = useParams();
  const fallbackPortfolio = DEFAULT_MODEL_PORTFOLIOS.find((item) => item.key === slug);
  const [portfolio, setPortfolio] = useState(fallbackPortfolio || null);
  const [asOfLabel, setAsOfLabel] = useState(DEFAULT_MODEL_PORTFOLIOS_AS_OF);
  const [snapshot, setSnapshot] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [fundPerfById, setFundPerfById] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortfolio = async () => {
      if (!slug) return;
      setLoading(true);
      const { data: legacyRow } = await supabase
        .from('model_portfolios')
        .select('key,name,ytd_2026,year_2025,annualized_3y,annualized_5y,href,as_of_date')
        .eq('key', slug)
        .maybeSingle();

      const { data: def, error: dErr } = await supabase
        .from('portfolio_definitions')
        .select('id, key, name, href')
        .eq('key', slug)
        .maybeSingle();

      if (dErr || !def) {
        const { data: legacy, error: lErr } = await supabase
          .from('model_portfolios')
          .select('key,name,ytd_2026,year_2025,href,as_of_date')
          .eq('key', slug)
          .maybeSingle();

        if (lErr || !legacy) {
          setLoading(false);
          return;
        }
        setPortfolio({
          key: legacy.key,
          name: legacy.name,
          ytd2026: Number(legacy.ytd_2026),
          year2025: Number(legacy.year_2025),
          annualized3y: Number(legacy.annualized_3y),
          annualized5y: Number(legacy.annualized_5y),
          href: legacy.href,
        });
        if (legacy.as_of_date) {
          setAsOfLabel(formatIsoDateLabel(legacy.as_of_date));
        }
        setSnapshot(null);
        setHoldings([]);
        setFundPerfById({});
        setLoading(false);
        return;
      }

      const { data: snap } = await supabase
        .from('portfolio_snapshots')
        .select('*')
        .eq('portfolio_definition_id', def.id)
        .order('computed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: effRow } = await supabase
        .from('portfolio_holdings')
        .select('effective_from')
        .eq('portfolio_definition_id', def.id)
        .order('effective_from', { ascending: false })
        .limit(1)
        .maybeSingle();

      let holdRows = [];
      if (effRow?.effective_from) {
        const { data: h } = await supabase
          .from('portfolio_holdings')
          .select('weight_pct, sort_order, fund_id, funds ( name, external_code )')
          .eq('portfolio_definition_id', def.id)
          .eq('effective_from', effRow.effective_from)
          .order('sort_order', { ascending: true });
        holdRows = h || [];
      }

      const fundIds = holdRows.map((r) => r.fund_id).filter(Boolean);
      const perfById = {};
      if (fundIds.length) {
        const { data: fundMonthlyRows } = await supabase
          .from('fund_monthly_returns')
          .select('fund_id, month_date, return_pct')
          .in('fund_id', fundIds)
          .order('month_date', { ascending: true });

        const byFund = {};
        for (const row of fundMonthlyRows || []) {
          if (!byFund[row.fund_id]) byFund[row.fund_id] = [];
          byFund[row.fund_id].push({
            month_date: row.month_date,
            return_pct: Number(row.return_pct),
          });
        }

        const anchorMonth = snap?.meta?.anchor_month || null;
        for (const fundId of fundIds) {
          const arr = byFund[fundId] || [];
          if (!arr.length) {
            perfById[fundId] = { ytdPct: null, oneYearPct: null };
            continue;
          }

          const asOfMonth = anchorMonth || arr[arr.length - 1].month_date;
          const [asOfYear, asOfMonthNum] = asOfMonth.split('-').map((x) => parseInt(x, 10));

          const ytdRows = arr.filter((r) => {
            const [yy, mm] = r.month_date.split('-').map((x) => parseInt(x, 10));
            return yy === asOfYear && mm <= asOfMonthNum;
          });
          let ytdFactor = 1;
          for (const r of ytdRows) ytdFactor *= 1 + r.return_pct / 100;
          const ytdPct = ytdRows.length ? (ytdFactor - 1) * 100 : null;

          const idx = arr.findIndex((r) => r.month_date === asOfMonth);
          const last12 = idx >= 0 ? arr.slice(Math.max(0, idx - 11), idx + 1) : [];
          let oneYearFactor = 1;
          for (const r of last12) oneYearFactor *= 1 + r.return_pct / 100;
          const oneYearPct = last12.length === 12 ? (oneYearFactor - 1) * 100 : null;

          perfById[fundId] = { ytdPct, oneYearPct };
        }
      }

      setPortfolio({
        key: def.key,
        name: legacyRow?.name || def.name,
        ytd2026: legacyRow ? Number(legacyRow.ytd_2026) : snap?.ytd_pct != null ? Number(snap.ytd_pct) : null,
        year2025: legacyRow
          ? Number(legacyRow.year_2025)
          : snap?.prev_civil_year_pct != null
            ? Number(snap.prev_civil_year_pct)
            : null,
        annualized3y: legacyRow ? Number(legacyRow.annualized_3y) : snap?.rolling_3y_pct != null ? Number(snap.rolling_3y_pct) : null,
        annualized5y: legacyRow ? Number(legacyRow.annualized_5y) : snap?.rolling_5y_pct != null ? Number(snap.rolling_5y_pct) : null,
        href: legacyRow?.href || def.href,
      });
      setSnapshot(snap);
      setHoldings(holdRows);
      setFundPerfById(perfById);

      if (legacyRow?.as_of_date || snap?.as_of_date) {
        setAsOfLabel(formatIsoDateLabel(legacyRow?.as_of_date || snap.as_of_date));
      }

      setLoading(false);
    };
    loadPortfolio();
  }, [slug]);

  const chartData = useMemo(() => {
    const ws = snapshot?.wealth_series;
    if (!Array.isArray(ws) || !ws.length) return [];
    return ws.map((p) => ({
      t: p.month_date,
      label: p.month_date?.slice(0, 7),
      v: Number(p.value),
    }));
  }, [snapshot]);

  const prevYear = new Date().getFullYear() - 1;
  const currentYear = new Date().getFullYear();

  useSeoMeta({
    title: portfolio
      ? `Portefeuille ${portfolio.name} | Rendements modeles`
      : 'Portefeuille modele',
    description: portfolio
      ? `Fiche detaillee du portefeuille ${portfolio.name}: rendements, composition et historique.`
      : 'Fiche portefeuille modele.',
    canonicalPath: portfolio?.href ?? '/portefeuilles',
  });

  if (!loading && !portfolio) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <main className="pt-20 min-h-screen bg-light flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen bg-light">
      <section className="section-padding">
        <div className="container-max max-w-4xl">
          <Link to="/" className="text-sm text-primary hover:underline">
            Retour a l accueil
          </Link>

          <div className="mt-4 bg-white border border-prestige-beige rounded-2xl p-6 md:p-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-2">
              Portefeuille {portfolio.name}
            </h1>
            <p className="text-sm text-prestige-taupe mb-6">Donnees au {asOfLabel}</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="rounded-xl bg-light border border-prestige-beige p-4">
                <p className="text-sm text-prestige-taupe">{currentYear} (YTD)</p>
                <p className="text-2xl font-semibold text-dark mt-1">{formatReturn(portfolio.ytd2026)}</p>
              </div>
              <div className="rounded-xl bg-light border border-prestige-beige p-4">
                <p className="text-sm text-prestige-taupe">{prevYear} (annee civile)</p>
                <p className="text-2xl font-semibold text-dark mt-1">{formatReturn(portfolio.year2025)}</p>
              </div>
              <div className="rounded-xl bg-light border border-prestige-beige p-4">
                <p className="text-sm text-prestige-taupe">3 ans (annualise)</p>
                <p className="text-2xl font-semibold text-dark mt-1">
                  {formatReturn(portfolio.annualized3y)}
                </p>
              </div>
              <div className="rounded-xl bg-light border border-prestige-beige p-4">
                <p className="text-sm text-prestige-taupe">5 ans (annualise)</p>
                <p className="text-2xl font-semibold text-dark mt-1">
                  {formatReturn(portfolio.annualized5y)}
                </p>
              </div>
            </div>

            {chartData.length > 1 && (
              <div className="mb-8">
                <h2 className="font-heading text-lg font-semibold text-dark mb-3">
                  Evolution (base 100, reconstruite)
                </h2>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-prestige-beige" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
                      <Tooltip
                        formatter={(v) => [`${Number(v).toFixed(2)}`, 'Valeur']}
                        labelFormatter={(l) => l}
                      />
                      <Line type="monotone" dataKey="v" stroke="#1e3a5f" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {holdings.length > 0 && (
              <div className="mb-4">
                <h2 className="font-heading text-lg font-semibold text-dark mb-3">Composition</h2>
                <div className="overflow-x-auto rounded-xl border border-prestige-beige">
                  <table className="w-full text-sm">
                    <thead className="bg-light">
                      <tr>
                        <th className="text-left p-3">Fonds</th>
                        <th className="text-right p-3">AAJ fonds</th>
                        <th className="text-right p-3">1 an fonds</th>
                        <th className="text-right p-3">Poids</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holdings.map((h) => (
                        <tr key={h.fund_id} className="border-t border-prestige-beige">
                          <td className="p-3">
                            {h.funds?.name || 'Fonds'}
                            {h.funds?.external_code ? (
                              <span className="text-prestige-taupe ml-2">{h.funds.external_code}</span>
                            ) : null}
                          </td>
                          <td className="p-3 text-right">{formatReturn(fundPerfById[h.fund_id]?.ytdPct)}</td>
                          <td className="p-3 text-right">{formatReturn(fundPerfById[h.fund_id]?.oneYearPct)}</td>
                          <td className="p-3 text-right font-medium">{Number(h.weight_pct).toFixed(2)} %</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <p className="text-sm text-prestige-taupe mt-6">
              Les rendements du portefeuille modele sont calcules a partir des rendements des fonds importes et des
              ponderations affichees. Methodes indicatives; les resultats reels peuvent differer.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

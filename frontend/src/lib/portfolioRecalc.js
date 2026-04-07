import {
  buildMonthlyReturnsFromAnnualAndYtd,
  computePortfolioMonthlySeries,
  compoundWealthFromMonthly,
  computeSnapshotKpis,
} from './portfolioEngine';

function endOfMonthIsoFromMonthFirst(monthFirst) {
  const [y, m] = monthFirst.split('-').map((x) => parseInt(x, 10));
  const d = new Date(y, m, 0);
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${String(m).padStart(2, '0')}-${dd}`;
}

/**
 * Load holdings for each definition at latest effective_from.
 */
async function loadLatestHoldingsMap(supabase) {
  const { data: defs, error: dErr } = await supabase.from('portfolio_definitions').select('id, key');
  if (dErr) throw dErr;
  const result = new Map();
  for (const def of defs || []) {
    const { data: effRows } = await supabase
      .from('portfolio_holdings')
      .select('effective_from')
      .eq('portfolio_definition_id', def.id)
      .order('effective_from', { ascending: false })
      .limit(1);
    const eff = effRows?.[0]?.effective_from;
    if (!eff) {
      result.set(def.id, []);
      continue;
    }
    const { data: holds, error: hErr } = await supabase
      .from('portfolio_holdings')
      .select('fund_id, weight_pct')
      .eq('portfolio_definition_id', def.id)
      .eq('effective_from', eff)
      .order('sort_order', { ascending: true });
    if (hErr) throw hErr;
    result.set(def.id, holds || []);
  }
  return { defs: defs || [], holdingsByDefId: result };
}

async function loadFundReturnsMap(supabase, fundIds) {
  if (!fundIds.length) return new Map();
  const { data, error } = await supabase
    .from('fund_monthly_returns')
    .select('fund_id, month_date, return_pct')
    .in('fund_id', fundIds)
    .order('month_date', { ascending: true });
  if (error) throw error;
  const map = new Map();
  for (const fid of fundIds) map.set(fid, []);
  for (const row of data || []) {
    const arr = map.get(row.fund_id) || [];
    arr.push({ month_date: row.month_date, return_pct: Number(row.return_pct) });
    map.set(row.fund_id, arr);
  }
  return map;
}

/**
 * Recalculate snapshots for all portfolio definitions. Updates `portfolio_snapshots`
 * and syncs `model_portfolios` for legacy banner consumers.
 */
export async function recalculateAllModelPortfolios(supabase) {
  const { defs, holdingsByDefId } = await loadLatestHoldingsMap(supabase);
  const allFundIds = new Set();
  for (const holds of holdingsByDefId.values()) {
    for (const h of holds) allFundIds.add(h.fund_id);
  }
  const byFundId = await loadFundReturnsMap(supabase, [...allFundIds]);

  const snapshots = [];

  for (const def of defs) {
    const holds = holdingsByDefId.get(def.id) || [];
    const weightSum = holds.reduce((s, h) => s + Number(h.weight_pct || 0), 0);
    if (!holds.length || Math.abs(weightSum - 100) > 0.02) {
      continue;
    }

    const weights = {};
    for (const h of holds) {
      weights[h.fund_id] = Number(h.weight_pct);
    }

    const monthly = computePortfolioMonthlySeries(weights, byFundId);
    if (!monthly.length) continue;

    const lastMonth = monthly[monthly.length - 1].month_date;
    const wealth = compoundWealthFromMonthly(monthly, 100);
    const kpis = computeSnapshotKpis(monthly, lastMonth);
    const asOfIso = endOfMonthIsoFromMonthFirst(lastMonth);

    const row = {
      portfolio_definition_id: def.id,
      as_of_date: asOfIso,
      ytd_pct: kpis.ytd_pct,
      prev_civil_year: kpis.prev_civil_year,
      prev_civil_year_pct: kpis.prev_civil_year_pct,
      rolling_1y_pct: kpis.rolling_1y_pct,
      rolling_3y_pct: kpis.rolling_3y_pct,
      rolling_5y_pct: kpis.rolling_5y_pct,
      rolling_10y_pct: kpis.rolling_10y_pct,
      wealth_series: wealth,
      monthly_series: monthly,
      meta: {
        anchor_month: kpis.anchor_month,
        weights,
        engine: 'intersection_monthly_blend_v1',
      },
    };
    snapshots.push({ defKey: def.key, row });
  }

  for (const { defKey, row } of snapshots) {
    const { error } = await supabase.from('portfolio_snapshots').insert(row);
    if (error) throw error;

    const ytd = row.ytd_pct ?? 0;
    const prev = row.prev_civil_year_pct ?? 0;
    const { error: mErr } = await supabase
      .from('model_portfolios')
      .update({
        ytd_2026: ytd,
        year_2025: prev,
        as_of_date: row.as_of_date,
      })
      .eq('key', defKey);
    if (mErr) console.warn('model_portfolios sync', defKey, mErr.message);
  }

  return { count: snapshots.length };
}

/**
 * Persist monthly rows for one fund from annual + YTD, then recalc portfolios.
 */
export async function persistFundMonthlyReturns(supabase, fundId, annualByYear, ytdPct, asOfDateIso) {
  const rows = buildMonthlyReturnsFromAnnualAndYtd(annualByYear, ytdPct, asOfDateIso);
  const { error: delErr } = await supabase.from('fund_monthly_returns').delete().eq('fund_id', fundId);
  if (delErr) throw delErr;
  if (rows.length) {
    const payload = rows.map((r) => ({
      fund_id: fundId,
      month_date: r.month_date,
      return_pct: r.return_pct,
    }));
    const { error: insErr } = await supabase.from('fund_monthly_returns').insert(payload);
    if (insErr) throw insErr;
  }
  return recalculateAllModelPortfolios(supabase);
}

/**
 * Upsert fund row + replace monthly returns from parsed PDF, then recalc portfolios.
 */
export async function upsertFundFromParsed(supabase, parsed) {
  const asOf = parsed.asOfDate || new Date().toISOString().slice(0, 10);
  let fundId;

  if (parsed.externalCode) {
    const { data, error } = await supabase
      .from('funds')
      .upsert(
        {
          external_code: parsed.externalCode,
          name: parsed.fundName,
          category: parsed.category,
          source: 'pdf_import',
          is_active: true,
        },
        { onConflict: 'external_code' }
      )
      .select('id')
      .single();
    if (error) throw error;
    fundId = data.id;
  } else {
    const { data: found } = await supabase
      .from('funds')
      .select('id')
      .eq('name', parsed.fundName)
      .maybeSingle();
    if (found?.id) {
      fundId = found.id;
      const { error: uErr } = await supabase
        .from('funds')
        .update({
          category: parsed.category,
          source: 'pdf_import',
          is_active: true,
        })
        .eq('id', fundId);
      if (uErr) throw uErr;
    } else {
      const { data: ins, error: iErr } = await supabase
        .from('funds')
        .insert({
          name: parsed.fundName,
          category: parsed.category,
          source: 'pdf_import',
          is_active: true,
        })
        .select('id')
        .single();
      if (iErr) throw iErr;
      fundId = ins.id;
    }
  }

  return persistFundMonthlyReturns(supabase, fundId, parsed.annualByYear, parsed.ytdPct, asOf);
}

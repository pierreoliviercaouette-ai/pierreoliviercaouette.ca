import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCad, formatCompactCad } from '../../lib/illustrateur';

export const DASH_COLORS = {
  blue: '#064dd9',
  navy: '#01233f',
  sky: '#73c4ef',
  taupe: '#756b5f',
  beige: '#e8e0d4',
  green: '#166534',
  amber: '#b45309',
  rose: '#9f1239',
  mint: '#0f766e',
};

export const PIE_PALETTE = [
  DASH_COLORS.blue,
  DASH_COLORS.navy,
  DASH_COLORS.sky,
  DASH_COLORS.mint,
  DASH_COLORS.amber,
  DASH_COLORS.taupe,
  DASH_COLORS.rose,
];

function tipStyle() {
  return {
    borderRadius: 12,
    border: '1px solid #e8e0d4',
    background: '#fff',
    fontSize: 12,
    boxShadow: '0 8px 24px rgba(1,35,63,0.08)',
  };
}

export function Sparkline({ data, color = DASH_COLORS.blue, positive = true }) {
  if (!data?.length) return null;
  return (
    <div className="h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            fill={`url(#spark-${color.replace('#', '')})`}
            isAnimationActive
            animationDuration={700}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      <span className="sr-only">{positive ? 'tendance' : 'tendance'}</span>
    </div>
  );
}

export function NetWorthChart({ data, compareKey = null, height = 340 }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="nwFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={DASH_COLORS.blue} stopOpacity={0.28} />
              <stop offset="100%" stopColor={DASH_COLORS.blue} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={DASH_COLORS.beige} vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: DASH_COLORS.taupe }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={formatCompactCad}
            tick={{ fontSize: 11, fill: DASH_COLORS.taupe }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip formatter={(v, name) => [formatCad(v), name]} contentStyle={tipStyle()} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="assets"
            name="Actifs"
            stroke={DASH_COLORS.sky}
            fill={DASH_COLORS.sky}
            fillOpacity={0.18}
            strokeWidth={1.5}
            isAnimationActive
            animationDuration={900}
          />
          <Area
            type="monotone"
            dataKey="debtsAbs"
            name="Dettes"
            stroke={DASH_COLORS.rose}
            fill={DASH_COLORS.rose}
            fillOpacity={0.12}
            strokeWidth={1.5}
            isAnimationActive
            animationDuration={900}
          />
          <Line
            type="monotone"
            dataKey="netWorth"
            name="Valeur nette"
            stroke={DASH_COLORS.navy}
            strokeWidth={3}
            dot={false}
            isAnimationActive
            animationDuration={1100}
          />
          {compareKey && (
            <Line
              type="monotone"
              dataKey={compareKey}
              name="Scénario B"
              stroke={DASH_COLORS.amber}
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              isAnimationActive
              animationDuration={1100}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CashflowChart({ data, height = 260 }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DASH_COLORS.beige} vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: DASH_COLORS.taupe }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={formatCompactCad}
            tick={{ fontSize: 11, fill: DASH_COLORS.taupe }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip formatter={(v, name) => [formatCad(v), name]} contentStyle={tipStyle()} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar
            dataKey="cashflow"
            name="Cashflow après impôt"
            radius={[6, 6, 0, 0]}
            isAnimationActive
            animationDuration={800}
          >
            {data.map((row, i) => (
              <Cell key={i} fill={(row.cashflow || 0) >= 0 ? DASH_COLORS.blue : DASH_COLORS.rose} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AllocationDonut({ data, height = 260, title }) {
  const total = data.reduce((s, d) => s + (d.value || 0), 0);
  return (
    <div className="relative" style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="58%"
            outerRadius="82%"
            paddingAngle={2}
            isAnimationActive
            animationDuration={900}
          >
            {data.map((entry, i) => (
              <Cell key={entry.name || i} fill={PIE_PALETTE[i % PIE_PALETTE.length]} stroke="#fff" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip formatter={(v, name) => [formatCad(v), name]} contentStyle={tipStyle()} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.14em] text-prestige-taupe">{title || 'Total'}</p>
          <p className="font-heading text-lg tabular-nums text-dark">{formatCompactCad(total)}</p>
        </div>
      </div>
    </div>
  );
}

const OPTION_LINE_COLORS = {
  A: DASH_COLORS.blue,
  B: DASH_COLORS.mint,
  C: DASH_COLORS.amber,
  baseline: DASH_COLORS.navy,
};

/** Multi-option net-worth comparison (baseline + A/B/C). */
export function ScenarioCompareChart({ data, options = [], height = 340, showBaseline = true }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DASH_COLORS.beige} vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: DASH_COLORS.taupe }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={formatCompactCad}
            tick={{ fontSize: 11, fill: DASH_COLORS.taupe }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip formatter={(v, name) => [formatCad(v), name]} contentStyle={tipStyle()} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {showBaseline && (
            <Line
              type="monotone"
              dataKey="baseline"
              name="Situation actuelle"
              stroke={OPTION_LINE_COLORS.baseline}
              strokeWidth={2.5}
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive
              animationDuration={900}
            />
          )}
          {options.map((opt) => (
            <Line
              key={opt.letter}
              type="monotone"
              dataKey={`opt_${opt.letter}`}
              name={`Option ${opt.letter}${opt.name ? ` · ${opt.name}` : ''}`}
              stroke={OPTION_LINE_COLORS[opt.letter] || DASH_COLORS.sky}
              strokeWidth={opt.recommended ? 3.5 : 2.5}
              dot={false}
              isAnimationActive
              animationDuration={1100}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CompositionArea({ data, keys, height = 280 }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={DASH_COLORS.beige} vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: DASH_COLORS.taupe }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={formatCompactCad}
            tick={{ fontSize: 11, fill: DASH_COLORS.taupe }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip formatter={(v, name) => [formatCad(v), name]} contentStyle={tipStyle()} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {keys.map((key, i) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="comp"
              stroke={PIE_PALETTE[i % PIE_PALETTE.length]}
              fill={PIE_PALETTE[i % PIE_PALETTE.length]}
              fillOpacity={0.45}
              isAnimationActive
              animationDuration={900}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

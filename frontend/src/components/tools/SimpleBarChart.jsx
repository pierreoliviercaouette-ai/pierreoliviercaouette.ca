import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BRAND_BLUE, BRAND_MUTED, BRAND_NAVY, formatCad } from './format';

/**
 * @param {{
 *   data: Array<Record<string, string|number>>,
 *   bars: Array<{ dataKey: string, name: string, color?: string }>,
 *   height?: number,
 *   valueFormatter?: (v: number) => string,
 * }} props
 */
export function SimpleBarChart({
  data = [],
  bars = [],
  height = 220,
  valueFormatter = formatCad,
}) {
  if (!data.length || !bars.length) return null;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickFormatter={(v) => {
              const n = Number(v);
              if (Math.abs(n) >= 1000) return `${Math.round(n / 1000)}k`;
              return String(Math.round(n));
            }}
          />
          <Tooltip
            formatter={(value, name) => [valueFormatter(value), name]}
            contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
          />
          {bars.length > 1 ? <Legend /> : null}
          {bars.map((bar, i) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.color || [BRAND_BLUE, BRAND_NAVY, BRAND_MUTED][i % 3]}
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

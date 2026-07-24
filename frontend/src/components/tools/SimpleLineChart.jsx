import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BRAND_BLUE, BRAND_MUTED, BRAND_NAVY, formatCad } from './format';

/**
 * @param {{
 *   data: Array<Record<string, string|number>>,
 *   lines: Array<{ dataKey: string, name: string, color?: string }>,
 *   height?: number,
 *   xKey?: string,
 * }} props
 */
export function SimpleLineChart({
  data = [],
  lines = [],
  height = 220,
  xKey = 'name',
}) {
  if (!data.length || !lines.length) return null;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickFormatter={(v) => {
              const n = Number(v);
              if (Math.abs(n) >= 1000) return `${Math.round(n / 1000)}k`;
              return String(Math.round(n));
            }}
          />
          <Tooltip
            formatter={(value, name) => [formatCad(value), name]}
            contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
          />
          {lines.length > 1 ? <Legend /> : null}
          {lines.map((line, i) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color || [BRAND_BLUE, BRAND_NAVY, BRAND_MUTED][i % 3]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BRAND_BLUE, BRAND_MUTED, BRAND_NAVY, formatCad } from './format';

const PALETTE = [BRAND_BLUE, BRAND_NAVY, BRAND_MUTED, '#3b82f6', '#64748b', '#0ea5e9', '#1e3a5f'];

/**
 * Stacked line chart (aires empilées + contours).
 * @param {{
 *   data: Array<Record<string, string|number>>,
 *   lines: Array<{ dataKey: string, name: string, color?: string }>,
 *   height?: number,
 *   xKey?: string,
 *   stacked?: boolean,
 *   valueFormatter?: (v: number) => string,
 * }} props
 */
export function StackedLineChart({
  data = [],
  lines = [],
  height = 240,
  xKey = 'name',
  stacked = true,
  valueFormatter = formatCad,
}) {
  if (!data.length || !lines.length) return null;

  const stackId = stacked && lines.length > 1 ? 'stack' : undefined;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 12, fill: '#64748b' }}
            interval={data.length > 12 ? 'preserveStartEnd' : 0}
            minTickGap={24}
          />
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
          {lines.length > 1 ? <Legend /> : null}
          {lines.map((line, i) => {
            const color = line.color || PALETTE[i % PALETTE.length];
            const isPrimary = line.primary === true || (line.primary !== false && lines.length === 1);
            return (
              <Area
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stackId={stackId}
                stroke={color}
                strokeWidth={isPrimary ? 2.75 : 2}
                fill={color}
                fillOpacity={
                  stacked && lines.length > 1
                    ? isPrimary
                      ? 0.4
                      : 0.28
                    : isPrimary
                      ? 0.2
                      : 0.08
                }
                dot={data.length <= 12 ? { r: isPrimary ? 3.5 : 2.5, strokeWidth: 1 } : false}
                activeDot={{ r: 5 }}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

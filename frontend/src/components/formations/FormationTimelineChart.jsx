import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BRAND_BLUE, BRAND_MUTED, BRAND_NAVY, formatCad } from '../tools/format';

const SERIES_COLORS = [BRAND_NAVY, BRAND_BLUE, BRAND_MUTED, '#6b7280'];

function formatAxis(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return String(value ?? '');
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fr-CA', { maximumFractionDigits: 1 })} M`;
  if (abs >= 1000) return `${Math.round(n / 1000)} k`;
  return String(Math.round(n));
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-prestige-beige bg-white px-3 py-2 text-xs shadow-sm">
      <p className="mb-1 font-medium text-dark">{label}</p>
      <ul className="space-y-0.5">
        {payload.map((entry) => (
          <li key={entry.dataKey} className="flex items-center gap-2 text-slate-600">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: entry.color || BRAND_NAVY }}
            />
            <span>
              {entry.name}: {formatCad(entry.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TimelineEvents({ events }) {
  if (!events?.length) return null;

  return (
    <>
      {/* Mobile: vertical rail */}
      <ol className="md:hidden">
        {events.map((event, i) => (
          <li key={`${event.at}-${event.title}-m`} className="relative flex gap-4 pb-6 last:pb-0">
            <div className="flex w-4 flex-col items-center">
              <span
                className={`mt-1 h-3 w-3 shrink-0 rounded-full border-2 ${
                  event.emphasis
                    ? 'border-dark bg-dark'
                    : 'border-prestige-taupe bg-white'
                }`}
              />
              {i < events.length - 1 ? (
                <span className="mt-1 w-px flex-1 bg-prestige-beige" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-prestige-taupe">
                {event.at}
              </p>
              <p className="mt-1 font-heading text-sm font-semibold text-dark">{event.title}</p>
              {event.amount ? (
                <p className="mt-0.5 font-heading text-base font-bold tabular-nums text-dark">
                  {event.amount}
                </p>
              ) : null}
              {event.note ? (
                <p className="mt-1 text-[13px] leading-snug text-slate-500">{event.note}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      {/* Desktop: evenly spaced across full width */}
      <ol className="hidden md:flex md:w-full md:items-stretch">
        {events.map((event, i) => (
          <li key={`${event.at}-${event.title}-d`} className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center">
              <span
                className={`h-3 w-3 shrink-0 rounded-full border-2 ${
                  event.emphasis ? 'border-dark bg-dark' : 'border-prestige-taupe bg-white'
                }`}
              />
              {i < events.length - 1 ? (
                <span className="h-px flex-1 bg-prestige-beige" />
              ) : (
                <span className="h-px flex-1 bg-transparent" />
              )}
            </div>
            <div className={`mt-3 ${i < events.length - 1 ? 'pr-3' : ''}`}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-prestige-taupe">
                {event.at}
              </p>
              <p className="mt-1 font-heading text-sm font-semibold leading-snug text-dark">
                {event.title}
              </p>
              {event.amount ? (
                <p className="mt-1 font-heading text-lg font-bold tabular-nums text-dark">
                  {event.amount}
                </p>
              ) : null}
              {event.note ? (
                <p className="mt-1 text-[12px] leading-snug text-slate-500">{event.note}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

function TimelineChartBody({ chart }) {
  if (!chart?.points?.length || !chart?.series?.length) return null;

  const type = chart.type === 'bar' ? 'bar' : 'line';
  const Chart = type === 'bar' ? BarChart : LineChart;

  return (
    <div className="mt-6 h-[220px] w-full sm:h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <Chart
          data={chart.points}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e8e4dc" vertical={false} />
          <XAxis
            dataKey="at"
            tick={{ fontSize: 11, fill: '#8a8478' }}
            axisLine={{ stroke: '#e8e4dc' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#8a8478' }}
            axisLine={false}
            tickLine={false}
            width={44}
            tickFormatter={formatAxis}
          />
          <Tooltip content={<ChartTooltip />} />
          {chart.series.length > 1 ? (
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              iconType="circle"
              iconSize={8}
            />
          ) : null}
          {chart.series.map((s, i) =>
            type === 'bar' ? (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.name}
                fill={s.color || SERIES_COLORS[i % SERIES_COLORS.length]}
                radius={[2, 2, 0, 0]}
                maxBarSize={48}
              />
            ) : (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color || SERIES_COLORS[i % SERIES_COLORS.length]}
                strokeWidth={2.25}
                dot={{ r: 3.5, strokeWidth: 0, fill: s.color || SERIES_COLORS[i % SERIES_COLORS.length] }}
                activeDot={{ r: 5 }}
              />
            )
          )}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Ligne du temps chiffrée + graphique (Recharts) pour l’exemple d’une formation.
 * timeline: { title?, caption?, events?, chart? }
 */
export function FormationTimelineChart({ timeline, className = '' }) {
  if (!timeline) return null;
  const hasEvents = Boolean(timeline.events?.length);
  const hasChart = Boolean(timeline.chart?.points?.length && timeline.chart?.series?.length);
  if (!hasEvents && !hasChart) return null;

  return (
    <figure
      className={`border border-prestige-beige bg-white p-4 sm:p-5 md:p-6 ${className}`}
      data-testid="formation-timeline-chart"
    >
      {timeline.title ? (
        <figcaption className="text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-prestige-taupe">
          {timeline.title}
        </figcaption>
      ) : null}
      {timeline.caption ? (
        <p className="mx-auto mt-2 max-w-xl text-center text-[13px] leading-relaxed text-slate-500">
          {timeline.caption}
        </p>
      ) : null}

      {hasEvents ? (
        <div className={timeline.title || timeline.caption ? 'mt-5' : undefined}>
          <TimelineEvents events={timeline.events} />
        </div>
      ) : null}

      {hasChart ? <TimelineChartBody chart={timeline.chart} /> : null}
    </figure>
  );
}

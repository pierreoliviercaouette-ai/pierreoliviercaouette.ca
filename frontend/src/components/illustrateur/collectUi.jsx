import { formatCad } from '../../lib/illustrateur';

export function SegmentedToggle({ value, onChange, options, className = '' }) {
  return (
    <div className={`inline-flex flex-wrap rounded-lg border border-[#d7dee8] bg-[#eef2f7] p-0.5 ${className}`}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              active ? 'bg-[#0b4ea2] text-white shadow-sm' : 'text-[#3d4f66] hover:bg-white/70'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function CollectCard({ title, action, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-[#d7dee8] bg-[#f4f7fb] p-4 md:p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          {title ? <h3 className="text-sm font-bold text-[#0b4ea2]">{title}</h3> : <span />}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function AddRowButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-md bg-[#0b4ea2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#093d82]"
    >
      + {children}
    </button>
  );
}

export function FieldLabel({ label, children, className = '' }) {
  return (
    <label className={`block text-xs ${className}`}>
      <span className="font-medium text-[#5a6b7d]">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export function TextField({ value, onChange, type = 'text', className = '' }) {
  return (
    <input
      type={type}
      className={`w-full rounded-md border border-[#d7dee8] bg-white px-3 py-2 text-sm text-[#12263a] ${className}`}
      value={value ?? ''}
      onChange={(e) => onChange(type === 'number' ? (e.target.value === '' ? 0 : Number(e.target.value)) : e.target.value)}
    />
  );
}

export function SelectField({ value, onChange, options, className = '' }) {
  return (
    <select
      className={`w-full rounded-md border border-[#d7dee8] bg-white px-3 py-2 text-sm text-[#12263a] ${className}`}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function StepFooter({ onPrev, onNext, nextLabel = 'Suivant', hideNext = false }) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
      <button
        type="button"
        onClick={onPrev}
        className="rounded-md bg-[#e8eef5] px-6 py-3 text-sm font-semibold text-[#0b4ea2]"
      >
        Précédent
      </button>
      {!hideNext && (
        <button
          type="button"
          onClick={onNext}
          className="rounded-md bg-[#0b4ea2] px-8 py-3 text-sm font-semibold text-white"
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
}

export function AttainmentPanel({
  title = 'Atteinte de l’objectif',
  clientLabel,
  attainment,
  extraRows,
  enabled = true,
}) {
  if (!attainment) return null;
  const pct = attainment.pct || 0;
  const barColor = pct >= 100 ? 'bg-emerald-600' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <aside className="sticky top-24 rounded-xl border border-[#d7dee8] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#5a6b7d]">{title}</p>
        <span
          className={`h-5 w-9 rounded-full ${enabled ? 'bg-[#0b4ea2]' : 'bg-slate-300'} relative`}
          aria-hidden
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
              enabled ? 'right-0.5' : 'left-0.5'
            }`}
          />
        </span>
      </div>
      {clientLabel && <p className="mt-3 text-xs font-semibold text-[#12263a]">{clientLabel}</p>}
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#e8eef5]">
        <div className={`h-full ${barColor}`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
      <p className={`mt-1 text-sm font-bold ${pct >= 100 ? 'text-emerald-700' : pct >= 60 ? 'text-amber-700' : 'text-red-600'}`}>
        {pct} %
      </p>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-[#5a6b7d]">Besoins</dt>
          <dd className="font-semibold tabular-nums">{formatCad(attainment.needs)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[#5a6b7d]">Montants disponibles</dt>
          <dd className="font-semibold tabular-nums">{formatCad(attainment.available)}</dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-[#e8eef5] pt-2">
          <dt className="font-semibold text-[#12263a]">Manque à gagner</dt>
          <dd className="font-bold tabular-nums text-red-600">{formatCad(attainment.shortfall)}</dd>
        </div>
        {extraRows}
      </dl>
    </aside>
  );
}

export function NetWorthPanel({ assets, debts, netWorth, clientLabel }) {
  return (
    <aside className="sticky top-24 space-y-3">
      <div className="rounded-xl border border-[#d7dee8] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold text-[#5a6b7d]">Valeur nette</p>
        <p className="mt-2 font-heading text-3xl tabular-nums text-[#0b4ea2]">{formatCad(netWorth)}</p>
      </div>
      <div className="rounded-xl border border-[#d7dee8] bg-white p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5a6b7d]">{clientLabel || 'Client'}</p>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Valeur nette</dt>
            <dd className="font-semibold tabular-nums">{formatCad(netWorth)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Actifs</dt>
            <dd className="tabular-nums">{formatCad(assets)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Passifs</dt>
            <dd className="tabular-nums">{formatCad(debts)}</dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}

export function StepTitle({ children }) {
  return <h2 className="mb-5 font-heading text-2xl font-bold uppercase tracking-wide text-[#0b4ea2] md:text-3xl">{children}</h2>;
}

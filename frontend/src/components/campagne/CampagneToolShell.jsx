import { Download } from 'lucide-react';
import { formatCad } from '../tools/format';

/**
 * Enveloppe visuelle commune pour les mini-outils des landings Meta.
 */
export function CampagneToolShell({
  title,
  intro,
  children,
  disclaimer = 'Illustration éducative seulement — pas un conseil personnalisé.',
  footer = null,
}) {
  return (
    <section
      className="overflow-hidden rounded-3xl border border-prestige-beige/80 bg-white shadow-[0_12px_40px_rgba(1,35,63,0.06)]"
      data-testid="campagne-ads-tool"
      aria-labelledby="campagne-tool-title"
    >
      <div className="border-b border-prestige-beige/80 bg-gradient-to-br from-primary/[0.04] via-white to-secondary/[0.06] px-5 py-5 md:px-8 md:py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
          Outil interactif
        </p>
        <h2
          id="campagne-tool-title"
          className="font-heading mt-2 text-xl font-bold text-dark md:text-2xl"
        >
          {title}
        </h2>
        {intro ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-prestige-taupe md:text-base">
            {intro}
          </p>
        ) : null}
      </div>
      <div className="px-5 py-6 md:px-8 md:py-7">{children}</div>
      {footer ? (
        <div className="border-t border-prestige-beige/80 bg-gray-50/70 px-5 py-5 md:px-8">
          {footer}
        </div>
      ) : null}
      <p className="px-5 pb-5 text-xs leading-relaxed text-prestige-taupe/80 md:px-8">{disclaimer}</p>
    </section>
  );
}

export function ToolDownloadPdf({ onClick, busy = false, label = 'Télécharger mon résumé PDF' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      data-testid="campagne-tool-download-pdf"
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-dark disabled:cursor-wait disabled:opacity-70 sm:w-auto"
    >
      <Download className="h-4 w-4" aria-hidden />
      {busy ? 'Préparation du PDF…' : label}
    </button>
  );
}

export function ToolNumberField({ id, label, value, onChange, min, max, step = '1', hint, suffix }) {
  return (
    <label className="block space-y-1.5" htmlFor={id}>
      <span className="text-sm font-medium text-dark">{label}</span>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-prestige-taupe">
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? <span className="block text-xs text-prestige-taupe">{hint}</span> : null}
    </label>
  );
}

export function ToolSelectField({ id, label, value, onChange, options, hint }) {
  return (
    <label className="block space-y-1.5" htmlFor={id}>
      <span className="text-sm font-medium text-dark">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {options.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint ? <span className="block text-xs text-prestige-taupe">{hint}</span> : null}
    </label>
  );
}

export function ToolTextField({ id, label, value, onChange, hint, placeholder, type = 'text' }) {
  return (
    <label className="block space-y-1.5" htmlFor={id}>
      <span className="text-sm font-medium text-dark">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      {hint ? <span className="block text-xs text-prestige-taupe">{hint}</span> : null}
    </label>
  );
}

export function ToolTextArea({ id, label, value, onChange, hint, placeholder, rows = 3 }) {
  return (
    <label className="block space-y-1.5" htmlFor={id}>
      <span className="text-sm font-medium text-dark">{label}</span>
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      {hint ? <span className="block text-xs text-prestige-taupe">{hint}</span> : null}
    </label>
  );
}

export function ToolSection({ title, children }) {
  return (
    <div className="space-y-3 rounded-xl border border-prestige-beige/80 bg-gray-50/60 p-4">
      <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-primary">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function ToolResult({ label, value, detail, tone = 'default' }) {
  const toneClass =
    tone === 'warn'
      ? 'border-amber-200 bg-amber-50'
      : tone === 'ok'
        ? 'border-emerald-200 bg-emerald-50'
        : 'border-primary/20 bg-primary/5';

  return (
    <div className={`rounded-xl border px-4 py-3 ${toneClass}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-prestige-taupe">{label}</p>
      <p className="font-heading mt-1 text-2xl font-bold text-dark">{value}</p>
      {detail ? <p className="mt-1 text-sm leading-relaxed text-prestige-taupe">{detail}</p> : null}
    </div>
  );
}

export function ToolMoney({ value }) {
  return formatCad(value);
}

export function ToolFields({ children }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function ToolChecklistItem({ id, checked, onChange, label, hint, children }) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 transition-colors ${
        checked ? 'border-primary/40 bg-primary/5' : 'border-prestige-beige bg-white'
      }`}
    >
      <label htmlFor={id} className="flex cursor-pointer gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-input text-primary focus:ring-primary"
        />
        <span className="min-w-0">
          <span className="block text-sm font-medium text-dark">{label}</span>
          {hint ? <span className="mt-0.5 block text-xs text-prestige-taupe">{hint}</span> : null}
        </span>
      </label>
      {children ? <div className="mt-3 space-y-3 border-t border-prestige-beige/70 pt-3 pl-7">{children}</div> : null}
    </div>
  );
}

import { ArrowRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  /** Immersive = plein écran mobile (pas de carte landing). */
  immersive = false,
  eyebrow = 'Outil interactif',
  titleAs = 'h2',
}) {
  const TitleTag = titleAs === 'h1' ? 'h1' : 'h2';

  return (
    <section
      id="outil"
      className={
        immersive
          ? 'scroll-mt-20 bg-white'
          : 'scroll-mt-28 overflow-hidden rounded-3xl border border-prestige-beige/80 bg-white shadow-[0_12px_40px_rgba(1,35,63,0.06)]'
      }
      data-testid="campagne-ads-tool"
      data-layout={immersive ? 'immersive' : 'card'}
      aria-labelledby="campagne-tool-title"
    >
      <div
        className={
          immersive
            ? 'border-b border-prestige-beige/60 bg-gradient-to-br from-primary/[0.05] via-white to-secondary/[0.06] px-4 pb-4 pt-5'
            : 'border-b border-prestige-beige/80 bg-gradient-to-br from-primary/[0.04] via-white to-secondary/[0.06] px-5 py-5 md:px-8 md:py-6'
        }
      >
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
            {eyebrow}
          </p>
        ) : null}
        <TitleTag
          id="campagne-tool-title"
          className={`font-heading font-bold text-dark ${
            immersive
              ? `${eyebrow ? 'mt-2' : ''} text-2xl leading-tight`
              : 'mt-2 text-xl md:text-2xl'
          }`}
        >
          {title}
        </TitleTag>
        {intro ? (
          <p
            className={`mt-2 max-w-2xl leading-relaxed text-prestige-taupe ${
              immersive ? 'text-sm' : 'text-sm md:text-base'
            }`}
          >
            {intro}
          </p>
        ) : null}
      </div>
      <div className={immersive ? 'px-4 py-5' : 'px-5 py-6 md:px-8 md:py-7'}>{children}</div>
      {footer ? (
        <div
          className={
            immersive
              ? 'border-t border-prestige-beige/60 bg-gray-50/70 px-4 py-4'
              : 'border-t border-prestige-beige/80 bg-gray-50/70 px-5 py-5 md:px-8'
          }
        >
          {footer}
        </div>
      ) : null}
      <p
        className={
          immersive
            ? 'px-4 pb-5 text-xs leading-relaxed text-prestige-taupe/80'
            : 'px-5 pb-5 text-xs leading-relaxed text-prestige-taupe/80 md:px-8'
        }
      >
        {disclaimer}
      </p>
    </section>
  );
}

export function ToolDownloadPdf({
  onClick,
  busy = false,
  label = 'Télécharger mon résumé PDF',
  variant = 'primary',
}) {
  const base =
    'inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-colors disabled:cursor-wait disabled:opacity-70 sm:w-auto';
  const styles =
    variant === 'ghost'
      ? 'border border-prestige-beige bg-white text-dark hover:border-primary/30 hover:text-primary'
      : 'bg-primary text-white shadow-md hover:bg-dark';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      data-testid="campagne-tool-download-pdf"
      className={`${base} ${styles}`}
    >
      <Download className="h-4 w-4" aria-hidden />
      {busy ? 'Préparation du PDF…' : label}
    </button>
  );
}

/**
 * Soft close post-climax : RDV (ou form) primaire, PDF secondaire (ghost).
 * `tone`: 'warn' (ambre) | 'ok' (émeraude) | 'default' (primary).
 */
export function ToolSoftClose({
  headline,
  subline,
  rdvPath,
  rdvLabel = 'Réserver 15 minutes',
  onRdvClick,
  formMode = false,
  onFormClick,
  formLabel = 'Demander une présentation',
  onPdf,
  pdfBusy = false,
  pdfLabel = 'Garder mon résumé PDF',
  tone = 'default',
}) {
  const toneClass =
    tone === 'warn'
      ? 'border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-white'
      : tone === 'ok'
        ? 'border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-white'
        : 'border-primary/15 bg-gradient-to-br from-primary/[0.06] to-secondary/[0.05]';

  return (
    <div
      className={`campagne-soft-close-enter space-y-4 rounded-2xl border px-4 py-4 md:px-5 ${toneClass}`}
      data-testid="campagne-tool-soft-close"
    >
      {headline ? (
        <p className="font-heading text-base font-semibold text-dark md:text-lg">{headline}</p>
      ) : null}
      {subline ? (
        <p className="text-sm leading-relaxed text-prestige-taupe">{subline}</p>
      ) : null}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
        {formMode ? (
          <button
            type="button"
            onClick={onFormClick}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-dark sm:w-auto"
            data-testid="campagne-tool-cta-form"
          >
            {formLabel}
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <Link
            to={rdvPath}
            onClick={onRdvClick}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-dark sm:w-auto"
            data-testid="campagne-tool-cta-rdv"
          >
            {rdvLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
        {onPdf ? (
          <ToolDownloadPdf
            onClick={onPdf}
            busy={pdfBusy}
            label={pdfLabel}
            variant="ghost"
          />
        ) : null}
      </div>
    </div>
  );
}

/** Reveal climax partagé (keyed remount côté parent) */
export function ToolClimaxReveal({ children, className = '' }) {
  return (
    <div className={`campagne-climax-enter ${className}`} data-testid="campagne-tool-climax">
      {children}
    </div>
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

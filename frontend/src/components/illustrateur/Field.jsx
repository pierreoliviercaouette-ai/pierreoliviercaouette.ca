export function MoneyInput({ label, value, onChange, className = '' }) {
  return (
    <label className={`block text-xs ${className}`}>
      <span className="text-prestige-taupe">{label}</span>
      <input
        type="number"
        className="mt-1 w-full rounded-lg border border-prestige-beige bg-white px-3 py-2 text-sm tabular-nums"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
      />
    </label>
  );
}

export function TextInput({ label, value, onChange, className = '' }) {
  return (
    <label className={`block text-xs ${className}`}>
      <span className="text-prestige-taupe">{label}</span>
      <input
        type="text"
        className="mt-1 w-full rounded-lg border border-prestige-beige bg-white px-3 py-2 text-sm"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function SelectInput({ label, value, onChange, options, className = '' }) {
  return (
    <label className={`block text-xs ${className}`}>
      <span className="text-prestige-taupe">{label}</span>
      <select
        className="mt-1 w-full rounded-lg border border-prestige-beige bg-white px-3 py-2 text-sm"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SectionCard({ title, action, children }) {
  return (
    <section className="rounded-2xl border border-prestige-beige bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-heading text-lg text-dark">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ResultsTable } from './ResultsTable';
import { StackedLineChart } from './StackedLineChart';

function resolveHint(hint, values) {
  if (typeof hint === 'function') return hint(values);
  return hint || null;
}

function resolveOptions(options, values) {
  if (typeof options === 'function') return options(values) || [];
  return options || [];
}

const fieldControlClass =
  'mt-1 flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

function FieldControl({ field, value, values, onChange }) {
  const id = field.id;
  const hint = resolveHint(field.hint, values);
  const common = {
    id,
    value: value ?? '',
    onChange: (e) => onChange(id, e.target.value),
  };

  if (field.type === 'select') {
    return (
      <div>
        <Label htmlFor={id}>{field.label}</Label>
        <select {...common} className={fieldControlClass}>
          {resolveOptions(field.options, values).map((opt) => (
            <option key={String(opt.value)} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {hint ? <p className="mt-1 text-xs text-prestige-taupe">{hint}</p> : null}
      </div>
    );
  }

  return (
    <div>
      <Label htmlFor={id}>{field.label}</Label>
      <Input
        type="number"
        step={field.step ?? '1'}
        min={field.min}
        max={field.max}
        placeholder={field.placeholder}
        className="mt-1 bg-white"
        {...common}
      />
      {hint ? <p className="mt-1 text-xs text-prestige-taupe">{hint}</p> : null}
    </div>
  );
}

/**
 * Shell unifié : formulaire | tableau + graphique.
 */
export function ToolShell({
  fields = [],
  values = {},
  onChange,
  presentation = {},
}) {
  const visibleFields = fields.filter((field) => {
    if (typeof field.showWhen === 'function') return field.showWhen(values);
    return true;
  });

  const sections = [];
  visibleFields.forEach((field) => {
    const key = field.section || 'Paramètres';
    let section = sections.find((s) => s.title === key);
    if (!section) {
      section = { title: key, fields: [] };
      sections.push(section);
    }
    section.fields.push(field);
  });

  const { rows = [], chart, note, highlight } = presentation;

  return (
    <div className="grid gap-8 lg:grid-cols-2" data-testid="tool-shell">
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-prestige-taupe">
              {section.title}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {section.fields.map((field) => (
                <div
                  key={field.id}
                  className={field.fullWidth ? 'sm:col-span-2' : undefined}
                >
                  <FieldControl
                    field={field}
                    value={values[field.id]}
                    values={values}
                    onChange={onChange}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6 rounded-xl border border-prestige-beige bg-white p-5 md:p-6">
        {highlight ? (
          <div
            className={`rounded-xl px-5 py-4 ${
              highlight.positive === false
                ? 'bg-slate-100 text-dark'
                : 'bg-primary text-white'
            }`}
            data-testid="tool-highlight"
          >
            <p
              className={`text-xs font-semibold uppercase tracking-wide ${
                highlight.positive === false ? 'text-prestige-taupe' : 'text-white/80'
              }`}
            >
              {highlight.label}
            </p>
            <p className="mt-1 font-heading text-3xl font-bold tabular-nums md:text-4xl">
              {highlight.value}
            </p>
            {highlight.detail ? (
              <p
                className={`mt-2 text-sm leading-snug ${
                  highlight.positive === false ? 'text-prestige-taupe' : 'text-white/90'
                }`}
              >
                {highlight.detail}
              </p>
            ) : null}
          </div>
        ) : null}

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-prestige-taupe">
            Résultats
          </h3>
          <ResultsTable rows={rows} />
        </div>

        {chart?.data?.length && chart?.series?.length ? (
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-prestige-taupe">
              {chart.title || 'Illustration'}
            </h3>
            <StackedLineChart
              data={chart.data}
              lines={chart.series}
              xKey={chart.xKey || 'name'}
              stacked={chart.stacked !== false}
              valueFormatter={chart.valueFormatter}
            />
          </div>
        ) : null}

        {note ? (
          <p className="border-t border-prestige-beige pt-4 text-sm leading-relaxed text-prestige-taupe">
            {note}
          </p>
        ) : null}
      </div>
    </div>
  );
}

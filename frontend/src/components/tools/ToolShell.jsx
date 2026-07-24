import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ResultsTable } from './ResultsTable';
import { StackedLineChart } from './StackedLineChart';

function FieldControl({ field, value, onChange }) {
  const id = field.id;
  const common = {
    id,
    value: value ?? '',
    onChange: (e) => onChange(id, e.target.value),
    className: 'mt-1',
  };

  if (field.type === 'select') {
    return (
      <div>
        <Label htmlFor={id}>{field.label}</Label>
        <select
          {...common}
          className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {(field.options || []).map((opt) => (
            <option key={String(opt.value)} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {field.hint ? <p className="mt-1 text-xs text-prestige-taupe">{field.hint}</p> : null}
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
        {...common}
      />
      {field.hint ? <p className="mt-1 text-xs text-prestige-taupe">{field.hint}</p> : null}
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
  const sections = [];
  fields.forEach((field) => {
    const key = field.section || 'Paramètres';
    let section = sections.find((s) => s.title === key);
    if (!section) {
      section = { title: key, fields: [] };
      sections.push(section);
    }
    section.fields.push(field);
  });

  const { rows = [], chart, note } = presentation;

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
                    onChange={onChange}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6 rounded-xl border border-prestige-beige bg-white p-5 md:p-6">
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

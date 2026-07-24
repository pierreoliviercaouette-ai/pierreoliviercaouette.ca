import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

/**
 * @param {{
 *   rows: Array<{ label: string, value: string, emphasize?: boolean, impact?: boolean }>,
 * }} props
 */
export function ResultsTable({ rows = [] }) {
  if (!rows.length) {
    return (
      <p className="text-sm text-prestige-taupe">Remplissez le formulaire pour voir les résultats.</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Indicateur</TableHead>
          <TableHead className="text-right">Valeur</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          if (row.impact) {
            return (
              <TableRow key={row.label} className="bg-primary/10">
                <TableCell className="py-4 font-semibold text-dark">{row.label}</TableCell>
                <TableCell className="py-4 text-right text-xl font-bold tabular-nums text-primary md:text-2xl">
                  {row.value}
                </TableCell>
              </TableRow>
            );
          }
          return (
            <TableRow key={row.label} className={row.emphasize ? 'bg-blue-50/60' : undefined}>
              <TableCell className={row.emphasize ? 'font-semibold text-dark' : 'text-prestige-taupe'}>
                {row.label}
              </TableCell>
              <TableCell
                className={`text-right tabular-nums ${
                  row.emphasize ? 'font-semibold text-primary' : 'text-dark'
                }`}
              >
                {row.value}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

import { type ReactNode } from "react";

export interface Column<Row> {
  header: string;
  cell: keyof Row | ((row: Row) => ReactNode);
}

export interface DataTableProps<Row extends { id: string | number }> {
  rows: readonly Row[];
  columns: readonly Column<Row>[];
  onRowClick?: (row: Row) => void;
}

export function DataTable<Row extends { id: string | number }>({
  rows,
  columns,
  onRowClick,
}: DataTableProps<Row>) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map(c => (
            <th key={c.header}>{c.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.id} onClick={() => onRowClick?.(row)}>
            {columns.map(c => (
              <td key={c.header}>
                {typeof c.cell === "function" ? c.cell(row) : String(row[c.cell])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

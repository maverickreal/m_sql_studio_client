interface TableProps {
  columns: string[];
  rows: Record<string, unknown>[];
}

export function Table({ columns, rows }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-surface-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-800 bg-surface-900">
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-2 text-left font-medium text-surface-400"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-surface-800/50 last:border-0 hover:bg-surface-900/50 transition-colors"
            >
              {columns.map((col) => (
                <td key={col} className="px-4 py-2 font-mono text-surface-200">
                  {String(row[col] ?? "NULL")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

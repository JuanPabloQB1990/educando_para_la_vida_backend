type AnyObject = Record<string, unknown>;

function toCamel(s: string) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function mapRowToEntity<T = any>(row: any): T {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(row)) {
    const camel = toCamel(key);
    out[camel] = row[key];
  }
  return out as T;
}

export function mapRowsToEntities<T = any>(rows: any[]): T[] {
  return rows.map((r) => mapRowToEntity<T>(r));
}

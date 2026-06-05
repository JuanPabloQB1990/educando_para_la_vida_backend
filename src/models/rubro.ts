export interface RubroRow {
  id: string;
  nombre: string;
  descripcion?: string | null;
  monto_base?: string | null;
}

export interface Rubro {
  id: string;
  nombre: string;
  descripcion?: string | null;
  montoBase?: string | null;
}

import { mapRowToEntity } from './dbMappers';

export function mapRubro(row: RubroRow): Rubro {
  return mapRowToEntity<Rubro>(row);
}

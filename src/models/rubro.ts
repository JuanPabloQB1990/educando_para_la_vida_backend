export interface RubroRow {
  id_rubro: string;
  nombre_rubro: string;
  descripcion?: string | null;
  monto_base?: string | null;
}

export interface Rubro {
  idRubro: string;
  nombreRubro: string;
  descripcion?: string | null;
  montoBase?: string | null;
}

import { mapRowToEntity } from './dbMappers';

export function mapRubro(row: RubroRow): Rubro {
  return mapRowToEntity<Rubro>(row);
}

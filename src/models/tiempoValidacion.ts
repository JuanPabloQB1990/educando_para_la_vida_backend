export interface TiempoValidacionRow {
  id: string;
  tiempo: number;
}

export interface TiempoValidacion {
  id: string;
  tiempo: number;
}

import { mapRowToEntity } from './dbMappers';

export function mapTiempoValidacion(row: TiempoValidacionRow): TiempoValidacion {
  return mapRowToEntity<TiempoValidacion>(row);
}

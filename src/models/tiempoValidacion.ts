export interface TiempoValidacionRow {
  id_tiempo_validacion: string;
  tiempo: number;
}

export interface TiempoValidacion {
  idTiempoValidacion: string;
  tiempo: number;
}

import { mapRowToEntity } from './dbMappers';

export function mapTiempoValidacion(row: TiempoValidacionRow): TiempoValidacion {
  return mapRowToEntity<TiempoValidacion>(row);
}

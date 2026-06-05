export interface TipoEstudioRow {
  id: string;
  nombre: string;
}

export interface TipoEstudio {
  id: string;
  nombre: string;
}

import { mapRowToEntity } from './dbMappers';

export function mapTipoEstudio(row: TipoEstudioRow): TipoEstudio {
  return mapRowToEntity<TipoEstudio>(row);
}

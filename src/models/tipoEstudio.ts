export interface TipoEstudioRow {
  id_tipo_estudio: string;
  nombre: string;
}

export interface TipoEstudio {
  idTipoEstudio: string;
  nombre: string;
}

import { mapRowToEntity } from './dbMappers';

export function mapTipoEstudio(row: TipoEstudioRow): TipoEstudio {
  return mapRowToEntity<TipoEstudio>(row);
}

export interface TipoDocumentoRow {
  id: string;
  nombre: string;
}

export interface TipoDocumento {
  id: string;
  nombre: string;
}

import { mapRowToEntity } from './dbMappers';

export function mapTipoDocumento(row: TipoDocumentoRow): TipoDocumento {
  return mapRowToEntity<TipoDocumento>(row);
}

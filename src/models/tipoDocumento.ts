export interface TipoDocumentoRow {
  id_tipo_documento: string;
  nombre: string;
}

export interface TipoDocumento {
  idTipoDocumento: string;
  nombre: string;
}

import { mapRowToEntity } from './dbMappers';

export function mapTipoDocumento(row: TipoDocumentoRow): TipoDocumento {
  return mapRowToEntity<TipoDocumento>(row);
}

export interface AnioElectivoRow {
  id_anio_electivo: string;
  anio: number;
  estado: 'activo' | 'cerrado';
}

export interface AnioElectivo {
  idAnioElectivo: string;
  anio: number;
  estado: 'activo' | 'cerrado';
}

import { mapRowToEntity } from './dbMappers';

export function mapAnioElectivo(row: AnioElectivoRow): AnioElectivo {
  return mapRowToEntity<AnioElectivo>(row);
}

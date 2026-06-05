export interface AnioElectivoRow {
  id: string;
  anio: number;
  estado: 'activo' | 'cerrado';
}

export interface AnioElectivo {
  id: string;
  anio: number;
  estado: 'activo' | 'cerrado';
}

import { mapRowToEntity } from './dbMappers';

export function mapAnioElectivo(row: AnioElectivoRow): AnioElectivo {
  return mapRowToEntity<AnioElectivo>(row);
}

export interface RolRow {
  id: string;
  nombre: string;
}

export interface Rol {
  id: string;
  nombre: string;
}

import { mapRowToEntity } from './dbMappers';

export function mapRol(row: RolRow): Rol {
  return mapRowToEntity<Rol>(row);
}

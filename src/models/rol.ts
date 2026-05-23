export interface RolRow {
  id_rol: string;
  nombre_rol: string;
}

export interface Rol {
  idRol: string;
  nombreRol: string;
}

import { mapRowToEntity } from './dbMappers';

export function mapRol(row: RolRow): Rol {
  return mapRowToEntity<Rol>(row);
}

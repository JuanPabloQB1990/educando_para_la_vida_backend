export interface GradoEducacionRow {
  id_grado_educacion: string;
  nombre: string;
}

export interface GradoEducacion {
  idGradoEducacion: string;
  nombre: string;
}

import { mapRowToEntity } from './dbMappers';

export function mapGradoEducacion(row: GradoEducacionRow): GradoEducacion {
  return mapRowToEntity<GradoEducacion>(row);
}

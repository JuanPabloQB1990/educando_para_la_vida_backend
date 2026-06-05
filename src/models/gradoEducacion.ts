export interface GradoEducacionRow {
  id: string;
  nombre: string;
  orden: number;
}

export interface GradoEducacion {
  id: string;
  nombre: string;
  orden: number;
}

import { mapRowToEntity } from './dbMappers';

export function mapGradoEducacion(row: GradoEducacionRow): GradoEducacion {
  return mapRowToEntity<GradoEducacion>(row);
}

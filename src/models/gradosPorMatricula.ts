export interface GradosPorMatriculaRow {
  id_estudiante_matricula: string;
  id_grado_educacion: string;
  estado: string;
}

export interface GradosPorMatricula {
  idEstudianteMatricula: string;
  idGradoEducacion: string;
  estado: string;
}

import { mapRowToEntity } from './dbMappers';

export function mapGradosPorMatricula(row: GradosPorMatriculaRow): GradosPorMatricula {
  return mapRowToEntity<GradosPorMatricula>(row);
}

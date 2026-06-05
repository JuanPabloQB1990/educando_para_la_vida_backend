export interface EstudianteRow {
  id: string;
  id_usuario: string;
  fecha_nacimiento_estudiante?: string | null;
  edad_estudiante?: number | null;
  sexo_estudiante?: string | null;
  fecha_creado?: string | null;
}

export interface Estudiante {
  id: string;
  idUsuario: string;
  fechaNacimientoEstudiante?: string | null;
  edadEstudiante?: number | null;
  sexoEstudiante?: string | null;
  fechaCreado?: string | null;
}

import { mapRowToEntity } from './dbMappers';

export function mapEstudiante(row: EstudianteRow): Estudiante {
  return mapRowToEntity<Estudiante>(row);
}

export interface EstudiantePeriodoRow {
  id_estudiante_periodo: string;
  id_estudiante: string;
  id_tipo_estudio?: string | null;
  id_tiempo_validacion?: string | null;
  fecha_inscripcion?: string | null;
  id_anio_electivo?: string | null;
}

export interface EstudiantePeriodo {
  idEstudiantePeriodo: string;
  idEstudiante: string;
  idTipoEstudio?: string | null;
  idTiempoValidacion?: string | null;
  fechaInscripcion?: string | null;
  idAnioElectivo?: string | null;
}

import { mapRowToEntity } from './dbMappers';

export function mapEstudiantePeriodo(row: EstudiantePeriodoRow): EstudiantePeriodo {
  return mapRowToEntity<EstudiantePeriodo>(row);
}

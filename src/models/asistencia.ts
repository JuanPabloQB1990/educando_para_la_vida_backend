import type { AsistenciaEstado } from '../enums/asistencia.enum';

export interface AsistenciaRow {
  id_asistencia: string;
  id_estudiante: string;
  id_periodo: string;
  fecha: string;
  estado_asistencia: AsistenciaEstado;
  observacion: string | null;
  nombre_estudiante?: string;
  numero_periodo?: number;
}

export interface Asistencia {
  idAsistencia: string;
  idEstudiante: string;
  idPeriodo: string;
  fecha: string;
  estadoAsistencia: AsistenciaEstado;
  observacion: string | null;
  nombreEstudiante?: string;
  numeroPeriodo?: number;
}

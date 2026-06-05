import type { AsistenciaEstado } from '../enums/asistencia.enum';

export interface AsistenciaRow {
  id: string;
  id_estudiante: string;
  id_periodo: string;
  fecha: string;
  estado: AsistenciaEstado;
  observacion: string | null;
  nombre_estudiante?: string;
  numero_periodo?: number;
}

export interface Asistencia {
  id: string;
  idEstudiante: string;
  idPeriodo: string;
  fecha: string;
  estado: AsistenciaEstado;
  observacion: string | null;
  nombreEstudiante?: string;
  numeroPeriodo?: number;
}

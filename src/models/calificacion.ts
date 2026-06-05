export interface CalificacionRow {
  id: string;
  id_estudiante: string;
  id_actividad_materia: string;
  nota: number;
  observacion: string | null;
  nombre_estudiante?: string;
  nombre_actividad?: string;
  nombre_materia?: string;
}

export interface Calificacion {
  id: string;
  idEstudiante: string;
  idActividadMateria: string;
  nota: number;
  observacion: string | null;
  nombreEstudiante?: string;
  nombreActividad?: string;
  nombreMateria?: string;
}

export interface ActividadRow {
  id_actividad: string;
  id_periodo: string;
  id_grado_educacion: string;
  nombre_actividad: string;
  semana: number;
  descripcion: string | null;
  numero_periodo?: number;
  nombre_grado?: string;
}

export interface Actividad {
  idActividad: string;
  idPeriodo: string;
  idGradoEducacion: string;
  nombreActividad: string;
  semana: number;
  descripcion: string | null;
  numeroPeriodo?: number;
  nombreGrado?: string;
}

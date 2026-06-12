export interface ActividadRow {
  id: string;
  id_periodo: string;
  id_grado_educacion: string;
  nombre: string;
  numero_periodo?: number;
  nombre_grado?: string;
}

export interface Actividad {
  id: string;
  idPeriodo: string;
  idGradoEducacion: string;
  nombre: string;
  numeroPeriodo?: number;
  nombreGrado?: string;
}

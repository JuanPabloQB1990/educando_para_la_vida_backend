export interface ClassroomTareaRow {
  id: string;
  id_carga_academica: string;
  id_periodo: string;
  titulo: string;
  instrucciones: string;
  fecha_limite: Date;
  fecha_creacion: Date;
  nombre_materia?: string;
  nombre_grado?: string;
  numero_periodo?: number;
}

export interface ClassroomTarea {
  id: string;
  idCargaAcademica: string;
  idPeriodo: string;
  titulo: string;
  instrucciones: string;
  fechaLimite: Date;
  fechaCreacion: Date;
  nombreMateria?: string;
  nombreGrado?: string;
  numeroPeriodo?: number;
}

export interface ClassroomTareaAdjuntoRow {
  id: string;
  id_classroom_tarea: string;
  url_archivo: string;
  nombre_archivo: string;
}

export interface ClassroomTareaAdjunto {
  id: string;
  idClassroomTarea: string;
  urlArchivo: string;
  nombreArchivo: string;
}

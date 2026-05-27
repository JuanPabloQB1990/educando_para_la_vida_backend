import type { ClassroomEntregaEstado } from '../enums/classroomEntrega.enum';

export interface ClassroomEntregaRow {
  id_classroom_entrega: string;
  id_classroom_tarea: string;
  id_estudiante: string;
  fecha_entrega: Date;
  estado_entrega: ClassroomEntregaEstado;
  observacion_profesor: string | null;
  titulo_tarea?: string;
  nombre_estudiante?: string;
}

export interface ClassroomEntrega {
  idClassroomEntrega: string;
  idClassroomTarea: string;
  idEstudiante: string;
  fechaEntrega: Date;
  estadoEntrega: ClassroomEntregaEstado;
  observacionProfesor: string | null;
  tituloTarea?: string;
  nombreEstudiante?: string;
}

export interface ClassroomEntregaAdjuntoRow {
  id_classroom_entrega_adjunto: string;
  id_classroom_entrega: string;
  url_archivo: string;
  nombre_archivo: string;
}

export interface ClassroomEntregaAdjunto {
  idClassroomEntregaAdjunto: string;
  idClassroomEntrega: string;
  urlArchivo: string;
  nombreArchivo: string;
}

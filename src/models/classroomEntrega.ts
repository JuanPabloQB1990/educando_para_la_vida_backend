import type { ClassroomEntregaEstado } from '../enums/classroomEntrega.enum';

export interface ClassroomEntregaRow {
  id: string;
  id_classroom_tarea: string;
  id_estudiante: string;
  fecha_entrega: Date;
  estado: ClassroomEntregaEstado;
  observacion_profesor: string | null;
  titulo_tarea?: string;
  nombre_estudiante?: string;
}

export interface ClassroomEntrega {
  id: string;
  idClassroomTarea: string;
  idEstudiante: string;
  fechaEntrega: Date;
  estado: ClassroomEntregaEstado;
  observacionProfesor: string | null;
  tituloTarea?: string;
  nombreEstudiante?: string;
}

export interface ClassroomEntregaAdjuntoRow {
  id: string;
  id_classroom_entrega: string;
  url_archivo: string;
  nombre_archivo: string;
}

export interface ClassroomEntregaAdjunto {
  id: string;
  idClassroomEntrega: string;
  urlArchivo: string;
  nombreArchivo: string;
}

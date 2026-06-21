import { z } from 'zod';

export const classroomEntregaListSchema = z.object({
  idTarea: z.string().optional(),
  idEstudiante: z.string().optional(),
  idCargaAcademica: z.string().optional(),
  idPeriodo: z.string().optional(),
}).refine(
  data => data.idTarea || data.idEstudiante || data.idCargaAcademica,
  { message: 'Se requiere idTarea, idEstudiante o idCargaAcademica' }
);

export const classroomEntregaCreateSchema = z.object({
  idClassroomTarea: z.string().min(1, 'idClassroomTarea es requerido'),
  idEstudiante: z.string().min(1, 'idEstudiante es requerido'),
});

export const classroomEntregaUpdateEstadoSchema = z.object({
  estadoEntrega: z.string().min(1, 'estadoEntrega es requerido'),
  observacionProfesor: z.string().optional(),
});

export const classroomEntregaAdjuntoSchema = z.object({
  urlArchivo: z.string().min(1, 'urlArchivo es requerido'),
  nombreArchivo: z.string().min(1, 'nombreArchivo es requerido'),
});

export const classroomEntregaCreateForEstudianteSchema = z.object({
  idClassroomTarea: z.string().min(1, 'idClassroomTarea es requerido'),
});

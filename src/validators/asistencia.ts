import { z } from 'zod';

export const asistenciaListSchema = z.object({
  idEstudiante: z.string().optional(),
  idGradoEducacion: z.string().optional(),
  idPeriodo: z.string().optional(),
}).refine(
  data => data.idEstudiante || (data.idGradoEducacion && data.idPeriodo),
  { message: 'Se requiere idEstudiante o (idGradoEducacion + idPeriodo)' }
);

export const asistenciaCreateSchema = z.object({
  idEstudiante: z.string().min(1, 'idEstudiante es requerido'),
  idActividad: z.string().min(1, 'idActividad es requerido'),
  fecha: z.string().min(1, 'fecha es requerida'),
  estadoAsistencia: z.string().min(1, 'estadoAsistencia es requerido'),
  observacion: z.string().optional(),
});

export const asistenciaUpsertSchema = z.object({
  idEstudiante: z.string().min(1, 'idEstudiante es requerido'),
  idActividad: z.string().min(1, 'idActividad es requerido'),
  fecha: z.string().min(1, 'fecha es requerida'),
  estadoAsistencia: z.string().optional(),
  observacion: z.string().optional(),
});

export const asistenciaUpdateSchema = z.object({
  fecha: z.string().min(1, 'fecha es requerida'),
  estadoAsistencia: z.string().min(1, 'estadoAsistencia es requerido'),
  observacion: z.string().optional(),
});

export const asistenciaUpdateFechaSchema = z.object({
  idActividad: z.string().min(1, 'idActividad es requerido'),
  fechaActual: z.string().min(1, 'fechaActual es requerida'),
  fechaNueva: z.string().min(1, 'fechaNueva es requerida'),
});

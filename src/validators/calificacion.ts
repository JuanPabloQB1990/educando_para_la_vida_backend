import { z } from 'zod';

export const calificacionListSchema = z.object({
  idActividadMateria: z.string().optional(),
  idEstudiante: z.string().optional(),
  idPeriodo: z.string().optional(),
}).refine(
  data => data.idActividadMateria || data.idEstudiante,
  { message: 'Se requiere idActividadMateria o idEstudiante' }
);

export const calificacionCreateSchema = z.object({
  idEstudiante: z.string().min(1, 'idEstudiante es requerido'),
  idActividadMateria: z.string().min(1, 'idActividadMateria es requerido'),
  nota: z.number({ required_error: 'nota es requerida', invalid_type_error: 'nota debe ser un número' }),
  observacion: z.string().optional(),
});

export const calificacionUpdateSchema = z.object({
  nota: z.number({ required_error: 'nota es requerida', invalid_type_error: 'nota debe ser un número' }),
  observacion: z.string().optional(),
});

import { z } from 'zod';

export const autoevaluacionUpsertSchema = z.object({
  idEstudiante: z.string().min(1, 'idEstudiante es requerido'),
  idPeriodo: z.string().min(1, 'idPeriodo es requerido'),
  idGradoEducacion: z.string().min(1, 'idGradoEducacion es requerido'),
  nota: z.number({ required_error: 'nota es requerida', invalid_type_error: 'nota debe ser un número' }),
  observacion: z.string().optional().nullable(),
});

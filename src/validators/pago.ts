import { z } from 'zod';

export const pagoVerificarSchema = z.object({
  accion: z.enum(['aprobado', 'rechazado'], { errorMap: () => ({ message: 'acción debe ser aprobado o rechazado' }) }),
  observaciones: z.string().optional(),
  idObligacionPago: z.string().optional(),
  montoPagado: z.string().optional(),
});

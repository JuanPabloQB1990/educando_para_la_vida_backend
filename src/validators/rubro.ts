import { z } from 'zod';

export const rubroBodySchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  montoBase: z.number({ required_error: 'El monto base es requerido', invalid_type_error: 'El monto base debe ser un número' }),
  descripcion: z.string().optional(),
});

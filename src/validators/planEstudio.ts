import { z } from 'zod';

export const planEstudioCreateSchema = z.object({
  idGradoEducacion: z.string().min(1, 'idGradoEducacion es requerido'),
  idMateria: z.string().min(1, 'idMateria es requerido'),
});

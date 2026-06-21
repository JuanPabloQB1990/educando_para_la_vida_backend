import { z } from 'zod';

export const materiaBodySchema = z.object({
  nombreMateria: z.string().min(1, 'nombreMateria es requerido'),
  abreviatura: z.string().min(1, 'abreviatura es requerida'),
});

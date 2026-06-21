import { z } from 'zod';

export const cargaAcademicaCreateSchema = z.object({
  idUsuario: z.string().min(1, 'idUsuario es requerido'),
  idMateria: z.string().min(1, 'idMateria es requerido'),
  idGradoEducacion: z.string().min(1, 'idGradoEducacion es requerido'),
  idAnioElectivo: z.string().min(1, 'idAnioElectivo es requerido'),
  idBloque: z.string().optional().nullable(),
});

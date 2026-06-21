import { z } from 'zod';

export const planillaQuerySchema = z.object({
  idGradoEducacion: z.string().min(1, 'idGradoEducacion es requerido'),
  idAnioElectivo: z.string().min(1, 'idAnioElectivo es requerido'),
  idPeriodo: z.string().min(1, 'idPeriodo es requerido'),
});

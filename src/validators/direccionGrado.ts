import { z } from 'zod';

export const direccionGradoBodySchema = z.object({
  idGradoEducacion: z.string().optional().nullable(),
  idUsuario: z.string().min(1, 'idUsuario es requerido'),
  idAnioElectivo: z.string().min(1, 'idAnioElectivo es requerido'),
  idBloque: z.string().optional().nullable(),
});

export const direccionGradoUpdateLinkSchema = z.object({
  linkClaseVirtual: z.string().min(1, 'linkClaseVirtual es requerido'),
});

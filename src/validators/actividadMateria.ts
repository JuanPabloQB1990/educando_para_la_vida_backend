import { z } from 'zod';

export const actividadMateriaListSchema = z.object({
  idActividad: z.string().min(1, 'idActividad es requerido'),
});

export const actividadMateriaCreateSchema = z.object({
  idActividad: z.string().min(1, 'idActividad es requerido'),
  idMateria: z.string().min(1, 'idMateria es requerido'),
  idCargaAcademica: z.string().min(1, 'idCargaAcademica es requerido'),
});

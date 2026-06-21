import { z } from 'zod';

export const actividadListSchema = z.object({
  idGradoEducacion: z.string().min(1, 'idGradoEducacion es requerido'),
  idPeriodo: z.string().min(1, 'idPeriodo es requerido'),
});

export const actividadCreateSchema = z.object({
  idPeriodo: z.string().min(1, 'idPeriodo es requerido'),
  idGradoEducacion: z.string().min(1, 'idGradoEducacion es requerido'),
  nombreActividad: z.string().min(1, 'nombreActividad es requerido'),
});

export const actividadUpdateSchema = z.object({
  nombreActividad: z.string().min(1, 'nombreActividad es requerido'),
});

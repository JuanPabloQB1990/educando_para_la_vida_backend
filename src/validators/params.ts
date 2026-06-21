import { z } from 'zod';

const ID_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z_[0-9a-fA-F-]{36}$/;
const idField = z.string().regex(ID_REGEX, 'El id debe tener formato timestamp_uuid');

export const idParamsSchema = z.object({ id: idField });

export const adjuntoParamsSchema = z.object({
  id: idField,
  adjuntoId: idField,
});

export const gradosPorMatriculaParamsSchema = z.object({
  id_ep: idField,
  id_g: idField,
});

export const bloqueParamsSchema = z.object({ idBloque: idField });

export const bloqueGradoParamsSchema = z.object({
  idBloque: idField,
  idGradoEducacion: idField,
});

export const nameParamsSchema = z.object({
  name: z.string().min(1, 'name es requerido'),
});

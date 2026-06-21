import { z } from 'zod';

export const classroomTareaListSchema = z.object({
  idCargaAcademica: z.string().optional(),
  idGradoEducacion: z.string().optional(),
  idAnioElectivo: z.string().optional(),
}).refine(
  data => data.idCargaAcademica || (data.idGradoEducacion && data.idAnioElectivo),
  { message: 'Se requiere idCargaAcademica o (idGradoEducacion + idAnioElectivo)' }
);

export const classroomTareaCreateSchema = z.object({
  idCargaAcademica: z.string().min(1, 'idCargaAcademica es requerido'),
  idPeriodo: z.string().optional().nullable(),
  titulo: z.string().min(1, 'titulo es requerido'),
  instrucciones: z.string().min(1, 'instrucciones son requeridas'),
  fechaLimite: z.string().min(1, 'fechaLimite es requerida'),
});

export const classroomTareaUpdateSchema = z.object({
  titulo: z.string().min(1, 'titulo es requerido'),
  instrucciones: z.string().min(1, 'instrucciones son requeridas'),
  fechaLimite: z.string().min(1, 'fechaLimite es requerida'),
});

import { z } from 'zod';
import { PeriodoEstado } from '../enums/periodo.enum';

export const periodoUpdateEstadoSchema = z.object({
  estado: z.nativeEnum(PeriodoEstado, { errorMap: () => ({ message: 'Estado inválido. Valores permitidos: activo, cerrado' }) }),
});

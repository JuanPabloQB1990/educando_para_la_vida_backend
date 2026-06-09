import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import PeriodoService from '../services/PeriodoService';
import { PeriodoEstado } from '../enums/periodo.enum';
import { AppError } from '../error/AppError';

const updateEstadoSchema = z.object({
  estado: z.nativeEnum(PeriodoEstado),
});

class PeriodoController {
  async list(req: Request, res: Response) {
    const { idAnioElectivo } = req.query;
    const data = idAnioElectivo
      ? await PeriodoService.listByAnio(idAnioElectivo as string)
      : await PeriodoService.list();
    res.json({ success: true, message: 'Periodos obtenidos', data, error: null });
  }

  async get(req: Request, res: Response) {
    const id = req.params.id as string;
    const data = await PeriodoService.get(id);
    if (!data) return res.status(404).json({ success: false, message: 'Periodo no encontrado', data: null, error: 'Not found' });
    res.json({ success: true, message: 'Periodo obtenido', data, error: null });
  }

  async updateEstado(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const parsed = updateEstadoSchema.safeParse(req.body);
      if (!parsed.success) throw new AppError(400, parsed.error.errors[0].message);
      await PeriodoService.updateEstado(id, parsed.data.estado);
      res.json({ success: true, message: 'Estado del periodo actualizado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new PeriodoController();

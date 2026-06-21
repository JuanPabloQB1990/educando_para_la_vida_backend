import type { Request, Response, NextFunction } from 'express';
import PeriodoService from '../services/PeriodoService';

class PeriodoController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { idAnioElectivo } = req.query;
      const data = idAnioElectivo
        ? await PeriodoService.listByAnio(idAnioElectivo as string)
        : await PeriodoService.list();
      res.json({ success: true, message: 'Periodos obtenidos', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PeriodoService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Periodo obtenido', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async updateEstado(req: Request, res: Response, next: NextFunction) {
    try {
      const { estado } = req.body;
      await PeriodoService.updateEstado(req.validated!.params.id, estado);
      res.json({ success: true, message: 'Estado del periodo actualizado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new PeriodoController();

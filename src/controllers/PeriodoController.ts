import type { Request, Response } from 'express';
import PeriodoService from '../services/PeriodoService';

class PeriodoController {
  async list(req: Request, res: Response) {
    const { idAnioElectivo } = req.query;
    const data = idAnioElectivo
      ? await PeriodoService.listByAnio(idAnioElectivo as string)
      : await PeriodoService.list();
    res.json({ success: true, message: 'Periodos obtenidos', data, error: null });
  }

  async get(req: Request, res: Response) {
    const data = await PeriodoService.get(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Periodo no encontrado', data: null, error: 'Not found' });
    res.json({ success: true, message: 'Periodo obtenido', data, error: null });
  }
}

export default new PeriodoController();

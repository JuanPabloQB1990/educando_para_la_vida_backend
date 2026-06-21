import type { Request, Response, NextFunction } from 'express';
import PlanillaService from '../services/PlanillaService';

class PlanillaController {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { idGradoEducacion, idAnioElectivo, idPeriodo } = req.query;
      const data = await PlanillaService.getPlanilla(
        idGradoEducacion as string,
        idAnioElectivo as string,
        idPeriodo as string
      );
      res.json({ success: true, message: 'Planilla académica obtenida', data, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new PlanillaController();

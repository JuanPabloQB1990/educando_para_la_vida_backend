import type { Request, Response } from 'express';
import PlanillaService from '../services/PlanillaService';

class PlanillaController {
  async get(req: Request, res: Response) {
    const { idGradoEducacion, idAnioElectivo, idPeriodo } = req.query;
    if (!idGradoEducacion || !idAnioElectivo || !idPeriodo) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren idGradoEducacion, idAnioElectivo e idPeriodo',
        data: null,
        error: 'Params faltantes',
      });
    }
    const data = await PlanillaService.getPlanilla(
      idGradoEducacion as string,
      idAnioElectivo as string,
      idPeriodo as string
    );
    console.log(data);
    
    res.json({ success: true, message: 'Planilla académica obtenida', data, error: null });
  }
}

export default new PlanillaController();

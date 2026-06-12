import type { Request, Response, NextFunction } from 'express';
import AutoevaluacionService from '../services/AutoevaluacionService';

class AutoevaluacionController {
  async upsert(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);
    
    try {
      const { idEstudiante, idPeriodo, idGradoEducacion, nota, observacion } = req.body;
      if (!idEstudiante || !idPeriodo || !idGradoEducacion || nota === undefined) {
        return res.status(400).json({ success: false, message: 'Campos requeridos faltantes', data: null, error: 'Datos faltantes' });
      }
      const data = await AutoevaluacionService.upsert({
        idEstudiante,
        idPeriodo,
        idGradoEducacion,
        nota: Number(nota),
        observacion: observacion ?? null,
      });
      res.status(200).json({ success: true, message: 'Autoevaluación guardada', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await AutoevaluacionService.delete(req.params.id);
      res.json({ success: true, message: 'Autoevaluación eliminada', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new AutoevaluacionController();

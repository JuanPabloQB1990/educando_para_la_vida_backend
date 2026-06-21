import type { Request, Response, NextFunction } from 'express';
import tiempoService from '../services/TiempoValidacionService';

class TiempoValidacionController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tiempoService.list();
      res.json({ success: true, message: 'Tiempos de validación listados', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tiempoService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Tiempo de validación encontrado', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { tiempo } = req.body;
      const data = await tiempoService.create(tiempo);
      res.status(201).json({ success: true, message: 'Tiempo de validación creado', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { tiempo } = req.body;
      const data = await tiempoService.update(req.validated!.params.id, tiempo);
      res.json({ success: true, message: 'Tiempo de validación actualizado', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await tiempoService.delete(req.validated!.params.id);
      res.json({ success: true, message: 'Tiempo de validación eliminado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new TiempoValidacionController();

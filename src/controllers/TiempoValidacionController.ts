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
      const id = req.params.id as string;
      const data = await tiempoService.get(id);
      if (!data) return res.status(404).json({ success: false, message: 'No encontrado', data: null, error: null });
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
      const id = req.params.id as string;
      const { tiempo } = req.body;
      const data = await tiempoService.update(id, tiempo);
      res.json({ success: true, message: 'Tiempo de validación actualizado', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await tiempoService.delete(id);
      res.json({ success: true, message: 'Tiempo de validación eliminado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new TiempoValidacionController();

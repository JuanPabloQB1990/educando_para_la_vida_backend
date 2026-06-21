import type { Request, Response, NextFunction } from 'express';
import bloqueService from '../services/BloqueService';

class BloqueController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await bloqueService.list();
      res.json({ success: true, message: 'Bloques obtenidos', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await bloqueService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Bloque obtenido', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre } = req.body;
      const data = await bloqueService.create(nombre);
      res.status(201).json({ success: true, message: 'Bloque creado', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre } = req.body;
      await bloqueService.update(req.validated!.params.id, nombre);
      res.json({ success: true, message: 'Bloque actualizado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await bloqueService.delete(req.validated!.params.id);
      res.json({ success: true, message: 'Bloque eliminado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new BloqueController();

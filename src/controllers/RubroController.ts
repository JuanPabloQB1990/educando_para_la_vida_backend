import type { Request, Response, NextFunction } from 'express';
import RubroService from '../services/RubroService';

class RubroController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await RubroService.list();
      res.json({ success: true, message: 'Rubros obtenidos', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await RubroService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Rubro obtenido', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre, montoBase, descripcion } = req.body;
      const data = await RubroService.create({ nombre, monto_base: montoBase, descripcion });
      res.status(201).json({ success: true, message: 'Rubro creado', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre, montoBase, descripcion } = req.body;
      const data = await RubroService.update(req.validated!.params.id, { nombre, monto_base: montoBase, descripcion });
      res.json({ success: true, message: 'Rubro actualizado', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await RubroService.delete(req.validated!.params.id);
      res.json({ success: true, message: 'Rubro eliminado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new RubroController();

import type { Request, Response, NextFunction } from 'express';
import tipoEstudioService from '../services/TipoEstudioService';

class TipoEstudioController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tipoEstudioService.list();
      res.json({ success: true, message: 'Tipos de estudio obtenidos', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tipoEstudioService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Tipo de estudio obtenido', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre } = req.body;
      const result = await tipoEstudioService.create(nombre);
      res.status(201).json({ success: true, message: 'Tipo de estudio creado', data: result, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre } = req.body;
      await tipoEstudioService.update(req.validated!.params.id, nombre);
      res.json({ success: true, message: 'Tipo de estudio actualizado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await tipoEstudioService.delete(req.validated!.params.id);
      res.json({ success: true, message: 'Tipo de estudio eliminado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new TipoEstudioController();

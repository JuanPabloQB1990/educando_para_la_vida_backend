import type { Request, Response, NextFunction } from 'express';
import gradoService from '../services/GradoEducacionService';

class GradoEducacionController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await gradoService.list();
      res.json({ success: true, message: 'Grados obtenidos', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await gradoService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Grado obtenido', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre } = req.body;
      const result = await gradoService.create(nombre);
      res.status(201).json({ success: true, message: 'Grado creado', data: result, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre } = req.body;
      await gradoService.update(req.validated!.params.id, nombre);
      res.json({ success: true, message: 'Grado actualizado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await gradoService.delete(req.validated!.params.id);
      res.json({ success: true, message: 'Grado eliminado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new GradoEducacionController();

import type { Request, Response, NextFunction } from 'express';
import GradosPorMatriculaService from '../services/GradosPorMatriculaService';

class GradosPorMatriculaController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await GradosPorMatriculaService.list();
      res.json({ success: true, message: 'Grados por matrícula obtenidos', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await GradosPorMatriculaService.get(req.validated!.params.id_ep, req.validated!.params.id_g);
      res.json({ success: true, message: 'Grado por matrícula obtenido', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GradosPorMatriculaService.create(req.body);
      res.status(201).json({ success: true, message: 'Grado por matrícula creado', data: result, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      await GradosPorMatriculaService.update(req.validated!.params.id_ep, req.validated!.params.id_g, req.body);
      res.json({ success: true, message: 'Grado por matrícula actualizado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await GradosPorMatriculaService.delete(req.validated!.params.id_ep, req.validated!.params.id_g);
      res.json({ success: true, message: 'Grado por matrícula eliminado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new GradosPorMatriculaController();

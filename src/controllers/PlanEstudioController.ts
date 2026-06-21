import type { Request, Response, NextFunction } from 'express';
import PlanEstudioService from '../services/PlanEstudioService';

class PlanEstudioController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { idGradoEducacion } = req.query;
      const data = idGradoEducacion
        ? await PlanEstudioService.listByGrado(idGradoEducacion as string)
        : await PlanEstudioService.list();
      res.json({ success: true, message: 'Plan de estudio obtenido', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PlanEstudioService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Plan de estudio obtenido', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { idGradoEducacion, idMateria } = req.body;
      const data = await PlanEstudioService.create(idGradoEducacion, idMateria);
      res.status(201).json({ success: true, message: 'Plan de estudio creado', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await PlanEstudioService.delete(req.validated!.params.id);
      res.json({ success: true, message: 'Plan de estudio eliminado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new PlanEstudioController();

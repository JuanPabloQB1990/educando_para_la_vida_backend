import type { Request, Response, NextFunction } from 'express';
import ActividadService from '../services/ActividadService';

class ActividadController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { idGradoEducacion, idPeriodo } = req.query;
      const data = await ActividadService.listByGradoPeriodo(idGradoEducacion as string, idPeriodo as string);
      res.json({ success: true, message: 'Actividades obtenidas', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ActividadService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Actividad obtenida', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { idPeriodo, idGradoEducacion, nombreActividad } = req.body;
      const data = await ActividadService.create({ idPeriodo, idGradoEducacion, nombreActividad });
      res.status(201).json({ success: true, message: 'Actividad creada', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombreActividad } = req.body;
      const data = await ActividadService.update(req.validated!.params.id, { nombreActividad });
      res.json({ success: true, message: 'Actividad actualizada', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ActividadService.delete(req.validated!.params.id);
      res.json({ success: true, message: 'Actividad eliminada', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new ActividadController();

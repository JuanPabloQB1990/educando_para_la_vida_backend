import type { Request, Response, NextFunction } from 'express';
import ActividadMateriaService from '../services/ActividadMateriaService';

class ActividadMateriaController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { idActividad } = req.query;
      const data = await ActividadMateriaService.listByActividad(idActividad as string);
      res.json({ success: true, message: 'Actividades-materia obtenidas', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ActividadMateriaService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Actividad-materia obtenida', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { idActividad, idMateria, idCargaAcademica } = req.body;
      const data = await ActividadMateriaService.create({ idActividad, idMateria, idCargaAcademica });
      res.status(201).json({ success: true, message: 'Actividad-materia creada', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ActividadMateriaService.delete(req.validated!.params.id);
      res.json({ success: true, message: 'Actividad-materia eliminada', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new ActividadMateriaController();

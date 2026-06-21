import type { Request, Response, NextFunction } from 'express';
import CalificacionService from '../services/CalificacionService';

class CalificacionController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { idActividadMateria, idEstudiante, idPeriodo } = req.query;
      let data;
      if (idEstudiante) {
        data = await CalificacionService.listByEstudiante(idEstudiante as string, idPeriodo as string | undefined);
      } else {
        data = await CalificacionService.listByActividadMateria(idActividadMateria as string);
      }
      res.json({ success: true, message: 'Calificaciones obtenidas', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CalificacionService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Calificación obtenida', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { idEstudiante, idActividadMateria, nota, observacion } = req.body;
      const data = await CalificacionService.create(
        { idEstudiante, idActividadMateria, nota: Number(nota), observacion },
        req.user
      );
      res.status(201).json({ success: true, message: 'Calificación creada', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { nota, observacion } = req.body;
      const data = await CalificacionService.update(
        req.validated!.params.id,
        { nota: Number(nota), observacion },
        req.user
      );
      res.json({ success: true, message: 'Calificación actualizada', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await CalificacionService.delete(req.validated!.params.id);
      res.json({ success: true, message: 'Calificación eliminada', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new CalificacionController();

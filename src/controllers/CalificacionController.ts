import type { Request, Response, NextFunction } from 'express';
import CalificacionService from '../services/CalificacionService';

class CalificacionController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { idActividadMateria, idEstudiante, idPeriodo } = req.query;
      let data;
      if (idEstudiante) {
        data = await CalificacionService.listByEstudiante(idEstudiante as string, idPeriodo as string | undefined);
      } else if (idActividadMateria) {
        data = await CalificacionService.listByActividadMateria(idActividadMateria as string);
      } else {
        return res.status(400).json({ success: false, message: 'Se requiere idActividadMateria o idEstudiante', data: null, error: 'Param faltante' });
      }
      res.json({ success: true, message: 'Calificaciones obtenidas', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CalificacionService.get(req.params.id as string);
      if (!data) return res.status(404).json({ success: false, message: 'Calificación no encontrada', data: null, error: 'Not found' });
      res.json({ success: true, message: 'Calificación obtenida', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { idEstudiante, idActividadMateria, nota, observacion } = req.body;
      if (!idEstudiante || !idActividadMateria || nota == null) {
        return res.status(400).json({ success: false, message: 'Campos requeridos faltantes', data: null, error: 'Datos faltantes' });
      }
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
      if (nota == null) {
        return res.status(400).json({ success: false, message: 'nota es requerida', data: null, error: 'Dato faltante' });
      }
      const data = await CalificacionService.update(
        req.params.id as string,
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
      await CalificacionService.delete(req.params.id as string);
      res.json({ success: true, message: 'Calificación eliminada', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new CalificacionController();

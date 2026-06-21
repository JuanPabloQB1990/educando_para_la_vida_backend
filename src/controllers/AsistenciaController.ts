import type { Request, Response, NextFunction } from 'express';
import AsistenciaService from '../services/AsistenciaService';

class AsistenciaController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { idGradoEducacion, idPeriodo, idEstudiante } = req.query;
      let data;
      if (idEstudiante) {
        data = await AsistenciaService.listByEstudiante(idEstudiante as string, idPeriodo as string | undefined);
      } else {
        data = await AsistenciaService.listByGradoPeriodo(idGradoEducacion as string, idPeriodo as string);
      }
      res.json({ success: true, message: 'Asistencias obtenidas', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AsistenciaService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Asistencia obtenida', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { idEstudiante, idActividad, fecha, estadoAsistencia, observacion } = req.body;
      const data = await AsistenciaService.create({ idEstudiante, idActividad, fecha, estadoAsistencia, observacion });
      res.status(201).json({ success: true, message: 'Asistencia registrada', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async upsert(req: Request, res: Response, next: NextFunction) {
    try {
      const { idEstudiante, idActividad, fecha, estadoAsistencia, observacion } = req.body;
      const data = await AsistenciaService.upsert({ idEstudiante, idActividad, fecha, estadoAsistencia, observacion });
      res.status(200).json({ success: true, message: 'Asistencia guardada', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { fecha, estadoAsistencia, observacion } = req.body;
      const data = await AsistenciaService.update(req.validated!.params.id, { fecha, estadoAsistencia, observacion });
      res.json({ success: true, message: 'Asistencia actualizada', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async updateFecha(req: Request, res: Response, next: NextFunction) {
    try {
      const { idActividad, fechaActual, fechaNueva } = req.body;
      const data = await AsistenciaService.updateFechaSesion(idActividad, fechaActual, fechaNueva);
      res.json({ success: true, message: 'Fecha de sesión actualizada', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await AsistenciaService.delete(req.validated!.params.id);
      res.json({ success: true, message: 'Asistencia eliminada', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new AsistenciaController();

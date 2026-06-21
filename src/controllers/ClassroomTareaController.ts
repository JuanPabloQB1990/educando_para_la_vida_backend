import type { Request, Response, NextFunction } from 'express';
import ClassroomTareaService from '../services/ClassroomTareaService';

class ClassroomTareaController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { idCargaAcademica, idGradoEducacion, idAnioElectivo } = req.query;
      let data;
      if (idCargaAcademica) {
        data = await ClassroomTareaService.listByCarga(idCargaAcademica as string);
      } else {
        data = await ClassroomTareaService.listByGrado(idGradoEducacion as string, idAnioElectivo as string);
      }
      res.json({ success: true, message: 'Tareas obtenidas', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ClassroomTareaService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Tarea obtenida', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { idCargaAcademica, idPeriodo, titulo, instrucciones, fechaLimite } = req.body;
      const data = await ClassroomTareaService.create({ idCargaAcademica, idPeriodo: idPeriodo || null, titulo, instrucciones, fechaLimite });
      res.status(201).json({ success: true, message: 'Tarea creada', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { titulo, instrucciones, fechaLimite } = req.body;
      const data = await ClassroomTareaService.update(req.validated!.params.id, { titulo, instrucciones, fechaLimite });
      res.json({ success: true, message: 'Tarea actualizada', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ClassroomTareaService.delete(req.validated!.params.id);
      res.json({ success: true, message: 'Tarea eliminada', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }

  async listAdjuntos(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ClassroomTareaService.listAdjuntos(req.validated!.params.id);
      res.json({ success: true, message: 'Adjuntos obtenidos', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async createAdjuntos(req: Request, res: Response, next: NextFunction) {
    try {
      const files = (req as any).files as Express.Multer.File[] | undefined;
      if (!files || files.length === 0) {
        return res.status(400).json({ success: false, message: 'Se requiere al menos un archivo', data: null, error: null });
      }
      const data = await ClassroomTareaService.createAdjuntos(req.validated!.params.id, files);
      res.status(201).json({ success: true, message: 'Adjuntos subidos', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async deleteAdjunto(req: Request, res: Response, next: NextFunction) {
    try {
      await ClassroomTareaService.deleteAdjunto(req.validated!.params.adjuntoId);
      res.json({ success: true, message: 'Adjunto eliminado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }

  async listForEstudiante(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ClassroomTareaService.listForEstudiante(req.user!.id);
      res.json({ success: true, message: 'Tareas obtenidas', data, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new ClassroomTareaController();

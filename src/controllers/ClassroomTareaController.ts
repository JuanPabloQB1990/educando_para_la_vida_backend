import type { Request, Response, NextFunction } from 'express';
import ClassroomTareaService from '../services/ClassroomTareaService';

class ClassroomTareaController {
  async list(req: Request, res: Response) {
    const { idCargaAcademica, idGradoEducacion, idAnioElectivo } = req.query;
    let data;
    if (idCargaAcademica) {
      data = await ClassroomTareaService.listByCarga(idCargaAcademica as string);
    } else if (idGradoEducacion && idAnioElectivo) {
      data = await ClassroomTareaService.listByGrado(idGradoEducacion as string, idAnioElectivo as string);
    } else {
      return res.status(400).json({ success: false, message: 'Se requiere idCargaAcademica o (idGradoEducacion + idAnioElectivo)', data: null, error: 'Params faltantes' });
    }
    res.json({ success: true, message: 'Tareas obtenidas', data, error: null });
  }

  async get(req: Request, res: Response) {
    const data = await ClassroomTareaService.get(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Tarea no encontrada', data: null, error: 'Not found' });
    res.json({ success: true, message: 'Tarea obtenida', data, error: null });
  }

  async create(req: Request, res: Response) {
    const { idCargaAcademica, idPeriodo, titulo, instrucciones, fechaLimite } = req.body;
    if (!idCargaAcademica || !idPeriodo || !titulo || !instrucciones || !fechaLimite) {
      return res.status(400).json({ success: false, message: 'Todos los campos son requeridos', data: null, error: 'Datos faltantes' });
    }
    const data = await ClassroomTareaService.create({ idCargaAcademica, idPeriodo, titulo, instrucciones, fechaLimite });
    res.status(201).json({ success: true, message: 'Tarea creada', data, error: null });
  }

  async update(req: Request, res: Response) {
    const { titulo, instrucciones, fechaLimite } = req.body;
    if (!titulo || !instrucciones || !fechaLimite) {
      return res.status(400).json({ success: false, message: 'Todos los campos son requeridos', data: null, error: 'Datos faltantes' });
    }
    const data = await ClassroomTareaService.update(req.params.id, { titulo, instrucciones, fechaLimite });
    res.json({ success: true, message: 'Tarea actualizada', data, error: null });
  }

  async delete(req: Request, res: Response) {
    await ClassroomTareaService.delete(req.params.id);
    res.json({ success: true, message: 'Tarea eliminada', data: null, error: null });
  }

  async listAdjuntos(req: Request, res: Response) {
    const data = await ClassroomTareaService.listAdjuntos(req.params.id);
    res.json({ success: true, message: 'Adjuntos obtenidos', data, error: null });
  }

  async createAdjuntos(req: Request, res: Response) {
    const files = (req as any).files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'Se requiere al menos un archivo', data: null, error: 'Datos faltantes' });
    }
    const data = await ClassroomTareaService.createAdjuntos(req.params.id, files);
    res.status(201).json({ success: true, message: 'Adjuntos subidos', data, error: null });
  }

  async deleteAdjunto(req: Request, res: Response) {
    await ClassroomTareaService.deleteAdjunto(req.params.adjuntoId);
    res.json({ success: true, message: 'Adjunto eliminado', data: null, error: null });
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

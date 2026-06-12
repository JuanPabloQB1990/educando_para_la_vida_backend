import type { Request, Response } from 'express';
import ActividadService from '../services/ActividadService';

class ActividadController {
  async list(req: Request, res: Response) {
    const { idGradoEducacion, idPeriodo } = req.query;
    if (!idGradoEducacion || !idPeriodo) {
      return res.status(400).json({ success: false, message: 'idGradoEducacion e idPeriodo son requeridos', data: null, error: 'Params faltantes' });
    }
    const data = await ActividadService.listByGradoPeriodo(idGradoEducacion as string, idPeriodo as string);
    res.json({ success: true, message: 'Actividades obtenidas', data, error: null });
  }

  async get(req: Request, res: Response) {
    const data = await ActividadService.get(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Actividad no encontrada', data: null, error: 'Not found' });
    res.json({ success: true, message: 'Actividad obtenida', data, error: null });
  }

  async create(req: Request, res: Response) {
    const { idPeriodo, idGradoEducacion, nombreActividad } = req.body;
    if (!idPeriodo || !idGradoEducacion || !nombreActividad) {
      return res.status(400).json({ success: false, message: 'Campos requeridos faltantes', data: null, error: 'Datos faltantes' });
    }
    const data = await ActividadService.create({ idPeriodo, idGradoEducacion, nombreActividad });
    res.status(201).json({ success: true, message: 'Actividad creada', data, error: null });
  }

  async update(req: Request, res: Response) {
    const { nombreActividad } = req.body;
    if (!nombreActividad) {
      return res.status(400).json({ success: false, message: 'nombreActividad es requerido', data: null, error: 'Datos faltantes' });
    }
    const data = await ActividadService.update(req.params.id, { nombreActividad });
    res.json({ success: true, message: 'Actividad actualizada', data, error: null });
  }

  async delete(req: Request, res: Response) {
    await ActividadService.delete(req.params.id);
    res.json({ success: true, message: 'Actividad eliminada', data: null, error: null });
  }
}

export default new ActividadController();

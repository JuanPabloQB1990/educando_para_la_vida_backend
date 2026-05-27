import type { Request, Response } from 'express';
import PlanEstudioService from '../services/PlanEstudioService';

class PlanEstudioController {
  async list(req: Request, res: Response) {
    const { idGradoEducacion } = req.query;
    const data = idGradoEducacion
      ? await PlanEstudioService.listByGrado(idGradoEducacion as string)
      : await PlanEstudioService.list();
    res.json({ success: true, message: 'Plan de estudio obtenido', data, error: null });
  }

  async get(req: Request, res: Response) {
    const data = await PlanEstudioService.get(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'No encontrado', data: null, error: 'Not found' });
    res.json({ success: true, message: 'Plan de estudio obtenido', data, error: null });
  }

  async create(req: Request, res: Response) {
    const { idGradoEducacion, idMateria } = req.body;
    if (!idGradoEducacion || !idMateria) {
      return res.status(400).json({ success: false, message: 'idGradoEducacion e idMateria son requeridos', data: null, error: 'Datos faltantes' });
    }
    const data = await PlanEstudioService.create(idGradoEducacion, idMateria);
    res.status(201).json({ success: true, message: 'Plan de estudio creado', data, error: null });
  }

  async delete(req: Request, res: Response) {
    await PlanEstudioService.delete(req.params.id);
    res.json({ success: true, message: 'Plan de estudio eliminado', data: null, error: null });
  }
}

export default new PlanEstudioController();

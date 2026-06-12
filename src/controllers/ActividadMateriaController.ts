import type { Request, Response } from 'express';
import ActividadMateriaService from '../services/ActividadMateriaService';

class ActividadMateriaController {
  async list(req: Request, res: Response) {
    const { idActividad } = req.query;
    if (!idActividad) {
      return res.status(400).json({ success: false, message: 'idActividad es requerido', data: null, error: 'Param faltante' });
    }
    const data = await ActividadMateriaService.listByActividad(idActividad as string);
    res.json({ success: true, message: 'Actividades-materia obtenidas', data, error: null });
  }

  async get(req: Request, res: Response) {
    const data = await ActividadMateriaService.get(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'No encontrado', data: null, error: 'Not found' });
    res.json({ success: true, message: 'Actividad-materia obtenida', data, error: null });
  }

  async create(req: Request, res: Response) {
    const { idActividad, idMateria, idCargaAcademica } = req.body;
    if (!idActividad || !idMateria || !idCargaAcademica) {
      return res.status(400).json({ success: false, message: 'Todos los campos son requeridos', data: null, error: 'Datos faltantes' });
    }
    const data = await ActividadMateriaService.create({ idActividad, idMateria, idCargaAcademica });
    res.status(201).json({ success: true, message: 'Actividad-materia creada', data, error: null });
  }

  async delete(req: Request, res: Response) {
    await ActividadMateriaService.delete(req.params.id);
    res.json({ success: true, message: 'Actividad-materia eliminada', data: null, error: null });
  }
}

export default new ActividadMateriaController();

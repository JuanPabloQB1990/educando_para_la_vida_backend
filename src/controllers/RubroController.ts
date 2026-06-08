import type { Request, Response } from 'express';
import RubroService from '../services/RubroService';
import { AppError } from '../error/AppError';

class RubroController {
  async list(_req: Request, res: Response) {
    const data = await RubroService.list();
    res.json({ success: true, message: 'Rubros obtenidos', data, error: null });
  }

  async get(req: Request, res: Response) {
    const id = req.params.id as string;
    const data = await RubroService.get(id);
    if (!data) throw new AppError(404, 'Rubro no encontrado');
    res.json({ success: true, message: 'Rubro obtenido', data, error: null });
  }

  async create(req: Request, res: Response) {
    const { nombre, montoBase, descripcion } = req.body;
    if (!nombre) throw new AppError(400, 'El nombre es requerido');
    if (montoBase === undefined || montoBase === null) throw new AppError(400, 'El monto base es requerido');
    const data = await RubroService.create({ nombre, monto_base: montoBase, descripcion });
    res.status(201).json({ success: true, message: 'Rubro creado', data, error: null });
  }

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const { nombre, montoBase, descripcion } = req.body;
    if (!nombre) throw new AppError(400, 'El nombre es requerido');
    if (montoBase === undefined || montoBase === null) throw new AppError(400, 'El monto base es requerido');
    const data = await RubroService.update(id, { nombre, monto_base: montoBase, descripcion });
    if (!data) throw new AppError(404, 'Rubro no encontrado');
    res.json({ success: true, message: 'Rubro actualizado', data, error: null });
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const existing = await RubroService.get(id);
    if (!existing) throw new AppError(404, 'Rubro no encontrado');
    await RubroService.delete(id);
    res.json({ success: true, message: 'Rubro eliminado', data: null, error: null });
  }
}

export default new RubroController();

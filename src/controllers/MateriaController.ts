import type { Request, Response } from 'express';
import MateriaService from '../services/MateriaService';

class MateriaController {
  async list(req: Request, res: Response) {
    const data = await MateriaService.list();
    res.json({ success: true, message: 'Materias obtenidas', data, error: null });
  }

  async get(req: Request, res: Response) {
    const data = await MateriaService.get(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Materia no encontrada', data: null, error: 'Not found' });
    res.json({ success: true, message: 'Materia obtenida', data, error: null });
  }

  async create(req: Request, res: Response) {
    const { nombreMateria } = req.body;
    if (!nombreMateria) return res.status(400).json({ success: false, message: 'nombreMateria es requerido', data: null, error: 'Dato faltante' });
    const data = await MateriaService.create(nombreMateria);
    res.status(201).json({ success: true, message: 'Materia creada', data, error: null });
  }

  async update(req: Request, res: Response) {
    const { nombreMateria } = req.body;
    if (!nombreMateria) return res.status(400).json({ success: false, message: 'nombreMateria es requerido', data: null, error: 'Dato faltante' });
    const data = await MateriaService.update(req.params.id, nombreMateria);
    res.json({ success: true, message: 'Materia actualizada', data, error: null });
  }

  async delete(req: Request, res: Response) {
    await MateriaService.delete(req.params.id);
    res.json({ success: true, message: 'Materia eliminada', data: null, error: null });
  }
}

export default new MateriaController();

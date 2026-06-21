import type { Request, Response, NextFunction } from 'express';
import MateriaService from '../services/MateriaService';

class MateriaController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await MateriaService.list();
      res.json({ success: true, message: 'Materias obtenidas', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await MateriaService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Materia obtenida', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombreMateria, abreviatura } = req.body;
      const data = await MateriaService.create(nombreMateria, abreviatura);
      res.status(201).json({ success: true, message: 'Materia creada', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombreMateria, abreviatura } = req.body;
      const data = await MateriaService.update(req.validated!.params.id, nombreMateria, abreviatura);
      res.json({ success: true, message: 'Materia actualizada', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await MateriaService.delete(req.validated!.params.id);
      res.json({ success: true, message: 'Materia eliminada', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new MateriaController();

import type { Request, Response, NextFunction } from 'express';
import AnioElectivoService from '../services/AnioElectivoService';

class AnioElectivoController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnioElectivoService.list();
      res.json({ success: true, message: 'Años electivos obtenidos', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnioElectivoService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Año electivo obtenido', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AnioElectivoService.create(req.body);
      res.status(201).json({ success: true, message: 'Año electivo creado', data: result, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.validated!.params.id;
      await AnioElectivoService.update(id, req.body);
      res.json({ success: true, message: 'Año electivo actualizado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.validated!.params.id;
      await AnioElectivoService.delete(id);
      res.json({ success: true, message: 'Año electivo eliminado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new AnioElectivoController();

import type { Request, Response } from 'express';
import tipoEstudioService from '../services/TipoEstudioService';

class TipoEstudioController {
  async list(req: Request, res: Response) {
    try {
      const data = await tipoEstudioService.list();
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error listing tipo_estudio' } });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = await tipoEstudioService.get(id);
      if (!data) return res.status(404).json({ success: false, data: null, error: { message: 'Not found' } });
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error fetching tipo_estudio' } });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { nombre } = req.body;
      const result = await tipoEstudioService.create(nombre);
      res.status(201).json({ success: true, data: result, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error creating tipo_estudio' } });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { nombre } = req.body;
      await tipoEstudioService.update(id, nombre);
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error updating tipo_estudio' } });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await tipoEstudioService.delete(id);
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error deleting tipo_estudio' } });
    }
  }
}

export default new TipoEstudioController();

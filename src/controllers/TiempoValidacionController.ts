import type { Request, Response } from 'express';
import tiempoService from '../services/TiempoValidacionService';

class TiempoValidacionController {
  async list(req: Request, res: Response) {
    try {
      const data = await tiempoService.list();
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error listing tiempo_validacion' } });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = await tiempoService.get(id);
      if (!data) return res.status(404).json({ success: false, data: null, error: { message: 'Not found' } });
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error fetching tiempo_validacion' } });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { tiempo } = req.body;
      const result = await tiempoService.create(tiempo);
      res.status(201).json({ success: true, data: result, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error creating tiempo_validacion' } });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { tiempo } = req.body;
      await tiempoService.update(id, tiempo);
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error updating tiempo_validacion' } });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await tiempoService.delete(id);
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error deleting tiempo_validacion' } });
    }
  }
}

export default new TiempoValidacionController();

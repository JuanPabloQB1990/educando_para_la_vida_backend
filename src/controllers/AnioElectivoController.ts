import type { Request, Response } from 'express';
import AnioElectivoService from '../services/AnioElectivoService';

class AnioElectivoController {
  async list(req: Request, res: Response) {
    try {
      const data = await AnioElectivoService.list();
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error listing anios' } });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const data = await AnioElectivoService.get(id);
      if (!data) return res.status(404).json({ success: false, data: null, error: { message: 'Not found' } });
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error fetching anio' } });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const result = await AnioElectivoService.create(req.body);
      res.status(201).json({ success: true, data: result, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error creating anio' } });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await AnioElectivoService.update(id, req.body);
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error updating anio' } });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await AnioElectivoService.delete(id);
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error deleting anio' } });
    }
  }
}

export default new AnioElectivoController();

import type { Request, Response } from 'express';
import RubroService from '../services/RubroService';

class RubroController {
  async list(req: Request, res: Response) {
    try {
      const data = await RubroService.list();
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error listing rubros' } });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const data = await RubroService.get(id);
      if (!data) return res.status(404).json({ success: false, data: null, error: { message: 'Not found' } });
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error fetching rubro' } });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const result = await RubroService.create(req.body);
      if (!result) return res.status(500).json({ success: false, data: null, error: { message: 'Error creating rubro' } });
      res.status(201).json({ success: true, data: result, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error creating rubro' } });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const result = await RubroService.update(id, req.body);
      if (!result) return res.status(404).json({ success: false, data: null, error: { message: 'Not found' } });
      res.json({ success: true, data: result, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error updating rubro' } });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const result = await RubroService.delete(id);
      if (!result) return res.status(404).json({ success: false, data: null, error: { message: 'Not found' } });
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error deleting rubro' } });
    }
  }
}

export default new RubroController();

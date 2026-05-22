import type { Request, Response } from 'express';
import EstudiantePeriodoService from '../services/EstudiantePeriodoService';

class EstudiantePeriodoController {
  async list(req: Request, res: Response) {
    try {
      const data = await EstudiantePeriodoService.list();
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error listing estudiante_periodo' } });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const data = await EstudiantePeriodoService.get(id);
      if (!data) return res.status(404).json({ success: false, data: null, error: { message: 'Not found' } });
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error fetching estudiante_periodo' } });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const result = await EstudiantePeriodoService.create(req.body);
      res.status(201).json({ success: true, data: result, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error creating estudiante_periodo' } });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      await EstudiantePeriodoService.update(id, req.body);
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error updating estudiante_periodo' } });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      await EstudiantePeriodoService.delete(id);
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error deleting estudiante_periodo' } });
    }
  }
}

export default new EstudiantePeriodoController();

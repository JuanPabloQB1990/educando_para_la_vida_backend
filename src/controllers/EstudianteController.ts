import type { Request, Response } from 'express';
import EstudianteService from '../services/EstudianteService';

class EstudianteController {
  async list(req: Request, res: Response) {
    try {
      const data = await EstudianteService.list();
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error listing estudiantes' } });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const data = await EstudianteService.get(id);
      if (!data) return res.status(404).json({ success: false, data: null, error: { message: 'Not found' } });
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error fetching estudiante' } });
    }
  }

  async create(req: Request, res: Response) {
    try {
      // accept nested payloads like { usuario: {...}, estudiante: {...} } or flat body
      const payload = { ...(req.body.usuario ?? {}), ...(req.body.estudiante ?? {}), ...req.body };
      const result = await EstudianteService.create(payload);
      res.status(201).json({ success: true, data: result, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error creating estudiante' } });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const payload = { ...(req.body.usuario ?? {}), ...(req.body.estudiante ?? {}), ...req.body };
      const result = await EstudianteService.update(id, payload);
      if (!result) return res.status(404).json({ success: false, data: null, error: { message: 'Not found' } });
      res.json({ success: true, data: result, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error updating estudiante' } });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const result = await EstudianteService.delete(id);
      if (!result) return res.status(404).json({ success: false, data: null, error: { message: 'Not found' } });
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error deleting estudiante' } });
    }
  }
}

export default new EstudianteController();

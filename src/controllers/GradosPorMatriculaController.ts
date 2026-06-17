import type { Request, Response } from 'express';
import GradosPorMatriculaService from '../services/GradosPorMatriculaService';

class GradosPorMatriculaController {
  async list(req: Request, res: Response) {
    try {
      const data = await GradosPorMatriculaService.list();
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error listing grados_por_matricula' } });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const id_ep = Array.isArray(req.params.id_ep) ? req.params.id_ep[0] ?? '' : (req.params.id_ep ?? '');
      const id_g = String(req.params.id_g);
      const data = await GradosPorMatriculaService.get(id_ep, id_g);
      if (!data) return res.status(404).json({ success: false, data: null, error: { message: 'Not found' } });
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error fetching grados_por_matricula' } });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const result = await GradosPorMatriculaService.create(req.body);
      res.status(201).json({ success: true, data: result, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error creating grados_por_matricula' } });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id_ep = Array.isArray(req.params.id_ep) ? req.params.id_ep[0] ?? '' : (req.params.id_ep ?? '');
      const id_g = String(req.params.id_g);
      await GradosPorMatriculaService.update(id_ep, id_g, req.body);
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error updating grados_por_matricula' } });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id_ep = Array.isArray(req.params.id_ep) ? req.params.id_ep[0] ?? '' : (req.params.id_ep ?? '');
      const id_g = String(req.params.id_g);
      await GradosPorMatriculaService.delete(id_ep, id_g);
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error deleting grados_por_matricula' } });
    }
  }
}

export default new GradosPorMatriculaController();

import type { Request, Response } from 'express';
import gradoService from '../services/GradoEducacionService';

class GradoEducacionController {
  async list(req: Request, res: Response) {
    try {
      const data = await gradoService.list();
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error listing grado_educacion' } });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = await gradoService.get(id);
      if (!data) return res.status(404).json({ success: false, data: null, error: { message: 'Not found' } });
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error fetching grado_educacion' } });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { nombre } = req.body;
      const result = await gradoService.create(nombre);
      res.status(201).json({ success: true, data: result, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error creating grado_educacion' } });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { nombre } = req.body;
      await gradoService.update(id, nombre);
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error updating grado_educacion' } });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await gradoService.delete(id);
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error deleting grado_educacion' } });
    }
  }
}

export default new GradoEducacionController();

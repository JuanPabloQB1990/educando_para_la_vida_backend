import type { Request, Response } from 'express';
import RolService from '../services/RolService';

class RolController {
  async list(req: Request, res: Response) {
    try {
      const data = await RolService.list();
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error listing rol' } });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const data = await RolService.get(id);
      if (!data) return res.status(404).json({ success: false, data: null, error: { message: 'Not found' } });
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error fetching rol' } });
    }
  }

  async getByName(req: Request, res: Response) {
    try {
      const name = String(req.params.name);
      const data = await RolService.findByName(name);
      if (!data) return res.status(404).json({ success: false, data: null, error: { message: 'Not found' } });
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error fetching rol by name' } });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { nombre_rol } = req.body;
      const result = await RolService.create(nombre_rol);
      res.status(201).json({ success: true, data: result, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error creating rol' } });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const { nombre_rol } = req.body;
      await RolService.update(id, nombre_rol);
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error updating rol' } });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await RolService.delete(id);
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error deleting rol' } });
    }
  }
}

export default new RolController();

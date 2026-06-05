import type { Request, Response } from 'express';
import bloqueService from '../services/BloqueService';

class BloqueController {
  async list(req: Request, res: Response) {
    try {
      const data = await bloqueService.list();
      res.json({ success: true, message: 'Bloques obtenidos', data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al listar bloques', data: null, error });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const data = await bloqueService.get(req.params.id);
      res.json({ success: true, message: 'Bloque obtenido', data, error: null });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ success: false, message: error.message, data: null, error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { nombre } = req.body;
      const data = await bloqueService.create(nombre);
      res.status(201).json({ success: true, message: 'Bloque creado', data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al crear bloque', data: null, error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { nombre } = req.body;
      await bloqueService.update(req.params.id, nombre);
      res.json({ success: true, message: 'Bloque actualizado', data: null, error: null });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ success: false, message: error.message, data: null, error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await bloqueService.delete(req.params.id);
      res.json({ success: true, message: 'Bloque eliminado', data: null, error: null });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ success: false, message: error.message, data: null, error });
    }
  }
}

export default new BloqueController();

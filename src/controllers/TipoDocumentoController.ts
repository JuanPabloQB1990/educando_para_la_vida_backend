import type { Request, Response } from 'express';
import tipoDocumentoService from '../services/TipoDocumentoService';

class TipoDocumentoController {
  async list(req: Request, res: Response) {
    try {
      const data = await tipoDocumentoService.list();
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error listing tipo_documento' } });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = await tipoDocumentoService.get(id);
      if (!data) return res.status(404).json({ success: false, data: null, error: { message: 'Not found' } });
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error fetching tipo_documento' } });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { nombre } = req.body;
      const result = await tipoDocumentoService.create(nombre);
      res.status(201).json({ success: true, data: result, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error creating tipo_documento' } });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { nombre } = req.body;
      await tipoDocumentoService.update(id, nombre);
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error updating tipo_documento' } });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await tipoDocumentoService.delete(id);
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error deleting tipo_documento' } });
    }
  }
}

export default new TipoDocumentoController();

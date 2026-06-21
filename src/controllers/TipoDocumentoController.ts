import type { Request, Response, NextFunction } from 'express';
import tipoDocumentoService from '../services/TipoDocumentoService';

class TipoDocumentoController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tipoDocumentoService.list();
      res.json({ success: true, message: 'Tipos de documento obtenidos', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tipoDocumentoService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Tipo de documento obtenido', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre } = req.body;
      const result = await tipoDocumentoService.create(nombre);
      res.status(201).json({ success: true, message: 'Tipo de documento creado', data: result, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.validated!.params.id;
      const { nombre } = req.body;
      await tipoDocumentoService.update(id, nombre);
      res.json({ success: true, message: 'Tipo de documento actualizado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.validated!.params.id;
      await tipoDocumentoService.delete(id);
      res.json({ success: true, message: 'Tipo de documento eliminado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new TipoDocumentoController();

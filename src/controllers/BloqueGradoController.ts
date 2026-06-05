import type { Request, Response } from 'express';
import bloqueGradoService from '../services/BloqueGradoService';

class BloqueGradoController {
  async list(req: Request, res: Response) {
    try {
      const data = await bloqueGradoService.list();
      res.json({ success: true, message: 'Bloque-grado obtenidos', data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al listar bloque_grado', data: null, error });
    }
  }

  async listByBloque(req: Request, res: Response) {
    try {
      const data = await bloqueGradoService.listByBloque(req.params.idBloque);
      res.json({ success: true, message: 'Grados del bloque obtenidos', data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al listar grados del bloque', data: null, error });
    }
  }

  async assign(req: Request, res: Response) {
    try {
      const { idBloque, idGradoEducacion } = req.body;
      const data = await bloqueGradoService.assign(idBloque, idGradoEducacion);
      res.status(201).json({ success: true, message: 'Grado asignado al bloque', data, error: null });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ success: false, message: error.message, data: null, error });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const { idBloque, idGradoEducacion } = req.params;
      await bloqueGradoService.remove(idBloque, idGradoEducacion);
      res.json({ success: true, message: 'Grado removido del bloque', data: null, error: null });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({ success: false, message: error.message, data: null, error });
    }
  }
}

export default new BloqueGradoController();

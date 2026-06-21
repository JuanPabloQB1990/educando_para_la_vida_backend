import type { Request, Response, NextFunction } from 'express';
import bloqueGradoService from '../services/BloqueGradoService';

class BloqueGradoController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await bloqueGradoService.list();
      res.json({ success: true, message: 'Bloque-grado obtenidos', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async listByBloque(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await bloqueGradoService.listByBloque(req.validated!.params.idBloque);
      res.json({ success: true, message: 'Grados del bloque obtenidos', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async assign(req: Request, res: Response, next: NextFunction) {
    try {
      const { idBloque, idGradoEducacion } = req.body;
      const data = await bloqueGradoService.assign(idBloque, idGradoEducacion);
      res.status(201).json({ success: true, message: 'Grado asignado al bloque', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await bloqueGradoService.remove(req.validated!.params.idBloque, req.validated!.params.idGradoEducacion);
      res.json({ success: true, message: 'Grado removido del bloque', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new BloqueGradoController();

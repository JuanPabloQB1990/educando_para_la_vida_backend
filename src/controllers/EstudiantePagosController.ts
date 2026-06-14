import type { Request, Response, NextFunction } from 'express';
import EstudiantePagosService from '../services/EstudiantePagosService';

class EstudiantePagosController {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const idUsuario = req.user!.id;
      const data = await EstudiantePagosService.getPagos(idUsuario);
      res.json({ success: true, message: 'Información de pagos obtenida', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async subirComprobante(req: Request, res: Response, next: NextFunction) {
    try {
      const idUsuario = req.user!.id;
      const idObligacionPago = (req.body.idObligacionPago ?? '') as string;
      const file = req.file;
      if (!idObligacionPago) {
        res.status(400).json({ success: false, message: 'idObligacionPago requerido', data: null, error: null });
        return;
      }
      if (!file) {
        res.status(400).json({ success: false, message: 'Archivo requerido', data: null, error: null });
        return;
      }
      await EstudiantePagosService.subirComprobante(idUsuario, idObligacionPago, file);
      res.json({ success: true, message: 'Comprobante subido exitosamente', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new EstudiantePagosController();

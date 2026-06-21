import type { Request, Response, NextFunction } from 'express';
import PagoService from '../services/PagoService';
import AuditoriaPagoService from '../services/AuditoriaPagoService';

class PagoController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PagoService.list();
      res.json({ success: true, message: 'Pagos obtenidos', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PagoService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Pago obtenido', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PagoService.create(req.body);
      res.status(201).json({ success: true, message: 'Pago creado', data: result, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PagoService.update(req.validated!.params.id, req.body);
      res.json({ success: true, message: 'Pago actualizado', data: result, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await PagoService.delete(req.validated!.params.id);
      res.json({ success: true, message: 'Pago eliminado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }

  async listAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { idRubro, fechaPagoReal, estado, fechaVerificacion, noDocumento, padreCedula, madreCedula, acudienteCedula } = req.query as Record<string, string | undefined>;
      const data = await PagoService.listForAdmin({ idRubro, fechaPagoReal, estado, fechaVerificacion, noDocumento, padreCedula, madreCedula, acudienteCedula });
      res.json({ success: true, message: 'Comprobantes obtenidos', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async verificar(req: Request, res: Response, next: NextFunction) {
    try {
      const { accion, observaciones, idObligacionPago, montoPagado } = req.body;
      const result = await PagoService.verificarPago(req.validated!.params.id, accion, observaciones, idObligacionPago, montoPagado);
      await AuditoriaPagoService.registrarVerificacion(req.validated!.params.id, req.user!.id);
      res.json({ success: true, message: 'Pago verificado', data: result, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new PagoController();

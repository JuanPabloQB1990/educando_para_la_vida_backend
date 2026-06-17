import type { Request, Response, NextFunction } from 'express';
import PagoService from '../services/PagoService';

class PagoController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PagoService.list();
      res.json({ success: true, message: 'Pagos obtenidos', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const data = await PagoService.get(id);
      if (!data) return res.status(404).json({ success: false, message: 'Pago no encontrado', data: null, error: null });
      res.json({ success: true, message: 'Pago obtenido', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PagoService.create(req.body);
      if (!result) return res.status(500).json({ success: false, message: 'Error al crear pago', data: null, error: null });
      res.status(201).json({ success: true, message: 'Pago creado', data: result, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const result = await PagoService.update(id, req.body);
      if (!result) return res.status(404).json({ success: false, message: 'Pago no encontrado', data: null, error: null });
      res.json({ success: true, message: 'Pago actualizado', data: result, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const result = await PagoService.delete(id);
      if (!result) return res.status(404).json({ success: false, message: 'Pago no encontrado', data: null, error: null });
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
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const { accion, observaciones, idObligacionPago, montoPagado } = req.body as {
        accion: 'aprobado' | 'rechazado';
        observaciones?: string;
        idObligacionPago?: string;
        montoPagado?: string;
      };

      if (!accion || !['aprobado', 'rechazado'].includes(accion)) {
        return res.status(400).json({ success: false, message: 'acción debe ser aprobado o rechazado', data: null, error: null });
      }

      const result = await PagoService.verificarPago(id, accion, observaciones, idObligacionPago, montoPagado);
      if (!result) return res.status(404).json({ success: false, message: 'Pago no encontrado', data: null, error: null });

      res.json({ success: true, message: 'Pago verificado', data: result, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new PagoController();

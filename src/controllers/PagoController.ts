import type { Request, Response } from 'express';
import PagoService from '../services/PagoService';

class PagoController {
  async list(req: Request, res: Response) {
    try {
      const data = await PagoService.list();
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error listing pagos' } });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const data = await PagoService.get(id);
      if (!data) return res.status(404).json({ success: false, data: null, error: { message: 'Not found' } });
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error fetching pago' } });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const result = await PagoService.create(req.body);
      if (!result) return res.status(500).json({ success: false, data: null, error: { message: 'Error creating pago' } });
      res.status(201).json({ success: true, data: result, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error creating pago' } });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const result = await PagoService.update(id, req.body);
      if (!result) return res.status(404).json({ success: false, data: null, error: { message: 'Not found' } });
      res.json({ success: true, data: result, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error updating pago' } });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const result = await PagoService.delete(id);
      if (!result) return res.status(404).json({ success: false, data: null, error: { message: 'Not found' } });
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error eliminando pago' } });
    }
  }

  async listAdmin(req: Request, res: Response) {
    try {
      const { idRubro, fechaPagoReal, estado, fechaVerificacion, noDocumento, padreCedula, madreCedula, acudienteCedula } = req.query as Record<string, string | undefined>;
      const data = await PagoService.listForAdmin({ idRubro, fechaPagoReal, estado, fechaVerificacion, noDocumento, padreCedula, madreCedula, acudienteCedula });

      res.json({ success: true, data, error: null });
    } catch (error) {
      console.error('Error listando comprobantes para admin:', error);
      res.status(500).json({ success: false, data: null, error: { message: 'Error listando comprobantes' } });
    }
  }

  async verificar(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const { accion, observaciones, idObligacionPago, montoPagado } = req.body as {
        accion: 'aprobado' | 'rechazado';
        observaciones?: string;
        idObligacionPago?: string;
        montoPagado?: string;
      };

      if (!accion || !['aprobado', 'rechazado'].includes(accion)) {
        return res.status(400).json({ success: false, data: null, error: { message: 'accion debe ser aprobado o rechazado' } });
      }

      const result = await PagoService.verificarPago(id, accion, observaciones, idObligacionPago, montoPagado);
      if (!result) return res.status(404).json({ success: false, data: null, error: { message: 'Pago no encontrado' } });

      res.json({ success: true, data: result, error: null });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        data: null,
        error: { message: error?.message ?? 'Error verificando pago' },
      });
    }
  }
}

export default new PagoController();

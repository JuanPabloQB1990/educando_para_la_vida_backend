import type { Request, Response, NextFunction } from 'express';
import ObligacionPagoService from '../services/ObligacionPagoService';

class ObligacionPagoController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ObligacionPagoService.list();
      res.json({ success: true, message: 'Obligaciones de pago obtenidas', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ObligacionPagoService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Obligación de pago obtenida', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ObligacionPagoService.create(req.body);
      res.status(201).json({ success: true, message: 'Obligación de pago creada', data: result, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ObligacionPagoService.update(req.validated!.params.id, req.body);
      res.json({ success: true, message: 'Obligación de pago actualizada', data: result, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ObligacionPagoService.delete(req.validated!.params.id);
      res.json({ success: true, message: 'Obligación de pago eliminada', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new ObligacionPagoController();

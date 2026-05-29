import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import EstudiantePeriodoService from '../services/EstudiantePeriodoService';
import { AppError } from '../error/AppError';

const matricularAnioSchema = z.object({
  idAnioElectivo: z.string().min(1, 'Año electivo requerido'),
  idRubro: z.string().min(1, 'Rubro requerido'),
  meses: z.array(z.number().int().min(0).max(11)).min(1, 'Seleccione al menos un mes'),
});

class EstudiantePeriodoController {
  async list(req: Request, res: Response) {
    try {
      const data = await EstudiantePeriodoService.list();
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error listing estudiante_periodo' } });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const data = await EstudiantePeriodoService.get(id);
      if (!data) return res.status(404).json({ success: false, data: null, error: { message: 'Not found' } });
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error fetching estudiante_periodo' } });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const result = await EstudiantePeriodoService.create(req.body);
      res.status(201).json({ success: true, data: result, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error creating estudiante_periodo' } });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      await EstudiantePeriodoService.update(id, req.body);
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error updating estudiante_periodo' } });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      await EstudiantePeriodoService.delete(id);
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error deleting estudiante_periodo' } });
    }
  }

  async getGrados(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const data = await EstudiantePeriodoService.getGrados(id);
      res.json({ success: true, data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async getObligaciones(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const data = await EstudiantePeriodoService.getObligaciones(id);
      res.json({ success: true, data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async matricularAnio(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const parsed = matricularAnioSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.errors[0]?.message ?? 'Datos inválidos', 400);
      }
      await EstudiantePeriodoService.matricularAnio(id, parsed.data);
      res.status(201).json({ success: true, data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new EstudiantePeriodoController();

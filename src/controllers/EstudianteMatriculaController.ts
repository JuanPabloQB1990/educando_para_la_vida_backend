import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import EstudianteMatriculaService from '../services/EstudianteMatriculaService';
import { AppError } from '../error/AppError';

const matricularAnioSchema = z.object({
  idAnioElectivo: z.string().min(1, 'Año electivo requerido'),
  idRubro: z.string().min(1, 'Rubro requerido'),
  meses: z.array(z.number().int().min(0).max(11)).min(1, 'Seleccione al menos un mes'),
});

class EstudianteMatriculaController {
  async list(req: Request, res: Response) {
    try {
      const data = await EstudianteMatriculaService.list();
      res.json({ success: true, message: 'Matrículas obtenidas', data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error listing estudiante_matricula' } });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const data = await EstudianteMatriculaService.get(id);
      if (!data) return res.status(404).json({ success: false, data: null, error: { message: 'Not found' } });
      res.json({ success: true, data, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error fetching estudiante_matricula' } });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const result = await EstudianteMatriculaService.create(req.body);
      res.status(201).json({ success: true, data: result, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error creating estudiante_matricula' } });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      await EstudianteMatriculaService.update(id, req.body);
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error updating estudiante_matricula' } });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      await EstudianteMatriculaService.delete(id);
      res.json({ success: true, data: null, error: null });
    } catch (error) {
      res.status(500).json({ success: false, data: null, error: { message: 'Error deleting estudiante_matricula' } });
    }
  }

  async getGrados(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const data = await EstudianteMatriculaService.getGrados(id);
      res.json({ success: true, data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async getObligaciones(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] ?? '' : (req.params.id ?? '');
      const data = await EstudianteMatriculaService.getObligaciones(id);
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
        throw new AppError(400, parsed.error.errors[0]?.message ?? 'Datos inválidos');
      }
      await EstudianteMatriculaService.matricularAnio(id, parsed.data);
      res.status(201).json({ success: true, data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new EstudianteMatriculaController();

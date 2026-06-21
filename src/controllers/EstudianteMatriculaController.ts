import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import EstudianteMatriculaService from '../services/EstudianteMatriculaService';
import { AppError } from '../error/AppError';

const patchEstudioSchema = z.object({
  idTipoEstudio: z.string().min(1, 'Tipo de estudio requerido'),
  idTiempoValidacion: z.string().nullable().optional(),
});

const matricularAnioSchema = z.object({
  idAnioElectivo: z.string().min(1, 'Año electivo requerido'),
  idRubro: z.string().min(1, 'Rubro requerido'),
  meses: z.array(z.number().int().min(0).max(11)).min(1, 'Seleccione al menos un mes'),
});

class EstudianteMatriculaController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await EstudianteMatriculaService.list();
      res.json({ success: true, message: 'Matrículas obtenidas', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await EstudianteMatriculaService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Matrícula obtenida', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await EstudianteMatriculaService.create(req.body);
      res.status(201).json({ success: true, message: 'Matrícula creada', data: result, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      await EstudianteMatriculaService.update(req.validated!.params.id, req.body);
      res.json({ success: true, message: 'Matrícula actualizada', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await EstudianteMatriculaService.delete(req.validated!.params.id);
      res.json({ success: true, message: 'Matrícula eliminada', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }

  async getGrados(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await EstudianteMatriculaService.getGrados(req.validated!.params.id);
      res.json({ success: true, data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async getObligaciones(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await EstudianteMatriculaService.getObligaciones(req.validated!.params.id);
      res.json({ success: true, data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async patchEstudio(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = patchEstudioSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.errors[0]?.message ?? 'Datos inválidos');
      }
      await EstudianteMatriculaService.updateEstudio(req.validated!.params.id, parsed.data.idTipoEstudio, parsed.data.idTiempoValidacion ?? null);
      res.json({ success: true, message: 'Matrícula actualizada', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }

  async matricularAnio(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = matricularAnioSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(400, parsed.error.errors[0]?.message ?? 'Datos inválidos');
      }
      await EstudianteMatriculaService.matricularAnio(req.validated!.params.id, parsed.data);
      res.status(201).json({ success: true, data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new EstudianteMatriculaController();

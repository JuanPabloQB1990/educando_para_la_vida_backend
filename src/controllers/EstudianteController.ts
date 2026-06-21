import type { Request, Response, NextFunction } from 'express';
import EstudianteService from '../services/EstudianteService';

class EstudianteController {
  async listAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { noDocumento, padreCedula, madreCedula, acudienteCedula, conObligacionVencida } = req.query as Record<string, string | undefined>;
      const data = await EstudianteService.listAdmin({
        noDocumento,
        padreCedula,
        madreCedula,
        acudienteCedula,
        conObligacionVencida: conObligacionVencida === 'true',
      });
      res.json({ success: true, message: 'Estudiantes matriculados obtenidos', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async getHistorial(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await EstudianteService.getHistorial(req.validated!.params.id);
      res.json({ success: true, message: 'Historial de matrículas obtenido', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await EstudianteService.list();
      res.json({ success: true, message: 'Estudiantes obtenidos', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await EstudianteService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Estudiante obtenido', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = { ...(req.body.usuario ?? {}), ...(req.body.estudiante ?? {}), ...req.body };
      const result = await EstudianteService.create(payload);
      res.status(201).json({ success: true, message: 'Estudiante creado', data: result, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = { ...(req.body.usuario ?? {}), ...(req.body.estudiante ?? {}), ...req.body };
      const result = await EstudianteService.update(req.validated!.params.id, payload);
      res.json({ success: true, message: 'Estudiante actualizado', data: result, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await EstudianteService.delete(req.validated!.params.id);
      res.json({ success: true, message: 'Estudiante eliminado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new EstudianteController();

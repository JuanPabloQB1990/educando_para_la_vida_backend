import type { Request, Response, NextFunction } from 'express';
import DireccionGradoService from '../services/DireccionGradoService';

class DireccionGradoController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { idUsuario, idAnioElectivo } = req.query;
      const data = idUsuario
        ? await DireccionGradoService.listByProfesor(idUsuario as string, idAnioElectivo as string | undefined)
        : await DireccionGradoService.list();
      res.json({ success: true, message: 'Direcciones de grado obtenidas', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await DireccionGradoService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Dirección de grado obtenida', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { idGradoEducacion, idUsuario, idAnioElectivo, idBloque } = req.body;
      const data = await DireccionGradoService.create({ idGradoEducacion: idGradoEducacion ?? null, idUsuario, idAnioElectivo, idBloque: idBloque ?? null });
      res.status(201).json({ success: true, message: 'Dirección de grado creada', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { idGradoEducacion, idUsuario, idAnioElectivo, idBloque } = req.body;
      const data = await DireccionGradoService.update(req.validated!.params.id, { idGradoEducacion: idGradoEducacion ?? null, idUsuario, idAnioElectivo, idBloque: idBloque ?? null });
      res.json({ success: true, message: 'Dirección de grado actualizada', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async updateLink(req: Request, res: Response, next: NextFunction) {
    try {
      const { linkClaseVirtual } = req.body;
      const data = await DireccionGradoService.updateLink(req.validated!.params.id, linkClaseVirtual);
      res.json({ success: true, message: 'Link de clase virtual actualizado', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await DireccionGradoService.delete(req.validated!.params.id);
      res.json({ success: true, message: 'Dirección de grado eliminada', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }

  async getForEstudiante(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await DireccionGradoService.getForEstudiante(req.user!.id);
      res.json({ success: true, message: 'Clase virtual obtenida', data, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new DireccionGradoController();

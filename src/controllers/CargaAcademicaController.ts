import type { Request, Response, NextFunction } from 'express';
import CargaAcademicaService from '../services/CargaAcademicaService';

class CargaAcademicaController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { idUsuario, idAnioElectivo } = req.query;
      const data = idUsuario
        ? await CargaAcademicaService.listByProfesor(String(idUsuario), idAnioElectivo as string | undefined)
        : await CargaAcademicaService.list();
      res.json({ success: true, message: 'Cargas académicas obtenidas', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CargaAcademicaService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Carga académica obtenida', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { idUsuario, idMateria, idGradoEducacion, idAnioElectivo, idBloque } = req.body;
      const data = await CargaAcademicaService.create({ idUsuario, idMateria, idGradoEducacion, idAnioElectivo, idBloque: idBloque ?? null });
      res.status(201).json({ success: true, message: 'Carga académica creada', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await CargaAcademicaService.delete(req.validated!.params.id);
      res.json({ success: true, message: 'Carga académica eliminada', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new CargaAcademicaController();

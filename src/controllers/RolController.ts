import type { Request, Response, NextFunction } from 'express';
import RolService from '../services/RolService';

class RolController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await RolService.list();
      res.json({ success: true, message: 'Roles obtenidos', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await RolService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Rol obtenido', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async getByName(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await RolService.findByName(req.validated!.params.name);
      res.json({ success: true, message: 'Rol obtenido', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre_rol } = req.body;
      const result = await RolService.create(nombre_rol);
      res.status(201).json({ success: true, message: 'Rol creado', data: result, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre_rol } = req.body;
      await RolService.update(req.validated!.params.id, nombre_rol);
      res.json({ success: true, message: 'Rol actualizado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await RolService.delete(req.validated!.params.id);
      res.json({ success: true, message: 'Rol eliminado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new RolController();

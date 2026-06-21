import type { Request, Response, NextFunction } from 'express';
import UsuarioService from '../services/UsuarioService';

class UsuarioController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UsuarioService.list();
      res.json({ success: true, message: 'Usuarios obtenidos exitosamente', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UsuarioService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Usuario obtenido exitosamente', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UsuarioService.create(req.body);
      res.status(201).json({ success: true, message: 'Usuario creado exitosamente', data: result, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      await UsuarioService.update(req.validated!.params.id, req.body);
      res.json({ success: true, message: 'Usuario actualizado exitosamente', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await UsuarioService.delete(req.validated!.params.id);
      res.json({ success: true, message: 'Usuario eliminado exitosamente', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new UsuarioController();

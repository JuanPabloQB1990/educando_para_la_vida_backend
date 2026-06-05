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
      const id = Array.isArray(req.params.id) ? (req.params.id[0] ?? '') : (req.params.id ?? '');
      const data = await UsuarioService.get(id);
      if (!data) return res.status(404).json({ success: false, message: 'Usuario no encontrado', data: null, error: { message: 'Usuario no encontrado' } });
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
      const id = Array.isArray(req.params.id) ? (req.params.id[0] ?? '') : (req.params.id ?? '');
      await UsuarioService.update(id, req.body);
      res.json({ success: true, message: 'Usuario actualizado exitosamente', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? (req.params.id[0] ?? '') : (req.params.id ?? '');
      await UsuarioService.delete(id);
      res.json({ success: true, message: 'Usuario eliminado exitosamente', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new UsuarioController();

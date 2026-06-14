import type { Request, Response, NextFunction } from 'express';
import EstudiantePerfilService from '../services/EstudiantePerfilService';

class EstudiantePerfilController {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const idUsuario = req.user!.id;
      const data = await EstudiantePerfilService.getPerfil(idUsuario);
      res.json({ success: true, message: 'Perfil obtenido exitosamente', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const idUsuario = req.user!.id;
      const data = await EstudiantePerfilService.updatePerfil(idUsuario, req.body);
      res.json({ success: true, message: 'Perfil actualizado exitosamente', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async updateArchivo(req: Request, res: Response, next: NextFunction) {
    try {
      const idUsuario = req.user!.id;
      const campo = (req.body.campo ?? '') as string;
      const file = req.file;
      if (!file) {
        res.status(400).json({ success: false, message: 'Archivo requerido', data: null, error: { message: 'No se recibió ningún archivo' } });
        return;
      }
      const data = await EstudiantePerfilService.updateArchivo(idUsuario, campo, file);
      res.json({ success: true, message: 'Archivo actualizado exitosamente', data, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new EstudiantePerfilController();

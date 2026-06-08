import type { Request, Response } from 'express';
import DireccionGradoService from '../services/DireccionGradoService';

class DireccionGradoController {
  async list(req: Request, res: Response) {
    const { idUsuario, idAnioElectivo } = req.query;
    const data = idUsuario
      ? await DireccionGradoService.listByProfesor(idUsuario as string, idAnioElectivo as string | undefined)
      : await DireccionGradoService.list();
    res.json({ success: true, message: 'Direcciones de grado obtenidas', data, error: null });
  }

  async get(req: Request, res: Response) {
    const data = await DireccionGradoService.get(req.params.id as string);
    if (!data) return res.status(404).json({ success: false, message: 'No encontrado', data: null, error: 'Not found' });
    res.json({ success: true, message: 'Dirección de grado obtenida', data, error: null });
  }

  async create(req: Request, res: Response) {
    const { idGradoEducacion, idUsuario, idAnioElectivo, idBloque } = req.body;
    if (!idGradoEducacion || !idUsuario || !idAnioElectivo) {
      return res.status(400).json({ success: false, message: 'Todos los campos son requeridos', data: null, error: 'Datos faltantes' });
    }
    const data = await DireccionGradoService.create({ idGradoEducacion, idUsuario, idAnioElectivo, idBloque: idBloque ?? null });
    res.status(201).json({ success: true, message: 'Dirección de grado creada', data, error: null });
  }

  async update(req: Request, res: Response) {
    const { idGradoEducacion, idUsuario, idAnioElectivo, idBloque } = req.body;
    if (!idGradoEducacion || !idUsuario || !idAnioElectivo) {
      return res.status(400).json({ success: false, message: 'Todos los campos son requeridos', data: null, error: 'Datos faltantes' });
    }
    const data = await DireccionGradoService.update(req.params.id as string, { idGradoEducacion, idUsuario, idAnioElectivo, idBloque: idBloque ?? null });
    res.json({ success: true, message: 'Dirección de grado actualizada', data, error: null });
  }

  async updateLink(req: Request, res: Response) {
    const { linkClaseVirtual } = req.body;
    if (!linkClaseVirtual) {
      return res.status(400).json({ success: false, message: 'linkClaseVirtual es requerido', data: null, error: 'Dato faltante' });
    }
    const data = await DireccionGradoService.updateLink(req.params.id as string, linkClaseVirtual);
    res.json({ success: true, message: 'Link de clase virtual actualizado', data, error: null });
  }

  async delete(req: Request, res: Response) {
    await DireccionGradoService.delete(req.params.id as string);
    res.json({ success: true, message: 'Dirección de grado eliminada', data: null, error: null });
  }
}

export default new DireccionGradoController();

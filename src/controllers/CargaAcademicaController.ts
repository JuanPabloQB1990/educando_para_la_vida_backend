import type { Request, Response } from 'express';
import CargaAcademicaService from '../services/CargaAcademicaService';

class CargaAcademicaController {
  async list(req: Request, res: Response) {
    const { idUsuario, idAnioElectivo } = req.query;
    const data = idUsuario
      ? await CargaAcademicaService.listByProfesor(idUsuario as string, idAnioElectivo as string | undefined)
      : await CargaAcademicaService.list();
    res.json({ success: true, message: 'Cargas académicas obtenidas', data, error: null });
  }

  async get(req: Request, res: Response) {
    const data = await CargaAcademicaService.get(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Carga académica no encontrada', data: null, error: 'Not found' });
    res.json({ success: true, message: 'Carga académica obtenida', data, error: null });
  }

  async create(req: Request, res: Response) {
    const { idUsuario, idMateria, idGradoEducacion, idAnioElectivo, idBloque } = req.body;
    if (!idUsuario || !idMateria || !idGradoEducacion || !idAnioElectivo) {
      return res.status(400).json({ success: false, message: 'Todos los campos son requeridos', data: null, error: 'Datos faltantes' });
    }
    const data = await CargaAcademicaService.create({ idUsuario, idMateria, idGradoEducacion, idAnioElectivo, idBloque: idBloque ?? null });
    res.status(201).json({ success: true, message: 'Carga académica creada', data, error: null });
  }

  async delete(req: Request, res: Response) {
    await CargaAcademicaService.delete(req.params.id);
    res.json({ success: true, message: 'Carga académica eliminada', data: null, error: null });
  }
}

export default new CargaAcademicaController();

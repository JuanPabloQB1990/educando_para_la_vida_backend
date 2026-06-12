import type { Request, Response } from 'express';
import AsistenciaService from '../services/AsistenciaService';

class AsistenciaController {
  async list(req: Request, res: Response) {
    const { idGradoEducacion, idPeriodo, idEstudiante } = req.query;
    let data;
    if (idEstudiante) {
      data = await AsistenciaService.listByEstudiante(idEstudiante as string, idPeriodo as string | undefined);
    } else if (idGradoEducacion && idPeriodo) {
      data = await AsistenciaService.listByGradoPeriodo(idGradoEducacion as string, idPeriodo as string);
    } else {
      return res.status(400).json({ success: false, message: 'Se requiere idEstudiante o (idGradoEducacion + idPeriodo)', data: null, error: 'Params faltantes' });
    }
    res.json({ success: true, message: 'Asistencias obtenidas', data, error: null });
  }

  async get(req: Request, res: Response) {
    const data = await AsistenciaService.get(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Asistencia no encontrada', data: null, error: 'Not found' });
    res.json({ success: true, message: 'Asistencia obtenida', data, error: null });
  }

  async create(req: Request, res: Response) {
    const { idEstudiante, idActividad, fecha, estadoAsistencia, observacion } = req.body;
    if (!idEstudiante || !idActividad || !fecha || !estadoAsistencia) {
      return res.status(400).json({ success: false, message: 'Campos requeridos faltantes', data: null, error: 'Datos faltantes' });
    }
    const data = await AsistenciaService.create({ idEstudiante, idActividad, fecha, estadoAsistencia, observacion });
    res.status(201).json({ success: true, message: 'Asistencia registrada', data, error: null });
  }

  async upsert(req: Request, res: Response) {
    const { idEstudiante, idActividad, fecha, estadoAsistencia, observacion } = req.body;
    if (!idEstudiante || !idActividad || !fecha) {
      return res.status(400).json({ success: false, message: 'Campos requeridos faltantes', data: null, error: 'Datos faltantes' });
    }
    const data = await AsistenciaService.upsert({ idEstudiante, idActividad, fecha, estadoAsistencia, observacion });
    res.status(200).json({ success: true, message: 'Asistencia guardada', data, error: null });
  }

  async update(req: Request, res: Response) {
    const { fecha, estadoAsistencia, observacion } = req.body;
    if (!fecha || !estadoAsistencia) {
      return res.status(400).json({ success: false, message: 'fecha y estadoAsistencia son requeridos', data: null, error: 'Datos faltantes' });
    }
    const data = await AsistenciaService.update(req.params.id, { fecha, estadoAsistencia, observacion });
    res.json({ success: true, message: 'Asistencia actualizada', data, error: null });
  }

  async updateFecha(req: Request, res: Response) {
    const { idActividad, fechaActual, fechaNueva } = req.body;
    if (!idActividad || !fechaActual || !fechaNueva) {
      return res.status(400).json({ success: false, message: 'idActividad, fechaActual y fechaNueva son requeridos', data: null, error: 'Datos faltantes' });
    }
    if (fechaActual === fechaNueva) {
      return res.status(400).json({ success: false, message: 'La fecha nueva debe ser distinta a la actual', data: null, error: 'Fecha igual' });
    }
    const data = await AsistenciaService.updateFechaSesion(idActividad, fechaActual, fechaNueva);
    res.json({ success: true, message: 'Fecha de sesión actualizada', data, error: null });
  }

  async delete(req: Request, res: Response) {
    await AsistenciaService.delete(req.params.id as string);
    res.json({ success: true, message: 'Asistencia eliminada', data: null, error: null });
  }
}

export default new AsistenciaController();

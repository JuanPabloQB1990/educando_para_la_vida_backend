import type { Request, Response } from 'express';
import ClassroomEntregaService from '../services/ClassroomEntregaService';

class ClassroomEntregaController {
  async list(req: Request, res: Response) {
    const { idTarea, idEstudiante } = req.query;
    let data;
    if (idTarea) {
      data = await ClassroomEntregaService.listByTarea(idTarea as string);
    } else if (idEstudiante) {
      data = await ClassroomEntregaService.listByEstudiante(idEstudiante as string);
    } else {
      return res.status(400).json({ success: false, message: 'Se requiere idTarea o idEstudiante', data: null, error: 'Params faltantes' });
    }
    res.json({ success: true, message: 'Entregas obtenidas', data, error: null });
  }

  async get(req: Request, res: Response) {
    const data = await ClassroomEntregaService.get(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Entrega no encontrada', data: null, error: 'Not found' });
    res.json({ success: true, message: 'Entrega obtenida', data, error: null });
  }

  async create(req: Request, res: Response) {
    const { idClassroomTarea, idEstudiante } = req.body;
    if (!idClassroomTarea || !idEstudiante) {
      return res.status(400).json({ success: false, message: 'idClassroomTarea e idEstudiante son requeridos', data: null, error: 'Datos faltantes' });
    }
    const data = await ClassroomEntregaService.create({ idClassroomTarea, idEstudiante });
    res.status(201).json({ success: true, message: 'Entrega registrada', data, error: null });
  }

  async updateEstado(req: Request, res: Response) {
    const { estadoEntrega, observacionProfesor } = req.body;
    if (!estadoEntrega) {
      return res.status(400).json({ success: false, message: 'estadoEntrega es requerido', data: null, error: 'Dato faltante' });
    }
    const data = await ClassroomEntregaService.updateEstado(req.params.id, { estadoEntrega, observacionProfesor });
    res.json({ success: true, message: 'Estado de entrega actualizado', data, error: null });
  }

  async delete(req: Request, res: Response) {
    await ClassroomEntregaService.delete(req.params.id);
    res.json({ success: true, message: 'Entrega eliminada', data: null, error: null });
  }

  async listAdjuntos(req: Request, res: Response) {
    const data = await ClassroomEntregaService.listAdjuntos(req.params.id);
    res.json({ success: true, message: 'Adjuntos obtenidos', data, error: null });
  }

  async createAdjunto(req: Request, res: Response) {
    const { urlArchivo, nombreArchivo } = req.body;
    if (!urlArchivo || !nombreArchivo) {
      return res.status(400).json({ success: false, message: 'urlArchivo y nombreArchivo son requeridos', data: null, error: 'Datos faltantes' });
    }
    const data = await ClassroomEntregaService.createAdjunto({ idClassroomEntrega: req.params.id, urlArchivo, nombreArchivo });
    res.status(201).json({ success: true, message: 'Adjunto creado', data, error: null });
  }

  async deleteAdjunto(req: Request, res: Response) {
    await ClassroomEntregaService.deleteAdjunto(req.params.adjuntoId);
    res.json({ success: true, message: 'Adjunto eliminado', data: null, error: null });
  }
}

export default new ClassroomEntregaController();

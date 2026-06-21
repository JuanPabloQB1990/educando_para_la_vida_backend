import type { Request, Response, NextFunction } from 'express';
import ClassroomEntregaService from '../services/ClassroomEntregaService';

class ClassroomEntregaController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { idTarea, idEstudiante, idCargaAcademica, idPeriodo } = req.query;
      let data;
      if (idCargaAcademica) {
        data = await ClassroomEntregaService.listByCarga(idCargaAcademica as string, idPeriodo as string | undefined);
      } else if (idTarea) {
        data = await ClassroomEntregaService.listByTarea(idTarea as string);
      } else {
        data = await ClassroomEntregaService.listByEstudiante(idEstudiante as string);
      }
      res.json({ success: true, message: 'Entregas obtenidas', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ClassroomEntregaService.get(req.validated!.params.id);
      res.json({ success: true, message: 'Entrega obtenida', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { idClassroomTarea, idEstudiante } = req.body;
      const data = await ClassroomEntregaService.create({ idClassroomTarea, idEstudiante });
      res.status(201).json({ success: true, message: 'Entrega registrada', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async updateEstado(req: Request, res: Response, next: NextFunction) {
    try {
      const { estadoEntrega, observacionProfesor } = req.body;
      const data = await ClassroomEntregaService.updateEstado(req.validated!.params.id, { estadoEntrega, observacionProfesor });
      res.json({ success: true, message: 'Estado de entrega actualizado', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ClassroomEntregaService.delete(req.validated!.params.id);
      res.json({ success: true, message: 'Entrega eliminada', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }

  async listAdjuntos(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ClassroomEntregaService.listAdjuntos(req.validated!.params.id);
      res.json({ success: true, message: 'Adjuntos obtenidos', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async createAdjunto(req: Request, res: Response, next: NextFunction) {
    try {
      const { urlArchivo, nombreArchivo } = req.body;
      const data = await ClassroomEntregaService.createAdjunto({ idClassroomEntrega: req.validated!.params.id, urlArchivo, nombreArchivo });
      res.status(201).json({ success: true, message: 'Adjunto creado', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async deleteAdjunto(req: Request, res: Response, next: NextFunction) {
    try {
      await ClassroomEntregaService.deleteAdjunto(req.validated!.params.adjuntoId);
      res.json({ success: true, message: 'Adjunto eliminado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }

  async listForEstudiante(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ClassroomEntregaService.listForEstudiante(req.user!.id);
      res.json({ success: true, message: 'Entregas obtenidas', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async createForEstudiante(req: Request, res: Response, next: NextFunction) {
    try {
      const { idClassroomTarea } = req.body;
      const data = await ClassroomEntregaService.createForEstudiante(req.user!.id, idClassroomTarea);
      res.status(201).json({ success: true, message: 'Entrega registrada', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async uploadAdjuntosForEstudiante(req: Request, res: Response, next: NextFunction) {
    try {
      const files = (req as any).files as Express.Multer.File[] | undefined;
      if (!files || files.length === 0) {
        return res.status(400).json({ success: false, message: 'Se requiere al menos un archivo', data: null, error: null });
      }
      const data = await ClassroomEntregaService.uploadAdjuntosForEstudiante(req.user!.id, req.validated!.params.id, files);
      res.status(201).json({ success: true, message: 'Archivos subidos', data, error: null });
    } catch (error) {
      next(error);
    }
  }

  async deleteAdjuntoForEstudiante(req: Request, res: Response, next: NextFunction) {
    try {
      await ClassroomEntregaService.deleteAdjuntoWithFile(req.validated!.params.adjuntoId);
      res.json({ success: true, message: 'Adjunto eliminado', data: null, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new ClassroomEntregaController();

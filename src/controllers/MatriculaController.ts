import type { Request, Response } from 'express';
import MatriculaService from '../services/MatriculaService';

class MatriculaController {
  async create(req: Request, res: Response) {
    try {
      const form = req.body || {};
 
      const result = await MatriculaService.processEnrollment(form);
      if (result.exists) {
        return res.status(409).json({
          success: false,
          message: 'El alumno ya se encuentra inscrito en la institución',
          data: null,
          error: null,
        });
      } 
      // For now, return success that the check passed and enrollment may continue
      return res.status(200).json({
        success: true,
        message: 'Estudiante matriculado exitosamente',
        data: result.payload || null,
        error: null,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error procesando matrícula',
        data: null,
        error: { message: 'Error procesando matrícula' },
      });
    }
  }
}


export default new MatriculaController();

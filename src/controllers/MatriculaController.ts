import type { Request, Response, NextFunction } from "express";
import MatriculaService from "../services/MatriculaService";

class MatriculaController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const form = req.body || {};
      const files = req.files as Record<string, Express.Multer.File[]>;

      const normalizedFiles = {
        file_doc: files?.file_doc?.[0],
        file_foto: files?.file_foto?.[0],
        file_compromiso: files?.file_compromiso?.[0],
        padre_file: files?.padre_file?.[0],
        madre_file: files?.madre_file?.[0],
        acudiente_file: files?.acudiente_file?.[0],
        file_diagnostico: files?.file_diagnostico?.[0] || null,
        file_certificado_grados: files?.file_certificado_grados?.[0],
        file_comprobante_pago: files?.file_comprobante_pago?.[0],
      };

      await MatriculaService.create({ ...form, ...normalizedFiles });

      res.status(201).json({
        success: true,
        message: "Estudiante matriculado exitosamente",
        data: null,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MatriculaController();

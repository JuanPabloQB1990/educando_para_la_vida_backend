import type { Request, Response } from "express";
import MatriculaService from "../services/MatriculaService";

class MatriculaController {
  async create(req: Request, res: Response) {
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

      const payload = {
        ...form,
        ...normalizedFiles,
      };

      const result = await MatriculaService.processEnrollment(payload);

      if (result.exists) {
        return res.status(409).json({
          success: false,
          message: "El alumno ya se encuentra inscrito en la institución",
          data: null,
          error: null,
        });
      }
      // For now, return success that the check passed and enrollment may continue
      return res.status(200).json({
        success: true,
        message: "Estudiante matriculado exitosamente",
        data: null,
        error: null,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error procesando matrícula",
        data: null,
        error: { message: "Error procesando matrícula" },
      });
    }
  }
}

export default new MatriculaController();

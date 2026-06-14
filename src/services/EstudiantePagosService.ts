import EstudianteRepository from '../repositories/EstudianteRepository';
import EstudianteMatriculaRepository from '../repositories/EstudianteMatriculaRepository';
import GradosPorMatriculaRepository from '../repositories/GradosPorMatriculaRepository';
import ObligacionPagoRepository from '../repositories/ObligacionPagoRepository';
import PagoRepository from '../repositories/PagoRepository';
import { uploadHelper, deleteFileFromDrive } from '../utils/uploadFIleToGoogleDrive';
import { AppError } from '../error/AppError';

function extractDriveFileId(url: string): string | null {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

class EstudiantePagosService {
  async getPagos(idUsuario: string) {
    const estudiante = await EstudianteRepository.findByIdUsuario(idUsuario);
    if (!estudiante) throw new AppError(404, 'Estudiante no encontrado');

    const matricula = await EstudianteMatriculaRepository.findMostRecentByEstudiante(estudiante.id);
    if (!matricula) throw new AppError(404, 'No se encontró matrícula para este estudiante');

    const [grados, obligaciones] = await Promise.all([
      GradosPorMatriculaRepository.findByEstudianteMatricula(matricula.id),
      ObligacionPagoRepository.findWithPagosByMatricula(matricula.id),
    ]);

    return { matricula, grados, obligaciones };
  }

  async subirComprobante(idUsuario: string, idObligacionPago: string, file: Express.Multer.File) {
    const estudiante: any = await EstudianteRepository.findByIdUsuario(idUsuario);
    if (!estudiante) throw new AppError(404, 'Estudiante no encontrado');

    const obligacion: any = await ObligacionPagoRepository.findByIdAndEstudiante(idObligacionPago, estudiante.id);
    if (!obligacion) throw new AppError(404, 'Obligación de pago no encontrada');

    if (!['pendiente', 'vencido'].includes(obligacion.estado)) {
      throw new AppError(400, 'Solo se pueden subir comprobantes para obligaciones pendientes o vencidas');
    }

    const pagoExistente: any = await PagoRepository.findByObligacionPago(idObligacionPago);
    if (pagoExistente && pagoExistente.estado !== 'rechazado') {
      throw new AppError(400, 'Esta obligación ya tiene un comprobante en revisión o aprobado');
    }

    const studentName = `${estudiante.usuarioNombres ?? ''} ${estudiante.usuarioApellido1 ?? ''}`.trim();
    const docNumber = estudiante.usuarioNoDocumento ?? 'SN';

    if (pagoExistente) {
      const fileId = extractDriveFileId(pagoExistente.fileComprobante ?? '');
      if (fileId) await deleteFileFromDrive(fileId).catch(() => {});
    }

    const url = await uploadHelper(file, 'comprobante', studentName, docNumber);
    if (!url) throw new AppError(500, 'Error al subir el comprobante a Drive');

    if (pagoExistente) {
      await PagoRepository.updateComprobante(pagoExistente.id, url, new Date());
    } else {
      await PagoRepository.create({
        id_obligacion_pago: idObligacionPago,
        monto_pagado: 0,
        fecha_pago_real: new Date(),
        file_comprobante: url,
        observaciones: null,
        estado: 'pendiente',
        fecha_verificacion: null,
      });
    }
  }
}

export default new EstudiantePagosService();

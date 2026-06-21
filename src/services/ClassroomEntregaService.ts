import path from 'path';
import ClassroomEntregaRepository from '../repositories/ClassroomEntregaRepository';
import EstudianteRepository from '../repositories/EstudianteRepository';
import ObligacionPagoRepository from '../repositories/ObligacionPagoRepository';
import { ClassroomEntregaEstado } from '../enums/classroomEntrega.enum';
import { uploadClassroomFile, deleteFileFromDrive } from '../utils/uploadFIleToGoogleDrive';
import { AppError } from '../error/AppError';

const ALLOWED_EXTS = ['.pdf', '.jpg', '.jpeg', '.png', '.docx'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

class ClassroomEntregaService {
  async listByCarga(idCargaAcademica: string, idPeriodo?: string) {
    return ClassroomEntregaRepository.findByCarga(idCargaAcademica, idPeriodo);
  }

  async listByTarea(idTarea: string) {
    return ClassroomEntregaRepository.findByTarea(idTarea);
  }

  async listByEstudiante(idEstudiante: string) {
    return ClassroomEntregaRepository.findByEstudiante(idEstudiante);
  }

  async get(id: string) {
    const data = await ClassroomEntregaRepository.findById(id);
    if (!data) throw new AppError(404, 'Entrega no encontrada');
    return data;
  }

  async create(data: { idClassroomTarea: string; idEstudiante: string }) {
    const res = await ClassroomEntregaRepository.create({
      ...data,
      estado: ClassroomEntregaEstado.PENDIENTE,
    });
    return ClassroomEntregaRepository.findById(res.id);
  }

  async updateEstado(id: string, data: { estadoEntrega: string; observacionProfesor?: string }) {
    await ClassroomEntregaRepository.updateEstado(id, { estado: data.estadoEntrega, observacionProfesor: data.observacionProfesor });
    return ClassroomEntregaRepository.findById(id);
  }

  async delete(id: string) {
    return ClassroomEntregaRepository.remove(id);
  }

  async listAdjuntos(idEntrega: string) {
    return ClassroomEntregaRepository.findAdjuntos(idEntrega);
  }

  async createAdjunto(data: { idClassroomEntrega: string; urlArchivo: string; nombreArchivo: string }) {
    return ClassroomEntregaRepository.createAdjunto(data);
  }

  async deleteAdjunto(id: string) {
    return ClassroomEntregaRepository.removeAdjunto(id);
  }

  async listForEstudiante(idUsuario: string) {
    const estudiante = await EstudianteRepository.findByIdUsuario(idUsuario);
    if (!estudiante) throw new AppError(404, 'Estudiante no encontrado');
    return ClassroomEntregaRepository.findByEstudiante((estudiante as any).id);
  }

  async createForEstudiante(idUsuario: string, idClassroomTarea: string) {
    const estudiante = await EstudianteRepository.findByIdUsuario(idUsuario);
    if (!estudiante) throw new AppError(404, 'Estudiante no encontrado');

    const idEstudiante = (estudiante as any).id;

    const tieneVencida = await ObligacionPagoRepository.hasVencidoByEstudiante(idEstudiante);
    if (tieneVencida) throw new AppError(403, 'Tienes obligaciones de pago vencidas. Regulariza tu situación antes de entregar tareas.');

    const existing = await ClassroomEntregaRepository.findByEstudianteAndTarea(idEstudiante, idClassroomTarea);
    if (existing) throw new AppError(409, 'Ya existe una entrega para esta tarea');

    const res = await ClassroomEntregaRepository.create({
      idClassroomTarea,
      idEstudiante,
      estado: ClassroomEntregaEstado.PENDIENTE,
    });
    return ClassroomEntregaRepository.findById(res.id);
  }

  async uploadAdjuntosForEstudiante(idUsuario: string, idEntrega: string, files: Express.Multer.File[]) {
    const estudiante = await EstudianteRepository.findByIdUsuario(idUsuario);
    if (!estudiante) throw new AppError(404, 'Estudiante no encontrado');

    const tieneVencida = await ObligacionPagoRepository.hasVencidoByEstudiante((estudiante as any).id);
    if (tieneVencida) throw new AppError(403, 'Tienes obligaciones de pago vencidas. Regulariza tu situación antes de subir archivos.');

    const entrega = await ClassroomEntregaRepository.findById(idEntrega);
    if (!entrega) throw new AppError(404, 'Entrega no encontrada');

    for (const file of files) {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!ALLOWED_EXTS.includes(ext)) {
        throw new AppError(400, `Extensión no permitida: ${ext}. Permitidas: pdf, jpg, jpeg, png, docx`);
      }
      if (file.size > MAX_SIZE_BYTES) {
        throw new AppError(400, `El archivo "${file.originalname}" excede el límite de 10 MB`);
      }
    }

    const adjuntos = [];
    for (const file of files) {
      const { url, nombre } = await uploadClassroomFile(file);
      const { id } = await ClassroomEntregaRepository.createAdjunto({
        idClassroomEntrega: idEntrega,
        urlArchivo: url,
        nombreArchivo: nombre,
      });
      adjuntos.push({ id, idClassroomEntrega: idEntrega, urlArchivo: url, nombreArchivo: nombre });
    }
    return adjuntos;
  }

  async deleteAdjuntoWithFile(id: string) {
    const adjunto = await ClassroomEntregaRepository.findAdjuntoById(id);
    if (!adjunto) throw new AppError(404, 'Adjunto no encontrado');

    const match = adjunto.urlArchivo.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      await deleteFileFromDrive(match[1]);
    }

    return ClassroomEntregaRepository.removeAdjunto(id);
  }
}

export default new ClassroomEntregaService();

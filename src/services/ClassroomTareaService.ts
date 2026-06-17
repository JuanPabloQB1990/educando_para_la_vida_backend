import path from 'path';
import ClassroomTareaRepository from '../repositories/ClassroomTareaRepository';
import EstudianteRepository from '../repositories/EstudianteRepository';
import EstudianteMatriculaRepository from '../repositories/EstudianteMatriculaRepository';
import GradosPorMatriculaRepository from '../repositories/GradosPorMatriculaRepository';
import BloqueGradoRepository from '../repositories/BloqueGradoRepository';
import { uploadClassroomFile, deleteFileFromDrive } from '../utils/uploadFIleToGoogleDrive';
import { AppError } from '../error/AppError';

const ALLOWED_EXTS = ['.pdf', '.jpg', '.jpeg', '.png', '.docx'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

class ClassroomTareaService {
  async listByCarga(idCargaAcademica: string) {
    return ClassroomTareaRepository.findByCarga(idCargaAcademica);
  }

  async listByGrado(idGradoEducacion: string, idAnioElectivo: string) {
    return ClassroomTareaRepository.findByGrado(idGradoEducacion, idAnioElectivo);
  }

  async get(id: string) {
    return ClassroomTareaRepository.findById(id);
  }

  async create(data: { idCargaAcademica: string; idPeriodo: string | null; titulo: string; instrucciones: string; fechaLimite: string }) {
    const res = await ClassroomTareaRepository.create(data);
    return ClassroomTareaRepository.findById(res.id);
  }

  async update(id: string, data: { titulo: string; instrucciones: string; fechaLimite: string }) {
    await ClassroomTareaRepository.update(id, data);
    return ClassroomTareaRepository.findById(id);
  }

  async delete(id: string) {
    return ClassroomTareaRepository.remove(id);
  }

  async listAdjuntos(idTarea: string) {
    return ClassroomTareaRepository.findAdjuntos(idTarea);
  }

  async createAdjuntos(idTarea: string, files: Express.Multer.File[]) {
    if (!files || files.length === 0) throw new AppError(400, 'Se requiere al menos un archivo');

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
      const { id } = await ClassroomTareaRepository.createAdjunto({
        idClassroomTarea: idTarea,
        urlArchivo: url,
        nombreArchivo: nombre,
      });
      adjuntos.push({ id, idClassroomTarea: idTarea, urlArchivo: url, nombreArchivo: nombre });
    }
    return adjuntos;
  }

  async deleteAdjunto(id: string) {
    const adjunto = await ClassroomTareaRepository.findAdjuntoById(id);
    if (!adjunto) throw new AppError(404, 'Adjunto no encontrado');

    const match = adjunto.urlArchivo.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      await deleteFileFromDrive(match[1]);
    }

    return ClassroomTareaRepository.removeAdjunto(id);
  }

  async listForEstudiante(idUsuario: string) {
    const estudiante = await EstudianteRepository.findByIdUsuario(idUsuario);
    if (!estudiante) throw new AppError(404, 'Estudiante no encontrado');

    const matricula = await EstudianteMatriculaRepository.findMostRecentByEstudiante((estudiante as any).id);
    if (!matricula) throw new AppError(404, 'No se encontró matrícula activa');

    const grados = await GradosPorMatriculaRepository.findByEstudianteMatricula((matricula as any).id);
    const gradoPendiente = (grados as any[]).find((g) => g.estado === 'pendiente');
    if (!gradoPendiente) throw new AppError(404, 'No se encontró grado en estado pendiente');

    const idGradoEducacion: string = gradoPendiente.idGradoEducacion;
    const tipoEstudio = ((matricula as any).nombreTipoEstudio ?? '').toLowerCase();

    if (tipoEstudio.includes('formal')) {
      return ClassroomTareaRepository.findByGradoFormal(idGradoEducacion);
    }

    const bloqueGrado = await BloqueGradoRepository.findByGrado(idGradoEducacion);
    if (!bloqueGrado) throw new AppError(404, 'No se encontró bloque asignado al grado');
    return ClassroomTareaRepository.findByBloqueValidacion(bloqueGrado.idBloque);
  }
}

export default new ClassroomTareaService();

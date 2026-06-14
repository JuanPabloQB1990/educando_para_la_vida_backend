import path from 'path';
import ClassroomTareaRepository from '../repositories/ClassroomTareaRepository';
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

  async create(data: { idCargaAcademica: string; idPeriodo: string; titulo: string; instrucciones: string; fechaLimite: string }) {
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
}

export default new ClassroomTareaService();

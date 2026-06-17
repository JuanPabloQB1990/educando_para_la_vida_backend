import DireccionGradoRepository from '../repositories/DireccionGradoRepository';
import EstudianteRepository from '../repositories/EstudianteRepository';
import EstudianteMatriculaRepository from '../repositories/EstudianteMatriculaRepository';
import GradosPorMatriculaRepository from '../repositories/GradosPorMatriculaRepository';
import { AppError } from '../error/AppError';

class DireccionGradoService {
  async list() {
    return DireccionGradoRepository.findAll();
  }

  async listByProfesor(idUsuario: string, idAnioElectivo?: string) {
    return DireccionGradoRepository.findByProfesor(idUsuario, idAnioElectivo);
  }

  async get(id: string) {
    return DireccionGradoRepository.findById(id);
  }

  async create(data: { idGradoEducacion: string | null; idUsuario: string; idAnioElectivo: string; idBloque?: string | null }) {
    const res = await DireccionGradoRepository.create(data);
    return DireccionGradoRepository.findById(res.id);
  }

  async update(id: string, data: { idGradoEducacion: string | null; idUsuario: string; idAnioElectivo: string; idBloque?: string | null }) {
    await DireccionGradoRepository.update(id, data);
    return DireccionGradoRepository.findById(id);
  }

  async updateLink(id: string, linkClaseVirtual: string) {
    await DireccionGradoRepository.updateLink(id, linkClaseVirtual);
    return DireccionGradoRepository.findById(id);
  }

  async delete(id: string) {
    return DireccionGradoRepository.remove(id);
  }

  async getForEstudiante(idUsuario: string) {
    const estudiante = await EstudianteRepository.findByIdUsuario(idUsuario);
    if (!estudiante) throw new AppError(404, 'Estudiante no encontrado');

    const matricula = await EstudianteMatriculaRepository.findMostRecentByEstudiante((estudiante as any).id);
    if (!matricula) throw new AppError(404, 'No se encontró matrícula activa');

    const grados = await GradosPorMatriculaRepository.findByEstudianteMatricula((matricula as any).id);
    const gradoPendiente = (grados as any[]).find((g) => g.estado === 'pendiente');
    if (!gradoPendiente) throw new AppError(404, 'No se encontró grado en estado pendiente');

    return DireccionGradoRepository.findByGradoActivo(gradoPendiente.idGradoEducacion);
  }
}

export default new DireccionGradoService();

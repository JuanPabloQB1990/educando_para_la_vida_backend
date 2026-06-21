import GradosPorMatriculaRepository from '../repositories/GradosPorMatriculaRepository';
import { AppError } from '../error/AppError';

class GradosPorMatriculaService {
  async list() {
    return await GradosPorMatriculaRepository.findAll();
  }

  async get(id_estudiante_matricula: string, id_grado_educacion: string) {
    const data = await GradosPorMatriculaRepository.findByPK(id_estudiante_matricula, id_grado_educacion);
    if (!data) throw new AppError(404, 'Registro no encontrado');
    return data;
  }

  async create(data: { id_estudiante_matricula: string; id_grado_educacion: string; estado: string }) {
    return GradosPorMatriculaRepository.create(data.id_estudiante_matricula, data.id_grado_educacion, data.estado);
  }

  async createMany(data: any) {
    const res: any = await GradosPorMatriculaRepository.createMany(data);
    return res;
  }

  async update(id_estudiante_matricula: string, id_grado_educacion: string, data: any) {
    return await GradosPorMatriculaRepository.update(id_estudiante_matricula, id_grado_educacion, data.estado);
  }

  async delete(id_estudiante_matricula: string, id_grado_educacion: string) {
    return await GradosPorMatriculaRepository.remove(id_estudiante_matricula, id_grado_educacion);
  }
}

export default new GradosPorMatriculaService();

import GradosPorMatriculaRepository from '../repositories/GradosPorMatriculaRepository';

class GradosPorMatriculaService {
  async list() {
    return await GradosPorMatriculaRepository.findAll();
  }

  async get(id_estudiante_periodo: string, id_grado_educacion: string) {
    return await GradosPorMatriculaRepository.findByPK(id_estudiante_periodo, id_grado_educacion);
  }

  async create(data: any) {
    const res: any = await GradosPorMatriculaRepository.create(data.id_estudiante_periodo, data.id_grado_educacion, data.estado);
    return res;
  }

  async update(id_estudiante_periodo: string, id_grado_educacion: string, data: any) {
    return await GradosPorMatriculaRepository.update(id_estudiante_periodo, id_grado_educacion, data.estado);
  }

  async delete(id_estudiante_periodo: string, id_grado_educacion: string) {
    return await GradosPorMatriculaRepository.remove(id_estudiante_periodo, id_grado_educacion);
  }
}

export default new GradosPorMatriculaService();

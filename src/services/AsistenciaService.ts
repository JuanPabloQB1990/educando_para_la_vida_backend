import AsistenciaRepository from '../repositories/AsistenciaRepository';

class AsistenciaService {
  async listByGradoPeriodo(idGradoEducacion: string, idPeriodo: string) {
    return AsistenciaRepository.findByGradoPeriodo(idGradoEducacion, idPeriodo);
  }

  async listByEstudiante(idEstudiante: string, idPeriodo?: string) {
    return AsistenciaRepository.findByEstudiante(idEstudiante, idPeriodo);
  }

  async get(id: string) {
    return AsistenciaRepository.findById(id);
  }

  async create(data: { idEstudiante: string; idPeriodo: string; idActividadMateria: string; fecha: string; estadoAsistencia: string; observacion?: string }) {
    const res = await AsistenciaRepository.create({ idEstudiante: data.idEstudiante, idPeriodo: data.idPeriodo, idActividadMateria: data.idActividadMateria, fecha: data.fecha, estado: data.estadoAsistencia, observacion: data.observacion });
    return AsistenciaRepository.findById(res.id);
  }

  async update(id: string, data: { fecha: string; estadoAsistencia: string; observacion?: string }) {
    await AsistenciaRepository.update(id, { fecha: data.fecha, estado: data.estadoAsistencia, observacion: data.observacion });
    return AsistenciaRepository.findById(id);
  }

  async delete(id: string) {
    return AsistenciaRepository.remove(id);
  }
}

export default new AsistenciaService();

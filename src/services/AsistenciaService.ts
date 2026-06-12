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

  async create(data: { idEstudiante: string; idActividad: string; fecha: string; estadoAsistencia: string | null; observacion?: string | null }) {
    const res = await AsistenciaRepository.create({
      idEstudiante: data.idEstudiante,
      idActividad: data.idActividad,
      fecha: data.fecha,
      estado: data.estadoAsistencia,
      observacion: data.observacion,
    });
    return AsistenciaRepository.findById(res.id);
  }

  async upsert(data: { idEstudiante: string; idActividad: string; fecha: string; estadoAsistencia: string | null; observacion?: string | null }) {
    const existente = await AsistenciaRepository.findByEstudianteActividadFecha(data.idEstudiante, data.idActividad, data.fecha);
    if (existente) {
      await AsistenciaRepository.update(existente.id, {
        fecha: data.fecha,
        estado: data.estadoAsistencia,
        observacion: data.observacion,
      });
      return AsistenciaRepository.findById(existente.id);
    }
    const res = await AsistenciaRepository.create({
      idEstudiante: data.idEstudiante,
      idActividad: data.idActividad,
      fecha: data.fecha,
      estado: data.estadoAsistencia,
      observacion: data.observacion,
    });
    return AsistenciaRepository.findById(res.id);
  }

  async update(id: string, data: { fecha: string; estadoAsistencia: string | null; observacion?: string | null }) {
    await AsistenciaRepository.update(id, { fecha: data.fecha, estado: data.estadoAsistencia, observacion: data.observacion });
    return AsistenciaRepository.findById(id);
  }

  async updateFechaSesion(idActividad: string, fechaActual: string, fechaNueva: string) {
    return AsistenciaRepository.updateFechaByActividadFecha(idActividad, fechaActual, fechaNueva);
  }

  async delete(id: string) {
    return AsistenciaRepository.remove(id);
  }
}

export default new AsistenciaService();

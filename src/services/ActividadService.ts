import ActividadRepository from '../repositories/ActividadRepository';

class ActividadService {
  async listByGradoPeriodo(idGradoEducacion: string, idPeriodo: string) {
    return ActividadRepository.findByGradoPeriodo(idGradoEducacion, idPeriodo);
  }

  async get(id: string) {
    return ActividadRepository.findById(id);
  }

  async create(data: { idPeriodo: string; idGradoEducacion: string; nombreActividad: string; semana: number; descripcion?: string }) {
    const res = await ActividadRepository.create({ idPeriodo: data.idPeriodo, idGradoEducacion: data.idGradoEducacion, nombre: data.nombreActividad, semana: data.semana, descripcion: data.descripcion });
    return ActividadRepository.findById(res.id);
  }

  async update(id: string, data: { nombreActividad: string; semana: number; descripcion?: string }) {
    await ActividadRepository.update(id, { nombre: data.nombreActividad, semana: data.semana, descripcion: data.descripcion });
    return ActividadRepository.findById(id);
  }

  async delete(id: string) {
    return ActividadRepository.remove(id);
  }
}

export default new ActividadService();

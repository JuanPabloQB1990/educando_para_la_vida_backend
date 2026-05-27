import ActividadMateriaRepository from '../repositories/ActividadMateriaRepository';

class ActividadMateriaService {
  async listByActividad(idActividad: string) {
    return ActividadMateriaRepository.findByActividad(idActividad);
  }

  async get(id: string) {
    return ActividadMateriaRepository.findById(id);
  }

  async create(data: { idActividad: string; idMateria: string; idCargaAcademica: string; nombreActividad: string }) {
    const res = await ActividadMateriaRepository.create(data);
    return ActividadMateriaRepository.findById(res.id);
  }

  async update(id: string, nombreActividad: string) {
    await ActividadMateriaRepository.update(id, { nombreActividad });
    return ActividadMateriaRepository.findById(id);
  }

  async delete(id: string) {
    return ActividadMateriaRepository.remove(id);
  }
}

export default new ActividadMateriaService();

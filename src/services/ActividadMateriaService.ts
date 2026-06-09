import ActividadMateriaRepository from '../repositories/ActividadMateriaRepository';

class ActividadMateriaService {
  async listByActividad(idActividad: string) {
    return ActividadMateriaRepository.findByActividad(idActividad);
  }

  async get(id: string) {
    return ActividadMateriaRepository.findById(id);
  }

  async create(data: { idActividad: string; idMateria: string; idCargaAcademica: string; nombreActividad: string }) {
    const existente = await ActividadMateriaRepository.findByActividadAndMateria(data.idActividad, data.idMateria);
    if (existente) {
      await ActividadMateriaRepository.update(existente.id, { nombre: data.nombreActividad });
      return ActividadMateriaRepository.findById(existente.id);
    }
    const res = await ActividadMateriaRepository.create({ idActividad: data.idActividad, idMateria: data.idMateria, idCargaAcademica: data.idCargaAcademica, nombre: data.nombreActividad });
    return ActividadMateriaRepository.findById(res.id);
  }

  async update(id: string, nombreActividad: string) {
    await ActividadMateriaRepository.update(id, { nombre: nombreActividad });
    return ActividadMateriaRepository.findById(id);
  }

  async delete(id: string) {
    return ActividadMateriaRepository.remove(id);
  }
}

export default new ActividadMateriaService();

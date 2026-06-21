import ActividadMateriaRepository from '../repositories/ActividadMateriaRepository';
import { AppError } from '../error/AppError';

class ActividadMateriaService {
  async listByActividad(idActividad: string) {
    return ActividadMateriaRepository.findByActividad(idActividad);
  }

  async get(id: string) {
    const data = await ActividadMateriaRepository.findById(id);
    if (!data) throw new AppError(404, 'Actividad-materia no encontrada');
    return data;
  }

  async create(data: { idActividad: string; idMateria: string; idCargaAcademica: string }) {
    const existente = await ActividadMateriaRepository.findByActividadAndMateria(data.idActividad, data.idMateria);
    if (existente) return existente;
    const res = await ActividadMateriaRepository.create(data);
    return ActividadMateriaRepository.findById(res.id);
  }

  async delete(id: string) {
    return ActividadMateriaRepository.remove(id);
  }
}

export default new ActividadMateriaService();

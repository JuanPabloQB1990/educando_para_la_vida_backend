import CalificacionRepository from '../repositories/CalificacionRepository';

class CalificacionService {
  async listByActividadMateria(idActividadMateria: string) {
    return CalificacionRepository.findByActividadMateria(idActividadMateria);
  }

  async listByEstudiante(idEstudiante: string, idPeriodo?: string) {
    return CalificacionRepository.findByEstudiante(idEstudiante, idPeriodo);
  }

  async get(id: string) {
    return CalificacionRepository.findById(id);
  }

  async create(data: { idEstudiante: string; idActividadMateria: string; nota: number; observacion?: string }) {
    const res = await CalificacionRepository.create(data);
    return CalificacionRepository.findById(res.id);
  }

  async update(id: string, data: { nota: number; observacion?: string }) {
    await CalificacionRepository.update(id, data);
    return CalificacionRepository.findById(id);
  }

  async delete(id: string) {
    return CalificacionRepository.remove(id);
  }
}

export default new CalificacionService();

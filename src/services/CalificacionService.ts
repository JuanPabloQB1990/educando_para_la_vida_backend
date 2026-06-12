import CalificacionRepository from '../repositories/CalificacionRepository';
import { AppError } from '../error/AppError';

type Solicitante = { id: string; nombreRol: string };

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

  async create(data: { idEstudiante: string; idActividadMateria: string; nota: number; observacion?: string }, solicitante?: Solicitante) {
    if (solicitante?.nombreRol === 'profesor(a)') {
      const idUsuarioPropietario = await CalificacionRepository.findIdUsuarioByActividadMateria(data.idActividadMateria);
      if (idUsuarioPropietario !== solicitante.id) {
        throw new AppError(403, 'No tienes permiso para calificar esta materia');
      }
    }
    const res = await CalificacionRepository.create(data);
    return CalificacionRepository.findById(res.id);
  }

  async update(id: string, data: { nota: number; observacion?: string }, solicitante?: Solicitante) {
    if (solicitante?.nombreRol === 'profesor(a)') {
      const idUsuarioPropietario = await CalificacionRepository.findIdUsuarioByCalificacion(id);
      if (idUsuarioPropietario !== solicitante.id) {
        throw new AppError(403, 'No tienes permiso para editar esta calificación');
      }
    }
    await CalificacionRepository.update(id, data);
    return CalificacionRepository.findById(id);
  }

  async delete(id: string) {
    return CalificacionRepository.remove(id);
  }
}

export default new CalificacionService();

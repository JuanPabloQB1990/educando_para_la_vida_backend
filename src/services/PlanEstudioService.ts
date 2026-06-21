import PlanEstudioRepository from '../repositories/PlanEstudioRepository';
import { AppError } from '../error/AppError';

class PlanEstudioService {
  async list() {
    return PlanEstudioRepository.findAll();
  }

  async listByGrado(idGradoEducacion: string) {
    return PlanEstudioRepository.findByGrado(idGradoEducacion);
  }

  async get(id: string) {
    const data = await PlanEstudioRepository.findById(id);
    if (!data) throw new AppError(404, 'Plan de estudio no encontrado');
    return data;
  }

  async create(idGradoEducacion: string, idMateria: string) {
    const res = await PlanEstudioRepository.create(idGradoEducacion, idMateria);
    return PlanEstudioRepository.findById(res.id);
  }

  async delete(id: string) {
    return PlanEstudioRepository.remove(id);
  }
}

export default new PlanEstudioService();

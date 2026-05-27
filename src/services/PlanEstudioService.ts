import PlanEstudioRepository from '../repositories/PlanEstudioRepository';

class PlanEstudioService {
  async list() {
    return PlanEstudioRepository.findAll();
  }

  async listByGrado(idGradoEducacion: string) {
    return PlanEstudioRepository.findByGrado(idGradoEducacion);
  }

  async get(id: string) {
    return PlanEstudioRepository.findById(id);
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

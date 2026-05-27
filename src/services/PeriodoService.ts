import PeriodoRepository from '../repositories/PeriodoRepository';

class PeriodoService {
  async list() {
    return PeriodoRepository.findAll();
  }

  async listByAnio(idAnioElectivo: string) {
    return PeriodoRepository.findByAnio(idAnioElectivo);
  }

  async get(id: string) {
    return PeriodoRepository.findById(id);
  }
}

export default new PeriodoService();

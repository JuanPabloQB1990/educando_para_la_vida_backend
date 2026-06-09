import PeriodoRepository from '../repositories/PeriodoRepository';
import { PeriodoEstado } from '../enums/periodo.enum';
import { AppError } from '../error/AppError';

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

  async updateEstado(id: string, estado: PeriodoEstado) {
    const periodo = await PeriodoRepository.findById(id);
    if (!periodo) throw new AppError(404, 'Periodo no encontrado');
    await PeriodoRepository.updateEstado(id, estado);
  }
}

export default new PeriodoService();

import AutoevaluacionRepository from '../repositories/AutoevaluacionRepository';
import { AppError } from '../error/AppError';

class AutoevaluacionService {
  async upsert(data: {
    idEstudiante: string;
    idPeriodo: string;
    idGradoEducacion: string;
    nota: number;
    observacion?: string | null;
  }) {
    if (data.nota < 0 || data.nota > 10) throw new AppError(400, 'La nota debe estar entre 0 y 10');
    return AutoevaluacionRepository.upsert(data);
  }

  async delete(id: string) {
    return AutoevaluacionRepository.delete(id);
  }
}

export default new AutoevaluacionService();

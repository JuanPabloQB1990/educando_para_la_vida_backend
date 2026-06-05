import BloqueGradoRepository from '../repositories/BloqueGradoRepository';
import { AppError } from '../error/AppError';

class BloqueGradoService {
  async list() {
    return await BloqueGradoRepository.findAll();
  }

  async listByBloque(idBloque: string) {
    return await BloqueGradoRepository.findByBloque(idBloque);
  }

  async assign(idBloque: string, idGradoEducacion: string) {
    const ya = await BloqueGradoRepository.exists(idBloque, idGradoEducacion);
    if (ya) throw new AppError(409, 'El grado ya está asignado a este bloque');
    await BloqueGradoRepository.create(idBloque, idGradoEducacion);
    return await BloqueGradoRepository.findByBloque(idBloque);
  }

  async remove(idBloque: string, idGradoEducacion: string) {
    const existe = await BloqueGradoRepository.exists(idBloque, idGradoEducacion);
    if (!existe) throw new AppError(404, 'Relación bloque-grado no encontrada');
    return await BloqueGradoRepository.remove(idBloque, idGradoEducacion);
  }
}

export default new BloqueGradoService();

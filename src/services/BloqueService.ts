import BloqueRepository from '../repositories/BloqueRepository';
import { AppError } from '../error/AppError';

class BloqueService {
  async list() {
    return await BloqueRepository.findAll();
  }

  async get(id: string) {
    const bloque = await BloqueRepository.findById(id);
    if (!bloque) throw new AppError(404, 'Bloque no encontrado');
    return bloque;
  }

  async create(nombre: string) {
    const result = await BloqueRepository.create(nombre);
    return await BloqueRepository.findById(result.id);
  }

  async update(id: string, nombre: string) {
    await this.get(id);
    return await BloqueRepository.update(id, nombre);
  }

  async delete(id: string) {
    await this.get(id);
    return await BloqueRepository.remove(id);
  }
}

export default new BloqueService();

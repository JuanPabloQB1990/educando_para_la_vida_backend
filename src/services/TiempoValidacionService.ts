import TiempoValidacionRepository from '../repositories/TiempoValidacionRepository';
import { AppError } from '../error/AppError';

class TiempoValidacionService {
  async list() {
    return await TiempoValidacionRepository.findAll();
  }

  async get(id: string) {
    const data = await TiempoValidacionRepository.findById(id);
    if (!data) throw new AppError(404, 'Tiempo de validación no encontrado');
    return data;
  }

  async create(tiempo: string) {
    const res: any = await TiempoValidacionRepository.create(tiempo);
    const id = res?.id;
    if (!id) return null;
    return await TiempoValidacionRepository.findById(id);
  }

  async update(id: string, tiempo: string) {
    await TiempoValidacionRepository.update(id, tiempo);
    return await TiempoValidacionRepository.findById(id);
  }

  async delete(id: string) {
    return await TiempoValidacionRepository.remove(id);
  }
}

export default new TiempoValidacionService();

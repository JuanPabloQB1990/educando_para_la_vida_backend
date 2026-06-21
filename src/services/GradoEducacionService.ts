import GradoEducacionRepository from '../repositories/GradoEducacionRepository';
import { AppError } from '../error/AppError';

class GradoEducacionService {
  async list() {
    return await GradoEducacionRepository.findAll();
  }

  async get(id: string) {
    const data = await GradoEducacionRepository.findById(id);
    if (!data) throw new AppError(404, 'Grado no encontrado');
    return data;
  }

  async create(nombre: string) {
    const res: any = await GradoEducacionRepository.create(nombre);
    const id = res?.id;
    if (!id) return null;
    return await GradoEducacionRepository.findById(id);
  }

  async update(id: string, nombre: string) {
    return await GradoEducacionRepository.update(id, nombre);
  }

  async delete(id: string) {
    return await GradoEducacionRepository.remove(id);
  }
}

export default new GradoEducacionService();

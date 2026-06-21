import TipoEstudioRepository from "../repositories/TipoEstudioRepository";
import { AppError } from '../error/AppError';

class TipoEstudioService {
  async list() {
    return await TipoEstudioRepository.findAll();
  }

  async get(id: string) {
    const data = await TipoEstudioRepository.findById(id);
    if (!data) throw new AppError(404, 'Tipo de estudio no encontrado');
    return data;
  }

  async create(nombre: string) {
    const res: any = await TipoEstudioRepository.create(nombre);
    const id = res?.id;
    if (!id) return null;
    return await TipoEstudioRepository.findById(id);
  }

  async update(id: string, nombre: string) {
    return await TipoEstudioRepository.update(id, nombre);
  }

  async delete(id: string) {
    return await TipoEstudioRepository.remove(id);
  }
}

export default new TipoEstudioService();

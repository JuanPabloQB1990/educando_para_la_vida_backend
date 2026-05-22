import TipoEstudioRepository from '../repositories/TipoEstudioRepository';

class TipoEstudioService {
  async list() {
    return await TipoEstudioRepository.findAll();
  }

  async get(id: string) {
    return await TipoEstudioRepository.findById(id);
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

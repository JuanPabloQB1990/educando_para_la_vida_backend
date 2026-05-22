import GradoEducacionRepository from '../repositories/GradoEducacionRepository';

class GradoEducacionService {
  async list() {
    return await GradoEducacionRepository.findAll();
  }

  async get(id: string) {
    return await GradoEducacionRepository.findById(id);
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

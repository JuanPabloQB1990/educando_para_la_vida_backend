import MateriaRepository from '../repositories/MateriaRepository';

class MateriaService {
  async list() {
    return MateriaRepository.findAll();
  }

  async get(id: string) {
    return MateriaRepository.findById(id);
  }

  async create(nombreMateria: string) {
    const res = await MateriaRepository.create(nombreMateria);
    return MateriaRepository.findById(res.id);
  }

  async update(id: string, nombreMateria: string) {
    await MateriaRepository.update(id, nombreMateria);
    return MateriaRepository.findById(id);
  }

  async delete(id: string) {
    return MateriaRepository.remove(id);
  }
}

export default new MateriaService();

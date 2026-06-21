import MateriaRepository from '../repositories/MateriaRepository';
import { AppError } from '../error/AppError';

class MateriaService {
  async list() {
    return MateriaRepository.findAll();
  }

  async get(id: string) {
    const data = await MateriaRepository.findById(id);
    if (!data) throw new AppError(404, 'Materia no encontrada');
    return data;
  }

  async create(nombreMateria: string, abreviatura: string) {
    const res = await MateriaRepository.create(nombreMateria, abreviatura);
    return MateriaRepository.findById(res.id);
  }

  async update(id: string, nombreMateria: string, abreviatura: string) {
    await MateriaRepository.update(id, nombreMateria, abreviatura);
    return MateriaRepository.findById(id);
  }

  async delete(id: string) {
    return MateriaRepository.remove(id);
  }
}

export default new MateriaService();

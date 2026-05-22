import EstudiantePeriodoRepository from '../repositories/EstudiantePeriodoRepository';

class EstudiantePeriodoService {
  async list() {
    return await EstudiantePeriodoRepository.findAll();
  }

  async get(id: string) {
    return await EstudiantePeriodoRepository.findById(id);
  }

  async create(data: any) {
    const res: any = await EstudiantePeriodoRepository.create(data);
    const id = res?.id;
    if (!id) return null;
    return await EstudiantePeriodoRepository.findById(id);
  }

  async update(id: string, data: any) {
    return await EstudiantePeriodoRepository.update(id, data);
  }

  async delete(id: string) {
    return await EstudiantePeriodoRepository.remove(id);
  }
}

export default new EstudiantePeriodoService();

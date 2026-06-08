import TiempoValidacionRepository from '../repositories/TiempoValidacionRepository';

class TiempoValidacionService {
  async list() {
    return await TiempoValidacionRepository.findAll();
  }

  async get(id: string) {
    return await TiempoValidacionRepository.findById(id);
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

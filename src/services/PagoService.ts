import PagoRepository from '../repositories/PagoRepository';

class PagoService {
  async list() {
    return await PagoRepository.findAll();
  }

  async get(id: string) {
    return await PagoRepository.findById(id);
  }

  async create(data: any) {
    const res: any = await PagoRepository.create(data);
    const id = res?.id;
    if (!id) return null;
    return await PagoRepository.findById(id);
  }

  async update(id: string, data: any) {
    await PagoRepository.update(id, data);
    return await PagoRepository.findById(id);
  }

  async delete(id: string) {
    const existing = await PagoRepository.findById(id);
    if (!existing) return null;
    return await PagoRepository.remove(id);
  }
}

export default new PagoService();

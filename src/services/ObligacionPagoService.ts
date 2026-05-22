import ObligacionPagoRepository from '../repositories/ObligacionPagoRepository';

class ObligacionPagoService {
  async list() {
    return await ObligacionPagoRepository.findAll();
  }

  async get(id: string) {
    return await ObligacionPagoRepository.findById(id);
  }

  async create(data: any) {
    const res: any = await ObligacionPagoRepository.create(data);
    const id = res?.id;
    if (!id) return null;
    return await ObligacionPagoRepository.findById(id);
  }

  async update(id: string, data: any) {
    await ObligacionPagoRepository.update(id, data);
    return await ObligacionPagoRepository.findById(id);
  }

  async delete(id: string) {
    const existing = await ObligacionPagoRepository.findById(id);
    if (!existing) return null;
    return await ObligacionPagoRepository.remove(id);
  }
}

export default new ObligacionPagoService();

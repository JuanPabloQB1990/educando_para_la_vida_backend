import ObligacionPagoRepository from '../repositories/ObligacionPagoRepository';
import { AppError } from '../error/AppError';

class ObligacionPagoService {
  async list() {
    return await ObligacionPagoRepository.findAll();
  }

  async get(id: string) {
    const data = await ObligacionPagoRepository.findById(id);
    if (!data) throw new AppError(404, 'Obligación de pago no encontrada');
    return data;
  }

  async create(data: any) {
    const res: any = await ObligacionPagoRepository.create(data);
    const id = res?.id;
    if (id) return id;
    return null;
  }

  async update(id: string, data: any) {
    const existing = await ObligacionPagoRepository.findById(id);
    if (!existing) throw new AppError(404, 'Obligación de pago no encontrada');
    await ObligacionPagoRepository.update(id, data);
    return await ObligacionPagoRepository.findById(id);
  }

  async delete(id: string) {
    const existing = await ObligacionPagoRepository.findById(id);
    if (!existing) throw new AppError(404, 'Obligación de pago no encontrada');
    return await ObligacionPagoRepository.remove(id);
  }
}

export default new ObligacionPagoService();

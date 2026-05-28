import PagoRepository, { type PagoAdminFilters } from '../repositories/PagoRepository';

class PagoService {
  async list() {
    return await PagoRepository.findAll();
  }

  async listForAdmin(filters: PagoAdminFilters) {
    return await PagoRepository.findAllForAdmin(filters);
  }

  async verificarPago(idPago: string, accion: 'aprobado' | 'rechazado', observaciones?: string) {
    const existing = await PagoRepository.findById(idPago);
    if (!existing) return null;
    if (existing.estado !== 'pendiente') {
      throw new Error(`El pago ya fue ${existing.estado}, no se puede modificar`);
    }
    return await PagoRepository.aprobarRechazar(idPago, accion, observaciones);
  }

  async get(id: string) {
    return await PagoRepository.findById(id);
  }

  async create(data: any) {
    const res: any = await PagoRepository.create(data);
    const id = res?.id;
    if (id) return id;
    return null
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

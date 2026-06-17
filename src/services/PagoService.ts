import PagoRepository, { type PagoAdminFilters } from '../repositories/PagoRepository';
import type { CreatePagoDto } from '../models/pago';

class PagoService {
  async list() {
    return await PagoRepository.findAll();
  }

  async listForAdmin(filters: PagoAdminFilters) {
    return await PagoRepository.findAllForAdmin(filters);
  }

  async verificarPago(
    idPago: string,
    accion: 'aprobado' | 'rechazado',
    observaciones?: string,
    idObligacionPago?: string,
    montoPagado?: string
  ) {
    const existing = await PagoRepository.findById(idPago);
    if (!existing) return null;
    return await PagoRepository.aprobarRechazar(idPago, accion, observaciones, idObligacionPago, montoPagado);
  }

  async get(id: string) {
    return await PagoRepository.findById(id);
  }

  async create(data: CreatePagoDto) {
    const { id } = await PagoRepository.create(data);
    return id ?? null;
  }

  async update(id: string, data: CreatePagoDto) {
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

import PagoRepository, { type PagoAdminFilters } from '../repositories/PagoRepository';
import type { CreatePagoDto } from '../models/pago';
import { AppError } from '../error/AppError';

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
    if (!existing) throw new AppError(404, 'Pago no encontrado');
    return await PagoRepository.aprobarRechazar(idPago, accion, observaciones, idObligacionPago, montoPagado);
  }

  async get(id: string) {
    const data = await PagoRepository.findById(id);
    if (!data) throw new AppError(404, 'Pago no encontrado');
    return data;
  }

  async create(data: CreatePagoDto) {
    const { id } = await PagoRepository.create(data);
    if (!id) throw new AppError(500, 'Error al crear pago');
    return id;
  }

  async update(id: string, data: CreatePagoDto) {
    const existing = await PagoRepository.findById(id);
    if (!existing) throw new AppError(404, 'Pago no encontrado');
    await PagoRepository.update(id, data);
    return await PagoRepository.findById(id);
  }

  async delete(id: string) {
    const existing = await PagoRepository.findById(id);
    if (!existing) throw new AppError(404, 'Pago no encontrado');
    return await PagoRepository.remove(id);
  }
}

export default new PagoService();

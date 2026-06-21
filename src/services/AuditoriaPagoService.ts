import AuditoriaPagoRepository from '../repositories/AuditoriaPagoRepository';
import UsuarioRepository from '../repositories/UsuarioRepository';
import { AppError } from '../error/AppError';
import type { AuditoriaPago } from '../models/auditoriaPago';

class AuditoriaPagoService {
  async registrarVerificacion(idPago: string, idUsuario: string): Promise<void> {
    const usuario = await UsuarioRepository.findById(idUsuario);
    if (!usuario) throw new AppError(404, 'Usuario no encontrado');

    await AuditoriaPagoRepository.upsert({
      idPago,
      nombres: usuario.nombres,
      apellido1: usuario.apellido1,
      apellido2: usuario.apellido2 ?? null,
    });
  }

  async obtenerPorPago(idPago: string): Promise<AuditoriaPago | null> {
    return AuditoriaPagoRepository.findByIdPago(idPago);
  }
}

export default new AuditoriaPagoService();

import TipoDocumentoRepository from '../repositories/TipoDocumentoRepository';
import { AppError } from '../error/AppError';

class TipoDocumentoService {
  async list() {
    return await TipoDocumentoRepository.findAll();
  }

  async get(id: string) {
    const data = await TipoDocumentoRepository.findById(id);
    if (!data) throw new AppError(404, 'Tipo de documento no encontrado');
    return data;
  }

  async create(nombre: string) {
    const res: any = await TipoDocumentoRepository.create(nombre);
    const id = res?.id;
    if (!id) return null;
    return await TipoDocumentoRepository.findById(id);
  }

  async update(id: string, nombre: string) {
    return await TipoDocumentoRepository.update(id, nombre);
  }

  async delete(id: string) {
    return await TipoDocumentoRepository.remove(id);
  }
}

export default new TipoDocumentoService();

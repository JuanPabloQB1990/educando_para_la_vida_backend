import RolRepository from '../repositories/RolRepository';
import { AppError } from '../error/AppError';

class RolService {
  async list() {
    return await RolRepository.findAll();
  }

  async get(id: string) {
    const data = await RolRepository.findById(id);
    if (!data) throw new AppError(404, 'Rol no encontrado');
    return data;
  }

  async findByName(nombre_rol: string) {
    const data = await RolRepository.findByName(nombre_rol);
    if (!data) throw new AppError(404, 'Rol no encontrado');
    return data;
  }

  async create(nombre_rol: string) {
    const res: any = await RolRepository.create(nombre_rol);
    const id = res?.id;
    if (!id) return null;
    return await RolRepository.findById(id);
  }

  async update(id: string, nombre_rol: string) {
    return await RolRepository.update(id, nombre_rol);
  }

  async delete(id: string) {
    return await RolRepository.remove(id);
  }
}

export default new RolService();

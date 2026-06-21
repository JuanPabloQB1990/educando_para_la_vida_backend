import RubroRepository from "../repositories/RubroRepository";
import { AppError } from "../error/AppError";

class RubroService {
  async list() {
    return await RubroRepository.findAll();
  }

  async get(id: string) {
    const data = await RubroRepository.findById(id);
    if (!data) throw new AppError(404, 'Rubro no encontrado');
    return data;
  }

  async findByName(nombre_rubro: string) {
    return await RubroRepository.findByName(nombre_rubro);
  }

  async create(data: any) {
    const res: any = await RubroRepository.create(data);
    const id = res?.id;
    if (!id) return null;
    return await RubroRepository.findById(id);
  }

  async update(id: string, data: any) {
    const existing = await RubroRepository.findById(id);
    if (!existing) throw new AppError(404, 'Rubro no encontrado');
    await RubroRepository.update(id, data);
    return await RubroRepository.findById(id);
  }

  async delete(id: string) {
    const existing = await RubroRepository.findById(id);
    if (!existing) throw new AppError(404, 'Rubro no encontrado');
    return await RubroRepository.remove(id);
  }
}

export default new RubroService();

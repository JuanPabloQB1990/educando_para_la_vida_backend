import RubroRepository from "../repositories/RubroRepository";

class RubroService {
  async list() {
    return await RubroRepository.findAll();
  }

  async get(id: string) {
    return await RubroRepository.findById(id);
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
    await RubroRepository.update(id, data);
    return await RubroRepository.findById(id);
  }

  async delete(id: string) {
    const existing = await RubroRepository.findById(id);
    if (!existing) return null;
    return await RubroRepository.remove(id);
  }
}

export default new RubroService();

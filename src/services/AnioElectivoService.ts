import AnioElectivoRepository from '../repositories/AnioElectivoRepository';
import PeriodoRepository from '../repositories/PeriodoRepository';

class AnioElectivoService {
  async list() {
    return await AnioElectivoRepository.findAll();
  }

  async get(id: string) {
    return await AnioElectivoRepository.findById(id);
  }

  async create(data: any) {
    const res: any = await AnioElectivoRepository.create(data.anio, data.estado);
    const id = res?.id;
    if (!id) return null;
    await PeriodoRepository.createCuatroPeriodos(id);
    return await AnioElectivoRepository.findById(id);
  }

  async update(id: string, data: any) {
    return await AnioElectivoRepository.update(id, data.anio, data.estado);
  }

  async delete(id: string) {
    return await AnioElectivoRepository.remove(id);
  }
}

export default new AnioElectivoService();

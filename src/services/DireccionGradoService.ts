import DireccionGradoRepository from '../repositories/DireccionGradoRepository';

class DireccionGradoService {
  async list() {
    return DireccionGradoRepository.findAll();
  }

  async listByProfesor(idUsuario: string, idAnioElectivo?: string) {
    return DireccionGradoRepository.findByProfesor(idUsuario, idAnioElectivo);
  }

  async get(id: string) {
    return DireccionGradoRepository.findById(id);
  }

  async create(data: { idGradoEducacion: string; idUsuario: string; idAnioElectivo: string; idBloque?: string | null }) {
    const res = await DireccionGradoRepository.create(data);
    return DireccionGradoRepository.findById(res.id);
  }

  async update(id: string, data: { idGradoEducacion: string; idUsuario: string; idAnioElectivo: string; idBloque?: string | null }) {
    await DireccionGradoRepository.update(id, data);
    return DireccionGradoRepository.findById(id);
  }

  async updateLink(id: string, linkClaseVirtual: string) {
    await DireccionGradoRepository.updateLink(id, linkClaseVirtual);
    return DireccionGradoRepository.findById(id);
  }

  async delete(id: string) {
    return DireccionGradoRepository.remove(id);
  }
}

export default new DireccionGradoService();

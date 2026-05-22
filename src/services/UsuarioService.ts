import UsuarioRepository from '../repositories/UsuarioRepository';

class UsuarioService {
  async list() {
    return await UsuarioRepository.findAll();
  }

  async get(id: string) {
    return await UsuarioRepository.findById(id);
  }

  async create(data: any) {
    const res: any = await UsuarioRepository.create(data);
    const id = res?.id;
    if (!id) return null;
    return await UsuarioRepository.findById(id);
  }

  async update(id: string, data: any) {
    return await UsuarioRepository.update(id, data);
  }

  async delete(id: string) {
    return await UsuarioRepository.remove(id);
  }
}

export default new UsuarioService();

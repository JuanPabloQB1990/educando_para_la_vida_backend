import UsuarioRepository from '../repositories/UsuarioRepository';
import bcrypt from 'bcryptjs';
import { generateSecurePassword } from '../utils/generatePassword';

class UsuarioService {
  async list() {
    return await UsuarioRepository.findAll();
  }

  async get(id: string) {
    return await UsuarioRepository.findById(id);
  }

  async create(data: any) {
    const plainPassword = generateSecurePassword();

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const payload = { ...data, password: hashedPassword };

    const res: any = await UsuarioRepository.create(payload);
  
    const id = res?.id;
    if (id) return id;
    return null
  }

  async update(id: string, data: any) {
    return await UsuarioRepository.update(id, data);
  }

  async delete(id: string) {
    return await UsuarioRepository.remove(id);
  }
}

export default new UsuarioService();

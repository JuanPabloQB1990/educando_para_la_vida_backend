import UsuarioRepository from '../repositories/UsuarioRepository';
import bcrypt from 'bcryptjs';
import { generateSecurePassword } from '../utils/generatePassword';
import { EmailService } from '../utils/sendEmail';
import { creacionUsuario } from '../templates/templatesSendEmail';
import type { CreateUsuarioDto, UpdateUsuarioDto } from '../models/usuario';

class UsuarioService {
  async list() {
    return await UsuarioRepository.findAllAdmin();
  }

  async get(id: string) {
    return await UsuarioRepository.findById(id);
  }

  async create(data: Omit<CreateUsuarioDto, 'password'>) {
    const plainPassword = generateSecurePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const payload: CreateUsuarioDto = { ...data, password: hashedPassword };
    const { id } = await UsuarioRepository.create(payload);

    const payloadEmail = { 
      nombres: data.nombres,
      apellido1: data.apellido1,
      apellido2: data.apellido2,
      email: data.email,
      plainPassword
    };
    try {
      await EmailService.sendMail(
        data.email,
        'Bienvenido — Credenciales de acceso al sistema Educando para la Vida',
        creacionUsuario(payloadEmail)
      );
    } catch {
      // El fallo de correo no cancela la creación del usuario
    }

    return { plainPassword, id };
  }

  async update(id: string, data: UpdateUsuarioDto) {
    return await UsuarioRepository.update(id, data);
  }

  async delete(id: string) {
    return await UsuarioRepository.remove(id);
  }
}

export default new UsuarioService();

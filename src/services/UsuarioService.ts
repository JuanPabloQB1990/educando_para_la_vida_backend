import UsuarioRepository from '../repositories/UsuarioRepository';
import bcrypt from 'bcryptjs';
import { generateSecurePassword } from '../utils/generatePassword';
import { EmailService } from '../utils/sendEmail';

class UsuarioService {
  async list() {
    return await UsuarioRepository.findAllAdmin();
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

    try {
      await EmailService.sendMail(
        'juanpqb_19@hotmail.com',
        'Bienvenido — Credenciales de acceso al sistema',
        `
          <div style="font-family: Arial, sans-serif; max-width: 520px; color: #333;">
            <h2 style="color: #4f46e5;">Bienvenido(a) a Educando Para La Vida</h2>
            <p>Hola <strong>${data.nombres} ${data.apellido1}</strong>,</p>
            <p>Tu cuenta ha sido creada exitosamente. Aquí están tus credenciales de acceso:</p>
            <table style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;">
              <tr><td style="padding: 4px 8px; color: #6b7280;">Correo:</td><td style="padding: 4px 8px; font-weight: 600;">${data.email}</td></tr>
              <tr><td style="padding: 4px 8px; color: #6b7280;">Contraseña:</td><td style="padding: 4px 8px; font-weight: 600; font-family: monospace;">${plainPassword}</td></tr>
            </table>
            <p style="color: #6b7280; font-size: 13px;">Por seguridad, te recomendamos cambiar tu contraseña al iniciar sesión por primera vez.</p>
          </div>
        `
      );
    } catch {
      // El fallo de correo no cancela la creación del usuario
    }

    return { plainPassword, id };
  }

  async update(id: string, data: any) {
    return await UsuarioRepository.update(id, data);
  }

  async delete(id: string) {
    return await UsuarioRepository.remove(id);
  }
}

export default new UsuarioService();

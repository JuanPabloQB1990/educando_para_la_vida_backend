import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { JwtPayload } from '../types/express';
import UsuarioRepository from '../repositories/UsuarioRepository';
import AuthRepository from '../repositories/AuthRepository';
import { EmailService } from '../utils/sendEmail';
import { UsuarioEstado } from '../enums/usuario.enum';
import { AppError } from '../error/AppError';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET no configurado');
  return secret;
}

function getJwtRefreshSecret(): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET no configurado');
  return secret;
}

function generarCodigo6Digitos(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

class AuthService {
  async login(email: string, password: string, ip?: string, userAgent?: string) {
    const usuario = await UsuarioRepository.findByEmailWithRol(email);
  
    if (!usuario) {
      throw new AppError(401, 'Usuario no registrado');
    }

    if (usuario.estado !== UsuarioEstado.ACTIVO) {
      throw new AppError(403, 'Usuario inactivo. Contacta al administrador.');
    }
   
    const passwordValida = await bcrypt.compare(password, usuario.password!);
    
    if (!passwordValida) {
      throw new AppError(401, 'Contraseña incorrecta');
    }

    const payload: JwtPayload = {
      id: usuario.id,
      idRol: usuario.idRol!,
      nombreRol: usuario.nombreRol!,
      email: usuario.email!,
    };

    const accessToken = jwt.sign(payload, getJwtSecret(), {
      expiresIn: (process.env.JWT_EXPIRES_IN as any) ?? '3h',
    });

    const refreshToken = jwt.sign(
      { id: usuario.id },
      getJwtRefreshSecret(),
      { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN as any) ?? '7d' }
    );

    const refreshExpiracion = new Date();
    refreshExpiracion.setDate(refreshExpiracion.getDate() + 7);

    await AuthRepository.crearSesion({
      idUsuario: usuario.id,
      token: refreshToken,
      ip,
      userAgent,
      fechaExpiracion: refreshExpiracion,
    });
    const { password: _pwd, ...usuarioSinPassword } = usuario;
    
    return { accessToken, refreshToken, usuario: usuarioSinPassword };
  }

  async refresh(refreshToken: string) {
    const sesion = await AuthRepository.findSesionByToken(refreshToken);
    if (!sesion) {
      throw new AppError(401, 'Sesión inválida o expirada');
    }

    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, getJwtRefreshSecret());
    } catch {
      throw new AppError(401, 'Refresh token inválido');
    }

    const usuario = await UsuarioRepository.findByEmailWithRol(decoded.id);
    if (!usuario) throw new AppError(401, 'Usuario no encontrado');

    const payload: JwtPayload = {
      id: usuario.id,
      idRol: usuario.idRol!,
      nombreRol: usuario.nombreRol!,
      email: usuario.email!,
    };

    const accessToken = jwt.sign(payload, getJwtSecret(), {
      expiresIn: (process.env.JWT_EXPIRES_IN as any) ?? '3h',
    });

    return { accessToken };
  }

  async logout(idUsuario: string) {
    await AuthRepository.eliminarSesionesPorUsuario(idUsuario);
  }

  async solicitarRecuperacion(email: string) {
    const usuario = await UsuarioRepository.findByEmailWithRol(email);
    if (!usuario) return;

    const codigo = generarCodigo6Digitos();
    const expiracion = new Date();
    expiracion.setMinutes(expiracion.getMinutes() + 15);

    await AuthRepository.crearCodigoRecuperacion({
      idUsuario: usuario.id,
      codigo,
      fechaExpiracion: expiracion,
    });

    await EmailService.sendMail(
      'juanpab_19@hotmail.com',
      'Recuperación de contraseña - Educando Para La Vida',
      `
        <h2>Recuperación de contraseña</h2>
        <p>Tu código de recuperación es:</p>
        <h1 style="letter-spacing: 8px;">${codigo}</h1>
        <p>Este código es válido por <strong>15 minutos</strong>.</p>
        <p>Si no solicitaste este cambio, ignora este correo.</p>
      `
    );
  }

  async verificarCodigo(email: string, codigo: string): Promise<boolean> {
    const usuario = await UsuarioRepository.findByEmailWithRol(email);
    if (!usuario) return false;
    return AuthRepository.verificarCodigoRecuperacion(usuario.idUsuario, codigo);
  }

  async nuevaPassword(email: string, codigo: string, nuevaPassword: string) {
    const usuario = await UsuarioRepository.findByEmailWithRol(email);
    if (!usuario) throw new AppError(400, 'Datos inválidos');

    const valido = await AuthRepository.verificarCodigoRecuperacion(usuario.idUsuario, codigo);
    if (!valido) throw new AppError(400, 'Código inválido o expirado');

    const hash = await bcrypt.hash(nuevaPassword, 10);
    await UsuarioRepository.updatePassword(usuario.idUsuario, hash);
    await AuthRepository.eliminarCodigoRecuperacion(usuario.idUsuario);
  }
}

export default new AuthService();

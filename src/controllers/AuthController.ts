import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import AuthService from '../services/AuthService';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

const recuperarSchema = z.object({
  email: z.string().email('Email inválido'),
});

const verificarCodigoSchema = z.object({
  email: z.string().email(),
  codigo: z.string().length(6, 'El código debe tener 6 dígitos'),
});

const nuevaPasswordSchema = z.object({
  email: z.string().email(),
  codigo: z.string().length(6),
  nuevaPassword: z.string().min(8, 'La contraseña debe tener mínimo 8 caracteres'),
});

class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, message: parsed.error.errors[0].message, data: null, error: parsed.error.errors[0].message });
        return;
      }
  
      const ip = req.ip;
      const userAgent = req.headers['user-agent'];
      const result = await AuthService.login(parsed.data.email, parsed.data.password, ip, userAgent);
     
      res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', data: result, error: null });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ success: false, message: 'Refresh token requerido', data: null, error: 'Refresh token requerido' });
      return;
    }

    const result = await AuthService.refresh(refreshToken);
    res.status(200).json({ success: true, message: 'Token renovado', data: result, error: null });
  }

  async logout(req: Request, res: Response): Promise<void> {
    await AuthService.logout(req.user!.idUsuario);
    res.status(200).json({ success: true, message: 'Sesión cerrada', data: null, error: null });
  }

  async solicitarRecuperacion(req: Request, res: Response): Promise<void> {
    const parsed = recuperarSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Email inválido', data: null, error: 'Email inválido' });
      return;
    }

    await AuthService.solicitarRecuperacion(parsed.data.email);
    res.status(200).json({
      success: true,
      message: 'Si el correo existe, recibirás un código de recuperación.',
      data: null,
      error: null,
    });
  }

  async verificarCodigo(req: Request, res: Response): Promise<void> {
    const parsed = verificarCodigoSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message, data: null, error: parsed.error.errors[0].message });
      return;
    }

    const valido = await AuthService.verificarCodigo(parsed.data.email, parsed.data.codigo);
    if (!valido) {
      res.status(400).json({ success: false, message: 'Código inválido o expirado', data: null, error: 'Código inválido o expirado' });
      return;
    }

    res.status(200).json({ success: true, message: 'Código válido', data: null, error: null });
  }

  async nuevaPassword(req: Request, res: Response): Promise<void> {
    const parsed = nuevaPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message, data: null, error: parsed.error.errors[0].message });
      return;
    }

    await AuthService.nuevaPassword(parsed.data.email, parsed.data.codigo, parsed.data.nuevaPassword);
    res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente', data: null, error: null });
  }
}

export default new AuthController();

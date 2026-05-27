import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../types/express';

export function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ success: false, message: 'Token requerido', data: null, error: 'Sin autorización' });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ success: false, message: 'Error de configuración', data: null, error: 'JWT_SECRET no configurado' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err: any) {
    const expired = err?.name === 'TokenExpiredError';
    res.status(401).json({
      success: false,
      message: expired ? 'Token expirado' : 'Token inválido',
      data: null,
      error: expired ? 'Token expirado' : 'Token inválido',
    });
  }
}

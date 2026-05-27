import type { Request, Response, NextFunction } from 'express';

export function requireRoles(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'No autenticado', data: null, error: 'Sin autorización' });
      return;
    }

    if (!roles.includes(req.user.nombreRol)) {
      res.status(403).json({
        success: false,
        message: 'Acceso denegado. No tienes permisos para este recurso.',
        data: null,
        error: 'Acceso denegado',
      });
      return;
    }

    next();
  };
}

export interface JwtPayload {
  idUsuario: string;
  idRol: string;
  nombreRol: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

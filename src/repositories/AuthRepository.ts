import pool from '../config/database';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

interface CrearSesionData {
  idUsuario: string;
  token: string;
  ip?: string;
  userAgent?: string;
  fechaExpiracion: Date;
}

interface CrearCodigoRecuperacionData {
  idUsuario: string;
  codigo: string;
  fechaExpiracion: Date;
}

class AuthRepository {
  async crearSesion(data: CrearSesionData): Promise<string> {
    const id = generatePrimaryKey();
    await pool.execute(
      `INSERT INTO sesion_usuario (id, id_usuario, token, ip, user_agent, fecha_login, fecha_expiracion)
       VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
      [id, data.idUsuario, data.token, data.ip ?? null, data.userAgent ?? null, data.fechaExpiracion]
    );
    return id;
  }

  async findSesionByToken(token: string) {
    const [rows] = await pool.query(
      `SELECT * FROM sesion_usuario WHERE token = ? AND user_agent != 'RECOVERY_CODE' AND fecha_expiracion > NOW()`,
      [token]
    );
    return (rows as any[])[0] ?? null;
  }

  async eliminarSesionesPorUsuario(idUsuario: string): Promise<void> {
    await pool.execute(
      `DELETE FROM sesion_usuario WHERE id_usuario = ? AND user_agent != 'RECOVERY_CODE'`,
      [idUsuario]
    );
  }

  async crearCodigoRecuperacion(data: CrearCodigoRecuperacionData): Promise<void> {
    await pool.execute(
      `DELETE FROM sesion_usuario WHERE id_usuario = ? AND user_agent = 'RECOVERY_CODE'`,
      [data.idUsuario]
    );
    const id = generatePrimaryKey();
    await pool.execute(
      `INSERT INTO sesion_usuario (id, id_usuario, token, ip, user_agent, fecha_login, fecha_expiracion)
       VALUES (?, ?, ?, NULL, 'RECOVERY_CODE', NOW(), ?)`,
      [id, data.idUsuario, data.codigo, data.fechaExpiracion]
    );
  }

  async verificarCodigoRecuperacion(idUsuario: string, codigo: string): Promise<boolean> {
    const [rows] = await pool.query(
      `SELECT id FROM sesion_usuario
       WHERE id_usuario = ? AND token = ? AND user_agent = 'RECOVERY_CODE' AND fecha_expiracion > NOW()`,
      [idUsuario, codigo]
    );
    return (rows as any[]).length > 0;
  }

  async eliminarCodigoRecuperacion(idUsuario: string): Promise<void> {
    await pool.execute(
      `DELETE FROM sesion_usuario WHERE id_usuario = ? AND user_agent = 'RECOVERY_CODE'`,
      [idUsuario]
    );
  }
}

export default new AuthRepository();

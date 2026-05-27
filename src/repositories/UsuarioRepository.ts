import type { ResultSetHeader } from 'mysql2';
import pool from '../config/database';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { Usuario } from '../models/usuario';
import { UsuarioEstado } from '../enums/usuario.enum';

class UsuarioRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM usuario ORDER BY id_usuario');
    return mapRowsToEntities<Usuario>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE id_usuario = ?', [id]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<Usuario>(row) : null;
  }

  async findByEmailWithRol(emailOrId: string) {
    const [rows] = await pool.query(
      `SELECT u.*, r.nombre_rol
       FROM usuario u
       LEFT JOIN rol r ON u.id_rol = r.id_rol
       WHERE u.email = ? OR u.id_usuario = ?`,
      [emailOrId, emailOrId]
    );
    const row = (rows as any[])[0] ?? null;
    if (!row) return null;
    return {
      idUsuario: row.id_usuario as string,
      nombres: row.nombres as string,
      apellido1: row.apellido1 as string,
      apellido2: row.apellido2 as string | null,
      email: row.email as string,
      password: row.password as string | null,
      estado: row.estado as 'activo' | 'inactivo',
      idRol: row.id_rol as string | null,
      nombreRol: row.nombre_rol as string | null,
    };
  }

  async updatePassword(idUsuario: string, hashedPassword: string): Promise<void> {
    await pool.execute('UPDATE usuario SET password = ? WHERE id_usuario = ?', [hashedPassword, idUsuario]);
  }

  async findByDocumento(no_documento: string, id_rol?: string) {
    let query = 'SELECT * FROM usuario WHERE no_documento = ?';
    const params: any[] = [no_documento];
    if (typeof id_rol !== 'undefined') {
      query += ' AND id_rol = ?';
      params.push(id_rol);
    }
    const [rows] = await pool.query(query, params);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<Usuario>(row) : null;
  }

  async create(data: any) {
 
    const {
      nombres,
      apellido1,
      apellido2,
      contacto1,
      contacto2,
      email,
      password,
      id_rol,
      id_tipo_documento,
      no_documento,
      fecha_expedicion_documento,
    } = data;

    const id_usuario = generatePrimaryKey();

    try {
      
      const [result] = await pool.execute(
        'INSERT INTO usuario (id_usuario, nombres, apellido1, apellido2, contacto1, contacto2, email, password, id_rol, estado, id_tipo_documento, no_documento, fecha_expedicion_documento) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          id_usuario,
          nombres,
          apellido1,
          apellido2,
          contacto1,
          contacto2,
          email,
          password,
          id_rol ?? null,
          UsuarioEstado.ACTIVO,
          id_tipo_documento ?? null,
          no_documento ?? null,
          fecha_expedicion_documento ?? null,
        ]
      );
  
      return { id: id_usuario };
    } catch (error) {
      console.error(error);
    }
  }

  async update(id: string, data: any) {
    const {
      nombres,
      apellido1,
      apellido2,
      contacto1,
      contacto2,
      email,
      id_rol,
      estado,
      id_tipo_documento,
      no_documento,
      fecha_expedicion_documento,
    } = data;
    const [result] = await pool.execute(
      'UPDATE usuario SET nombres=?, apellido1=?, apellido2=?, contacto1=?, contacto2=?, email=?, id_rol=?, estado=?, id_tipo_documento=?, no_documento=?, fecha_expedicion_documento=? WHERE id_usuario=?',
      [
        nombres,
        apellido1,
        apellido2,
        contacto1,
        contacto2,
        email,
        id_rol ?? null,
        estado,
        id_tipo_documento ?? null,
        no_documento ?? null,
        fecha_expedicion_documento ?? null,
        id,
      ]
    );
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM usuario WHERE id_usuario = ?', [id]);
    return result;
  }
}

export default new UsuarioRepository();

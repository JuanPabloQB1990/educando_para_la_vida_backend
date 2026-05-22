import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { Pago } from '../models/pago';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class PagoRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM pago ORDER BY id_pago');
    return mapRowsToEntities<Pago>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM pago WHERE id_pago = ?', [id]);
    const row = (rows as any[])[0] || null;
    return row ? mapRowToEntity<Pago>(row) : null;
  }

  async create(data: any) {
    const { id_obligacion_pago, monto_pagado, fecha_pago_real, file_comprobante, observaciones, estado, fecha_verificacion } = data;
    const id_pago = generatePrimaryKey();
    const [result] = await pool.execute('INSERT INTO pago (id_pago, id_obligacion_pago, monto_pagado, fecha_pago_real, file_comprobante, observaciones, estado, fecha_verificacion) VALUES (?,?,?,?,?,?,?,?)', [id_pago, id_obligacion_pago, monto_pagado, fecha_pago_real, file_comprobante, observaciones, estado, fecha_verificacion]);
    return { id: id_pago };
  }

  async update(id: string, data: any) {
    const { id_obligacion_pago, monto_pagado, fecha_pago_real, file_comprobante, observaciones, estado, fecha_verificacion } = data;
    const [result] = await pool.execute('UPDATE pago SET id_obligacion_pago=?, monto_pagado=?, fecha_pago_real=?, file_comprobante=?, observaciones=?, estado=?, fecha_verificacion=? WHERE id_pago=?', [id_obligacion_pago, monto_pagado, fecha_pago_real, file_comprobante, observaciones, estado, fecha_verificacion, id]);
    return result;
  }

  async remove(id: string) {
    const [result] = await pool.execute('DELETE FROM pago WHERE id_pago = ?', [id]);
    return result;
  }
}

export default new PagoRepository();

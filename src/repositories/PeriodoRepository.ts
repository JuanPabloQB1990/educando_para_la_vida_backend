import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { Periodo } from '../models/periodo';
import { generatePrimaryKey } from '../utils/generatePrimaryKey';

class PeriodoRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM periodo ORDER BY id_anio_electivo, numero_periodo');
    return mapRowsToEntities<Periodo>(rows as any[]);
  }

  async findByAnio(idAnioElectivo: string) {
    const [rows] = await pool.query(
      'SELECT * FROM periodo WHERE id_anio_electivo = ? ORDER BY numero_periodo',
      [idAnioElectivo]
    );
    return mapRowsToEntities<Periodo>(rows as any[]);
  }

  async findById(id: string) {
    const [rows] = await pool.query('SELECT * FROM periodo WHERE id_periodo = ?', [id]);
    const row = (rows as any[])[0] ?? null;
    return row ? mapRowToEntity<Periodo>(row) : null;
  }

  async createCuatroPeriodos(idAnioElectivo: string): Promise<void> {
    for (let i = 1; i <= 4; i++) {
      const id = generatePrimaryKey();
      await pool.execute(
        'INSERT INTO periodo (id_periodo, id_anio_electivo, numero_periodo) VALUES (?, ?, ?)',
        [id, idAnioElectivo, i]
      );
    }
  }
}

export default new PeriodoRepository();

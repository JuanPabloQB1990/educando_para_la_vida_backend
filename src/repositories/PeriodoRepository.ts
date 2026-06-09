import pool from '../config/database';
import { mapRowsToEntities, mapRowToEntity } from '../models/dbMappers';
import type { Periodo } from '../models/periodo';
import { PeriodoEstado } from '../enums/periodo.enum';
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
    const [rows] = await pool.query('SELECT * FROM periodo WHERE id = ?', [id]);
    const row = (rows as any[])[0] ?? null;
    return row ? mapRowToEntity<Periodo>(row) : null;
  }

  async updateEstado(id: string, estado: PeriodoEstado): Promise<void> {
    try {
      await pool.execute('UPDATE periodo SET estado = ? WHERE id = ?', [estado, id]);
    } catch (error) {
      throw error;
    }
  }

  async createCuatroPeriodos(idAnioElectivo: string): Promise<void> {
    for (let i = 1; i <= 4; i++) {
      const id = generatePrimaryKey();
      await pool.execute(
        'INSERT INTO periodo (id, id_anio_electivo, numero_periodo, estado) VALUES (?, ?, ?, ?)',
        [id, idAnioElectivo, i, PeriodoEstado.CERRADO]
      );
    }
  }
}

export default new PeriodoRepository();

import pool from '../config/database';

export interface DashboardStats {
  pagosPendientes: number;
  obligacionesVencidas: number;
  anioElectivoActivo: number | null;
  totalEstudiantes: number;
  totalIngresos: number;
}

class DashboardRepository {
  async getStats(): Promise<DashboardStats> {
    const [[rows]] = await pool.query<any[]>(`
      SELECT
        (SELECT COUNT(*) FROM pago WHERE estado = 'pendiente')          AS pagos_pendientes,
        (SELECT COUNT(*) FROM obligacion_pago WHERE estado = 'vencido') AS obligaciones_vencidas,
        (SELECT anio FROM anio_electivo WHERE estado = 'activo' LIMIT 1) AS anio_electivo_activo,
        (SELECT COUNT(*) FROM estudiante)                                AS total_estudiantes,
        (SELECT COALESCE(SUM(monto_pagado), 0) FROM pago WHERE estado = 'aprobado') AS total_ingresos
    `);

    return {
      pagosPendientes: Number(rows.pagos_pendientes),
      obligacionesVencidas: Number(rows.obligaciones_vencidas),
      anioElectivoActivo: rows.anio_electivo_activo ?? null,
      totalEstudiantes: Number(rows.total_estudiantes),
      totalIngresos: Number(rows.total_ingresos),
    };
  }
}

export default new DashboardRepository();

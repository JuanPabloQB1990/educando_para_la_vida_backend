import type { Request, Response, NextFunction } from 'express';
import DashboardService from '../services/DashboardService';

class DashboardController {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await DashboardService.getStats();
      res.json({ success: true, message: 'Estadísticas obtenidas', data, error: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();

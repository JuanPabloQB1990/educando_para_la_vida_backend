import DashboardRepository from '../repositories/DashboardRepository';

class DashboardService {
  async getStats() {
    return DashboardRepository.getStats();
  }
}

export default new DashboardService();

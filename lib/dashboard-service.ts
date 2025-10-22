import { DashboardData } from '@/types/dashboard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class DashboardService {
  private getAuthToken(): string {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return token;
  }

  /**
   * Obtener datos del dashboard
   */
  async getDashboardData(companyId?: number): Promise<DashboardData> {
    const url = new URL(`${API_URL}/dashboard`);
    if (companyId) {
      url.searchParams.append('company_id', companyId.toString());
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener datos del dashboard');
    }

    const data = await response.json();
    return data.data;
  }
}

export const dashboardService = new DashboardService();

import { 
  ReportFilters, 
  TimeReport, 
  ExecutiveSummary, 
  UserStatsReport 
} from '@/types/report';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ReportService {
  private getAuthToken(): string {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return token;
  }

  /**
   * Generar reporte de tiempo con filtros
   */
  async generateTimeReport(filters: ReportFilters): Promise<TimeReport> {
    const response = await fetch(`${API_URL}/reports/time`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al generar reporte');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Obtener resumen ejecutivo
   */
  async getExecutiveSummary(companyId?: number): Promise<ExecutiveSummary> {
    const url = new URL(`${API_URL}/reports/executive-summary`);
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
      throw new Error(error.message || 'Error al obtener resumen ejecutivo');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Obtener estadísticas de un usuario
   */
  async getUserStats(
    userId: number, 
    startDate: string, 
    endDate: string
  ): Promise<UserStatsReport> {
    const url = new URL(`${API_URL}/reports/user/${userId}/stats`);
    url.searchParams.append('start_date', startDate);
    url.searchParams.append('end_date', endDate);

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener estadísticas de usuario');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Exportar reporte a CSV
   */
  async exportToCSV(filters: ReportFilters): Promise<Blob> {
    const response = await fetch(`${API_URL}/reports/export/csv`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al exportar reporte');
    }

    return await response.blob();
  }

  /**
   * Exportar reporte a PDF
   */
  async exportToPDF(filters: ReportFilters): Promise<Blob> {
    const response = await fetch(`${API_URL}/reports/export/pdf`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al exportar reporte a PDF');
    }

    return await response.blob();
  }

  /**
   * Descargar CSV
   */
  downloadCSV(blob: Blob, filename?: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `reporte_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  /**
   * Descargar PDF
   */
  downloadPDF(blob: Blob, filename?: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `reporte_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export const reportService = new ReportService();

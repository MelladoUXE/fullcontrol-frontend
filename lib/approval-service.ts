import { TimeEntry } from '@/types/time-entry';
import { ApprovalStats, ApproveRequest, ApproveMultipleRequest, ApprovalResults } from '@/types/approval';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApprovalService {
  private getAuthToken(): string {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return token;
  }

  /**
   * Obtener registros pendientes de aprobación
   */
  async getPendingApprovals(companyId?: number): Promise<TimeEntry[]> {
    const url = new URL(`${API_URL}/approvals/pending`);
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
      throw new Error(error.message || 'Error al obtener registros pendientes');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Obtener registros por estado
   */
  async getByStatus(status: string, companyId?: number): Promise<TimeEntry[]> {
    const url = new URL(`${API_URL}/approvals/status/${status}`);
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
      throw new Error(error.message || 'Error al obtener registros');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Aprobar o rechazar un registro individual
   */
  async approve(timeEntryId: number, request: ApproveRequest): Promise<TimeEntry> {
    const response = await fetch(`${API_URL}/approvals/${timeEntryId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al procesar aprobación');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Aprobar o rechazar múltiples registros
   */
  async approveMultiple(request: ApproveMultipleRequest): Promise<ApprovalResults> {
    const response = await fetch(`${API_URL}/approvals/approve-multiple`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al procesar aprobaciones');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Obtener estadísticas de aprobaciones
   */
  async getStats(companyId?: number): Promise<ApprovalStats> {
    const url = new URL(`${API_URL}/approvals/stats`);
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
      throw new Error(error.message || 'Error al obtener estadísticas');
    }

    const data = await response.json();
    return data.data;
  }
}

export const approvalService = new ApprovalService();

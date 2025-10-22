import type { AuditLog, AuditFilters, ActivitySummary } from '@/types/audit';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
  };
}

export const auditService = {
  /**
   * Get audit logs with filters
   */
  async getLogs(filters?: AuditFilters): Promise<{
    data: AuditLog[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  }> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await fetch(`${API_URL}/audit?${params.toString()}`, {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener logs de auditoría');
    return response.json();
  },

  /**
   * Get activity summary
   */
  async getSummary(days: number = 30): Promise<ActivitySummary> {
    const response = await fetch(`${API_URL}/audit/summary?days=${days}`, {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener resumen de actividad');
    return response.json();
  },

  /**
   * Get user activity
   */
  async getUserActivity(userId?: number, days: number = 30): Promise<AuditLog[]> {
    const url = userId 
      ? `${API_URL}/audit/user/${userId}?days=${days}`
      : `${API_URL}/audit/user?days=${days}`;
    const response = await fetch(url, {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener actividad del usuario');
    return response.json();
  },

  /**
   * Get entity history
   */
  async getEntityHistory(entityType: string, entityId: number): Promise<AuditLog[]> {
    const response = await fetch(`${API_URL}/audit/entity/${entityType}/${entityId}`, {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener historial de la entidad');
    return response.json();
  },

  /**
   * Get available actions
   */
  async getActions(): Promise<Record<string, string>> {
    const response = await fetch(`${API_URL}/audit/actions`, {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener acciones');
    return response.json();
  },

  /**
   * Get available entity types
   */
  async getEntityTypes(): Promise<Record<string, string>> {
    const response = await fetch(`${API_URL}/audit/entity-types`, {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener tipos de entidad');
    return response.json();
  },

  /**
   * Clean old logs
   */
  async cleanOldLogs(daysToKeep: number): Promise<{ message: string; deleted_count: number }> {
    const response = await fetch(`${API_URL}/audit/clean`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ days_to_keep: daysToKeep }),
    });
    if (!response.ok) throw new Error('Error al limpiar logs antiguos');
    return response.json();
  },
};

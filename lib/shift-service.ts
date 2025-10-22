import {
  ShiftTemplate,
  UserShift,
  ShiftTemplateFormData,
  AssignShiftData,
  AssignShiftRangeData,
} from '@/types/shift';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
  };
}

export const shiftService = {
  // === PLANTILLAS ===
  
  async getTemplates(): Promise<ShiftTemplate[]> {
    const response = await fetch(`${API_URL}/shifts/templates`, {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener plantillas');
    return response.json();
  },

  async getTemplate(id: number): Promise<ShiftTemplate> {
    const response = await fetch(`${API_URL}/shifts/templates/${id}`, {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener plantilla');
    return response.json();
  },

  async createTemplate(data: ShiftTemplateFormData): Promise<ShiftTemplate> {
    const response = await fetch(`${API_URL}/shifts/templates`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear plantilla');
    }
    return response.json();
  },

  async updateTemplate(id: number, data: Partial<ShiftTemplateFormData>): Promise<ShiftTemplate> {
    const response = await fetch(`${API_URL}/shifts/templates/${id}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar plantilla');
    }
    return response.json();
  },

  async deleteTemplate(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/shifts/templates/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar plantilla');
    }
  },

  // === ASIGNACIONES ===
  
  async assignShift(data: AssignShiftData): Promise<UserShift> {
    const response = await fetch(`${API_URL}/shifts/assign`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al asignar turno');
    }
    return response.json();
  },

  async assignShiftRange(data: AssignShiftRangeData): Promise<{ message: string; count: number }> {
    const response = await fetch(`${API_URL}/shifts/assign-range`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al asignar turnos');
    }
    return response.json();
  },

  async getUserShifts(userId: number, startDate?: string, endDate?: string): Promise<UserShift[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await fetch(`${API_URL}/shifts/user/${userId}?${params}`, {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener turnos del usuario');
    return response.json();
  },

  async getCompanyShifts(startDate?: string, endDate?: string): Promise<UserShift[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await fetch(`${API_URL}/shifts/company?${params}`, {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener turnos de la empresa');
    return response.json();
  },

  async deleteShift(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/shifts/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar turno');
    }
  },
};

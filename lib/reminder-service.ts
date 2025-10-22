import { Reminder, ReminderFormData, ReminderType, ReminderFrequency } from '@/types/reminder';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
  };
}

export const reminderService = {
  // Obtener todos los recordatorios
  async getAll(): Promise<Reminder[]> {
    const response = await fetch(`${API_URL}/reminders`, {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener recordatorios');
    return response.json();
  },

  // Obtener un recordatorio por ID
  async getById(id: number): Promise<Reminder> {
    const response = await fetch(`${API_URL}/reminders/${id}`, {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener recordatorio');
    return response.json();
  },

  // Crear un recordatorio
  async create(data: ReminderFormData): Promise<Reminder> {
    const response = await fetch(`${API_URL}/reminders`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear recordatorio');
    }
    return response.json();
  },

  // Actualizar un recordatorio
  async update(id: number, data: Partial<ReminderFormData>): Promise<Reminder> {
    const response = await fetch(`${API_URL}/reminders/${id}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar recordatorio');
    }
    return response.json();
  },

  // Eliminar un recordatorio
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/reminders/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al eliminar recordatorio');
  },

  // Activar/desactivar un recordatorio
  async toggleActive(id: number): Promise<Reminder> {
    const response = await fetch(`${API_URL}/reminders/${id}/toggle`, {
      method: 'POST',
      headers: await getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al cambiar estado del recordatorio');
    return response.json();
  },

  // Obtener tipos disponibles
  async getTypes(): Promise<Record<ReminderType, string>> {
    const response = await fetch(`${API_URL}/reminders/types`, {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener tipos');
    return response.json();
  },

  // Obtener frecuencias disponibles
  async getFrequencies(): Promise<Record<ReminderFrequency, string>> {
    const response = await fetch(`${API_URL}/reminders/frequencies`, {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener frecuencias');
    return response.json();
  },
};

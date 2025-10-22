import { CompanySettings, UpdateCompanySettingsData } from '@/types/company-settings';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const companySettingsService = {
  async getSettings(companyId: number): Promise<CompanySettings> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/companies/${companyId}/settings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener configuración de la empresa');
    }

    const data = await response.json();
    return data.data;
  },

  async updateSettings(companyId: number, settings: UpdateCompanySettingsData): Promise<CompanySettings> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/companies/${companyId}/settings`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar configuración de la empresa');
    }

    const data = await response.json();
    return data.data;
  },
};

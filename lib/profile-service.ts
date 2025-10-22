import { UserProfile, UpdateProfileData, ChangePasswordData, NotificationPreferences } from '@/types/profile';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener perfil');
    }

    const data = await response.json();
    return data.data;
  },

  async updateProfile(profileData: UpdateProfileData): Promise<UserProfile> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar perfil');
    }

    const data = await response.json();
    return data.data;
  },

  async changePassword(passwordData: ChangePasswordData): Promise<void> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/profile/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al cambiar contraseña');
    }
  },

  async uploadAvatar(file: File): Promise<string> {
    const token = localStorage.getItem('auth_token');
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${API_URL}/profile/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir avatar');
    }

    const data = await response.json();
    return data.data.avatar;
  },

  async deleteAvatar(): Promise<void> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/profile/avatar`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar avatar');
    }
  },

  async updateNotificationPreferences(preferences: NotificationPreferences): Promise<UserProfile> {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/profile/notification-preferences`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar preferencias');
    }

    const data = await response.json();
    return data.data;
  },
};

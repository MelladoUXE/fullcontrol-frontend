import { Notification, NotificationCount } from '@/types/notification';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class NotificationService {
  private getAuthToken(): string {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return token;
  }

  /**
   * Obtener todas las notificaciones
   */
  async getNotifications(unreadOnly: boolean = false, limit: number = 50): Promise<Notification[]> {
    const url = new URL(`${API_URL}/notifications`);
    if (unreadOnly) {
      url.searchParams.append('unread_only', 'true');
    }
    url.searchParams.append('limit', limit.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener notificaciones');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Obtener contador de notificaciones no leídas
   */
  async getUnreadCount(): Promise<number> {
    const response = await fetch(`${API_URL}/notifications/unread-count`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener contador');
    }

    const data = await response.json();
    return data.data.count;
  }

  /**
   * Marcar notificación como leída
   */
  async markAsRead(notificationId: number): Promise<void> {
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al marcar como leída');
    }
  }

  /**
   * Marcar todas como leídas
   */
  async markAllAsRead(): Promise<number> {
    const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al marcar todas como leídas');
    }

    const data = await response.json();
    return data.data.count;
  }

  /**
   * Eliminar notificación
   */
  async deleteNotification(notificationId: number): Promise<void> {
    const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar notificación');
    }
  }

  /**
   * Eliminar todas las leídas
   */
  async deleteAllRead(): Promise<number> {
    const response = await fetch(`${API_URL}/notifications/read/all`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar notificaciones');
    }

    const data = await response.json();
    return data.data.count;
  }
}

export const notificationService = new NotificationService();

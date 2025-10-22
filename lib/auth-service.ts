import { LoginCredentials, RegisterCredentials, AuthResponse, ApiResponse, User } from '@/types/auth';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

class AuthService {
  private getHeaders(includeAuth = false): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        localStorage.setItem('auth_token', data.data.token);
      }

      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión',
      };
    }
  }

  async register(credentials: RegisterCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        localStorage.setItem('auth_token', data.data.token);
      }

      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión',
      };
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(true),
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.removeItem('auth_token');
      }

      return data;
    } catch (error) {
      localStorage.removeItem('auth_token');
      return {
        success: false,
        message: 'Error de conexión',
      };
    }
  }

  async me(): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión',
      };
    }
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
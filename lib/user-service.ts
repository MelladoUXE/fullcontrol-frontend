import { User, ApiResponse } from '@/types/auth';
import { CreateUserRequest, UpdateUserRequest } from '@/types/user';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api';

class UserService {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });

    const result: ApiResponse<User[]> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to get users');
    }

    return result.data;
  }

  async getUsersByCompany(companyId?: number): Promise<User[]> {
    const params = new URLSearchParams();
    if (companyId) params.append('company_id', companyId.toString());

    const response = await fetch(`${API_URL}/users/company?${params.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });

    const result: ApiResponse<User[]> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to get users');
    }

    return result.data;
  }

  async getUserById(id: number): Promise<User> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });

    const result: ApiResponse<User> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to get user');
    }

    return result.data;
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify(data),
    });

    const result: ApiResponse<User> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to create user');
    }

    return result.data;
  }

  async updateUser(id: number, data: UpdateUserRequest): Promise<User> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeader(),
      body: JSON.stringify(data),
    });

    const result: ApiResponse<User> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to update user');
    }

    return result.data;
  }

  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });

    const result: ApiResponse<void> = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to delete user');
    }
  }

  async getActiveUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/users/active`, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });

    const result: ApiResponse<User[]> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to get active users');
    }

    return result.data;
  }

  async getUsersByRole(role: 'admin' | 'manager' | 'employee'): Promise<User[]> {
    const response = await fetch(`${API_URL}/users/role/${role}`, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });

    const result: ApiResponse<User[]> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to get users by role');
    }

    return result.data;
  }
}

export const userService = new UserService();

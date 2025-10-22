import { Role, Permission, PermissionGroup, CreateRoleRequest, UpdateRoleRequest, AssignRolesRequest } from '@/types/role';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la petición' }));
    throw new Error(error.message || 'Error en la petición');
  }

  return response.json();
}

export const roleService = {
  // Get all roles
  async getRoles(params?: { company_id?: number; is_system?: boolean }): Promise<Role[]> {
    const queryParams = new URLSearchParams();
    if (params?.company_id) queryParams.append('company_id', params.company_id.toString());
    if (params?.is_system !== undefined) queryParams.append('is_system', params.is_system.toString());
    
    const queryString = queryParams.toString();
    const url = `/roles${queryString ? `?${queryString}` : ''}`;
    
    return fetchWithAuth(url);
  },

  // Get role by id
  async getRole(id: number): Promise<Role> {
    return fetchWithAuth(`/roles/${id}`);
  },

  // Create role
  async createRole(data: CreateRoleRequest): Promise<Role> {
    return fetchWithAuth('/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update role
  async updateRole(id: number, data: UpdateRoleRequest): Promise<Role> {
    return fetchWithAuth(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete role
  async deleteRole(id: number): Promise<void> {
    return fetchWithAuth(`/roles/${id}`, {
      method: 'DELETE',
    });
  },

  // Assign permissions to role
  async assignPermissions(id: number, permissions: number[]): Promise<Role> {
    return fetchWithAuth(`/roles/${id}/permissions`, {
      method: 'POST',
      body: JSON.stringify({ permissions }),
    });
  },
};

export const permissionService = {
  // Get all permissions
  async getPermissions(group?: string): Promise<Permission[]> {
    const url = group ? `/permissions?group=${group}` : '/permissions';
    return fetchWithAuth(url);
  },

  // Get permissions grouped by category
  async getPermissionGroups(): Promise<PermissionGroup> {
    return fetchWithAuth('/permissions/groups');
  },
};

export const userRoleService = {
  // Get user roles
  async getUserRoles(userId: number): Promise<{ success: boolean; data: Role[] }> {
    return fetchWithAuth(`/users/${userId}/roles`);
  },

  // Assign roles to user
  async assignRoles(userId: number, data: AssignRolesRequest): Promise<{ success: boolean; message: string; data: unknown }> {
    return fetchWithAuth(`/users/${userId}/roles`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get user permissions
  async getUserPermissions(userId: number): Promise<{ success: boolean; data: Permission[] }> {
    return fetchWithAuth(`/users/${userId}/permissions`);
  },
};

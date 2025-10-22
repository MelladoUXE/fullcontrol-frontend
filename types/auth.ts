export interface Role {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_system: boolean;
}

export interface Permission {
  id: number;
  name: string;
  slug: string;
  group: string;
}

export interface Company {
  id: number;
  name: string;
  slug: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  company_id: number | null;
  role: 'admin' | 'manager' | 'employee';
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles?: Role[];
  permissions?: Permission[];
  company?: Company;
}

export interface AuthResponse {
  user: User;
  token: string;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}
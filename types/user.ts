export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  company_id: number;
  role?: 'admin' | 'manager' | 'employee';
  is_active?: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  company_id?: number;
  role?: 'admin' | 'manager' | 'employee';
  is_active?: boolean;
}

export interface UserFilters {
  company_id?: number;
  role?: 'admin' | 'manager' | 'employee';
  is_active?: boolean;
}

export interface Role {
  id: number;
  company_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  permissions?: Permission[];
  users?: User[];
}

export interface Permission {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  group: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  company_id: number | null;
  role: string;
  is_active: boolean;
}

export interface PermissionGroup {
  [key: string]: Permission[];
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissions?: number[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: number[];
}

export interface AssignRolesRequest {
  roles: number[];
}

export const PERMISSION_GROUPS = {
  users: 'Usuarios',
  time_entries: 'Entradas de Tiempo',
  approvals: 'Aprobaciones',
  reports: 'Reportes',
  reminders: 'Recordatorios',
  shifts: 'Horarios',
  vacations: 'Vacaciones',
  audit: 'Auditoría',
  company: 'Empresa',
  roles: 'Roles y Permisos',
} as const;

export type PermissionGroupKey = keyof typeof PERMISSION_GROUPS;

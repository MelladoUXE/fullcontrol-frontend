export interface AuditLog {
  id: number;
  company_id: number;
  user_id: number | null;
  action: string;
  entity_type: string | null;
  entity_id: number | null;
  description: string;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AuditFilters {
  user_id?: number;
  action?: string;
  entity_type?: string;
  entity_id?: number;
  start_date?: string;
  end_date?: string;
  days?: number;
  search?: string;
  per_page?: number;
}

export interface ActivitySummary {
  total_actions: number;
  by_action: Record<string, number>;
  by_user: Record<string, number>;
  by_entity: Record<string, number>;
  by_day: Record<string, number>;
}

export const AUDIT_ACTIONS: Record<string, string> = {
  create: 'Crear',
  update: 'Actualizar',
  delete: 'Eliminar',
  login: 'Iniciar Sesión',
  logout: 'Cerrar Sesión',
  clock_in: 'Entrada',
  clock_out: 'Salida',
  approve: 'Aprobar',
  reject: 'Rechazar',
  export: 'Exportar',
  import: 'Importar',
  view: 'Ver',
  restore: 'Restaurar',
};

export const ENTITY_TYPES: Record<string, string> = {
  User: 'Usuario',
  Attendance: 'Asistencia',
  Leave: 'Permiso',
  ShiftTemplate: 'Plantilla de Turno',
  UserShift: 'Turno Asignado',
  Reminder: 'Recordatorio',
  Company: 'Empresa',
};

export const ACTION_COLORS: Record<string, string> = {
  create: 'bg-green-100 text-green-800 border-green-200',
  update: 'bg-blue-100 text-blue-800 border-blue-200',
  delete: 'bg-red-100 text-red-800 border-red-200',
  login: 'bg-purple-100 text-purple-800 border-purple-200',
  logout: 'bg-gray-100 text-gray-800 border-gray-200',
  clock_in: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  clock_out: 'bg-orange-100 text-orange-800 border-orange-200',
  approve: 'bg-teal-100 text-teal-800 border-teal-200',
  reject: 'bg-rose-100 text-rose-800 border-rose-200',
  export: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  import: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  view: 'bg-slate-100 text-slate-800 border-slate-200',
  restore: 'bg-amber-100 text-amber-800 border-amber-200',
};

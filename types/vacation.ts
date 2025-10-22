export interface Vacation {
  id: number;
  company_id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  days: number;
  type: VacationType;
  status: VacationStatus;
  reason?: string;
  notes?: string;
  approver_id?: number;
  approved_at?: string;
  rejection_reason?: string;
  approver_notes?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  approver?: {
    id: number;
    name: string;
    email: string;
  };
  company?: {
    id: number;
    name: string;
  };
  
  // Computed
  status_label?: string;
  type_label?: string;
}

export type VacationType = 'vacation' | 'sick' | 'personal' | 'unpaid' | 'other';
export type VacationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface VacationBalance {
  total: number;
  used: number;
  pending: number;
  available: number;
}

export interface VacationStatistics {
  total_requests: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
  total_days: number;
  by_type: Record<VacationType, number>;
  by_month: Record<string, number>;
}

export interface VacationCalendarItem {
  vacation_id: number;
  user_id: number;
  user_name: string;
  type: VacationType;
  type_label: string;
}

export interface VacationCalendar {
  [date: string]: VacationCalendarItem[];
}

export interface VacationFilters {
  status?: VacationStatus;
  type?: VacationType;
  user_id?: number;
  start_date?: string;
  end_date?: string;
  upcoming?: boolean;
  current?: boolean;
  per_page?: number;
}

export interface CreateVacationRequest {
  start_date: string;
  end_date: string;
  type: VacationType;
  reason?: string;
  notes?: string;
}

export interface ApproveVacationRequest {
  notes?: string;
}

export interface RejectVacationRequest {
  reason: string;
  notes?: string;
}

export const VACATION_TYPES: Record<VacationType, { label: string; color: string }> = {
  vacation: { label: 'Vacaciones', color: 'blue' },
  sick: { label: 'Enfermedad', color: 'red' },
  personal: { label: 'Personal', color: 'purple' },
  unpaid: { label: 'Sin goce de sueldo', color: 'gray' },
  other: { label: 'Otro', color: 'orange' },
};

export const VACATION_STATUS: Record<VacationStatus, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'yellow' },
  approved: { label: 'Aprobada', color: 'green' },
  rejected: { label: 'Rechazada', color: 'red' },
  cancelled: { label: 'Cancelada', color: 'gray' },
};

export interface Reminder {
  id: number;
  company_id: number;
  user_id: number | null;
  type: ReminderType;
  frequency: ReminderFrequency;
  time: string; // HH:mm format
  days: number[] | null; // 1-7 (lunes-domingo)
  day_of_month: number | null; // 1-31
  message: string | null;
  recipients: string[] | number[] | null; // roles o IDs de usuarios
  is_active: boolean;
  last_sent_at: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export type ReminderType =
  | 'clock_in'
  | 'clock_out'
  | 'approve_entries'
  | 'weekly_report'
  | 'monthly_report'
  | 'missing_entries';

export type ReminderFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface ReminderFormData {
  user_id?: number | null;
  type: ReminderType;
  frequency: ReminderFrequency;
  time: string;
  days?: number[] | null;
  day_of_month?: number | null;
  message?: string | null;
  recipients?: string[] | number[] | null;
  is_active?: boolean;
}

export const REMINDER_TYPES: Record<ReminderType, string> = {
  clock_in: 'Recordar fichar entrada',
  clock_out: 'Recordar fichar salida',
  approve_entries: 'Aprobar registros pendientes',
  weekly_report: 'Reporte semanal',
  monthly_report: 'Reporte mensual',
  missing_entries: 'Registros faltantes',
};

export const REMINDER_FREQUENCIES: Record<ReminderFrequency, string> = {
  daily: 'Diario',
  weekly: 'Semanal',
  monthly: 'Mensual',
  custom: 'Personalizado',
};

export const WEEKDAYS = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 7, label: 'Domingo' },
];

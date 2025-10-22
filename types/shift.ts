export interface ShiftTemplate {
  id: number;
  company_id: number;
  name: string;
  color: string;
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  break_minutes: number;
  is_active: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserShift {
  id: number;
  user_id: number;
  shift_template_id: number;
  date: string; // YYYY-MM-DD
  start_time: string | null; // HH:mm custom
  end_time: string | null; // HH:mm custom
  notes: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  shift_template?: ShiftTemplate;
}

export interface ShiftTemplateFormData {
  name: string;
  color: string;
  start_time: string;
  end_time: string;
  break_minutes?: number;
  is_active?: boolean;
  description?: string | null;
}

export interface AssignShiftData {
  user_id: number;
  shift_template_id: number;
  date: string;
  start_time?: string | null;
  end_time?: string | null;
  notes?: string | null;
}

export interface AssignShiftRangeData {
  user_id: number;
  shift_template_id: number;
  start_date: string;
  end_date: string;
  days?: number[]; // 1-7 (lunes-domingo)
}

export const WEEKDAYS = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 7, label: 'Domingo' },
];

export const PRESET_COLORS = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Green
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
];

export const PRESET_SHIFTS = [
  {
    name: 'Turno Mañana',
    start_time: '08:00',
    end_time: '16:00',
    break_minutes: 30,
    color: '#3b82f6',
  },
  {
    name: 'Turno Tarde',
    start_time: '16:00',
    end_time: '00:00',
    break_minutes: 30,
    color: '#f59e0b',
  },
  {
    name: 'Turno Noche',
    start_time: '00:00',
    end_time: '08:00',
    break_minutes: 30,
    color: '#8b5cf6',
  },
  {
    name: 'Jornada Intensiva',
    start_time: '09:00',
    end_time: '15:00',
    break_minutes: 0,
    color: '#10b981',
  },
];

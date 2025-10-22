export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  type: 'time_entry' | 'holiday' | 'absence' | 'shift';
  status?: 'pending' | 'approved' | 'rejected';
  userId?: number;
  userName?: string;
  totalHours?: number;
  notes?: string;
}

export interface CalendarFilters {
  userId?: number;
  status?: string;
  type?: string;
}

export const EVENT_TYPES = [
  { value: 'time_entry', label: 'Registro de Tiempo', color: '#3b82f6' },
  { value: 'holiday', label: 'Festivo', color: '#ef4444' },
  { value: 'absence', label: 'Ausencia', color: '#f59e0b' },
  { value: 'shift', label: 'Turno', color: '#10b981' },
];

export const EVENT_STATUS = [
  { value: 'pending', label: 'Pendiente', color: '#f59e0b' },
  { value: 'approved', label: 'Aprobado', color: '#10b981' },
  { value: 'rejected', label: 'Rechazado', color: '#ef4444' },
];

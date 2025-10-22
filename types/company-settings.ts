export interface CompanySettings {
  work_start_time: string;
  work_end_time: string;
  working_days: number[]; // 1-7 (Monday-Sunday)
  overtime_multiplier: number;
  max_overtime_hours_per_day: number;
  max_overtime_hours_per_week: number;
  min_break_minutes: number;
  max_break_minutes: number;
  break_required: boolean;
  holidays: string[]; // Array of dates in YYYY-MM-DD format
  timezone: string;
}

export interface UpdateCompanySettingsData {
  work_start_time?: string;
  work_end_time?: string;
  working_days?: number[];
  overtime_multiplier?: number;
  max_overtime_hours_per_day?: number;
  max_overtime_hours_per_week?: number;
  min_break_minutes?: number;
  max_break_minutes?: number;
  break_required?: boolean;
  holidays?: string[];
  timezone?: string;
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

export const TIMEZONES = [
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)' },
  { value: 'Europe/London', label: 'Londres (GMT/BST)' },
  { value: 'Europe/Paris', label: 'París (CET/CEST)' },
  { value: 'America/New_York', label: 'Nueva York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'Los Ángeles (PST/PDT)' },
  { value: 'America/Mexico_City', label: 'Ciudad de México (CST)' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires (ART)' },
];

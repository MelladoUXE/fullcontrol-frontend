export interface ScheduledTask {
  name: string;
  description: string;
  frequency: string;
  next_run: string;
  last_run?: string;
  status: 'active' | 'paused' | 'error';
}

export interface ReminderLog {
  id: number;
  reminder_id: number;
  executed_at: string;
  recipients_count: number;
  status: 'success' | 'failed';
  error_message?: string;
}

export const TASK_FREQUENCIES: Record<string, string> = {
  'everyMinute': 'Cada minuto',
  'everyFiveMinutes': 'Cada 5 minutos',
  'everyTenMinutes': 'Cada 10 minutos',
  'everyFifteenMinutes': 'Cada 15 minutos',
  'everyThirtyMinutes': 'Cada 30 minutos',
  'hourly': 'Cada hora',
  'daily': 'Diario',
  'weekly': 'Semanal',
  'monthly': 'Mensual',
};

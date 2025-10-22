export interface WorkBreak {
  id: number;
  time_entry_id: number;
  break_start: string;
  break_end: string | null;
  duration_minutes: number | null;
  type: 'meal' | 'rest' | 'personal' | 'other';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TimeEntry {
  id: number;
  user_id: number;
  company_id: number;
  date: string;
  clock_in: string;
  clock_out: string | null;
  total_worked_minutes: number | null;
  type: 'regular' | 'overtime' | 'remote' | 'on_site';
  status: 'active' | 'completed' | 'approved' | 'rejected';
  notes: string | null;
  location: string | null;
  ip_address: string | null;
  created_by: number;
  approved_by: number | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  breaks: WorkBreak[];
  user?: {
    id: number;
    name: string;
    email: string;
  };
  company?: {
    id: number;
    name: string;
  };
}

export interface ClockInRequest {
  type?: 'regular' | 'overtime' | 'remote' | 'on_site';
  notes?: string;
  location?: string;
}

export interface ClockOutRequest {
  time_entry_id: number;
  notes?: string;
}

export interface StartBreakRequest {
  time_entry_id: number;
  type: 'meal' | 'rest' | 'personal' | 'other';
  notes?: string;
}

export interface EndBreakRequest {
  break_id: number;
  notes?: string;
}

export interface TimeEntryFilters {
  start_date?: string;
  end_date?: string;
}

export interface TimeEntryStats {
  total_worked_minutes: number;
  total_entries: number;
  total_breaks: number;
  average_daily_minutes: number;
}

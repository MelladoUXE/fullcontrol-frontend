import { TimeEntry } from './time-entry';

export interface ReportFilters {
  start_date: string;
  end_date: string;
  user_id?: number;
  company_id?: number;
  status?: 'active' | 'completed' | 'approved' | 'rejected';
  type?: 'regular' | 'overtime' | 'remote' | 'on_site';
}

export interface ReportStats {
  total_entries: number;
  total_minutes: number;
  total_hours: number;
  average_hours_per_day: number;
  by_status: Record<string, {
    count: number;
    total_minutes: number;
    total_hours: number;
  }>;
  by_type: Record<string, {
    count: number;
    total_minutes: number;
    total_hours: number;
  }>;
}

export interface UserSummary {
  user_id: number;
  user_name: string;
  user_email: string;
  total_entries: number;
  total_minutes: number;
  total_hours: number;
}

export interface DateSummary {
  date: string;
  total_entries: number;
  total_minutes: number;
  total_hours: number;
  by_user: Array<{
    user_name: string;
    total_minutes: number;
    total_hours: number;
  }>;
}

export interface TimeReport {
  filters: ReportFilters;
  stats: ReportStats;
  by_user: UserSummary[];
  by_date: DateSummary[];
  entries: TimeEntry[];
  generated_at: string;
  generated_by: string;
}

export interface ExecutiveSummary {
  today: ReportStats;
  this_week: ReportStats;
  this_month: ReportStats;
  pending_approvals: number;
}

export interface UserStatsReport {
  user: {
    id: number;
    name: string;
    email: string;
  };
  period: {
    start: string;
    end: string;
  };
  stats: ReportStats;
  by_date: DateSummary[];
}

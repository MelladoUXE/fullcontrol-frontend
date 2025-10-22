export interface DashboardStats {
  today_hours: number;
  week_hours: number;
  month_hours: number;
  average_daily?: number; // Solo para empleados
  active_employees: number;
  pending_approvals: number;
  approved_today: number;
  rejected_today: number;
}

export interface HoursChartData {
  date: string;
  hours: number;
}

export interface EmployeeHoursData {
  name: string;
  hours: number;
  entries: number;
}

export interface StatusDistributionData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export interface DashboardData {
  stats: DashboardStats;
  hours_chart: HoursChartData[];
  employee_hours: EmployeeHoursData[];
  status_distribution: StatusDistributionData[];
}

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { TimeTracker } from '@/components/time-tracker';
import { TimeEntryHistory } from '@/components/time-entry-history';
import { 
  HoursTrendChart, 
  EmployeePerformanceChart, 
  StatusDistributionChart 
} from '@/components/charts';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { StatsGrid } from '@/components/dashboard/stats-cards';
import { Card } from '@/components/ui/card';
import { dashboardService } from '@/lib/dashboard-service';
import { DashboardData } from '@/types/dashboard';
import { PageHeader } from '@/components/ui/page-header';
import { CardSkeleton } from '@/components/ui/loading-skeleton';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Clock, 
  TrendingUp, 
  Calendar,
  Users,
  CheckSquare,
  XCircle
} from 'lucide-react';

export default function DashboardPage() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadDashboardData();
    }
  }, [isAuthenticated, user, loadDashboardData]);

  // Memoize computed data for charts
  const hoursTrendData = useMemo(() => {
    if (!dashboardData) return [];
    return dashboardData.hours_chart.map(item => ({
      date: item.date,
      hours: item.hours,
      target: 176
    }));
  }, [dashboardData]);

  const statusDistributionData = useMemo(() => {
    if (!dashboardData) return { approved: 0, pending: 0, rejected: 0 };
    return {
      approved: dashboardData.status_distribution.find(s => s.name.toLowerCase().includes('aprob'))?.value || 0,
      pending: dashboardData.status_distribution.find(s => s.name.toLowerCase().includes('pend'))?.value || 0,
      rejected: dashboardData.status_distribution.find(s => s.name.toLowerCase().includes('rech'))?.value || 0
    };
  }, [dashboardData]);

  const employeePerformanceData = useMemo(() => {
    if (!dashboardData) return [];
    return dashboardData.employee_hours.slice(0, 5).map(emp => ({
      name: emp.name,
      hours: emp.hours,
      target: 176
    }));
  }, [dashboardData]);

  if (isLoading || isLoadingData) {
    return (
      <div className="p-6 space-y-6">
        <CardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <CardSkeleton />
        <div className="grid gap-6 lg:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !dashboardData) {
    return null;
  }

  const isEmployee = user?.role === 'employee';
  const isManager = user?.role === 'manager';
  const isAdmin = user?.role === 'admin';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title="Dashboard"
        description={
          isEmployee ? '✨ Bienvenido, registra tus horas de trabajo' :
          isManager ? '👔 Bienvenido, gestiona tu equipo' :
          '🔑 Bienvenido, panel de administración'
        }
        icon={LayoutDashboard}
        gradient="from-blue-600 to-purple-600"
      />

      {/* Employee View */}
      {isEmployee && (
        <div className="space-y-6">
          {/* Quick Stats for Employee */}
          <StatsGrid
            stats={[
              {
                title: 'Hoy',
                value: dashboardData.stats.today_hours,
                subtitle: 'horas',
                icon: Clock,
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                title: 'Esta Semana',
                value: dashboardData.stats.week_hours,
                subtitle: 'horas',
                icon: Calendar,
                gradient: 'from-emerald-500 to-teal-500',
              },
              {
                title: 'Este Mes',
                value: dashboardData.stats.month_hours,
                subtitle: 'horas',
                icon: TrendingUp,
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                title: 'Promedio Diario',
                value: dashboardData.stats.average_daily || 0,
                subtitle: 'horas',
                icon: Clock,
                gradient: 'from-orange-500 to-red-500',
              },
            ]}
          />

          {/* Quick Actions */}
          <QuickActions />

          {/* Time Tracker and History */}
          <div className="grid gap-6 lg:grid-cols-2">
            <TimeTracker />
            <TimeEntryHistory />
          </div>

          {/* Activity Feed */}
          <ActivityFeed />
        </div>
      )}

      {/* Manager/Admin View */}
      {(isManager || isAdmin) && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <StatsGrid
            stats={[
              {
                title: 'Horas Hoy',
                value: dashboardData.stats.today_hours,
                subtitle: 'horas',
                icon: Clock,
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                title: 'Horas Esta Semana',
                value: dashboardData.stats.week_hours,
                subtitle: 'horas',
                icon: Calendar,
                gradient: 'from-emerald-500 to-teal-500',
              },
              {
                title: 'Empleados Activos',
                value: dashboardData.stats.active_employees,
                icon: Users,
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                title: 'Pendientes',
                value: dashboardData.stats.pending_approvals,
                icon: Clock,
                gradient: 'from-orange-500 to-red-500',
              },
            ]}
          />

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Aprobadas Hoy',
                value: dashboardData.stats.approved_today,
                icon: CheckSquare,
                gradient: 'from-green-500 to-emerald-500',
              },
              {
                title: 'Rechazadas Hoy',
                value: dashboardData.stats.rejected_today,
                icon: XCircle,
                gradient: 'from-red-500 to-rose-500',
              },
              {
                title: 'Horas del Mes',
                value: dashboardData.stats.month_hours,
                subtitle: 'horas',
                icon: TrendingUp,
                gradient: 'from-indigo-500 to-blue-500',
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
              >
                <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <div className="relative p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {stat.value}
                          </p>
                          {stat.subtitle && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.subtitle}</p>
                          )}
                        </div>
                      </div>
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <QuickActions />

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <HoursTrendChart 
              data={hoursTrendData}
              title="Tendencia de Horas"
              showTarget={true}
            />
            <StatusDistributionChart 
              data={statusDistributionData}
              title="Distribución de Estados"
            />
          </div>

          {/* Employee Performance Chart */}
          {employeePerformanceData.length > 0 && (
            <EmployeePerformanceChart 
              data={employeePerformanceData}
              title="Top 5 Empleados del Mes"
            />
          )}

          {/* Activity Feed and Time Tracker */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ActivityFeed />
            <TimeTracker />
          </div>

          {/* Recent History */}
          <TimeEntryHistory />
        </div>
      )}
    </div>
  );
}
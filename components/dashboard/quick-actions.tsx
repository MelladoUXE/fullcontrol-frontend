'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckSquare, 
  FileBarChart, 
  Bell, 
  Calendar,
  Users,
  Plane,
  Settings,
  LucideIcon,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/hooks/usePermissions';
import { cn } from '@/lib/utils';

interface QuickAction {
  label: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
  permission?: string;
}

export function QuickActions() {
  const router = useRouter();
  
  // Permissions
  const canApprove = usePermission('approvals.approve_time');
  const canViewReports = usePermission('reports.view_all');
  const canCreateReminders = usePermission('reminders.create');
  const canViewUsers = usePermission('users.view_all');
  const canManageShifts = usePermission('shifts.manage');
  const canCreateVacations = usePermission('vacations.create');

  const actions: QuickAction[] = [
    {
      label: 'Registrar Tiempo',
      icon: Clock,
      href: '/dashboard',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Aprobaciones',
      icon: CheckSquare,
      href: '/approvals',
      gradient: 'from-emerald-500 to-teal-500',
      permission: 'approvals.approve_time',
    },
    {
      label: 'Reportes',
      icon: FileBarChart,
      href: '/reports',
      gradient: 'from-purple-500 to-pink-500',
      permission: 'reports.view_all',
    },
    {
      label: 'Recordatorios',
      icon: Bell,
      href: '/reminders',
      gradient: 'from-orange-500 to-red-500',
      permission: 'reminders.create',
    },
    {
      label: 'Turnos',
      icon: Calendar,
      href: '/shifts',
      gradient: 'from-indigo-500 to-blue-500',
      permission: 'shifts.manage',
    },
    {
      label: 'Empleados',
      icon: Users,
      href: '/employees',
      gradient: 'from-blue-500 to-cyan-500',
      permission: 'users.view_all',
    },
    {
      label: 'Vacaciones',
      icon: Plane,
      href: '/vacations',
      gradient: 'from-sky-500 to-blue-500',
      permission: 'vacations.create',
    },
    {
      label: 'Configuración',
      icon: Settings,
      href: '/settings',
      gradient: 'from-gray-500 to-slate-500',
    },
  ];

  // Filter actions based on permissions
  const visibleActions = actions.filter(action => {
    if (!action.permission) return true;
    
    switch (action.permission) {
      case 'approvals.approve_time':
        return canApprove;
      case 'reports.view_all':
        return canViewReports;
      case 'reminders.create':
        return canCreateReminders;
      case 'users.view_all':
        return canViewUsers;
      case 'shifts.manage':
        return canManageShifts;
      case 'vacations.create':
        return canCreateVacations;
      default:
        return true;
    }
  });

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Accesos Rápidos</h3>
            <p className="text-sm text-muted-foreground">Navega rápidamente por el sistema</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.href}
                variant="outline"
                className={cn(
                  "h-auto flex-col gap-3 p-5 group relative overflow-hidden",
                  "hover:shadow-lg hover:scale-105 hover:border-primary/50",
                  "transition-all duration-200"
                )}
                onClick={() => router.push(action.href)}
              >
                {/* Gradient background on hover */}
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity",
                  `bg-gradient-to-br ${action.gradient}`
                )} />
                
                {/* Icon */}
                <div className={cn(
                  "relative p-4 rounded-2xl transition-all duration-200",
                  "bg-gradient-to-br shadow-md",
                  action.gradient,
                  "group-hover:scale-110 group-hover:shadow-lg"
                )}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                {/* Label */}
                <span className="relative text-sm font-semibold text-center leading-tight">
                  {action.label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

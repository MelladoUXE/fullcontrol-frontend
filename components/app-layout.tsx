'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePermission, useAnyPermission } from '@/hooks/usePermissions';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { NavSection } from '@/types/navigation';
import { Button } from '@/components/ui/button';
import { NotificationBell } from '@/components/notification-bell';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { GlobalSearch } from '@/components/global-search';
import { 
  LayoutDashboard, 
  Clock, 
  Building2, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  CheckSquare,
  FileBarChart,
  Calendar,
  Bell,
  CalendarClock,
  Shield,
  Book,
  Plane
} from 'lucide-react';
import { useState, useMemo } from 'react';

const navigationSections: NavSection[] = [
  {
    title: 'General',
    items: [
      { 
        title: 'Dashboard', 
        href: '/dashboard', 
        icon: LayoutDashboard,
        description: 'Vista general'
      },
      { 
        title: 'Control Horario', 
        href: '/time-tracking', 
        icon: Clock,
        description: 'Registro de tiempo'
      },
      { 
        title: 'Calendario', 
        href: '/calendar', 
        icon: Calendar,
        description: 'Vista de calendario'
      },
    ]
  },
  {
    title: 'Equipo',
    items: [
      { 
        title: 'Empleados', 
        href: '/employees', 
        icon: Users,
        description: 'Gestión de personal'
      },
      { 
        title: 'Turnos', 
        href: '/shifts', 
        icon: CalendarClock,
        description: 'Plantillas de horarios'
      },
      { 
        title: 'Vacaciones', 
        href: '/vacations', 
        icon: Plane,
        description: 'Gestión de ausencias'
      },
    ]
  },
  {
    title: 'Gestión',
    items: [
      { 
        title: 'Aprobaciones', 
        href: '/approvals', 
        icon: CheckSquare,
        description: 'Aprobar registros'
      },
      { 
        title: 'Reportes', 
        href: '/reports', 
        icon: FileBarChart,
        description: 'Reportes de horas'
      },
      { 
        title: 'Recordatorios', 
        href: '/reminders', 
        icon: Bell,
        description: 'Notificaciones automáticas'
      },
    ]
  },
  {
    title: 'Administración',
    items: [
      { 
        title: 'Empresa', 
        href: '/company', 
        icon: Building2,
        description: 'Gestión de empresa'
      },
      { 
        title: 'Roles', 
        href: '/roles', 
        icon: Shield,
        description: 'Roles y permisos'
      },
      { 
        title: 'Auditoría', 
        href: '/audit', 
        icon: Book,
        description: 'Registro de acciones'
      },
    ]
  },
  {
    title: 'Sistema',
    items: [
      { 
        title: 'Scheduler', 
        href: '/scheduler', 
        icon: Clock,
        description: 'Tareas programadas'
      },
      { 
        title: 'API Docs', 
        href: '/api-docs', 
        icon: Book,
        description: 'Documentación API'
      },
      { 
        title: 'Configuración', 
        href: '/settings', 
        icon: Settings,
        description: 'Ajustes del sistema'
      },
    ]
  },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Permission checks for navigation
  const canViewUsers = useAnyPermission(['users.view_all', 'users.view_company']);
  const canViewApprovals = useAnyPermission(['approvals.approve_time', 'approvals.approve_vacations']);
  const canViewReports = usePermission('reports.view_all');
  const canManageReminders = useAnyPermission(['reminders.create', 'reminders.edit', 'reminders.delete']);
  const canManageShifts = useAnyPermission(['shifts.create', 'shifts.edit', 'shifts.assign']);
  const canManageVacations = useAnyPermission(['vacations.create', 'vacations.edit', 'vacations.delete', 'approvals.approve_vacations']);
  const canViewRoles = usePermission('roles.view');
  const canViewAudit = usePermission('audit.view');
  
  // Filter navigation items based on permissions
  const filteredNavigationSections = useMemo(() => {
    return navigationSections.map(section => ({
      ...section,
      items: section.items.filter(item => {
        switch (item.href) {
          case '/employees':
            return canViewUsers;
          case '/approvals':
            return canViewApprovals;
          case '/reports':
            return canViewReports;
          case '/reminders':
            return canManageReminders;
          case '/shifts':
            return canManageShifts;
          case '/vacations':
            return canManageVacations;
          case '/roles':
            return canViewRoles;
          case '/audit':
            return canViewAudit;
          // These are visible to everyone
          case '/dashboard':
          case '/time-tracking':
          case '/calendar':
          case '/company':
          case '/scheduler':
          case '/api-docs':
          case '/settings':
            return true;
          default:
            return true;
        }
      })
    })).filter(section => section.items.length > 0); // Remove empty sections
  }, [canViewUsers, canViewApprovals, canViewReports, canManageReminders, canManageShifts, canManageVacations, canViewRoles, canViewAudit]);
  
  // Flatten for page title lookup
  const allNavItems = useMemo(() => {
    return filteredNavigationSections.flatMap(section => section.items);
  }, [filteredNavigationSections]);
  
  // Generate breadcrumb items
  const breadcrumbItems = useMemo(() => {
    const currentPage = allNavItems.find(nav => nav.href === pathname);
    if (!currentPage) return [];
    
    return [{ label: currentPage.title }];
  }, [allNavItems, pathname]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Don't show layout on auth pages
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/';
  
  if (!isAuthenticated || isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              FullControl
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {filteredNavigationSections.map((section) => (
              <div key={section.title} className="mb-6">
                {/* Section Title */}
                <div className="px-3 mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>
                
                {/* Section Items */}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                          ${isActive 
                            ? 'bg-primary text-primary-foreground' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }
                        `}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <div className="flex-1">
                          <div>{item.title}</div>
                          {item.description && (
                            <div className={`text-xs ${isActive ? 'text-primary-foreground/80' : 'text-gray-500 dark:text-gray-400'}`}>
                              {item.description}
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="w-full justify-start"
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top Navbar - Desktop & Mobile */}
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Page title / breadcrumb */}
            <div className="flex-1 lg:flex-none">
              <div className="hidden lg:block mb-1">
                <Breadcrumb items={breadcrumbItems} />
              </div>
              <h1 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
                {allNavItems.find(nav => nav.href === pathname)?.title || 'FullControl'}
              </h1>
            </div>

            {/* Right side - Search, Notifications & User */}
            <div className="flex items-center gap-3">
              {/* Search Button - Opens with Ctrl+K */}
              <div className="hidden md:block text-sm text-gray-500">
                Presiona{' '}
                <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded text-xs font-mono">
                  {typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+K
                </kbd>{' '}
                para buscar
              </div>
              
              {/* Notifications */}
              <NotificationBell />

              {/* User info - Desktop only */}
              <Link 
                href="/profile"
                className="hidden lg:flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700 hover:opacity-80 transition-opacity"
              >
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role === 'admin' ? 'Administrador' : user?.role === 'manager' ? 'Manager' : 'Empleado'}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePermission } from '@/hooks/usePermissions';
import { auditService } from '@/lib/audit-service';
import type { AuditLog, AuditFilters } from '@/types/audit';
import { AUDIT_ACTIONS, ENTITY_TYPES, ACTION_COLORS } from '@/types/audit';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  User,
  Calendar,
  Tag,
  FileText,
  BarChart3,
  Trash2,
  ShieldAlert
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { TableSkeleton, CardSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AuditPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  // Permission check
  const canViewAudit = usePermission('audit.view');
  
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AuditFilters>({ days: 30, per_page: 50 });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 50,
    total: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    if (!canViewAudit) {
      router.push('/dashboard');
      return;
    }

    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadLogs = async () => {
    if (!canViewAudit) {
      setLogs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await auditService.getLogs(filters);
      setLogs(data.data);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        per_page: data.per_page,
        total: data.total,
      });
    } catch (error) {
      toast.error('Error al cargar logs de auditoría');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    if (!canViewAudit) {
      router.push('/dashboard');
      return;
    }

    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleSearch = () => {
    setFilters({ ...filters, search });
  };

  const handleFilterChange = (key: keyof AuditFilters, value: string | number) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({ days: 30, per_page: 50 });
    setSearch('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getActionBadgeClass = (action: string) => {
    return ACTION_COLORS[action] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const goToPage = () => {
    // TODO: Implement pagination
    setFilters({ ...filters });
  };

  if (loading && logs.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <CardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <CardSkeleton />
        <TableSkeleton rows={10} />
      </div>
    );
  }

  if (!user || !canViewAudit) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <ShieldAlert className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Acceso Denegado
        </h2>
        <p className="text-gray-600 text-center max-w-md">
          No tienes permisos para acceder a la auditoría del sistema.
          Contacta con tu administrador si necesitas acceso.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Sistema de Auditoría"
        description="Registro completo de todas las acciones en el sistema"
        icon={Shield}
        gradient="from-blue-600 to-indigo-600"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Acciones</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Últimos</p>
              <p className="text-2xl font-bold text-gray-900">{filters.days} días</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Página Actual</p>
              <p className="text-2xl font-bold text-gray-900">
                {pagination.current_page} / {pagination.last_page}
              </p>
            </div>
            <FileText className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resultados/Página</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.per_page}</p>
            </div>
            <Tag className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar en descripción..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Acción
                </label>
                <Select
                  value={filters.action || ''}
                  onValueChange={(value) => handleFilterChange('action', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las acciones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    {Object.entries(AUDIT_ACTIONS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Tipo de Entidad
                </label>
                <Select
                  value={filters.entity_type || ''}
                  onValueChange={(value) => handleFilterChange('entity_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    {Object.entries(ENTITY_TYPES).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Período
                </label>
                <Select
                  value={String(filters.days || 30)}
                  onValueChange={(value) => handleFilterChange('days', Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Últimos 7 días</SelectItem>
                    <SelectItem value="30">Últimos 30 días</SelectItem>
                    <SelectItem value="60">Últimos 60 días</SelectItem>
                    <SelectItem value="90">Últimos 90 días</SelectItem>
                    <SelectItem value="180">Últimos 6 meses</SelectItem>
                    <SelectItem value="365">Último año</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Audit Logs List */}
      <div className="space-y-3">
        {logs.map((log) => (
          <Card key={log.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getActionBadgeClass(log.action)}`}>
                    {AUDIT_ACTIONS[log.action] || log.action}
                  </span>
                  {log.entity_type && (
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      {ENTITY_TYPES[log.entity_type] || log.entity_type}
                      {log.entity_id && ` #${log.entity_id}`}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-900 font-medium mb-2">{log.description}</p>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  {log.user && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{log.user.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(log.created_at)}</span>
                  </div>
                  {log.ip_address && (
                    <span className="text-gray-400">IP: {log.ip_address}</span>
                  )}
                </div>

                {/* Changes */}
                {(log.old_values || log.new_values) && (
                  <div className="mt-3 pt-3 border-t space-y-2">
                    {log.old_values && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
                          Ver valores anteriores
                        </summary>
                        <pre className="mt-2 p-2 bg-red-50 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.old_values, null, 2)}
                        </pre>
                      </details>
                    )}
                    {log.new_values && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
                          Ver valores nuevos
                        </summary>
                        <pre className="mt-2 p-2 bg-green-50 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.new_values, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}

        {logs.length === 0 && !loading && (
          <EmptyState
            icon={Shield}
            title="No hay logs de auditoría"
            description="No se encontraron registros con los filtros seleccionados"
            variant="card"
          />
        )}
      </div>

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Mostrando {logs.length} de {pagination.total} registros
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPage}
              disabled={pagination.current_page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={pagination.current_page === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={goToPage}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={goToPage}
              disabled={pagination.current_page === pagination.last_page}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { usePermission } from '@/hooks/usePermissions';
import { vacationService } from '@/lib/vacation-service';
import { Vacation, VacationBalance, VACATION_TYPES, VACATION_STATUS } from '@/types/vacation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, CheckCircle, XCircle, Ban, Plane, TrendingUp, Clock, Hourglass } from 'lucide-react';
import { toast } from 'sonner';
import VacationDialog from '@/components/vacation-dialog';
import { PageHeader } from '@/components/ui/page-header';
import { CardSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';

export default function VacationsPage() {
  // Permission checks
  const canCreateVacations = usePermission('vacations.create');
  const canDeleteVacations = usePermission('vacations.delete');
  
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [balance, setBalance] = useState<VacationBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      const filters = filterStatus !== 'all' ? { status: filterStatus as 'pending' | 'approved' | 'rejected' | 'cancelled' } : {};
      const [vacationsData, balanceData] = await Promise.all([
        vacationService.getVacations(filters),
        vacationService.getBalance(),
      ]);
      
      setVacations(vacationsData.data || []);
      setBalance(balanceData);
    } catch {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!canDeleteVacations) {
      toast.error('No tienes permisos para cancelar solicitudes');
      return;
    }

    if (!confirm('¿Estás seguro de que deseas cancelar esta solicitud?')) return;
    
    try {
      await vacationService.cancelVacation(id);
      toast.success('Solicitud cancelada');
      loadData();
    } catch {
      toast.error('Error al cancelar la solicitud');
    }
  };

  const handleSave = () => {
    setDialogOpen(false);
    loadData();
  };

  const getTypeBadge = (type: string) => {
    const config = VACATION_TYPES[type as keyof typeof VACATION_TYPES];
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-800',
      red: 'bg-red-100 text-red-800',
      purple: 'bg-purple-100 text-purple-800',
      gray: 'bg-gray-100 text-gray-800',
      orange: 'bg-orange-100 text-orange-800',
    };
    
    return (
      <Badge className={colorMap[config?.color || 'gray']}>
        {config?.label || type}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <CardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title="Mis Vacaciones"
        description="Gestiona tus solicitudes de ausencias"
        icon={Plane}
        gradient="from-blue-600 to-cyan-600"
        action={
          canCreateVacations
            ? {
                label: 'Nueva Solicitud',
                onClick: () => setDialogOpen(true),
                icon: Plus,
              }
            : undefined
        }
      />

      {/* Balance Cards */}
      {balance && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Anual</div>
                <div className="text-2xl font-bold text-blue-600">{balance.total}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <CheckCircle className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Usados</div>
                <div className="text-2xl font-bold text-gray-700">{balance.used}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Hourglass className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Pendientes</div>
                <div className="text-2xl font-bold text-yellow-600">{balance.pending}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Disponibles</div>
                <div className="text-2xl font-bold text-green-600">{balance.available}</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tabs Filter */}
      <Tabs value={filterStatus} onValueChange={setFilterStatus} className="space-y-4">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-5">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="approved">Aprobadas</TabsTrigger>
          <TabsTrigger value="rejected">Rechazadas</TabsTrigger>
          <TabsTrigger value="cancelled">Canceladas</TabsTrigger>
        </TabsList>

        <TabsContent value={filterStatus} className="space-y-4">
          {vacations.length === 0 ? (
            <EmptyState
              icon={Plane}
              title="No hay solicitudes"
              description={
                filterStatus === 'all'
                  ? 'Crea tu primera solicitud de vacaciones'
                  : `No hay solicitudes con estado "${filterStatus}"`
              }
              actionLabel={canCreateVacations ? 'Nueva Solicitud' : undefined}
              onAction={canCreateVacations ? () => setDialogOpen(true) : undefined}
              variant="card"
            />
          ) : (
            <div className="grid gap-4">
              {vacations.map((vacation) => (
                <Card key={vacation.id} className="p-6 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Badges */}
                      <div className="flex items-center gap-3 mb-3">
                        {getTypeBadge(vacation.type)}
                        <StatusBadge
                          status={
                            vacation.status === 'approved' ? 'success' :
                            vacation.status === 'pending' ? 'pending' :
                            vacation.status === 'rejected' ? 'error' :
                            'inactive'
                          }
                        >
                          {VACATION_STATUS[vacation.status as keyof typeof VACATION_STATUS]?.label || vacation.status}
                        </StatusBadge>
                        <Badge variant="outline" className="gap-1">
                          <Clock className="w-3 h-3" />
                          {vacation.days} día{vacation.days !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      
                      {/* Dates */}
                      <div className="flex items-center gap-2 text-gray-700 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">
                          {new Date(vacation.start_date).toLocaleDateString('es-ES', { 
                            weekday: 'short', 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                          {' → '}
                          {new Date(vacation.end_date).toLocaleDateString('es-ES', { 
                            weekday: 'short', 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>

                      {/* Reason */}
                      {vacation.reason && (
                        <div className="text-sm text-gray-600 mb-2 p-3 bg-gray-50 rounded-md">
                          <strong>Motivo:</strong> {vacation.reason}
                        </div>
                      )}

                      {/* Notes */}
                      {vacation.notes && (
                        <div className="text-sm text-gray-600 mb-2 p-3 bg-blue-50 rounded-md">
                          <strong>Notas:</strong> {vacation.notes}
                        </div>
                      )}

                      {/* Approver Info */}
                      {vacation.approver && (
                        <div className="text-sm mt-3">
                          {vacation.status === 'approved' && (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>Aprobada por <strong>{vacation.approver.name}</strong></span>
                            </div>
                          )}
                          {vacation.status === 'rejected' && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-red-600">
                                <XCircle className="w-4 h-4" />
                                <span>Rechazada por <strong>{vacation.approver.name}</strong></span>
                              </div>
                              {vacation.rejection_reason && (
                                <div className="p-3 bg-red-50 rounded-md text-red-700 text-sm">
                                  <strong>Motivo:</strong> {vacation.rejection_reason}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {vacation.approver_notes && (
                        <div className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded-md">
                          <strong>Notas del aprobador:</strong> {vacation.approver_notes}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {canDeleteVacations && (vacation.status === 'pending' || (vacation.status === 'approved' && new Date(vacation.start_date) > new Date())) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(vacation.id)}
                        className="text-red-600 border-red-600 hover:bg-red-50 ml-4"
                      >
                        <Ban className="w-4 h-4 mr-1" />
                        Cancelar
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog */}
      <VacationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
      />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePermission } from '@/hooks/usePermissions';
import { vacationService } from '@/lib/vacation-service';
import { Vacation, VACATION_TYPES } from '@/types/vacation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, XCircle, User, Clock, ClipboardCheck, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import ApproveVacationDialog from '@/components/approve-vacation-dialog';
import RejectVacationDialog from '@/components/reject-vacation-dialog';

export default function VacationApprovalsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const canApproveVacations = usePermission('approvals.approve_vacations');
  
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVacation, setSelectedVacation] = useState<Vacation | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    if (!canApproveVacations) {
      router.push('/dashboard');
      return;
    }

    loadVacations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, router]);

  const loadVacations = async () => {
    if (!canApproveVacations) {
      toast.error('No tienes permisos para ver aprobaciones de vacaciones');
      return;
    }

    try {
      setLoading(true);
      const data = await vacationService.getPendingApprovals();
      setVacations(data.data || []);
    } catch {
      toast.error('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApprove = (vacation: Vacation) => {
    if (!canApproveVacations) {
      toast.error('No tienes permisos para aprobar vacaciones');
      return;
    }
    setSelectedVacation(vacation);
    setApproveDialogOpen(true);
  };

  const handleOpenReject = (vacation: Vacation) => {
    if (!canApproveVacations) {
      toast.error('No tienes permisos para rechazar vacaciones');
      return;
    }
    setSelectedVacation(vacation);
    setRejectDialogOpen(true);
  };

  const handleSave = () => {
    setApproveDialogOpen(false);
    setRejectDialogOpen(false);
    setSelectedVacation(null);
    loadVacations();
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

  if (!user || !canApproveVacations) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <ShieldAlert className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Acceso Denegado
        </h2>
        <p className="text-gray-600 text-center max-w-md">
          No tienes permisos para acceder a la página de aprobaciones de vacaciones.
          Contacta con tu administrador si necesitas acceso.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
            <ClipboardCheck className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Aprobaciones de Vacaciones</h1>
            <p className="text-green-100">Gestiona las solicitudes pendientes del equipo</p>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Pendientes</div>
              <div className="text-2xl font-bold text-yellow-600">{vacations.length}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Vacations List */}
      <div className="grid gap-4">
        {vacations.length === 0 ? (
          <Card className="p-12 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">¡Todo al día!</h3>
            <p className="text-gray-500">No hay solicitudes pendientes de aprobación</p>
          </Card>
        ) : (
          vacations.map((vacation) => (
            <Card key={vacation.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* User Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold text-lg">{vacation.user?.name}</span>
                    <span className="text-sm text-gray-500">({vacation.user?.email})</span>
                  </div>

                  {/* Type and Days */}
                  <div className="flex items-center gap-3 mb-3">
                    {getTypeBadge(vacation.type)}
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
                    <div className="mb-2 p-3 bg-gray-50 rounded-md">
                      <div className="text-sm font-medium text-gray-700 mb-1">Motivo:</div>
                      <div className="text-sm text-gray-600">{vacation.reason}</div>
                    </div>
                  )}

                  {/* Notes */}
                  {vacation.notes && (
                    <div className="mb-2 p-3 bg-blue-50 rounded-md">
                      <div className="text-sm font-medium text-blue-700 mb-1">Notas adicionales:</div>
                      <div className="text-sm text-blue-600">{vacation.notes}</div>
                    </div>
                  )}

                  {/* Created at */}
                  <div className="text-xs text-gray-400 mt-2">
                    Solicitada el {new Date(vacation.created_at).toLocaleDateString('es-ES')} a las{' '}
                    {new Date(vacation.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {canApproveVacations && (
                    <>
                      <Button
                        onClick={() => handleOpenApprove(vacation)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aprobar
                      </Button>
                      <Button
                        onClick={() => handleOpenReject(vacation)}
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rechazar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Dialogs */}
      {selectedVacation && (
        <>
          <ApproveVacationDialog
            open={approveDialogOpen}
            onOpenChange={setApproveDialogOpen}
            vacation={selectedVacation}
            onSave={handleSave}
          />
          <RejectVacationDialog
            open={rejectDialogOpen}
            onOpenChange={setRejectDialogOpen}
            vacation={selectedVacation}
            onSave={handleSave}
          />
        </>
      )}
    </div>
  );
}

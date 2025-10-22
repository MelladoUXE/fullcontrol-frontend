'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePermission } from '@/hooks/usePermissions';
import { TimeEntry } from '@/types/time-entry';
import { ApprovalStats, ApprovalStatus } from '@/types/approval';
import { approvalService } from '@/lib/approval-service';
import { ApprovalStatsCards } from '@/components/approval-stats-cards';
import { ApprovalsTable } from '@/components/approvals-table';
import { ApprovalDialog } from '@/components/approval-dialog';
import { ShieldAlert, CheckSquare } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { TableSkeleton, CardSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';

export default function ApprovalsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  // Permission checks
  const canApproveTime = usePermission('approvals.approve_time');
  
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [stats, setStats] = useState<ApprovalStats>({ pending: 0, approved: 0, rejected: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
  const [action, setAction] = useState<ApprovalStatus>('approved');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    // Check permission to view approvals
    if (!canApproveTime) {
      router.push('/dashboard');
      return;
    }

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, router]);

  const loadData = async () => {
    await Promise.all([loadPendingApprovals(), loadStats()]);
  };

  const loadPendingApprovals = async () => {
    if (!canApproveTime) {
      setError('No tienes permisos para ver aprobaciones');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await approvalService.getPendingApprovals();
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar registros');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setIsStatsLoading(true);
      const data = await approvalService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setIsStatsLoading(false);
    }
  };

  const handleApprove = (entry: TimeEntry) => {
    if (!canApproveTime) {
      alert('No tienes permisos para aprobar registros de tiempo');
      return;
    }
    setSelectedEntry(entry);
    setAction('approved');
    setIsDialogOpen(true);
  };

  const handleReject = (entry: TimeEntry) => {
    if (!canApproveTime) {
      alert('No tienes permisos para rechazar registros de tiempo');
      return;
    }
    setSelectedEntry(entry);
    setAction('rejected');
    setIsDialogOpen(true);
  };

  const handleConfirm = async (notes?: string) => {
    if (!selectedEntry) return;

    if (!canApproveTime) {
      alert('No tienes permisos para aprobar/rechazar registros');
      throw new Error('No tienes permisos');
    }

    try {
      await approvalService.approve(selectedEntry.id, {
        status: action,
        notes,
      });

      // Recargar datos
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al procesar aprobación');
      throw err; // Re-throw para que el diálogo maneje el estado
    }
  };

  if (!user || !canApproveTime) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <ShieldAlert className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Acceso Denegado
        </h2>
        <p className="text-gray-600 text-center max-w-md">
          No tienes permisos para acceder a la página de aprobaciones.
          Contacta con tu administrador si necesitas acceso.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Aprobaciones"
        description="Gestiona las aprobaciones de registros de tiempo"
        icon={CheckSquare}
        gradient="from-emerald-500 to-teal-500"
      />

      {/* Error State */}
      {!isLoading && error && (
        <ErrorState
          message={error}
          onRetry={loadData}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <TableSkeleton rows={5} />
        </div>
      )}

      {/* Data Display */}
      {!isLoading && !error && (
        <div className="space-y-6">
          <ApprovalStatsCards stats={stats} isLoading={isStatsLoading} />

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Pendientes de Aprobación
            </h2>
            
            {entries.length === 0 ? (
              <EmptyState
                icon={CheckSquare}
                title="No hay aprobaciones pendientes"
                description="Todos los registros de tiempo han sido procesados"
                variant="card"
              />
            ) : (
              <ApprovalsTable
                entries={entries}
                onApprove={handleApprove}
                onReject={handleReject}
                isLoading={isLoading}
                canApprove={canApproveTime}
              />
            )}
          </div>
        </div>
      )}

      <ApprovalDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirm}
        entry={selectedEntry}
        action={action}
      />
    </div>
  );
}

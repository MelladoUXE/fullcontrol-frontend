'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePermission } from '@/hooks/usePermissions';
import { User } from '@/types/auth';
import { ReportFilters, TimeReport } from '@/types/report';
import { reportService } from '@/lib/report-service';
import { userService } from '@/lib/user-service';
import { ReportFiltersForm } from '@/components/report-filters-form';
import { ReportStatsCards } from '@/components/report-stats-cards';
import { ReportByUserTable } from '@/components/report-by-user-table';
import { ReportByDateTable } from '@/components/report-by-date-table';
import { FileBarChart, ShieldAlert } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { TableSkeleton, CardSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';

export default function ReportsPage() {
  const router = useRouter();
  const { user: currentUser, isAuthenticated } = useAuth();
  
  // Permission checks
  const canViewReports = usePermission('reports.view_all');
  const canExportReports = usePermission('reports.export');
  
  const [users, setUsers] = useState<User[]>([]);
  const [report, setReport] = useState<TimeReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      router.push('/login');
      return;
    }

    // Check permission to view reports
    if (!canViewReports) {
      router.push('/dashboard');
      return;
    }

    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, currentUser, router]);

  const loadUsers = async () => {
    if (!currentUser) return;

    try {
      let loadedUsers: User[];
      
      if (currentUser.role === 'admin') {
        loadedUsers = await userService.getAllUsers();
      } else {
        loadedUsers = await userService.getUsersByCompany();
      }

      setUsers(loadedUsers);
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  const handleGenerateReport = async (filters: ReportFilters) => {
    if (!canViewReports) {
      setError('No tienes permisos para ver reportes');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await reportService.generateTimeReport(filters);
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar reporte');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = async (filters: ReportFilters) => {
    if (!canExportReports) {
      alert('No tienes permisos para exportar reportes');
      return;
    }

    try {
      setIsExporting(true);
      const blob = await reportService.exportToCSV(filters);
      const filename = `reporte_${filters.start_date}_${filters.end_date}.csv`;
      reportService.downloadCSV(blob, filename);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al exportar reporte');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async (filters: ReportFilters) => {
    if (!canExportReports) {
      alert('No tienes permisos para exportar reportes a PDF');
      return;
    }

    try {
      setIsExporting(true);
      const blob = await reportService.exportToPDF(filters);
      const filename = `reporte_${filters.start_date}_${filters.end_date}.pdf`;
      reportService.downloadPDF(blob, filename);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al exportar reporte a PDF');
    } finally {
      setIsExporting(false);
    }
  };

  if (!currentUser || !canViewReports) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <ShieldAlert className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Acceso Denegado
        </h2>
        <p className="text-gray-600 text-center max-w-md">
          No tienes permisos para acceder a la página de reportes.
          Contacta con tu administrador si necesitas acceso.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Reportes"
        description="Genera reportes detallados de horas trabajadas"
        icon={FileBarChart}
        gradient="from-purple-500 to-pink-500"
      />

      {/* Error State */}
      {!isLoading && error && (
        <ErrorState
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          <CardSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <TableSkeleton rows={5} />
        </div>
      )}

      {/* Data Display */}
      {!isLoading && (
        <div className="space-y-6">
          {/* Filtros */}
          <ReportFiltersForm
            onGenerate={handleGenerateReport}
            onExport={handleExportCSV}
            onExportPdf={handleExportPDF}
            users={users}
            currentUser={currentUser}
            isLoading={isLoading || isExporting}
            canExport={canExportReports}
          />

          {/* Resultados del reporte */}
          {report && (
            <>
              {/* Información del reporte */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-start gap-3">
                  <FileBarChart className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-900">
                      Reporte Generado
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Periodo: {report.filters.start_date} a {report.filters.end_date}
                      {' • '}
                      Generado por: {report.generated_by}
                      {' • '}
                      Fecha: {new Date(report.generated_at).toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Resumen General
                </h2>
                <ReportStatsCards stats={report.stats} />
              </div>

              {/* Por usuario */}
              {report.by_user.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Desglose por Empleado
                  </h2>
                  <ReportByUserTable users={report.by_user} />
                </div>
              )}

              {/* Por fecha */}
              {report.by_date.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Desglose por Fecha
                  </h2>
                  <ReportByDateTable dates={report.by_date} />
                </div>
              )}
            </>
          )}

          {/* Estado vacío */}
          {!report && (
            <EmptyState
              icon={FileBarChart}
              title="No hay reporte generado"
              description='Selecciona los filtros y haz clic en "Generar Reporte" para ver los resultados'
              variant="card"
            />
          )}
        </div>
      )}
    </div>
  );
}

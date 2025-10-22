'use client';

import { useState } from 'react';
import { ReportFilters } from '@/types/report';
import { User } from '@/types/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Download, FileDown } from 'lucide-react';

interface ReportFiltersFormProps {
  onGenerate: (filters: ReportFilters) => void;
  onExport: (filters: ReportFilters) => void;
  onExportPdf: (filters: ReportFilters) => void;
  users?: User[];
  currentUser: User;
  isLoading?: boolean;
  canExport?: boolean;
}

export function ReportFiltersForm({
  onGenerate,
  onExport,
  onExportPdf,
  users = [],
  currentUser,
  isLoading,
  canExport = true,
}: ReportFiltersFormProps) {
  const today = new Date().toISOString().split('T')[0];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split('T')[0];

  const [filters, setFilters] = useState<ReportFilters>({
    start_date: firstDayOfMonth,
    end_date: today,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(filters);
  };

  const handleExport = () => {
    onExport(filters);
  };

  const handleExportPdf = () => {
    onExportPdf(filters);
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Filtros de Reporte</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fecha inicio */}
          <div className="space-y-2">
            <Label htmlFor="start_date">Fecha Inicio</Label>
            <Input
              id="start_date"
              type="date"
              value={filters.start_date}
              onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
              required
            />
          </div>

          {/* Fecha fin */}
          <div className="space-y-2">
            <Label htmlFor="end_date">Fecha Fin</Label>
            <Input
              id="end_date"
              type="date"
              value={filters.end_date}
              onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
              required
              min={filters.start_date}
            />
          </div>

          {/* Usuario (solo admin/manager) */}
          {currentUser.role !== 'employee' && users.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="user_id">Empleado</Label>
              <Select
                value={filters.user_id?.toString()}
                onValueChange={(value) =>
                  setFilters({ ...filters, user_id: value ? parseInt(value) : undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los empleados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los empleados</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Estado */}
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) =>
                setFilters({ 
                  ...filters, 
                  status: value === 'all' ? undefined : value as 'active' | 'completed' | 'approved' | 'rejected'
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="approved">Aprobado</SelectItem>
                <SelectItem value="rejected">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tipo */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Registro</Label>
            <Select
              value={filters.type || 'all'}
              onValueChange={(value) =>
                setFilters({ 
                  ...filters, 
                  type: value === 'all' ? undefined : value as 'regular' | 'overtime' | 'remote' | 'on_site'
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="overtime">Horas Extra</SelectItem>
                <SelectItem value="remote">Remoto</SelectItem>
                <SelectItem value="on_site">Presencial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            <FileText className="h-4 w-4 mr-2" />
            {isLoading ? 'Generando...' : 'Generar Reporte'}
          </Button>
          
          {canExport && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleExport}
                disabled={isLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleExportPdf}
                disabled={isLoading}
              >
                <FileDown className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            </>
          )}
        </div>
      </form>
    </Card>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TimeEntry } from '@/types/time-entry';
import { timeEntryService } from '@/lib/time-entry-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, RefreshCw, Coffee, CheckCircle2, XCircle, Timer, Laptop, Building } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TimeEntryHistory() {
  const { isAuthenticated } = useAuth();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters - Default to current month
  const now = new Date();
  const [startDate, setStartDate] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
  );

  const loadEntries = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await timeEntryService.getMyEntries({ 
        start_date: startDate, 
        end_date: endDate 
      });
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load entries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadEntries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, startDate, endDate]);

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '—';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusBadge = (status: TimeEntry['status']) => {
    switch (status) {
      case 'active':
        return { variant: 'default' as const, label: 'Activo', icon: Timer };
      case 'completed':
        return { variant: 'secondary' as const, label: 'Completado', icon: CheckCircle2 };
      case 'approved':
        return { variant: 'default' as const, label: 'Aprobado', icon: CheckCircle2, className: 'bg-green-500 hover:bg-green-600' };
      case 'rejected':
        return { variant: 'destructive' as const, label: 'Rechazado', icon: XCircle };
      default:
        return { variant: 'secondary' as const, label: status, icon: Clock };
    }
  };

  const getTypeIcon = (type: TimeEntry['type']) => {
    switch (type) {
      case 'remote':
        return { icon: Laptop, label: 'Remoto', color: 'text-blue-600' };
      case 'on_site':
        return { icon: Building, label: 'Presencial', color: 'text-purple-600' };
      case 'overtime':
        return { icon: Clock, label: 'Horas Extra', color: 'text-amber-600' };
      default:
        return { icon: Clock, label: 'Regular', color: 'text-gray-600' };
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">{error}</div>
          <Button onClick={loadEntries} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Historial de Registros
            </CardTitle>
            <CardDescription>Tus entradas de tiempo recientes</CardDescription>
          </div>
          <Button onClick={loadEntries} variant="outline" size="sm" className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
        
        {/* Date Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Desde</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Hasta</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              No hay registros
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              No se encontraron registros para el período seleccionado
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => {
              const statusBadge = getStatusBadge(entry.status);
              const typeInfo = getTypeIcon(entry.type);
              const StatusIcon = statusBadge.icon;
              const TypeIcon = typeInfo.icon;
              
              return (
                <div
                  key={entry.id}
                  className={cn(
                    "group relative p-4 sm:p-5 rounded-xl border transition-all duration-200",
                    "hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5",
                    "bg-card"
                  )}
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{formatDate(entry.date)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <TypeIcon className={cn("h-3.5 w-3.5", typeInfo.color)} />
                          <span className="text-xs text-muted-foreground">{typeInfo.label}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Badge 
                      variant={statusBadge.variant} 
                      className={cn("gap-1.5 px-3 py-1", statusBadge.className)}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {statusBadge.label}
                    </Badge>
                  </div>

                  {/* Time Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">Horario</p>
                        <p className="font-mono text-sm font-medium truncate">
                          {formatTime(entry.clock_in)}
                          {entry.clock_out && ` - ${formatTime(entry.clock_out)}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                      <Timer className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Total Trabajado</p>
                        <p className="font-mono text-sm font-bold text-primary">
                          {formatDuration(entry.total_worked_minutes)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Breaks */}
                  {entry.breaks.length > 0 && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-3">
                      <Coffee className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <div className="flex-1">
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                          {entry.breaks.length} descanso{entry.breaks.length > 1 ? 's' : ''}
                        </p>
                        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                          Total: {formatDuration(
                            entry.breaks.reduce((sum, b) => sum + (b.duration_minutes || 0), 0)
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {entry.notes && (
                    <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                      <p className="text-sm text-muted-foreground italic">
                        &ldquo;{entry.notes}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

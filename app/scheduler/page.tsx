'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  PlayCircle, 
  PauseCircle,
  CheckCircle,
  XCircle,
  Calendar,
  Bell,
  RefreshCw,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data - en producción vendría del backend
const getScheduledTasks = () => {
  const now = new Date();
  return [
    {
      id: 1,
      name: 'Procesar Recordatorios',
      command: 'reminders:process',
      description: 'Envía recordatorios programados según su configuración',
      frequency: 'Cada minuto',
      expression: '* * * * *',
      status: 'active' as const,
      next_run: new Date(now.getTime() + 60000).toISOString(),
      last_run: now.toISOString(),
      last_status: 'success' as const,
    },
    {
      id: 2,
      name: 'Limpiar Logs Antiguos',
      command: 'audit:clean',
      description: 'Elimina logs de auditoría mayores a 365 días',
      frequency: 'Mensual',
      expression: '0 2 1 * *',
      status: 'active' as const,
      next_run: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      last_run: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      last_status: 'success' as const,
    },
  ];
};

export default function SchedulerPage() {
  const [loading, setLoading] = useState(false);
  const scheduledTasks = getScheduledTasks();

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

  const getTimeUntilNextRun = (nextRun: string) => {
    const now = new Date().getTime();
    const next = new Date(nextRun).getTime();
    const diff = next - now;

    if (diff < 0) return 'Ahora';

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `En ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `En ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `En ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return 'Menos de 1 minuto';
  };

  const handleRunNow = (_taskId: number) => {
    setLoading(true);
    const promise = new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.promise(
      promise,
      {
        loading: 'Ejecutando tarea...',
        success: 'Tarea ejecutada correctamente',
        error: 'Error al ejecutar la tarea',
      }
    );
    
    promise.finally(() => setLoading(false));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Laravel Scheduler</h1>
              <p className="text-sm text-gray-600">
                Monitor y gestión de tareas programadas
              </p>
            </div>
          </div>
          <Button variant="outline" disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tareas Activas</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Próxima Ejecución</p>
              <p className="text-lg font-bold text-gray-900">~1 min</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ejecutadas Hoy</p>
              <p className="text-2xl font-bold text-gray-900">1,440</p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Errores Hoy</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Scheduled Tasks List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Tareas Programadas</h2>
        </div>

        {scheduledTasks.map((task) => (
          <Card key={task.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    task.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Bell className={`h-5 w-5 ${
                      task.status === 'active' ? 'text-green-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{task.name}</h3>
                    <p className="text-sm text-gray-500">
                      <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                        {task.command}
                      </code>
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === 'active'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    {task.status === 'active' ? 'Activo' : 'Pausado'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">{task.description}</p>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Frecuencia</p>
                    <p className="text-sm font-medium text-gray-900">{task.frequency}</p>
                    <p className="text-xs text-gray-400 font-mono">{task.expression}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Próxima Ejecución</p>
                    <p className="text-sm font-medium text-gray-900">
                      {getTimeUntilNextRun(task.next_run)}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(task.next_run)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Última Ejecución</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(task.last_run)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Estado</p>
                    <div className="flex items-center gap-1">
                      {task.last_status === 'success' ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">Exitoso</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-600 font-medium">Error</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRunNow(task.id)}
                  disabled={loading}
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Ejecutar Ahora
                </Button>
                {task.status === 'active' ? (
                  <Button size="sm" variant="outline">
                    <PauseCircle className="h-4 w-4 mr-2" />
                    Pausar
                  </Button>
                ) : (
                  <Button size="sm" variant="outline">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Reanudar
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">
              ¿Cómo funciona el Scheduler?
            </h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>
                <strong>En desarrollo:</strong> Ejecuta{' '}
                <code className="bg-blue-100 px-2 py-0.5 rounded">php artisan schedule:work</code>
              </p>
              <p>
                <strong>En producción:</strong> Agrega al crontab:{' '}
                <code className="bg-blue-100 px-2 py-0.5 rounded">
                  * * * * * cd /ruta/proyecto && php artisan schedule:run &gt;&gt; /dev/null 2&gt;&amp;1
                </code>
              </p>
              <p>
                <strong>Probar comando:</strong>{' '}
                <code className="bg-blue-100 px-2 py-0.5 rounded">
                  php artisan reminders:test [ID]
                </code>
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

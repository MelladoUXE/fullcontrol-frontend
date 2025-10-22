'use client';

import { useState, useEffect } from 'react';
import { usePermission } from '@/hooks/usePermissions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Plus, 
  Pencil, 
  Trash2, 
  Power, 
  Clock,
  Calendar,
  Users
} from 'lucide-react';
import { reminderService } from '@/lib/reminder-service';
import { Reminder, REMINDER_TYPES, REMINDER_FREQUENCIES, WEEKDAYS } from '@/types/reminder';
import { toast } from 'sonner';
import ReminderDialog from '@/components/reminder-dialog';
import { CardSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';

export default function RemindersPage() {
  // Permission checks
  const canCreateReminders = usePermission('reminders.create');
  const canEditReminders = usePermission('reminders.edit');
  const canDeleteReminders = usePermission('reminders.delete');
  
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      setLoading(true);
      const data = await reminderService.getAll();
      setReminders(data);
    } catch {
      toast.error('Error al cargar recordatorios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    if (!canCreateReminders) {
      toast.error('No tienes permisos para crear recordatorios');
      return;
    }
    setEditingReminder(null);
    setDialogOpen(true);
  };

  const handleEdit = (reminder: Reminder) => {
    if (!canEditReminders) {
      toast.error('No tienes permisos para editar recordatorios');
      return;
    }
    setEditingReminder(reminder);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!canDeleteReminders) {
      toast.error('No tienes permisos para eliminar recordatorios');
      return;
    }

    if (!confirm('¿Estás seguro de eliminar este recordatorio?')) return;

    try {
      await reminderService.delete(id);
      toast.success('Recordatorio eliminado');
      loadReminders();
    } catch {
      toast.error('Error al eliminar recordatorio');
    }
  };

  const handleToggleActive = async (id: number) => {
    if (!canEditReminders) {
      toast.error('No tienes permisos para cambiar el estado');
      return;
    }

    try {
      await reminderService.toggleActive(id);
      toast.success('Estado actualizado');
      loadReminders();
    } catch {
      toast.error('Error al cambiar estado');
    }
  };

  const handleSave = () => {
    setDialogOpen(false);
    loadReminders();
  };

  const getFrequencyDisplay = (reminder: Reminder) => {
    if (reminder.frequency === 'daily') return 'Diario';
    if (reminder.frequency === 'weekly' && reminder.days) {
      const dayNames = reminder.days.map(d => WEEKDAYS.find(w => w.value === d)?.label || d);
      return `Semanal: ${dayNames.join(', ')}`;
    }
    if (reminder.frequency === 'monthly' && reminder.day_of_month) {
      return `Mensual: día ${reminder.day_of_month}`;
    }
    return REMINDER_FREQUENCIES[reminder.frequency];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
              <Bell className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Recordatorios Automáticos</h1>
              <p className="text-purple-100">
                Configura notificaciones automáticas para tu equipo
              </p>
            </div>
          </div>
          {canCreateReminders && (
            <Button
              onClick={handleCreate}
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Recordatorio
            </Button>
          )}
        </div>
      </Card>

      {/* Lista de Recordatorios */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : reminders.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No hay recordatorios configurados"
          description="Crea tu primer recordatorio para automatizar notificaciones"
          actionLabel={canCreateReminders ? 'Crear Recordatorio' : undefined}
          onAction={canCreateReminders ? handleCreate : undefined}
          variant="card"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reminders.map((reminder) => (
            <Card
              key={reminder.id}
              className="p-6 shadow-lg hover:shadow-xl transition-all"
            >
              {/* Header del card */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge 
                      status={reminder.is_active ? 'active' : 'inactive'} 
                      pulse={reminder.is_active}
                    >
                      {reminder.is_active ? 'Activo' : 'Inactivo'}
                    </StatusBadge>
                    <h3 className="font-semibold text-lg">
                      {REMINDER_TYPES[reminder.type]}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {reminder.message || 'Sin mensaje personalizado'}
                  </p>
                </div>
              </div>

              {/* Detalles */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">{reminder.time}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span>{getFrequencyDisplay(reminder)}</span>
                </div>

                {reminder.user && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span>Para: {reminder.user.name}</span>
                  </div>
                )}

                {reminder.last_sent_at && (
                  <div className="text-xs text-gray-500">
                    Último envío: {new Date(reminder.last_sent_at).toLocaleString('es-ES')}
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="flex gap-2 pt-4 border-t">
                {canEditReminders && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(reminder.id)}
                    className="flex-1"
                  >
                    <Power className="h-4 w-4 mr-1" />
                    {reminder.is_active ? 'Desactivar' : 'Activar'}
                  </Button>
                )}
                {canEditReminders && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(reminder)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {canDeleteReminders && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(reminder.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de crear/editar */}
      <ReminderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        reminder={editingReminder}
        onSave={handleSave}
      />
    </div>
  );
}

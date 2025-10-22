'use client';

import { useState, useEffect } from 'react';
import { usePermission } from '@/hooks/usePermissions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Clock, Coffee, Calendar as CalendarIcon } from 'lucide-react';
import { shiftService } from '@/lib/shift-service';
import { ShiftTemplate } from '@/types/shift';
import { toast } from 'sonner';
import ShiftTemplateDialog from './shift-template-dialog';

export default function ShiftTemplatesTab() {
  // Permission checks
  const canCreateShifts = usePermission('shifts.create');
  const canEditShifts = usePermission('shifts.edit');
  const canDeleteShifts = usePermission('shifts.delete');
  
  const [templates, setTemplates] = useState<ShiftTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ShiftTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await shiftService.getTemplates();
      setTemplates(data);
    } catch {
      toast.error('Error al cargar plantillas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    if (!canCreateShifts) {
      toast.error('No tienes permisos para crear plantillas de turnos');
      return;
    }
    setEditingTemplate(null);
    setDialogOpen(true);
  };

  const handleEdit = (template: ShiftTemplate) => {
    if (!canEditShifts) {
      toast.error('No tienes permisos para editar plantillas de turnos');
      return;
    }
    setEditingTemplate(template);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!canDeleteShifts) {
      toast.error('No tienes permisos para eliminar plantillas de turnos');
      return;
    }

    if (!confirm('¿Estás seguro de eliminar esta plantilla?')) return;

    try {
      await shiftService.deleteTemplate(id);
      toast.success('Plantilla eliminada');
      loadTemplates();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al eliminar plantilla';
      toast.error(message);
    }
  };

  const handleSave = () => {
    setDialogOpen(false);
    loadTemplates();
  };

  const calculateDuration = (start: string, end: string, breakMinutes: number) => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    let minutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    if (minutes < 0) minutes += 24 * 60; // Si cruza medianoche
    
    minutes -= breakMinutes;
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Plantillas de Turnos</h2>
          <p className="text-gray-600">Define los horarios que luego asignarás a tus empleados</p>
        </div>
        {canCreateShifts && (
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Plantilla
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando plantillas...</p>
        </div>
      ) : templates.length === 0 ? (
        <Card className="p-12 text-center">
          <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No hay plantillas configuradas
          </h3>
          <p className="text-gray-500 mb-6">
            Crea tu primera plantilla de turno para empezar
          </p>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Plantilla
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="p-6 shadow-lg hover:shadow-xl transition-all"
            >
              {/* Color badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: template.color }}
                    />
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                  </div>
                  {template.description && (
                    <p className="text-sm text-gray-600">{template.description}</p>
                  )}
                </div>
              </div>

              {/* Horario */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-indigo-600" />
                  <span className="font-medium">
                    {template.start_time} - {template.end_time}
                  </span>
                </div>

                {template.break_minutes > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Coffee className="h-4 w-4 text-indigo-600" />
                    <span>{template.break_minutes} min descanso</span>
                  </div>
                )}

                <div className="text-sm text-gray-600">
                  Duración:{' '}
                  <span className="font-medium">
                    {calculateDuration(
                      template.start_time,
                      template.end_time,
                      template.break_minutes
                    )}
                  </span>
                </div>

                {!template.is_active && (
                  <div className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    Inactivo
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="flex gap-2 pt-4 border-t">
                {canEditShifts && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(template)}
                    className="flex-1"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                )}
                {canDeleteShifts && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(template.id)}
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

      <ShiftTemplateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        template={editingTemplate}
        onSave={handleSave}
      />
    </>
  );
}

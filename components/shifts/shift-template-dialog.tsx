'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { shiftService } from '@/lib/shift-service';
import { ShiftTemplate, ShiftTemplateFormData, PRESET_COLORS, PRESET_SHIFTS } from '@/types/shift';
import { toast } from 'sonner';

interface ShiftTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: ShiftTemplate | null;
  onSave: () => void;
}

export default function ShiftTemplateDialog({
  open,
  onOpenChange,
  template,
  onSave,
}: ShiftTemplateDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ShiftTemplateFormData>({
    name: '',
    color: '#3b82f6',
    start_time: '09:00',
    end_time: '17:00',
    break_minutes: 0,
    is_active: true,
  });

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        color: template.color,
        start_time: template.start_time,
        end_time: template.end_time,
        break_minutes: template.break_minutes,
        is_active: template.is_active,
        description: template.description,
      });
    } else {
      setFormData({
        name: '',
        color: '#3b82f6',
        start_time: '09:00',
        end_time: '17:00',
        break_minutes: 0,
        is_active: true,
      });
    }
  }, [template, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (template) {
        await shiftService.updateTemplate(template.id, formData);
        toast.success('Plantilla actualizada');
      } else {
        await shiftService.createTemplate(formData);
        toast.success('Plantilla creada');
      }
      onSave();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar plantilla');
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset: typeof PRESET_SHIFTS[0]) => {
    setFormData({
      ...formData,
      name: preset.name,
      start_time: preset.start_time,
      end_time: preset.end_time,
      break_minutes: preset.break_minutes,
      color: preset.color,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Editar Plantilla' : 'Nueva Plantilla de Turno'}
          </DialogTitle>
          <DialogDescription>
            Define un horario que luego podrás asignar a tus empleados
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Presets (solo en crear) */}
          {!template && (
            <div className="space-y-2">
              <Label>Plantillas Predefinidas</Label>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_SHIFTS.map((preset, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset)}
                    className="justify-start gap-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: preset.color }}
                    />
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Turno</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Turno Mañana"
              required
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="grid grid-cols-8 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-gray-900' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <Input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-20 h-10"
            />
          </div>

          {/* Horarios */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Hora Inicio</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">Hora Fin</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Descanso */}
          <div className="space-y-2">
            <Label htmlFor="break_minutes">Minutos de Descanso</Label>
            <Input
              id="break_minutes"
              type="number"
              min="0"
              max="480"
              step="5"
              value={formData.break_minutes}
              onChange={(e) =>
                setFormData({ ...formData, break_minutes: parseInt(e.target.value) || 0 })
              }
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción (Opcional)</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Añade notas sobre este turno..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : template ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

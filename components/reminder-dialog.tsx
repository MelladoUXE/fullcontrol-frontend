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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { reminderService } from '@/lib/reminder-service';
import { 
  Reminder, 
  ReminderFormData, 
  ReminderType,
  ReminderFrequency,
  REMINDER_TYPES, 
  REMINDER_FREQUENCIES,
  WEEKDAYS 
} from '@/types/reminder';
import { toast } from 'sonner';

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reminder: Reminder | null;
  onSave: () => void;
}

export default function ReminderDialog({ open, onOpenChange, reminder, onSave }: ReminderDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ReminderFormData>({
    type: 'clock_in',
    frequency: 'daily',
    time: '09:00',
    is_active: true,
  });

  useEffect(() => {
    if (reminder) {
      setFormData({
        type: reminder.type,
        frequency: reminder.frequency,
        time: reminder.time,
        days: reminder.days,
        day_of_month: reminder.day_of_month,
        message: reminder.message,
        recipients: reminder.recipients,
        is_active: reminder.is_active,
        user_id: reminder.user_id,
      });
    } else {
      setFormData({
        type: 'clock_in',
        frequency: 'daily',
        time: '09:00',
        is_active: true,
      });
    }
  }, [reminder, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (reminder) {
        await reminderService.update(reminder.id, formData);
        toast.success('Recordatorio actualizado');
      } else {
        await reminderService.create(formData);
        toast.success('Recordatorio creado');
      }
      onSave();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar recordatorio');
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (day: number) => {
    const currentDays = formData.days || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day].sort();
    setFormData({ ...formData, days: newDays });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {reminder ? 'Editar Recordatorio' : 'Nuevo Recordatorio'}
          </DialogTitle>
          <DialogDescription>
            Configura las notificaciones automáticas para tu equipo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de recordatorio */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Recordatorio</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as ReminderType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(REMINDER_TYPES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Frecuencia */}
          <div className="space-y-2">
            <Label htmlFor="frequency">Frecuencia</Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) => setFormData({ ...formData, frequency: value as ReminderFrequency })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(REMINDER_FREQUENCIES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hora */}
          <div className="space-y-2">
            <Label htmlFor="time">Hora</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>

          {/* Días de la semana (solo si es semanal) */}
          {formData.frequency === 'weekly' && (
            <div className="space-y-2">
              <Label>Días de la Semana</Label>
              <div className="grid grid-cols-2 gap-3">
                {WEEKDAYS.map((day) => (
                  <div key={day.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day.value}`}
                      checked={(formData.days || []).includes(day.value)}
                      onCheckedChange={() => handleDayToggle(day.value)}
                    />
                    <label
                      htmlFor={`day-${day.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {day.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Día del mes (solo si es mensual) */}
          {formData.frequency === 'monthly' && (
            <div className="space-y-2">
              <Label htmlFor="day_of_month">Día del Mes</Label>
              <Input
                id="day_of_month"
                type="number"
                min="1"
                max="31"
                value={formData.day_of_month || ''}
                onChange={(e) => setFormData({ ...formData, day_of_month: parseInt(e.target.value) })}
                placeholder="1-31"
                required
              />
            </div>
          )}

          {/* Mensaje personalizado */}
          <div className="space-y-2">
            <Label htmlFor="message">Mensaje Personalizado (Opcional)</Label>
            <Textarea
              id="message"
              value={formData.message || ''}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Escribe un mensaje personalizado para este recordatorio..."
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
              {loading ? 'Guardando...' : reminder ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { shiftService } from '@/lib/shift-service';
import { userService } from '@/lib/user-service';
import { ShiftTemplate, AssignShiftData, WEEKDAYS } from '@/types/shift';
import { toast } from 'sonner';

interface AssignShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export default function AssignShiftDialog({ open, onOpenChange, onSave }: AssignShiftDialogProps) {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<ShiftTemplate[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [mode, setMode] = useState<'single' | 'range'>('single');
  
  const [formData, setFormData] = useState<any>({
    user_id: '',
    shift_template_id: '',
    date: new Date().toISOString().split('T')[0],
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    days: [1, 2, 3, 4, 5], // lunes a viernes por defecto
  });

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    try {
      const [templatesData, usersData] = await Promise.all([
        shiftService.getTemplates(),
        userService.getUsersByCompany(),
      ]);
      setTemplates(templatesData.filter((t) => t.is_active));
      setUsers(usersData.filter((u: any) => u.is_active));
    } catch (error) {
      toast.error('Error al cargar datos');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'single') {
        await shiftService.assignShift({
          user_id: parseInt(formData.user_id),
          shift_template_id: parseInt(formData.shift_template_id),
          date: formData.date,
        });
        toast.success('Turno asignado');
      } else {
        await shiftService.assignShiftRange({
          user_id: parseInt(formData.user_id),
          shift_template_id: parseInt(formData.shift_template_id),
          start_date: formData.start_date,
          end_date: formData.end_date,
          days: formData.days,
        });
        toast.success('Turnos asignados correctamente');
      }
      onSave();
    } catch (error: any) {
      toast.error(error.message || 'Error al asignar turno');
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (day: number) => {
    const currentDays = formData.days || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d: number) => d !== day)
      : [...currentDays, day].sort();
    setFormData({ ...formData, days: newDays });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Asignar Turno</DialogTitle>
          <DialogDescription>
            Asigna un turno a un empleado para una fecha específica o rango de fechas
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Modo */}
          <div className="space-y-2">
            <Label>Modo de Asignación</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={mode === 'single' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('single')}
                className="flex-1"
              >
                Día Único
              </Button>
              <Button
                type="button"
                variant={mode === 'range' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('range')}
                className="flex-1"
              >
                Rango de Fechas
              </Button>
            </div>
          </div>

          {/* Empleado */}
          <div className="space-y-2">
            <Label htmlFor="user_id">Empleado</Label>
            <Select
              value={formData.user_id}
              onValueChange={(value) => setFormData({ ...formData, user_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un empleado" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name} - {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Plantilla de turno */}
          <div className="space-y-2">
            <Label htmlFor="shift_template_id">Plantilla de Turno</Label>
            <Select
              value={formData.shift_template_id}
              onValueChange={(value) => setFormData({ ...formData, shift_template_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un turno" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id.toString()}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: template.color }}
                      />
                      {template.name} ({template.start_time} - {template.end_time})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fecha única */}
          {mode === 'single' && (
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          )}

          {/* Rango de fechas */}
          {mode === 'range' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Fecha Inicio</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">Fecha Fin</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    min={formData.start_date}
                    required
                  />
                </div>
              </div>

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
            </>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !formData.user_id || !formData.shift_template_id}>
              {loading ? 'Asignando...' : 'Asignar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

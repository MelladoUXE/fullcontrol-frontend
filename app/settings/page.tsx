'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CompanySettings, WEEKDAYS, TIMEZONES, UpdateCompanySettingsData } from '@/types/company-settings';
import { companySettingsService } from '@/lib/company-settings-service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Clock, 
  Calendar, 
  DollarSign, 
  Coffee, 
  Save,
  Globe,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function CompanySettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [newHoliday, setNewHoliday] = useState('');

  useEffect(() => {
    if (user?.company_id) {
      loadSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadSettings = async () => {
    if (!user?.company_id) {
      toast.error('No se encontró la empresa del usuario');
      return;
    }

    try {
      setLoading(true);
      const data = await companySettingsService.getSettings(user.company_id);
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      const updateData: UpdateCompanySettingsData = {
        work_start_time: settings.work_start_time,
        work_end_time: settings.work_end_time,
        working_days: settings.working_days,
        overtime_multiplier: settings.overtime_multiplier,
        max_overtime_hours_per_day: settings.max_overtime_hours_per_day,
        max_overtime_hours_per_week: settings.max_overtime_hours_per_week,
        min_break_minutes: settings.min_break_minutes,
        max_break_minutes: settings.max_break_minutes,
        break_required: settings.break_required,
        holidays: settings.holidays,
        timezone: settings.timezone,
      };

      if (!user?.company_id) {
        toast.error('No se encontró la empresa del usuario');
        return;
      }

      await companySettingsService.updateSettings(user.company_id, updateData);
      toast.success('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const toggleWorkingDay = (day: number) => {
    if (!settings) return;
    const days = settings.working_days.includes(day)
      ? settings.working_days.filter(d => d !== day)
      : [...settings.working_days, day].sort();
    setSettings({ ...settings, working_days: days });
  };

  const addHoliday = () => {
    if (!settings || !newHoliday) return;
    if (settings.holidays.includes(newHoliday)) {
      toast.error('Este festivo ya está agregado');
      return;
    }
    setSettings({ ...settings, holidays: [...settings.holidays, newHoliday].sort() });
    setNewHoliday('');
  };

  const removeHoliday = (holiday: string) => {
    if (!settings) return;
    setSettings({ ...settings, holidays: settings.holidays.filter(h => h !== holiday) });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 text-amber-600">
          <AlertCircle className="h-5 w-5" />
          <p>No se pudo cargar la configuración</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">Configuración de Empresa</h1>
        <p className="text-blue-100">Administra horarios, políticas y preferencias de tu organización</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horarios Laborales */}
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Horarios Laborales</h2>
              <p className="text-sm text-gray-500">Define tu jornada laboral estándar</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="work_start_time">Hora de Entrada</Label>
              <Input
                id="work_start_time"
                type="time"
                value={settings.work_start_time}
                onChange={(e) => setSettings({ ...settings, work_start_time: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="work_end_time">Hora de Salida</Label>
              <Input
                id="work_end_time"
                type="time"
                value={settings.work_end_time}
                onChange={(e) => setSettings({ ...settings, work_end_time: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        {/* Días Laborables */}
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Días Laborables</h2>
              <p className="text-sm text-gray-500">Selecciona los días de trabajo</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {WEEKDAYS.map((day) => (
              <button
                key={day.value}
                onClick={() => toggleWorkingDay(day.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  settings.working_days.includes(day.value)
                    ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Horas Extras */}
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Políticas de Horas Extras</h2>
              <p className="text-sm text-gray-500">Configura límites y multiplicadores</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="overtime_multiplier">Multiplicador de Horas Extras</Label>
              <Input
                id="overtime_multiplier"
                type="number"
                step="0.01"
                min="1"
                max="3"
                value={settings.overtime_multiplier}
                onChange={(e) => setSettings({ ...settings, overtime_multiplier: parseFloat(e.target.value) })}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Ej: 1.50 = +50% del salario normal</p>
            </div>
            <div>
              <Label htmlFor="max_overtime_day">Máximo de Horas Extras por Día</Label>
              <Input
                id="max_overtime_day"
                type="number"
                min="0"
                max="12"
                value={settings.max_overtime_hours_per_day}
                onChange={(e) => setSettings({ ...settings, max_overtime_hours_per_day: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="max_overtime_week">Máximo de Horas Extras por Semana</Label>
              <Input
                id="max_overtime_week"
                type="number"
                min="0"
                max="60"
                value={settings.max_overtime_hours_per_week}
                onChange={(e) => setSettings({ ...settings, max_overtime_hours_per_week: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        {/* Descansos */}
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Coffee className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Políticas de Descansos</h2>
              <p className="text-sm text-gray-500">Administra tiempos de descanso</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="break_required">Descanso Obligatorio</Label>
              <Switch
                id="break_required"
                checked={settings.break_required}
                onCheckedChange={(checked) => setSettings({ ...settings, break_required: checked })}
              />
            </div>
            <div>
              <Label htmlFor="min_break">Descanso Mínimo (minutos)</Label>
              <Input
                id="min_break"
                type="number"
                min="0"
                max="240"
                value={settings.min_break_minutes}
                onChange={(e) => setSettings({ ...settings, min_break_minutes: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="max_break">Descanso Máximo (minutos)</Label>
              <Input
                id="max_break"
                type="number"
                min="0"
                max="480"
                value={settings.max_break_minutes}
                onChange={(e) => setSettings({ ...settings, max_break_minutes: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        {/* Zona Horaria */}
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Zona Horaria</h2>
              <p className="text-sm text-gray-500">Configura tu región</p>
            </div>
          </div>

          <div>
            <Label htmlFor="timezone">Zona Horaria</Label>
            <select
              id="timezone"
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Festivos */}
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Festivos</h2>
              <p className="text-sm text-gray-500">Días no laborables del año</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                type="date"
                value={newHoliday}
                onChange={(e) => setNewHoliday(e.target.value)}
                placeholder="Seleccionar fecha"
              />
              <Button onClick={addHoliday} disabled={!newHoliday}>
                Agregar
              </Button>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {settings.holidays.map((holiday) => (
                <div
                  key={holiday}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm">{new Date(holiday + 'T00:00:00').toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHoliday(holiday)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Eliminar
                  </Button>
                </div>
              ))}
              {settings.holidays.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay festivos configurados
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
        >
          <Save className="h-5 w-5 mr-2" />
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </div>
    </div>
  );
}

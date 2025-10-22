'use client';

import { useState, useEffect } from 'react';
import { usePermission } from '@/hooks/usePermissions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { shiftService } from '@/lib/shift-service';
import { UserShift } from '@/types/shift';
import { toast } from 'sonner';
import AssignShiftDialog from './assign-shift-dialog';

export default function ShiftCalendarTab() {
  // Permission check
  const canAssignShifts = usePermission('shifts.assign');
  
  const [shifts, setShifts] = useState<UserShift[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const loadShifts = async () => {
    try {
      setLoading(true);
      // Obtener primer y último día del mes actual
      const firstDay = new Date(currentYear, currentMonth, 1);
      const lastDay = new Date(currentYear, currentMonth + 1, 0);

      const startDate = firstDay.toISOString().split('T')[0];
      const endDate = lastDay.toISOString().split('T')[0];
      
      const data = await shiftService.getCompanyShifts(startDate, endDate);
      setShifts(data);
    } catch {
      toast.error('Error al cargar turnos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShifts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  const handleSave = () => {
    setDialogOpen(false);
    loadShifts();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Generar días del calendario
  const getDaysInMonth = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 = domingo
    
    // Ajustar para que lunes sea el primer día (1 = lunes, 0 = domingo)
    const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    
    const days = [];
    
    // Días vacíos al inicio
    for (let i = 0; i < adjustedStartDay; i++) {
      days.push(null);
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  // Agrupar turnos por fecha
  const getShiftsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return shifts.filter(shift => {
      // El backend devuelve fecha como "2025-10-22T00:00:00.000000Z"
      // Extraer solo la parte de la fecha (YYYY-MM-DD)
      const shiftDate = shift.date.split('T')[0];
      return shiftDate === dateStr;
    });
  };

  const monthName = new Date(currentYear, currentMonth, 1).toLocaleDateString('es-ES', { 
    month: 'long', 
    year: 'numeric' 
  });

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const days = getDaysInMonth();
  const today = new Date();
  const isToday = (day: number) => {
    return day === today.getDate() && 
           currentMonth === today.getMonth() && 
           currentYear === today.getFullYear();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold capitalize">{monthName}</h2>
          <p className="text-gray-600">Calendario de turnos asignados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          {canAssignShifts && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Asignar Turno
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando turnos...</p>
        </div>
      ) : (
        <Card className="p-6">
          {/* Header días de la semana */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Grid del calendario */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="h-24" />;
              }

              const dayShifts = getShiftsForDay(day);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={day}
                  className={`h-24 border rounded-lg p-2 flex flex-col ${
                    isCurrentDay ? 'bg-indigo-50 border-indigo-500 border-2' : 'bg-white'
                  } hover:border-indigo-300 transition-colors overflow-hidden`}
                >
                  <div className={`text-sm font-semibold mb-1 ${isCurrentDay ? 'text-indigo-600' : 'text-gray-700'}`}>
                    {day}
                  </div>
                  <div className="flex-1 space-y-1 overflow-y-auto">
                    {dayShifts.slice(0, 3).map((shift) => (
                      <div
                        key={shift.id}
                        className="text-xs p-1 rounded truncate"
                        style={{ 
                          backgroundColor: shift.shift_template?.color + '20',
                          borderLeft: `3px solid ${shift.shift_template?.color}`
                        }}
                        title={`${shift.user?.name} - ${shift.shift_template?.name} (${shift.start_time || shift.shift_template?.start_time})`}
                      >
                        <div className="font-medium truncate">{shift.user?.name}</div>
                      </div>
                    ))}
                    {dayShifts.length > 3 && (
                      <div className="text-xs text-gray-500 px-1">
                        +{dayShifts.length - 3} más
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <AssignShiftDialog open={dialogOpen} onOpenChange={setDialogOpen} onSave={handleSave} />
    </>
  );
}

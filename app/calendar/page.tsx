'use client';

import { useState, useEffect } from 'react';
import { CalendarView } from '@/components/calendar-view';
import { EventDetailsModal } from '@/components/event-details-modal';
import { CalendarEvent } from '@/types/calendar';
import { calendarService } from '@/lib/calendar-service';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, RefreshCw, Filter, Users } from 'lucide-react';
import { toast } from 'sonner';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export default function CalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterUserId, setFilterUserId] = useState<number | undefined>();

  const isManager = user?.role === 'manager' || user?.role === 'admin';

  const loadEvents = async () => {
    try {
      setLoading(true);
      const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');
      
      const calendarEvents = await calendarService.getCalendarEvents(start, end, filterUserId);
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error loading calendar events:', error);
      toast.error('Error al cargar eventos del calendario');
    } finally {
      setLoading(false);
    }
  };

  // Load events on mount and when filters change
  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, filterUserId]);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/20 p-3 backdrop-blur-sm">
              <Calendar className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Calendario</h1>
              <p className="text-blue-100">Vista de registros y eventos</p>
            </div>
          </div>

          <Button
            onClick={loadEvents}
            disabled={loading}
            variant="secondary"
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Filters */}
      {isManager && (
        <Card className="p-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Filter className="h-4 w-4" />
              Filtros:
            </div>

            <Select
              value={filterUserId?.toString() || 'all'}
              onValueChange={(value) => setFilterUserId(value === 'all' ? undefined : parseInt(value))}
            >
              <SelectTrigger className="w-[200px]">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <SelectValue placeholder="Todos los empleados" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los empleados</SelectItem>
                {/* TODO: Cargar lista de empleados dinámicamente */}
              </SelectContent>
            </Select>
          </div>
        </Card>
      )}

      {/* Legend */}
      <Card className="p-4 shadow-lg">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-yellow-500"></div>
            <span className="text-sm font-medium text-gray-700">Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-green-500"></div>
            <span className="text-sm font-medium text-gray-700">Aprobado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-red-500"></div>
            <span className="text-sm font-medium text-gray-700">Rechazado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-blue-500"></div>
            <span className="text-sm font-medium text-gray-700">Turno</span>
          </div>
        </div>
      </Card>

      {/* Calendar */}
      <CalendarView
        events={events}
        onSelectEvent={handleSelectEvent}
        defaultDate={currentDate}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

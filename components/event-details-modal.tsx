'use client';

import { CalendarEvent, EVENT_STATUS } from '@/types/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface EventDetailsModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailsModal({ event, isOpen, onClose }: EventDetailsModalProps) {
  if (!event) return null;

  const statusConfig = EVENT_STATUS.find(s => s.value === event.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Detalles del Evento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Status Badge */}
          {event.status && statusConfig && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Estado:</span>
              <Badge 
                style={{ 
                  backgroundColor: statusConfig.color,
                  color: 'white'
                }}
              >
                {statusConfig.label}
              </Badge>
            </div>
          )}

          {/* User */}
          {event.userName && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Empleado</p>
                <p className="text-base font-semibold text-gray-900">{event.userName}</p>
              </div>
            </div>
          )}

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="h-4 w-4" />
                Inicio
              </div>
              <p className="text-sm text-gray-900">
                {format(event.start, "d 'de' MMMM, yyyy", { locale: es })}
              </p>
              <p className="text-sm font-semibold text-blue-600">
                {format(event.start, 'HH:mm')}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="h-4 w-4" />
                Fin
              </div>
              <p className="text-sm text-gray-900">
                {format(event.end, "d 'de' MMMM, yyyy", { locale: es })}
              </p>
              <p className="text-sm font-semibold text-blue-600">
                {format(event.end, 'HH:mm')}
              </p>
            </div>
          </div>

          {/* Total Hours */}
          {event.totalHours !== undefined && (
            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total de Horas</span>
                <span className="text-2xl font-bold text-blue-600">
                  {event.totalHours.toFixed(2)}h
                </span>
              </div>
            </div>
          )}

          {/* Notes */}
          {event.notes && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="h-4 w-4" />
                Notas
              </div>
              <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-900">
                {event.notes}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

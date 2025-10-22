import { CalendarEvent } from '@/types/calendar';
import { TimeEntry } from '@/types/time-entry';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const calendarService = {
  async getCalendarEvents(startDate: string, endDate: string, userId?: number): Promise<CalendarEvent[]> {
    const token = localStorage.getItem('auth_token');
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    });
    
    if (userId) {
      params.append('user_id', userId.toString());
    }

    const response = await fetch(`${API_URL}/time-entries/company?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener eventos del calendario');
    }

    const data = await response.json();
    return this.transformTimeEntriesToEvents(data.data);
  },

  transformTimeEntriesToEvents(timeEntries: TimeEntry[]): CalendarEvent[] {
    return timeEntries.map(entry => {
      const start = new Date(entry.clock_in);
      const end = entry.clock_out ? new Date(entry.clock_out) : new Date();
      
      // Calculate total hours
      const totalHours = entry.clock_out 
        ? (end.getTime() - start.getTime()) / (1000 * 60 * 60)
        : 0;

      return {
        id: entry.id,
        title: `${entry.user?.name || 'Usuario'} - ${this.formatHours(totalHours)}h`,
        start,
        end,
        type: 'time_entry' as const,
        status: entry.status as 'pending' | 'approved' | 'rejected',
        userId: entry.user_id,
        userName: entry.user?.name,
        totalHours,
        notes: entry.notes || undefined,
      };
    });
  },

  formatHours(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}:${m.toString().padStart(2, '0')}` : `${h}`;
  },

  getEventColor(event: CalendarEvent): string {
    if (event.type === 'holiday') return '#ef4444';
    if (event.type === 'absence') return '#f59e0b';
    if (event.type === 'shift') return '#10b981';
    
    // For time entries, color by status
    switch (event.status) {
      case 'approved':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      case 'pending':
      default:
        return '#f59e0b';
    }
  },
};

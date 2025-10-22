'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TimeEntryStats as Stats } from '@/types/time-entry-stats';
import { timeEntryService } from '@/lib/time-entry-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, Coffee, TrendingUp } from 'lucide-react';

export function TimeEntryStats() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalWorkedMinutes: 0,
    totalEntries: 0,
    totalBreaks: 0,
    averageDailyMinutes: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
    }
  }, [isAuthenticated]);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      
      // Get current month entries
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      
      const entries = await timeEntryService.getMyEntries({ start_date: startDate, end_date: endDate });
      
      const totalWorkedMinutes = entries.reduce((sum, entry) => sum + (entry.total_worked_minutes || 0), 0);
      const totalBreaks = entries.reduce((sum, entry) => sum + entry.breaks.length, 0);
      const daysWithEntries = new Set(entries.map(e => e.date)).size;
      const averageDailyMinutes = daysWithEntries > 0 ? Math.round(totalWorkedMinutes / daysWithEntries) : 0;
      
      setStats({
        totalWorkedMinutes,
        totalEntries: entries.length,
        totalBreaks,
        averageDailyMinutes,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (!isAuthenticated) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Trabajado</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? '...' : formatHours(stats.totalWorkedMinutes)}
          </div>
          <p className="text-xs text-muted-foreground">Este mes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Registros</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? '...' : stats.totalEntries}
          </div>
          <p className="text-xs text-muted-foreground">Este mes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pausas</CardTitle>
          <Coffee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? '...' : stats.totalBreaks}
          </div>
          <p className="text-xs text-muted-foreground">Este mes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Promedio Diario</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? '...' : formatHours(stats.averageDailyMinutes)}
          </div>
          <p className="text-xs text-muted-foreground">Por día trabajado</p>
        </CardContent>
      </Card>
    </div>
  );
}

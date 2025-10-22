'use client';

import { useTimeEntry } from '@/contexts/TimeEntryContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { Coffee, Play, Square, Pause, Timer, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toastSuccess, toastError } from '@/lib/toast-utils';

export function TimeTracker() {
  const { isAuthenticated } = useAuth();
  const {
    activeEntry,
    isLoading,
    error,
    clockIn,
    clockOut,
    startBreak,
    endBreak,
    refreshActiveEntry,
    clearError,
  } = useTimeEntry();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (isAuthenticated) {
      refreshActiveEntry();
    }
  }, [isAuthenticated, refreshActiveEntry]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const elapsedTime = () => {
    if (!activeEntry?.clock_in) return '00:00:00';
    
    const clockInTime = new Date(activeEntry.clock_in);
    const diff = currentTime.getTime() - clockInTime.getTime();
    
    // Subtract break time
    const totalBreakMinutes = activeEntry.breaks.reduce((sum, b) => {
      if (b.duration_minutes) {
        return sum + b.duration_minutes;
      }
      // Active break - calculate duration
      if (b.break_start && !b.break_end) {
        const breakStart = new Date(b.break_start);
        const breakDiff = currentTime.getTime() - breakStart.getTime();
        return sum + Math.floor(breakDiff / 1000 / 60);
      }
      return sum;
    }, 0);
    
    const workedMs = diff - (totalBreakMinutes * 60 * 1000);
    const hours = Math.floor(workedMs / 1000 / 60 / 60);
    const minutes = Math.floor((workedMs / 1000 / 60) % 60);
    const seconds = Math.floor((workedMs / 1000) % 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const activeBreak = activeEntry?.breaks.find(b => !b.break_end);

  const handleClockIn = async () => {
    try {
      await clockIn('regular');
      toastSuccess('¡Jornada iniciada!', 'Tu tiempo está siendo registrado');
    } catch (err) {
      toastError('Error al iniciar jornada', err instanceof Error ? err.message : 'Intenta de nuevo');
      console.error(err);
    }
  };

  const handleClockOut = async () => {
    try {
      await clockOut();
      toastSuccess('¡Jornada finalizada!', 'Tu tiempo ha sido guardado correctamente');
    } catch (err) {
      toastError('Error al finalizar jornada', err instanceof Error ? err.message : 'Intenta de nuevo');
      console.error(err);
    }
  };

  const handleStartBreak = async (type: 'meal' | 'rest' | 'personal' | 'other') => {
    try {
      await startBreak(type);
      const breakLabel = type === 'meal' ? 'comida' : type === 'rest' ? 'breve' : type;
      toastSuccess('Descanso iniciado', `Disfruta tu descanso de ${breakLabel}`);
    } catch (err) {
      toastError('Error al iniciar descanso', err instanceof Error ? err.message : 'Intenta de nuevo');
      console.error(err);
    }
  };

  const handleEndBreak = async () => {
    if (activeBreak) {
      try {
        await endBreak(activeBreak.id);
        toastSuccess('Descanso finalizado', 'De vuelta al trabajo');
      } catch (err) {
        toastError('Error al finalizar descanso', err instanceof Error ? err.message : 'Intenta de nuevo');
        console.error(err);
      }
    }
  };

  // Calculate progress percentage (8 hours = 100%)
  const calculateProgress = () => {
    if (!activeEntry?.clock_in) return 0;
    
    const clockInTime = new Date(activeEntry.clock_in);
    const diff = currentTime.getTime() - clockInTime.getTime();
    
    // Subtract break time
    const totalBreakMinutes = activeEntry.breaks.reduce((sum, b) => {
      if (b.duration_minutes) {
        return sum + b.duration_minutes;
      }
      if (b.break_start && !b.break_end) {
        const breakStart = new Date(b.break_start);
        const breakDiff = currentTime.getTime() - breakStart.getTime();
        return sum + Math.floor(breakDiff / 1000 / 60);
      }
      return sum;
    }, 0);
    
    const workedMs = diff - (totalBreakMinutes * 60 * 1000);
    const workedHours = workedMs / 1000 / 60 / 60;
    
    // 8 hours = 100%
    return Math.min((workedHours / 8) * 100, 100);
  };

  const progress = calculateProgress();
  const circumference = 2 * Math.PI * 120; // radio de 120
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-b">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" />
              Control de Tiempo
            </CardTitle>
            <CardDescription>Registra tus horas de trabajo</CardDescription>
          </div>
          {activeEntry && (
            <Badge 
              variant={activeBreak ? "secondary" : "default"}
              className="text-xs px-3 py-1"
            >
              <Zap className="h-3 w-3 mr-1" />
              {activeBreak ? 'En Descanso' : 'Activo'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="mt-2 h-8"
            >
              Cerrar
            </Button>
          </div>
        )}

        {/* Circular Timer Display */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-72 h-72">
            {/* SVG Circle Progress */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 280 280">
              {/* Background circle */}
              <circle
                cx="140"
                cy="140"
                r="120"
                stroke="currentColor"
                strokeWidth="16"
                fill="none"
                className="text-muted/20"
              />
              {/* Progress circle */}
              <circle
                cx="140"
                cy="140"
                r="120"
                stroke="currentColor"
                strokeWidth="16"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={cn(
                  "transition-all duration-1000 ease-out",
                  activeEntry && !activeBreak
                    ? "text-primary"
                    : activeBreak
                    ? "text-amber-500"
                    : "text-muted"
                )}
                strokeLinecap="round"
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-center space-y-2">
                <div className="text-5xl font-bold font-mono tracking-tight">
                  {elapsedTime()}
                </div>
                {activeEntry ? (
                  <>
                    <div className="text-sm text-muted-foreground font-medium">
                      Inicio: {new Date(activeEntry.clock_in).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    <div className="text-lg font-semibold text-primary">
                      {progress.toFixed(0)}% de 8h
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Listo para comenzar
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Active Break Banner */}
        {activeBreak && (
          <div className="p-5 bg-gradient-to-r from-amber-50 via-amber-100/50 to-amber-50 dark:from-amber-950/30 dark:via-amber-900/20 dark:to-amber-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Pause className="h-5 w-5 text-amber-600 dark:text-amber-400 animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                    En descanso ({activeBreak.type})
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Cronómetro pausado
                  </p>
                </div>
              </div>
              <Button
                onClick={handleEndBreak}
                disabled={isLoading}
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Square className="h-4 w-4 mr-2" />
                Terminar Descanso
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {!activeEntry ? (
            <Button
              onClick={handleClockIn}
              disabled={isLoading}
              size="lg"
              className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-primary to-primary/90"
            >
              <Play className="h-6 w-6 mr-2" />
              Iniciar Jornada
            </Button>
          ) : (
            <>
              {!activeBreak && (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleStartBreak('meal')}
                    disabled={isLoading}
                    variant="outline"
                    className="h-12 hover:bg-amber-50 hover:border-amber-300 dark:hover:bg-amber-950/20 transition-colors"
                  >
                    <Coffee className="h-4 w-4 mr-2" />
                    Descanso Comida
                  </Button>
                  <Button
                    onClick={() => handleStartBreak('rest')}
                    disabled={isLoading}
                    variant="outline"
                    className="h-12 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/20 transition-colors"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Descanso Breve
                  </Button>
                </div>
              )}
              <Button
                onClick={handleClockOut}
                disabled={isLoading || !!activeBreak}
                size="lg"
                variant="destructive"
                className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Square className="h-6 w-6 mr-2" />
                Finalizar Jornada
              </Button>
            </>
          )}
        </div>

        {/* Today's Breaks */}
        {activeEntry && activeEntry.breaks.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Descansos de Hoy
              </h3>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="space-y-2">
              {activeEntry.breaks.map((b) => (
                <div
                  key={b.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg text-sm transition-all duration-200",
                    !b.duration_minutes 
                      ? "bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800" 
                      : "bg-muted/50 hover:bg-muted border border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      !b.duration_minutes ? "bg-amber-500/10" : "bg-background"
                    )}>
                      <Coffee className={cn(
                        "h-4 w-4",
                        !b.duration_minutes ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                      )} />
                    </div>
                    <div>
                      <p className="font-medium capitalize">
                        Descanso {b.type === 'meal' ? 'de comida' : b.type === 'rest' ? 'breve' : b.type}
                      </p>
                      {b.break_start && (
                        <p className="text-xs text-muted-foreground">
                          Inicio: {new Date(b.break_start).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant={!b.duration_minutes ? "secondary" : "outline"}
                    className="font-mono"
                  >
                    {b.duration_minutes
                      ? `${b.duration_minutes} min`
                      : 'En curso...'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

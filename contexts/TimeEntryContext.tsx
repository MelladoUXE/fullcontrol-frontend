'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { TimeEntry } from '@/types/time-entry';
import { timeEntryService } from '@/lib/time-entry-service';

interface TimeEntryContextType {
  activeEntry: TimeEntry | null;
  isLoading: boolean;
  error: string | null;
  clockIn: (type?: TimeEntry['type'], notes?: string, location?: string) => Promise<void>;
  clockOut: (notes?: string) => Promise<void>;
  startBreak: (type: 'meal' | 'rest' | 'personal' | 'other', notes?: string) => Promise<void>;
  endBreak: (breakId: number, notes?: string) => Promise<void>;
  refreshActiveEntry: () => Promise<void>;
  clearError: () => void;
}

const TimeEntryContext = createContext<TimeEntryContextType | undefined>(undefined);

export function TimeEntryProvider({ children }: { children: ReactNode }) {
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshActiveEntry = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const entry = await timeEntryService.getActiveEntry();
      setActiveEntry(entry);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get active entry');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clockIn = useCallback(
    async (type: TimeEntry['type'] = 'regular', notes?: string, location?: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const entry = await timeEntryService.clockIn({ type, notes, location });
        setActiveEntry(entry);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to clock in');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clockOut = useCallback(
    async (notes?: string) => {
      if (!activeEntry) {
        throw new Error('No active time entry');
      }

      try {
        setIsLoading(true);
        setError(null);
        await timeEntryService.clockOut({
          time_entry_id: activeEntry.id,
          notes,
        });
        setActiveEntry(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to clock out');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [activeEntry]
  );

  const startBreak = useCallback(
    async (type: 'meal' | 'rest' | 'personal' | 'other', notes?: string) => {
      if (!activeEntry) {
        throw new Error('No active time entry');
      }

      try {
        setIsLoading(true);
        setError(null);
        const entry = await timeEntryService.startBreak({
          time_entry_id: activeEntry.id,
          type,
          notes,
        });
        setActiveEntry(entry);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to start break');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [activeEntry]
  );

  const endBreak = useCallback(
    async (breakId: number, notes?: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const entry = await timeEntryService.endBreak({ break_id: breakId, notes });
        setActiveEntry(entry);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to end break');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <TimeEntryContext.Provider
      value={{
        activeEntry,
        isLoading,
        error,
        clockIn,
        clockOut,
        startBreak,
        endBreak,
        refreshActiveEntry,
        clearError,
      }}
    >
      {children}
    </TimeEntryContext.Provider>
  );
}

export function useTimeEntry() {
  const context = useContext(TimeEntryContext);
  if (context === undefined) {
    throw new Error('useTimeEntry must be used within a TimeEntryProvider');
  }
  return context;
}

'use client';

import { TimeTracker } from '@/components/time-tracker';
import { TimeEntryHistory } from '@/components/time-entry-history';
import { TimeEntryStats } from '@/components/time-entry-stats';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function TimeTrackingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Control de Tiempo</h1>
        <p className="text-muted-foreground">
          Gestiona tu tiempo de trabajo y visualiza tus registros completos
        </p>
      </div>

      {/* Time Tracker Widget */}
      <TimeTracker />

      {/* Stats */}
      <TimeEntryStats />

      {/* History Table with Filters */}
      <TimeEntryHistory />
    </div>
  );
}

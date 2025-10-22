'use client';

import { ReportStats } from '@/types/report';
import { Card } from '@/components/ui/card';
import { Clock, FileText, TrendingUp, BarChart3 } from 'lucide-react';

interface ReportStatsCardsProps {
  stats: ReportStats;
}

export function ReportStatsCards({ stats }: ReportStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Registros</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total_entries}</p>
          </div>
          <FileText className="h-12 w-12 text-blue-600 opacity-20" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Horas</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.total_hours.toFixed(1)}h
            </p>
          </div>
          <Clock className="h-12 w-12 text-green-600 opacity-20" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Promedio Diario</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.average_hours_per_day.toFixed(1)}h
            </p>
          </div>
          <TrendingUp className="h-12 w-12 text-purple-600 opacity-20" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Minutos</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.total_minutes.toLocaleString()}
            </p>
          </div>
          <BarChart3 className="h-12 w-12 text-orange-600 opacity-20" />
        </div>
      </Card>
    </div>
  );
}

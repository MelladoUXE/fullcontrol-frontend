'use client';

import { ApprovalStats } from '@/types/approval';
import { Card } from '@/components/ui/card';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface ApprovalStatsCardsProps {
  stats: ApprovalStats;
  isLoading?: boolean;
}

export function ApprovalStatsCards({ stats, isLoading }: ApprovalStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pendientes</p>
            <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
          </div>
          <Clock className="h-12 w-12 text-orange-600 opacity-20" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Aprobados</p>
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <CheckCircle className="h-12 w-12 text-green-600 opacity-20" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Rechazados</p>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
          <XCircle className="h-12 w-12 text-red-600 opacity-20" />
        </div>
      </Card>
    </div>
  );
}

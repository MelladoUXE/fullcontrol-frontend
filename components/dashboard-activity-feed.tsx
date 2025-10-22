'use client';

import { Card } from '@/components/ui/card';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ActivityItem {
  id: number;
  type: 'clock_in' | 'clock_out' | 'approved' | 'rejected';
  user: string;
  time: string;
  status?: string;
}

interface DashboardActivityFeedProps {
  activities?: ActivityItem[];
  title?: string;
}

export function DashboardActivityFeed({ 
  activities = [],
  title = 'Actividad Reciente' 
}: DashboardActivityFeedProps) {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'clock_in':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'clock_out':
        return <Clock className="h-5 w-5 text-gray-600" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActivityText = (item: ActivityItem) => {
    switch (item.type) {
      case 'clock_in':
        return `${item.user} comenzó su jornada`;
      case 'clock_out':
        return `${item.user} finalizó su jornada`;
      case 'approved':
        return `Registro de ${item.user} fue aprobado`;
      case 'rejected':
        return `Registro de ${item.user} fue rechazado`;
      default:
        return item.user;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'clock_in':
        return 'border-l-blue-500';
      case 'clock_out':
        return 'border-l-gray-500';
      case 'approved':
        return 'border-l-green-500';
      case 'rejected':
        return 'border-l-red-500';
      default:
        return 'border-l-gray-500';
    }
  };

  if (activities.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p>No hay actividad reciente</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${getActivityColor(activity.type)} bg-gray-50 hover:bg-gray-100 transition-colors`}
          >
            <div className="mt-0.5">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {getActivityText(activity)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDate(activity.time)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  User,
  Calendar,
  Bell,
  Activity,
  Sparkles
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { auditService } from '@/lib/audit-service';
import type { AuditLog } from '@/types/audit';
import { CardSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

export function ActivityFeed() {
  const [activities, setActivities] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await auditService.getLogs({ days: 7, per_page: 10 });
      setActivities(data.data.slice(0, 8)); // Solo últimas 8
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return { icon: CheckCircle, color: 'text-green-600 bg-green-50 dark:bg-green-950/30' };
      case 'update':
        return { icon: Clock, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30' };
      case 'delete':
        return { icon: XCircle, color: 'text-red-600 bg-red-50 dark:bg-red-950/30' };
      case 'login':
        return { icon: User, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/30' };
      default:
        return { icon: Bell, color: 'text-gray-600 bg-gray-50 dark:bg-gray-950/30' };
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return <CardSkeleton />;
  }

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Actividad Reciente</h3>
              <p className="text-sm text-muted-foreground">Timeline del sistema</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1.5 px-3 py-1">
            <Calendar className="h-3 w-3" />
            Últimos 7 días
          </Badge>
        </div>
      </div>

      <div className="p-6">
        {activities.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No hay actividad reciente"
            description="La actividad del sistema aparecerá aquí"
          />
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[21px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent" />
            
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const { icon: Icon, color } = getActionIcon(activity.action);
                const isFirst = index === 0;
                
                return (
                  <div
                    key={activity.id}
                    className={cn(
                      "relative flex items-start gap-4 group",
                      "transition-all duration-200"
                    )}
                  >
                    {/* Timeline icon */}
                    <div className={cn(
                      "relative z-10 flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200",
                      color,
                      "group-hover:scale-110 group-hover:shadow-md",
                      isFirst && "ring-2 ring-primary/20 ring-offset-2"
                    )}>
                      <Icon className="h-5 w-5" />
                      {isFirst && (
                        <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-primary animate-pulse" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className={cn(
                      "flex-1 min-w-0 pb-4 pt-1",
                      "transition-all duration-200",
                      "group-hover:translate-x-1"
                    )}>
                      <div className={cn(
                        "p-4 rounded-xl border transition-all duration-200",
                        "bg-card hover:bg-accent/5 hover:border-accent",
                        isFirst && "border-primary/30 bg-primary/5"
                      )}>
                        <p className="text-sm font-medium leading-relaxed">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          {activity.user && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <div className="p-1 bg-muted rounded">
                                <User className="h-3 w-3" />
                              </div>
                              <span className="font-medium">{activity.user.name}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(activity.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

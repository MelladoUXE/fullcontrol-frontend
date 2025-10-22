'use client';

import { Card } from '@/components/ui/card';
import { Clock, Calendar, TrendingUp, Award } from 'lucide-react';

interface EmployeePersonalStatsProps {
  todayHours: number;
  weekHours: number;
  monthHours: number;
  averageDaily: number;
}

export function EmployeePersonalStats({
  todayHours,
  weekHours,
  monthHours,
  averageDaily,
}: EmployeePersonalStatsProps) {
  const stats = [
    {
      title: 'Horas Hoy',
      value: todayHours.toFixed(2),
      subtitle: 'Tiempo registrado',
      icon: Clock,
      gradient: 'from-blue-500 to-blue-600',
      shadowColor: 'shadow-blue-500/20',
      iconBg: 'bg-blue-500',
    },
    {
      title: 'Esta Semana',
      value: weekHours.toFixed(2),
      subtitle: 'Horas acumuladas',
      icon: Calendar,
      gradient: 'from-green-500 to-emerald-600',
      shadowColor: 'shadow-green-500/20',
      iconBg: 'bg-green-500',
    },
    {
      title: 'Este Mes',
      value: monthHours.toFixed(2),
      subtitle: 'Total mensual',
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
      shadowColor: 'shadow-purple-500/20',
      iconBg: 'bg-purple-500',
    },
    {
      title: 'Promedio Diario',
      value: averageDaily.toFixed(2),
      subtitle: 'Horas por día',
      icon: Award,
      gradient: 'from-orange-500 to-orange-600',
      shadowColor: 'shadow-orange-500/20',
      iconBg: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Mis Estadísticas
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className={`relative overflow-hidden border-0 shadow-lg ${stat.shadowColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -mr-10 -mt-10`}></div>
              
              <div className="p-3 relative">
                <div className={`p-2 rounded-lg ${stat.iconBg} shadow-md w-fit mb-2`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">{stat.title}</p>
                  <p className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-0.5`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-400">{stat.subtitle}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

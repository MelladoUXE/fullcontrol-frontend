'use client';

import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { Users } from 'lucide-react';

interface EmployeePerformanceChartProps {
  data: Array<{
    name: string;
    hours: number;
    target?: number;
  }>;
  title?: string;
}

interface TooltipPayload {
  payload: {
    name: string;
    hours: number;
    target?: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    if (!data) return null;
    
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          {data.name}
        </p>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          Horas: <span className="font-semibold">{data.hours}</span>
        </p>
        {data.target && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Meta: <span className="font-semibold">{data.target}</span>
          </p>
        )}
        <p className={`text-xs mt-1 ${data.hours >= (data.target || 0) ? 'text-green-600' : 'text-orange-600'}`}>
          {data.hours >= (data.target || 0) ? '✓ Meta alcanzada' : '⚠ Por debajo de meta'}
        </p>
      </div>
    );
  }
  return null;
};

export function EmployeePerformanceChart({ 
  data, 
  title = 'Rendimiento por Empleado' 
}: EmployeePerformanceChartProps) {
  // Colores degradados para las barras
  const getBarColor = (hours: number, index: number) => {
    const colors = [
      '#3b82f6', // blue-500
      '#8b5cf6', // violet-500
      '#ec4899', // pink-500
      '#f59e0b', // amber-500
      '#10b981', // emerald-500
      '#06b6d4', // cyan-500
    ];
    return colors[index % colors.length];
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Top {data.length} empleados
            </p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            type="number" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            width={120}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="hours" 
            radius={[0, 8, 8, 0]}
            name="Horas Trabajadas"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.hours, index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

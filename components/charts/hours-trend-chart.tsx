'use client';

import { Card } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface HoursTrendChartProps {
  data: Array<{
    date: string;
    hours: number;
    target?: number;
  }>;
  title?: string;
  showTarget?: boolean;
}

interface TooltipPayload {
  value: number;
  payload: {
    date: string;
    hours: number;
    target?: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  showTarget?: boolean;
}

const CustomTooltip = ({ active, payload, showTarget }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          {payload[0]?.payload.date}
        </p>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          Horas: <span className="font-semibold">{payload[0]?.value}</span>
        </p>
        {showTarget && payload[1] && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Meta: <span className="font-semibold">{payload[1]?.value}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function HoursTrendChart({ 
  data, 
  title = 'Tendencia de Horas',
  showTarget = true 
}: HoursTrendChartProps) {
  // Calcular tendencia
  const trend = data.length > 1 
    ? ((data[data.length - 1]?.hours || 0) - (data[0]?.hours || 0)) / (data[0]?.hours || 1) * 100
    : 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Últimos {data.length} días
          </p>
        </div>
        <div className="flex items-center gap-2">
          {trend > 0 ? (
            <TrendingUp className="h-5 w-5 text-green-600" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-600" />
          )}
          <span className={`text-sm font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            label={{ value: 'Horas', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip showTarget={showTarget} />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="hours"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorHours)"
            name="Horas Trabajadas"
          />
          {showTarget && (
            <Area
              type="monotone"
              dataKey="target"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="5 5"
              fillOpacity={0}
              name="Meta"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

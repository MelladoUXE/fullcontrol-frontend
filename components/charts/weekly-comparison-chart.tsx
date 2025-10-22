'use client';

import { Card } from '@/components/ui/card';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Calendar } from 'lucide-react';

interface WeeklyComparisonChartProps {
  data: Array<{
    day: string;
    currentWeek: number;
    lastWeek: number;
    average: number;
  }>;
  title?: string;
}

interface TooltipEntry {
  value: number;
  name: string;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          {label}
        </p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">{entry.value}</span>h
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function WeeklyComparisonChart({ 
  data, 
  title = 'Comparativa Semanal' 
}: WeeklyComparisonChartProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
          <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Semana actual vs anterior
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="day" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            label={{ value: 'Horas', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="currentWeek" 
            fill="#3b82f6" 
            name="Semana Actual"
            radius={[8, 8, 0, 0]}
          />
          <Bar 
            dataKey="lastWeek" 
            fill="#94a3b8" 
            name="Semana Anterior"
            radius={[8, 8, 0, 0]}
          />
          <Line
            type="monotone"
            dataKey="average"
            stroke="#f59e0b"
            strokeWidth={2}
            name="Promedio"
            dot={{ fill: '#f59e0b', r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
}

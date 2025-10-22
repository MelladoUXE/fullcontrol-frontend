'use client';

import { Card } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface StatusDistributionChartProps {
  data: {
    approved: number;
    pending: number;
    rejected: number;
  };
  title?: string;
}

interface TooltipPayload {
  name: string;
  value: number;
  payload: {
    color: string;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  total: number;
}

const CustomTooltip = ({ active, payload, total }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    if (!data) return null;
    
    const percentage = ((data.value / total) * 100).toFixed(1);
    
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          {data.name}
        </p>
        <p className="text-sm font-semibold" style={{ color: data.payload.color }}>
          {data.value} ({percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-sm font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function StatusDistributionChart({ 
  data, 
  title = 'Distribución de Estados' 
}: StatusDistributionChartProps) {
  const chartData = [
    { name: 'Aprobados', value: data.approved, color: '#10b981' },
    { name: 'Pendientes', value: data.pending, color: '#f59e0b' },
    { name: 'Rechazados', value: data.rejected, color: '#ef4444' },
  ];

  const total = data.approved + data.pending + data.rejected;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {title}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico */}
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={(props) => <CustomTooltip {...props} total={total} />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Estadísticas */}
        <div className="flex flex-col justify-center space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Aprobados
              </span>
            </div>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {data.approved}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Pendientes
              </span>
            </div>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
              {data.pending}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Rechazados
              </span>
            </div>
            <span className="text-lg font-bold text-red-600 dark:text-red-400">
              {data.rejected}
            </span>
          </div>

          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total
              </span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {total}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

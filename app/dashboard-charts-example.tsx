/**
 * EJEMPLO DE INTEGRACIÓN - Dashboard con Gráficos Recharts
 * 
 * Este archivo muestra cómo integrar los 4 gráficos en tu dashboard.
 * Copia y adapta según tus necesidades.
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  HoursTrendChart,
  EmployeePerformanceChart,
  StatusDistributionChart,
  WeeklyComparisonChart
} from '@/components/charts';
import {
  generateHoursTrendData,
  generateEmployeePerformanceData,
  generateStatusDistributionData,
  generateWeeklyComparisonData
} from '@/lib/mock-chart-data';
import { PageHeader } from '@/components/ui/page-header';
import { CardSkeleton } from '@/components/ui/loading-skeleton';

export default function DashboardWithChartsExample() {
  const [loading, setLoading] = useState(true);
  const [hoursTrend, setHoursTrend] = useState<Array<{
    date: string;
    hours: number;
    target?: number;
  }>>([]);
  
  const [employeePerformance, setEmployeePerformance] = useState<Array<{
    name: string;
    hours: number;
    target?: number;
  }>>([]);
  
  const [statusDistribution, setStatusDistribution] = useState({
    approved: 0,
    pending: 0,
    rejected: 0
  });
  
  const [weeklyComparison, setWeeklyComparison] = useState<Array<{
    day: string;
    currentWeek: number;
    lastWeek: number;
    average: number;
  }>>([]);

  // Simular carga de datos (reemplazar con llamadas a API reales)
  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      
      try {
        // Opción 1: Usar datos mock (para desarrollo)
        setHoursTrend(generateHoursTrendData(30));
        setEmployeePerformance(generateEmployeePerformanceData(5));
        setStatusDistribution(generateStatusDistributionData());
        setWeeklyComparison(generateWeeklyComparisonData());
        
        /* Opción 2: Llamar a tu API real (para producción)
        const [trends, employees, statuses, weekly] = await Promise.all([
          fetch('/api/charts/hours-trend').then(r => r.json()),
          fetch('/api/charts/employee-performance').then(r => r.json()),
          fetch('/api/charts/status-distribution').then(r => r.json()),
          fetch('/api/charts/weekly-comparison').then(r => r.json())
        ]);
        
        setHoursTrend(trends.data);
        setEmployeePerformance(employees.data);
        setStatusDistribution(statuses.data);
        setWeeklyComparison(weekly.data);
        */
        
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  // Memoizar datos procesados si es necesario
  const processedHoursTrend = useMemo(() => {
    return hoursTrend.slice(-30); // Últimos 30 días
  }, [hoursTrend]);

  const processedEmployeePerformance = useMemo(() => {
    return employeePerformance.slice(0, 5); // Top 5
  }, [employeePerformance]);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <PageHeader
          title="Dashboard Analítico"
          description="Visualización de métricas de rendimiento"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Dashboard Analítico"
        description="Visualización de métricas de rendimiento y asistencia"
      />

      {/* Fila 1: Tendencia de Horas y Distribución de Estados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HoursTrendChart 
          data={processedHoursTrend} 
          title="Tendencia de Horas Mensuales"
          showTarget={true}
        />
        <StatusDistributionChart 
          data={statusDistribution} 
          title="Estados de Aprobaciones"
        />
      </div>

      {/* Fila 2: Rendimiento de Empleados y Comparación Semanal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmployeePerformanceChart 
          data={processedEmployeePerformance} 
          title="Top 5 Empleados del Mes"
        />
        <WeeklyComparisonChart 
          data={weeklyComparison} 
          title="Comparativa Semanal"
        />
      </div>

      {/* Sección adicional: Un gráfico en ancho completo */}
      <div className="w-full">
        <HoursTrendChart 
          data={processedHoursTrend} 
          title="Vista Detallada - Últimos 30 Días"
          showTarget={true}
        />
      </div>
    </div>
  );
}

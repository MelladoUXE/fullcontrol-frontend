/**
 * Generador de datos mock para los componentes de gráficos
 * Útil para desarrollo y testing
 */

export const generateHoursTrendData = (days: number = 30) => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    
    data.push({
      date: currentDate.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
      }),
      hours: Math.floor(Math.random() * 40) + 140, // Entre 140 y 180 horas
      target: 176 // Meta estándar
    });
  }
  
  return data;
};

export const generateEmployeePerformanceData = (count: number = 5) => {
  const names = [
    'Juan Pérez',
    'María García',
    'Carlos López',
    'Ana Martínez',
    'Pedro Sánchez',
    'Laura Rodríguez',
    'Miguel Torres',
    'Carmen Díaz',
    'Roberto Fernández',
    'Isabel Ruiz'
  ];
  
  return names
    .slice(0, count)
    .map(name => ({
      name,
      hours: Math.floor(Math.random() * 50) + 140, // Entre 140 y 190 horas
      target: 176 // Meta estándar
    }))
    .sort((a, b) => b.hours - a.hours); // Ordenar de mayor a menor
};

export const generateStatusDistributionData = () => {
  const approved = Math.floor(Math.random() * 50) + 30; // 30-80
  const pending = Math.floor(Math.random() * 20) + 5;   // 5-25
  const rejected = Math.floor(Math.random() * 10) + 1;  // 1-11
  
  return {
    approved,
    pending,
    rejected
  };
};

export const generateWeeklyComparisonData = () => {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
  
  return days.map(day => {
    const currentWeek = Math.floor(Math.random() * 4) + 6;  // 6-10 horas
    const lastWeek = Math.floor(Math.random() * 4) + 6;     // 6-10 horas
    const average = (currentWeek + lastWeek) / 2;
    
    return {
      day,
      currentWeek,
      lastWeek,
      average: Math.round(average * 10) / 10 // Redondear a 1 decimal
    };
  });
};

// Datos de ejemplo estáticos para demostración
export const exampleHoursTrend = [
  { date: '1 Ene', hours: 160, target: 176 },
  { date: '8 Ene', hours: 168, target: 176 },
  { date: '15 Ene', hours: 172, target: 176 },
  { date: '22 Ene', hours: 175, target: 176 },
  { date: '29 Ene', hours: 180, target: 176 },
];

export const exampleEmployeePerformance = [
  { name: 'Juan Pérez', hours: 180, target: 176 },
  { name: 'María García', hours: 175, target: 176 },
  { name: 'Carlos López', hours: 168, target: 176 },
  { name: 'Ana Martínez', hours: 165, target: 176 },
  { name: 'Pedro Sánchez', hours: 160, target: 176 },
];

export const exampleStatusDistribution = {
  approved: 45,
  pending: 12,
  rejected: 3
};

export const exampleWeeklyComparison = [
  { day: 'Lun', currentWeek: 8, lastWeek: 7, average: 7.5 },
  { day: 'Mar', currentWeek: 9, lastWeek: 8, average: 8.5 },
  { day: 'Mié', currentWeek: 8, lastWeek: 9, average: 8.5 },
  { day: 'Jue', currentWeek: 7, lastWeek: 8, average: 7.5 },
  { day: 'Vie', currentWeek: 8, lastWeek: 7, average: 7.5 },
];

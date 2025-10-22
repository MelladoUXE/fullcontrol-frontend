'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, Layout } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import ShiftTemplatesTab from '@/components/shifts/shift-templates-tab';
import ShiftCalendarTab from '@/components/shifts/shift-calendar-tab';

export default function ShiftsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title="Gestión de Turnos"
        description="Crea plantillas de horarios y asígnalas a tu equipo"
        icon={CalendarIcon}
        gradient="from-indigo-600 to-blue-600"
      />

      {/* Tabs */}
      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2">
          <TabsTrigger value="templates" className="gap-2">
            <Layout className="h-4 w-4" />
            Plantillas
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <ShiftTemplatesTab />
        </TabsContent>

        <TabsContent value="calendar">
          <ShiftCalendarTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

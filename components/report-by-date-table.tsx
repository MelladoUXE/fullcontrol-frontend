'use client';

import { DateSummary } from '@/types/report';
import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ReportByDateTableProps {
  dates: DateSummary[];
}

export function ReportByDateTable({ dates }: ReportByDateTableProps) {
  if (dates.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No hay datos por fecha</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Registros
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Total Horas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Empleados
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {dates.map((dateEntry) => (
              <tr key={dateEntry.date} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(dateEntry.date)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {dateEntry.total_entries}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                  {dateEntry.total_hours.toFixed(2)} h
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {dateEntry.by_user.map((user, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {user.user_name}: {user.total_hours.toFixed(1)}h
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 border-t-2">
            <tr>
              <td className="px-6 py-4 text-sm font-bold text-gray-900">
                TOTAL
              </td>
              <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                {dates.reduce((sum, date) => sum + date.total_entries, 0)}
              </td>
              <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                {dates
                  .reduce((sum, date) => sum + date.total_hours, 0)
                  .toFixed(2)}{' '}
                h
              </td>
              <td className="px-6 py-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}

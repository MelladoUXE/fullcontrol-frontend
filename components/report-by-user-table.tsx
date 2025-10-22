'use client';

import { UserSummary } from '@/types/report';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';

interface ReportByUserTableProps {
  users: UserSummary[];
}

export function ReportByUserTable({ users }: ReportByUserTableProps) {
  if (users.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center text-gray-500">
          <User className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No hay datos de usuarios</p>
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
                Empleado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Registros
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Total Horas
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Promedio/Día
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user) => (
              <tr key={user.user_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.user_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.user_email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {user.total_entries}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                  {user.total_hours.toFixed(2)} h
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {user.total_entries > 0
                    ? (user.total_hours / user.total_entries).toFixed(2)
                    : '0.00'}{' '}
                  h
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 border-t-2">
            <tr>
              <td
                colSpan={2}
                className="px-6 py-4 text-sm font-bold text-gray-900"
              >
                TOTAL
              </td>
              <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                {users.reduce((sum, user) => sum + user.total_entries, 0)}
              </td>
              <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                {users
                  .reduce((sum, user) => sum + user.total_hours, 0)
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

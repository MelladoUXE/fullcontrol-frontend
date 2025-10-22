'use client';

import { User } from '@/types/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, UserPlus, Shield } from 'lucide-react';

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onCreate: () => void;
  onAssignRoles?: (user: User) => void;
  isLoading?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canCreate?: boolean;
  canManageRoles?: boolean;
}

export function UsersTable({ 
  users, 
  onEdit, 
  onDelete, 
  onCreate, 
  onAssignRoles,
  isLoading,
  canEdit = true,
  canDelete = true,
  canCreate = true,
  canManageRoles = false,
}: UsersTableProps) {
  const getRoleBadge = (role: User['role']) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      employee: 'bg-gray-100 text-gray-800',
    };
    
    const labels = {
      admin: 'Administrador',
      manager: 'Manager',
      employee: 'Empleado',
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colors[role]}`}>
        {labels[role]}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
        {isActive ? 'Activo' : 'Inactivo'}
      </span>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Cargando usuarios...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Empleados</CardTitle>
            <CardDescription>Gestiona los usuarios de tu empresa</CardDescription>
          </div>
          {canCreate && (
            <Button onClick={onCreate}>
              <UserPlus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay usuarios registrados. Crea el primero.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 text-sm font-medium">Nombre</th>
                  <th className="text-left p-3 text-sm font-medium">Email</th>
                  <th className="text-left p-3 text-sm font-medium">Rol</th>
                  {canManageRoles && <th className="text-left p-3 text-sm font-medium">Roles Asignados</th>}
                  <th className="text-left p-3 text-sm font-medium">Estado</th>
                  <th className="text-right p-3 text-sm font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="p-3">
                      <div className="font-medium">{user.name}</div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="p-3">
                      {getRoleBadge(user.role)}
                    </td>
                    {canManageRoles && (
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {user.roles && user.roles.length > 0 ? (
                            user.roles.map(role => (
                              <Badge key={role.id} variant="outline" className="text-xs">
                                {role.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">Sin roles</span>
                          )}
                        </div>
                      </td>
                    )}
                    <td className="p-3">
                      {getStatusBadge(user.is_active)}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        {canManageRoles && onAssignRoles && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onAssignRoles(user)}
                            title="Asignar roles"
                          >
                            <Shield className="h-4 w-4 text-purple-600" />
                          </Button>
                        )}
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(user)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

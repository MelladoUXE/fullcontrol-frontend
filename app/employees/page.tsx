'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/auth';
import { CreateUserRequest, UpdateUserRequest } from '@/types/user';
import { userService } from '@/lib/user-service';
import { UsersTable } from '@/components/users-table';
import { UserFormDialog } from '@/components/user-form-dialog';
import { AssignRolesDialog } from '@/components/assign-roles-dialog';
import { usePermission, useAnyPermission } from '@/hooks/usePermissions';
import { PageHeader } from '@/components/ui/page-header';
import { TableSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Users, Plus } from 'lucide-react';

export default function EmployeesPage() {
  const router = useRouter();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRolesDialogOpen, setIsRolesDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Permissions
  const canViewUsers = useAnyPermission(['users.view', 'users.manage']);
  const canCreateUsers = usePermission('users.create');
  const canEditUsers = usePermission('users.edit');
  const canDeleteUsers = usePermission('users.delete');
  const canManageRoles = useAnyPermission(['roles.assign_permissions', 'users.manage']);

  const loadUsers = async (user: User) => {
    try {
      setIsLoading(true);
      setError(null);

      let loadedUsers: User[];

      if (user.role === 'admin') {
        // Admin ve todos los usuarios
        loadedUsers = await userService.getAllUsers();
      } else if (user.role === 'manager' || canViewUsers) {
        // Manager o usuarios con permiso ven usuarios de su empresa
        loadedUsers = await userService.getUsersByCompany();
      } else {
        // Sin permisos
        setError('No tienes permisos para ver esta página');
        return;
      }

      setUsers(loadedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      router.push('/login');
      return;
    }

    loadUsers(currentUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, currentUser, router]);

  const handleCreate = () => {
    if (!canCreateUsers) {
      alert('No tienes permisos para crear usuarios');
      return;
    }
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    if (!canEditUsers) {
      alert('No tienes permisos para editar usuarios');
      return;
    }
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (!canDeleteUsers) {
      alert('No tienes permisos para eliminar usuarios');
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar al usuario ${user.name}?`)) {
      return;
    }

    try {
      await userService.deleteUser(user.id);
      
      // Recargar lista
      if (currentUser) {
        await loadUsers(currentUser);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar usuario');
    }
  };

  const handleAssignRoles = (user: User) => {
    if (!canManageRoles) {
      alert('No tienes permisos para asignar roles');
      return;
    }
    setSelectedUser(user);
    setIsRolesDialogOpen(true);
  };

  const handleSubmit = async (data: CreateUserRequest | UpdateUserRequest) => {
    try {
      if (selectedUser) {
        // Actualizar
        await userService.updateUser(selectedUser.id, data as UpdateUserRequest);
      } else {
        // Crear
        await userService.createUser(data as CreateUserRequest);
      }

      // Recargar lista
      if (currentUser) {
        await loadUsers(currentUser);
      }

      setIsDialogOpen(false);
    } catch (err) {
      throw err; // El formulario manejará el error
    }
  };

  if (!currentUser) {
    return null;
  }

  if (!canViewUsers && currentUser.role === 'employee') {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          No tienes permisos para acceder a esta página.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Gestión de Empleados"
        description={
          currentUser.role === 'admin'
            ? 'Administra todos los usuarios del sistema'
            : 'Administra los usuarios de tu empresa'
        }
        icon={Users}
        gradient="from-blue-500 to-cyan-500"
        action={
          canCreateUsers
            ? {
                label: 'Nuevo Empleado',
                onClick: handleCreate,
                icon: Plus,
              }
            : undefined
        }
      />

      {/* Error State */}
      {!isLoading && error && (
        <ErrorState
          message={error}
          onRetry={() => loadUsers(currentUser)}
        />
      )}

      {/* Loading State */}
      {isLoading && <TableSkeleton rows={5} />}

      {/* Empty State */}
      {!isLoading && !error && users.length === 0 && (
        <EmptyState
          icon={Users}
          title="No hay empleados"
          description={
            canCreateUsers
              ? 'Comienza agregando tu primer empleado al sistema'
              : 'Aún no hay empleados registrados en el sistema'
          }
          actionLabel={canCreateUsers ? 'Agregar Empleado' : undefined}
          onAction={canCreateUsers ? handleCreate : undefined}
        />
      )}

      {/* Data Display */}
      {!isLoading && !error && users.length > 0 && (
        <UsersTable
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
          onAssignRoles={handleAssignRoles}
          isLoading={isLoading}
          canEdit={canEditUsers}
          canDelete={canDeleteUsers}
          canCreate={canCreateUsers}
          canManageRoles={canManageRoles}
        />
      )}

      <UserFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        user={selectedUser}
        currentUserRole={currentUser.role}
        companyId={currentUser.company_id || 0}
      />

      {selectedUser && (
        <AssignRolesDialog
          open={isRolesDialogOpen}
          onOpenChange={setIsRolesDialogOpen}
          userId={selectedUser.id}
          userName={selectedUser.name}
          onSuccess={() => {
            if (currentUser) {
              loadUsers(currentUser);
            }
          }}
        />
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Role, Permission, PermissionGroup, PERMISSION_GROUPS, PermissionGroupKey } from '@/types/role';
import { roleService, permissionService } from '@/lib/role-service';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
  onSuccess: () => void;
}

export function RoleDialog({ open, onOpenChange, role, onSuccess }: RoleDialogProps) {
  const [loading, setLoading] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup>({});
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  useEffect(() => {
    if (open) {
      loadPermissions();
      if (role) {
        setName(role.name);
        setDescription(role.description || '');
        setSelectedPermissions(role.permissions?.map(p => p.id) || []);
      } else {
        setName('');
        setDescription('');
        setSelectedPermissions([]);
      }
    }
  }, [open, role]);

  const loadPermissions = async () => {
    try {
      setLoadingPermissions(true);
      const groups = await permissionService.getPermissionGroups();
      setPermissionGroups(groups);
    } catch (error) {
      toast.error('Error al cargar permisos');
      console.error(error);
    } finally {
      setLoadingPermissions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }

    try {
      setLoading(true);
      
      if (role) {
        await roleService.updateRole(role.id, {
          name: name.trim(),
          description: description.trim() || undefined,
          permissions: selectedPermissions,
        });
        toast.success('Rol actualizado exitosamente');
      } else {
        await roleService.createRole({
          name: name.trim(),
          description: description.trim() || undefined,
          permissions: selectedPermissions,
        });
        toast.success('Rol creado exitosamente');
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar el rol');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permissionId: number) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const toggleGroup = (groupPermissions: Permission[]) => {
    const groupIds = groupPermissions.map(p => p.id);
    const allSelected = groupIds.every(id => selectedPermissions.includes(id));
    
    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(id => !groupIds.includes(id)));
    } else {
      setSelectedPermissions(prev => [...new Set([...prev, ...groupIds])]);
    }
  };

  const isGroupSelected = (groupPermissions: Permission[]) => {
    const groupIds = groupPermissions.map(p => p.id);
    return groupIds.every(id => selectedPermissions.includes(id));
  };

  const isGroupPartiallySelected = (groupPermissions: Permission[]) => {
    const groupIds = groupPermissions.map(p => p.id);
    const selectedCount = groupIds.filter(id => selectedPermissions.includes(id)).length;
    return selectedCount > 0 && selectedCount < groupIds.length;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">
            {role ? 'Editar Rol' : 'Crear Nuevo Rol'}
          </DialogTitle>
          <DialogDescription>
            {role ? 'Modifica la información del rol y sus permisos' : 'Crea un nuevo rol y asigna permisos'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Supervisor de Ventas"
              maxLength={255}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del rol..."
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Permisos</Label>
            
            {loadingPermissions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-4 border rounded-lg p-4 max-h-[400px] overflow-y-auto">
                {Object.entries(permissionGroups).map(([groupKey, permissions]) => (
                  <div key={groupKey} className="space-y-2">
                    <div className="flex items-center space-x-2 pb-2 border-b">
                      <Checkbox
                        id={`group-${groupKey}`}
                        checked={isGroupSelected(permissions)}
                        onCheckedChange={() => toggleGroup(permissions)}
                        className={isGroupPartiallySelected(permissions) ? 'data-[state=checked]:bg-blue-400' : ''}
                      />
                      <Label
                        htmlFor={`group-${groupKey}`}
                        className="text-sm font-semibold text-gray-700 cursor-pointer"
                      >
                        {PERMISSION_GROUPS[groupKey as PermissionGroupKey] || groupKey}
                      </Label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`permission-${permission.id}`}
                            checked={selectedPermissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                          <Label
                            htmlFor={`permission-${permission.id}`}
                            className="text-sm cursor-pointer"
                            title={permission.description || undefined}
                          >
                            {permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || loadingPermissions}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {role ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                role ? 'Actualizar Rol' : 'Crear Rol'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

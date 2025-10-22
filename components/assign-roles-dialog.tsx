'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Role } from '@/types/role';
import { roleService, userRoleService } from '@/lib/role-service';
import { toast } from 'sonner';
import { Loader2, Shield } from 'lucide-react';

interface AssignRolesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
  userName: string;
  onSuccess?: () => void;
}

export function AssignRolesDialog({ open, onOpenChange, userId, userName, onSuccess }: AssignRolesDialogProps) {
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const loadData = async () => {
    try {
      setLoadingRoles(true);
      
      // Load available roles
      const roles = await roleService.getRoles();
      setAvailableRoles(roles);
      
      // Load user's current roles
      const userRolesResponse = await userRoleService.getUserRoles(userId);
      if (userRolesResponse.success && userRolesResponse.data) {
        setSelectedRoles(userRolesResponse.data.map(r => r.id));
      }
    } catch (error) {
      toast.error('Error al cargar roles');
      console.error(error);
    } finally {
      setLoadingRoles(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      
      await userRoleService.assignRoles(userId, { roles: selectedRoles });
      toast.success('Roles asignados exitosamente');
      
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al asignar roles');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = (roleId: number) => {
    setSelectedRoles(prev => 
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const systemRoles = availableRoles.filter(r => r.is_system);
  const customRoles = availableRoles.filter(r => !r.is_system);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600 flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span>Asignar Roles</span>
          </DialogTitle>
          <DialogDescription>
            Selecciona los roles para <strong>{userName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {loadingRoles ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* System Roles */}
              {systemRoles.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-gray-700">
                    Roles del Sistema
                  </Label>
                  <div className="space-y-2 border rounded-lg p-4 bg-gray-50">
                    {systemRoles.map((role) => (
                      <div key={role.id} className="flex items-start space-x-3 p-2 hover:bg-white rounded transition-colors">
                        <Checkbox
                          id={`role-${role.id}`}
                          checked={selectedRoles.includes(role.id)}
                          onCheckedChange={() => toggleRole(role.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-1">
                          <Label
                            htmlFor={`role-${role.id}`}
                            className="font-semibold cursor-pointer flex items-center space-x-2"
                          >
                            <span>{role.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              Sistema
                            </Badge>
                          </Label>
                          {role.description && (
                            <p className="text-sm text-gray-600">{role.description}</p>
                          )}
                          {role.permissions && (
                            <p className="text-xs text-gray-500">
                              {role.permissions.length} permisos
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Roles */}
              {customRoles.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-gray-700">
                    Roles Personalizados
                  </Label>
                  <div className="space-y-2 border rounded-lg p-4">
                    {customRoles.map((role) => (
                      <div key={role.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded transition-colors">
                        <Checkbox
                          id={`role-${role.id}`}
                          checked={selectedRoles.includes(role.id)}
                          onCheckedChange={() => toggleRole(role.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-1">
                          <Label
                            htmlFor={`role-${role.id}`}
                            className="font-semibold cursor-pointer"
                          >
                            {role.name}
                          </Label>
                          {role.description && (
                            <p className="text-sm text-gray-600">{role.description}</p>
                          )}
                          {role.permissions && (
                            <p className="text-xs text-gray-500">
                              {role.permissions.length} permisos
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {availableRoles.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay roles disponibles
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || loadingRoles}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Asignando...
                </>
              ) : (
                'Asignar Roles'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

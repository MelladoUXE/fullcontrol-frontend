'use client';

import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to check if user has a specific permission
 */
export function usePermission(permissionSlug: string): boolean {
  const { user } = useAuth();
  
  if (!user) return false;
  
  // Admins always have all permissions
  if (user.role === 'admin') return true;
  
  // Check in permissions array
  return user.permissions?.some(p => p.slug === permissionSlug) || false;
}

/**
 * Hook to check if user has any of the specified permissions
 */
export function useAnyPermission(permissionSlugs: string[]): boolean {
  const { user } = useAuth();
  
  if (!user) return false;
  
  // Admins always have all permissions
  if (user.role === 'admin') return true;
  
  // Check if has any of the permissions
  return permissionSlugs.some(slug => 
    user.permissions?.some(p => p.slug === slug)
  );
}

/**
 * Hook to check if user has all of the specified permissions
 */
export function useAllPermissions(permissionSlugs: string[]): boolean {
  const { user } = useAuth();
  
  if (!user) return false;
  
  // Admins always have all permissions
  if (user.role === 'admin') return true;
  
  // Check if has all permissions
  return permissionSlugs.every(slug => 
    user.permissions?.some(p => p.slug === slug)
  );
}

/**
 * Hook to check if user has a specific role
 */
export function useRole(roleSlug: string): boolean {
  const { user } = useAuth();
  
  if (!user) return false;
  
  // Check legacy role column
  if (user.role === roleSlug) return true;
  
  // Check in roles array
  return user.roles?.some(r => r.slug === roleSlug) || false;
}

/**
 * Hook to check if user has any of the specified roles
 */
export function useAnyRole(roleSlugs: string[]): boolean {
  const { user } = useAuth();
  
  if (!user) return false;
  
  // Check legacy role column
  if (roleSlugs.includes(user.role)) return true;
  
  // Check in roles array
  return roleSlugs.some(slug => 
    user.roles?.some(r => r.slug === slug)
  );
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin(): boolean {
  return useRole('admin');
}

/**
 * Hook to check if user is manager
 */
export function useIsManager(): boolean {
  return useAnyRole(['admin', 'manager']);
}

/**
 * Hook to check if user can manage users
 */
export function useCanManageUsers(): boolean {
  return useAnyPermission(['users.manage', 'users.create', 'users.edit']);
}

/**
 * Hook to get all user permissions as an array of slugs
 */
export function useUserPermissions(): string[] {
  const { user } = useAuth();
  return user?.permissions?.map(p => p.slug) || [];
}

/**
 * Hook to get all user roles as an array of slugs
 */
export function useUserRoles(): string[] {
  const { user } = useAuth();
  const roles: string[] = [];
  
  // Add legacy role
  if (user?.role) {
    roles.push(user.role);
  }
  
  // Add roles from roles array
  if (user?.roles) {
    roles.push(...user.roles.map(r => r.slug));
  }
  
  return [...new Set(roles)]; // Remove duplicates
}

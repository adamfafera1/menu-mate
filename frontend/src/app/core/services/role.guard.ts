import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserRole, RolePermissions } from '../models/user-roles';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  
  const userRole = authService.getUserRole();
  if (!userRole || !RolePermissions.isAdmin(userRole)) {
    router.navigate(['/browse']);
    return false;
  }
  
  return true;
};

export const restaurantOwnerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  
  const userRole = authService.getUserRole();
  if (!userRole || !RolePermissions.canAccessDashboard(userRole)) {
    router.navigate(['/browse']);
    return false;
  }
  
  return true;
};

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  
  const userRole = authService.getUserRole();
  if (!userRole || !RolePermissions.canAccessUserFeatures(userRole)) {
    router.navigate(['/dashboard/1']);
    return false;
  }
  
  return true;
};

export const browseGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isAuthenticated()) {
    return true;
  }
  
  const userRole = authService.getUserRole();
  if (userRole && !RolePermissions.canAccessBrowse(userRole)) {
    router.navigate(['/dashboard/1']);
    return false;
  }
  
  return true;
};

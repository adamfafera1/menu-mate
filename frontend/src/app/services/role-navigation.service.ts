import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserRole, RolePermissions } from '../models/user-roles';

@Injectable({
  providedIn: 'root'
})
export class RoleNavigationService {

  constructor(private authService: AuthService, private router: Router) { }

  redirectToDefaultPage(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/browse']);
      return;
    }

    const userRole = this.authService.getUserRole();
    
    switch (userRole) {
      case UserRole.ADMIN:
        this.router.navigate(['/browse']); // Admin can access everything, start with browse
        break;
      case UserRole.USER:
        this.router.navigate(['/browse']);
        break;
      case UserRole.RESTAURANT_OWNER:
        const restaurantId = this.authService.getRestaurantId();
        if (restaurantId) {
          this.router.navigate(['/dashboard', restaurantId]);
        } else {
          // Fallback: Get restaurant ID from API for existing users
          this.authService.getUserRestaurant().subscribe({
            next: (restaurant) => {
              if (restaurant && restaurant.id) {
                this.authService.setRestaurantId(restaurant.id);
                this.router.navigate(['/dashboard', restaurant.id]);
              } else {
                console.error('No restaurant found for user');
                this.router.navigate(['/browse']); // Redirect to browse if no restaurant found
              }
            },
            error: (error) => {
              console.error('Failed to get user restaurant:', error);
              this.router.navigate(['/browse']); // Redirect to browse on error
            }
          });
        }
        break;
      default:
        this.router.navigate(['/browse']);
    }
  }

  canShowBrowseNavigation(): boolean {
    const userRole = this.authService.getUserRole();
    return !userRole || RolePermissions.canAccessBrowse(userRole);
  }

  canShowDashboardNavigation(): boolean {
    const userRole = this.authService.getUserRole();
    return userRole ? RolePermissions.canAccessDashboard(userRole) : false;
  }

  canShowUserFeatures(): boolean {
    const userRole = this.authService.getUserRole();
    return userRole ? RolePermissions.canAccessUserFeatures(userRole) : false;
  }

  isCurrentUserAdmin(): boolean {
    const userRole = this.authService.getUserRole();
    return userRole ? RolePermissions.isAdmin(userRole) : false;
  }

  isCurrentUserRestaurantOwner(): boolean {
    const userRole = this.authService.getUserRole();
    return userRole ? RolePermissions.isRestaurantOwner(userRole) : false;
  }
}
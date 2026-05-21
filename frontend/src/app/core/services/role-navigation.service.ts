// Path: frontend/src/app/core/services/role-navigation.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserRole, RolePermissions } from '../models/user-roles';

@Injectable({
  providedIn: 'root'
})
// Serwis nawigacji ról odpowiedzialny za automatyczne przekierowania oraz sterowanie widocznością elementów UI na podstawie uprawnień ról użytkowników
export class RoleNavigationService {

  constructor(private authService: AuthService, private router: Router) { }

  // Przekierowanie zalogowanego użytkownika do dedykowanej dla jego roli strony startowej (np. panel właściciela restauracji lub przeglądarka menu)
  redirectToDefaultPage(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/browse']);
      return;
    }

    const userRole = this.authService.getUserRole();
    
    switch (userRole) {
      case UserRole.ADMIN:
        this.router.navigate(['/browse']);
        break;
      case UserRole.USER:
        this.router.navigate(['/browse']);
        break;
      case UserRole.RESTAURANT_OWNER:
        const restaurantId = this.authService.getRestaurantId();
        console.log('Stored restaurant ID:', restaurantId);
        if (restaurantId) {
          this.router.navigate(['/dashboard', restaurantId]);
        } else {
          console.log('No stored restaurant ID, fetching from API...');
          this.authService.getUserRestaurant().subscribe({
            next: (restaurant) => {
              console.log('Restaurant from API:', restaurant);
              if (restaurant && restaurant.id) {
                console.log('Setting restaurant ID:', restaurant.id);
                this.authService.setRestaurantId(restaurant.id);
                this.router.navigate(['/dashboard', restaurant.id]);
              } else {
                console.error('No restaurant found for user');
                this.router.navigate(['/browse']);
              }
            },
            error: (error) => {
              console.error('Failed to get user restaurant:', error);
              this.router.navigate(['/browse']);
            }
          });
        }
        break;
      default:
        this.router.navigate(['/browse']);
    }
  }

  // Weryfikacja, czy aktualny użytkownik posiada uprawnienia do wyświetlenia nawigacji wyszukiwania (Browse)
  canShowBrowseNavigation(): boolean {
    const userRole = this.authService.getUserRole();
    return !userRole || RolePermissions.canAccessBrowse(userRole);
  }

  // Weryfikacja, czy aktualny użytkownik posiada uprawnienia do wyświetlenia panelu zarządzania (Dashboard)
  canShowDashboardNavigation(): boolean {
    const userRole = this.authService.getUserRole();
    return userRole ? RolePermissions.canAccessDashboard(userRole) : false;
  }

  // Weryfikacja, czy aktualny użytkownik posiada dostęp do standardowych funkcji klenckich (np. dodawanie opinii)
  canShowUserFeatures(): boolean {
    const userRole = this.authService.getUserRole();
    return userRole ? RolePermissions.canAccessUserFeatures(userRole) : false;
  }

  // Weryfikacja, czy zalogowany użytkownik posiada rolę administratora (Admin)
  isCurrentUserAdmin(): boolean {
    const userRole = this.authService.getUserRole();
    return userRole ? RolePermissions.isAdmin(userRole) : false;
  }

  // Weryfikacja, czy zalogowany użytkownik posiada rolę właściciela restauracji (RestaurantOwner)
  isCurrentUserRestaurantOwner(): boolean {
    const userRole = this.authService.getUserRole();
    return userRole ? RolePermissions.isRestaurantOwner(userRole) : false;
  }
}

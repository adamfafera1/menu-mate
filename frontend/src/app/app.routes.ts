import { Routes } from '@angular/router';
import { authGuard } from './core/services/auth.guard';
import { restaurantOwnerGuard, userGuard, browseGuard } from './core/services/role.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'browse', pathMatch: 'full' },
    { path: 'browse', loadComponent: () => import('./features/browse/browse/browse.component').then(m => m.BrowseComponent), canActivate: [browseGuard] },
    { path: 'restaurant/:id', loadComponent: () => import('./features/browse/restaurant-page/restaurant-page.component').then(m => m.RestaurantPageComponent), canActivate: [browseGuard] },
    { path: 'review ', loadComponent: () => import('./features/browse/review/review.component').then(m => m.ReviewComponent), canActivate: [userGuard] },
    { path: 'user', loadComponent: () => import('./features/user/user-page/user-page.component').then(m => m.UserPageComponent), canActivate: [userGuard] },

    { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },

    { path: 'dashboard/:id', loadComponent: () => import('./features/dashboard/restaurant-dashboard/restaurant-dashboard.component').then(m => m.RestaurantDashboardComponent), canActivate: [restaurantOwnerGuard] },
    { path: 'dashboard/:id/edits', loadComponent: () => import('./features/dashboard/restaurant-dashboard-edits/restaurant-dashboard-edits.component').then(m => m.RestaurantDashboardEditsComponent), canActivate: [restaurantOwnerGuard] },
    { path: 'dashboard/:id/reviews', loadComponent: () => import('./features/dashboard/restaurant-dashboard-reviews/restaurant-dashboard-reviews.component').then(m => m.RestaurantDashboardReviewsComponent), canActivate: [restaurantOwnerGuard] },
    { path: 'dashboard/:id/item-edits', loadComponent: () => import('./features/dashboard/restaurant-dashboard-item-edits/restaurant-dashboard-item-edits.component').then(m => m.RestaurantDashboardItemEditsComponent), canActivate: [restaurantOwnerGuard] },
    { path: 'dashboard/:id/item-edits/:id', loadComponent: () => import('./features/dashboard/restaurant-dashboard-item-edits-check/restaurant-dashboard-item-edits-check.component').then(m => m.RestaurantDashboardItemEditsCheckComponent), canActivate: [restaurantOwnerGuard] },
    { path: 'dashboard/:id/item-reviews', loadComponent: () => import('./features/dashboard/restaurant-dashboard-item-reviews/restaurant-dashboard-item-reviews.component').then(m => m.RestaurantDashboardItemReviewsComponent), canActivate: [restaurantOwnerGuard] },
    { path: 'dashboard/:id/item-reviews/:id', loadComponent: () => import('./features/dashboard/restaurant-dashboard-item-reviews-check/restaurant-dashboard-item-reviews-check.component').then(m => m.RestaurantDashboardItemReviewsCheckComponent), canActivate: [restaurantOwnerGuard] },
    { path: 'dashboard/:id/add-item', loadComponent: () => import('./features/dashboard/restaurant-dashboard-add-item/restaurant-dashboard-add-item.component').then(m => m.RestaurantDashboardAddItemComponent), canActivate: [restaurantOwnerGuard] },

    { path: 'dashboard/:id/restaurant-self-manage', loadComponent: () => import('./features/dashboard/restaurant-dashboard-restaurant-self-manage/restaurant-dashboard-restaurant-self-manage.component').then(m => m.RestaurantDashboardRestaurantSelfManageComponent), canActivate: [restaurantOwnerGuard] },
    { path: 'dashboard/:id/items-self-manage', loadComponent: () => import('./features/dashboard/restaurant-dashboard-items-self-manage/restaurant-dashboard-items-self-manage.component').then(m => m.RestaurantDashboardItemsSelfManageComponent), canActivate: [restaurantOwnerGuard] },
    { path: 'dashboard/:id/items-self-manage/:id', loadComponent: () => import('./features/dashboard/restaurant-dashboard-items-self-manage-item/restaurant-dashboard-items-self-manage-item.component').then(m => m.RestaurantDashboardItemsSelfManageItemComponent), canActivate: [restaurantOwnerGuard] },

    { path: '**', loadComponent: () => import('./features/error/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent) }

];

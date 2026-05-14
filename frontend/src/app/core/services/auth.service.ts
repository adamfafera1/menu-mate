import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { UserRole, UserWithRole } from '../models/user-roles';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(
      `${API_CONFIG.baseUrl}/Auth/login`,
      { email, password },
    );
  }

  register(
    email: string,
    userName: string,
    password: string,
    role: string = 'User',
  ) {
    return this.http.post<{ restaurantId?: string }>(
      `${API_CONFIG.baseUrl}/Auth/register`,
      { email, userName, password, role },
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.clearRestaurantId();
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    console.log('Token set, checking role...');
    const role = this.getUserRole();
    console.log('User role from new token:', role);
  }

  setRestaurantId(restaurantId: string) {
    console.log('Setting restaurant ID in localStorage:', restaurantId);
    localStorage.setItem('restaurantId', restaurantId);
  }

  getRestaurantId(): string | null {
    const id = localStorage.getItem('restaurantId');
    console.log('Retrieved restaurant ID from localStorage:', id);
    return id;
  }

  clearRestaurantId() {
    localStorage.removeItem('restaurantId');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserById(userId: string): Observable<UserWithRole> {
    return this.http.get<UserWithRole>(
      `${API_CONFIG.baseUrl}/Users/${userId}`,
      {},
    );
  }

  getCurrentUser(): Observable<UserWithRole | null> {
    const userFromToken = this.getUserFromToken();
    if (userFromToken && userFromToken.id) {
      return this.getUserById(userFromToken.id);
    }
    throw new Error('No authenticated user found');
  }

  getUserRole(): UserRole | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const decoded: any = jwtDecode(token);
      console.log('Decoded token for role:', decoded);
      const role =
        decoded[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ] ||
        decoded['role'] ||
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'];
      return (role as UserRole) || UserRole.USER;
    } catch (error) {
      console.error('Failed to decode role from token', error);
      return null;
    }
  }

  hasRole(role: UserRole): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }

  getUserRestaurant(): Observable<any> {
    const userFromToken = this.getUserFromToken();
    console.log('User from token:', userFromToken);
    if (userFromToken && userFromToken.id) {
      console.log('Calling API with user ID:', userFromToken.id);
      return this.http.get(
        `${API_CONFIG.baseUrl}/Restaurants/owner/${userFromToken.id}`,
      );
    }
    throw new Error('No authenticated user found');
  }

  getUserFromToken() {
    const token = this.getToken();
    if (!token) {
      console.error('No token found in local storage');
      return null;
    }
    try {
      const decoded: any = jwtDecode(token);
      console.log('Decoded token:', decoded);
      return {
        id:
          decoded[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
          ] || null,
      };
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  }

  getUserDataFromToken() {
    const userFromToken = this.getUserFromToken();
    if (userFromToken && userFromToken.id) {
      this.getUserById(userFromToken.id).subscribe(
        (user) => {
          return user;
        },
        (error) => {
          console.error('Failed to fetch user data by ID', error);
        },
      );
    } else {
      console.error('Failed to decode user ID from token');
    }
  }

  uploadProfileImage(file: File): Observable<{ imgPath: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imgPath: string }>(
      `${API_CONFIG.baseUrl}/Users/upload-image`,
      formData
    );
  }
}

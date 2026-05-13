import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private apiUrl = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  getRestaurants() {
    return this.http.get<any[]>(`${this.apiUrl}/Restaurants`);
  }

  getRestaurantById(restaurantId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Restaurants/${restaurantId}`);
  }

  uploadRestaurantImage(restaurantId: string, file: File): Observable<{ imagePath: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imagePath: string }>(
      `${this.apiUrl}/Restaurants/${restaurantId}/upload-image`,
      formData
    );
  }
}

// frontend/src/app/core/services/restaurant.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
// Serwis odpowiedzialny za komunikację z interfejsem API w zakresie operacji na restauracjach
export class RestaurantService {
  private apiUrl = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) { }

  // Pobranie listy wszystkich zarejestrowanych lokali gastronomicznych
  getRestaurants() {
    return this.http.get<any[]>(`${this.apiUrl}/Restaurants`);
  }

  // Pobranie danych szczegółowych wybranej restauracji na podstawie jej identyfikatora
  getRestaurantById(restaurantId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Restaurants/${restaurantId}`);
  }

  // Przesłanie zdjęcia lokalu gastronomicznego w formacie multipart/form-data
  uploadRestaurantImage(restaurantId: string, file: File): Observable<{ imagePath: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imagePath: string }>(
      `${this.apiUrl}/Restaurants/${restaurantId}/upload-image`,
      formData
    );
  }
}

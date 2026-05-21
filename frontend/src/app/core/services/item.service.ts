// Path: frontend/src/app/core/services/item.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
// Serwis zarządzający elementami menu (daniami) i ich parametrami
export class ItemService {
  private apiUrl = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  // Pobranie listy wszystkich pozycji z menu dla konkretnej restauracji
  getItemsByRestaurantId(restaurantId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Items/Restaurant/${restaurantId}`);
  }

  // Pobranie szczegółowych parametrów wybranego produktu na podstawie jego identyfikatora
  getItemById(itemId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Items/${itemId}`);
  }
}

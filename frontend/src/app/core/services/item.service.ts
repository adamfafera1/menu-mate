import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  getItemsByRestaurantId(restaurantId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Items/Restaurant/${restaurantId}`);
  }

  getItemById(itemId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Items/${itemId}`);
  }
}

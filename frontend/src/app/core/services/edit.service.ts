import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class EditService {
  private apiUrl = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) { }

  getPendingRestaurantEdits(restaurantId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/EditRestaurants/${restaurantId}`);
  }

  getPendingRestaurantEditsCount(restaurantId: string): Observable<number> {
    return this.getPendingRestaurantEdits(restaurantId).pipe(
      map(edits => edits.length)
    );
  }

  approveRestaurantEdit(editId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/EditRestaurants/${editId}/approve`, {});
  }

  denyRestaurantEdit(editId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/EditRestaurants/${editId}`);
  }

  getPendingItemEdits(itemId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/EditItems/item/${itemId}`);
  }

  getPendingItemEditsByRestaurant(restaurantId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/EditItems/Restaurant/${restaurantId}`);
  }

  getPendingItemEditsCountByRestaurant(restaurantId: string): Observable<number> {
    return this.getPendingItemEditsByRestaurant(restaurantId).pipe(
      map(edits => edits.length)
    );
  }

  approveItemEdit(editId: string | Guid): Observable<any> {
    return this.http.put(`${this.apiUrl}/EditItems/${editId}/approve`, {});
  }

  denyItemEdit(editId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/EditItems/${editId}`);
  }
}

type Guid = string;

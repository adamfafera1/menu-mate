// Path: frontend/src/app/core/services/edit.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
// Serwis zarządzania propozycjami modyfikacji danych restauracji oraz produktów (menu)
export class EditService {
  private apiUrl = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) { }

  // Pobranie listy oczekujących propozycji modyfikacji danych konkretnej restauracji
  getPendingRestaurantEdits(restaurantId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/EditRestaurants/${restaurantId}`);
  }

  // Zliczenie oczekujących propozycji modyfikacji danych wybranej restauracji
  getPendingRestaurantEditsCount(restaurantId: string): Observable<number> {
    return this.getPendingRestaurantEdits(restaurantId).pipe(
      map(edits => edits.length)
    );
  }

  // Akceptacja i naniesienie proponowanej zmiany w danych restauracji
  approveRestaurantEdit(editId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/EditRestaurants/${editId}/approve`, {});
  }

  // Odrzucenie i usunięcie propozycji modyfikacji danych restauracji
  denyRestaurantEdit(editId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/EditRestaurants/${editId}`);
  }

  // Pobranie oczekujących propozycji edycji dla konkretnego produktu z menu
  getPendingItemEdits(itemId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/EditItems/item/${itemId}`);
  }

  // Pobranie oczekujących propozycji edycji produktów przypisanych do wybranej restauracji
  getPendingItemEditsByRestaurant(restaurantId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/EditItems/Restaurant/${restaurantId}`);
  }

  // Zliczenie oczekujących propozycji edycji dań dla danej restauracji
  getPendingItemEditsCountByRestaurant(restaurantId: string): Observable<number> {
    return this.getPendingItemEditsByRestaurant(restaurantId).pipe(
      map(edits => edits.length)
    );
  }

  // Akceptacja i naniesienie propozycji edycji produktu w menu
  approveItemEdit(editId: string | Guid): Observable<any> {
    return this.http.put(`${this.apiUrl}/EditItems/${editId}/approve`, {});
  }

  // Odrzucenie i usunięcie propozycji edycji produktu z menu
  denyItemEdit(editId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/EditItems/${editId}`);
  }
}

type Guid = string;

// Path: frontend/src/app/core/services/rating-item.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
  })
// Serwis zarządzający pobieraniem ocen i opinii przypisanych do konkretnych produktów (dań)
export class RatingItemService {
  private apiUrl = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  // Pobranie listy wszystkich ocen dań zarejestrowanych w systemie
  getReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ReviewItems`);
  }

  // Pobranie opinii wystawionych dla określonego dania (produktu) na podstawie jego ID
  getReviewsByItemId(itemId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ReviewItems/${itemId}`);
  }

  // Pobranie historii ocen produktów wystawionych przez konkretnego użytkownika
  getReviewsByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ReviewItems/user/${userId}`);
  }

  // Obliczenie średniej oceny dla wybranego dania na podstawie zebranych recenzji
  getItemRating(itemId: string): Observable<number> {
    return this.http.get<any[]>(`${this.apiUrl}/Reviews/${itemId}`).pipe(
      map((reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return total / reviews.length;
      }),
    );
  }

  // Pobranie całkowitej liczby opinii dodanych do wybranego dania
  countRestaurantReviews(itemId: string): Observable<number> {
    return this.http
      .get<any[]>(`${this.apiUrl}/ReviewItems/${itemId}`)
      .pipe(map((reviews) => reviews.length));
  }
}

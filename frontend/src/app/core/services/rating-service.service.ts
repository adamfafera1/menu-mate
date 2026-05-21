// Path: frontend/src/app/core/services/rating-service.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
// Serwis zarządzający pobieraniem ocen i opinii przypisanych do restauracji (lokali)
export class RatingServiceService {
  private apiUrl = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  // Pobranie listy wszystkich recenzji lokali dostępnych w systemie
  getAllReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Reviews`);
  }

  // Pobranie opinii wystawionych dla określonej restauracji na podstawie jej identyfikatora ID
  getReviews(restaurantId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Reviews/${restaurantId}`);
  }

  // Pobranie historii recenzji lokali opublikowanych przez określonego użytkownika
  getReviewsByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Reviews/user/${userId}`);
  }

  // Obliczenie średniej oceny dla danej restauracji na podstawie wszystkich zgromadzonych recenzji
  getRestaurantRating(restaurantId: string): Observable<number> {
    return this.http.get<any[]>(`${this.apiUrl}/Reviews/${restaurantId}`).pipe(
      map((reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return total / reviews.length;
      }),
    );
  }

  // Zliczenie całkowitej liczby opinii dodanych do wybranej restauracji
  countRestaurantReviews(restaurantId: string): Observable<number> {
    return this.http
      .get<any[]>(`${this.apiUrl}/Reviews/${restaurantId}`)
      .pipe(map((reviews) => reviews.length));
  }

  // Obliczenie sumy i liczby ocen dla kolekcji recenzji w celu dynamicznego wyznaczenia średnich (pomocnicza metoda mapująca)
  calculateAverageRatings(reviews: any[]): Map<string, { sum: number; count: number }> {
    const ratingMap = new Map<string, { sum: number; count: number }>();
    for (const review of reviews) {
      const id = review.restaurantId || review.itemId;
      if (!id) continue;
      
      if (!ratingMap.has(id)) {
        ratingMap.set(id, { sum: 0, count: 0 });
      }
      const entry = ratingMap.get(id)!;
      entry.sum += review.rating;
      entry.count += 1;
    }
    return ratingMap;
  }
}

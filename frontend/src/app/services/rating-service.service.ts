import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class RatingServiceService {
  private apiUrl = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  getAllReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Reviews`);
  }

  getReviews(restaurantId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Reviews/${restaurantId}`);
  }

  getRestaurantRating(restaurantId: string): Observable<number> {
    return this.http.get<any[]>(`${this.apiUrl}/Reviews/${restaurantId}`).pipe(
      map((reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return total / reviews.length;
      }),
    );
  }

  countRestaurantReviews(restaurantId: string): Observable<number> {
    return this.http
      .get<any[]>(`${this.apiUrl}/Reviews/${restaurantId}`)
      .pipe(map((reviews) => reviews.length));
  }


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

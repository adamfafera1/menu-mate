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
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class RatingItemService {
  private apiUrl = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  getReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ReviewItems`);
  }

  getReviewsByItemId(itemId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ReviewItems/${itemId}`);
  }

  getReviewsByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ReviewItems/user/${userId}`);
  }

  getItemRating(itemId: string): Observable<number> {
    return this.http.get<any[]>(`${this.apiUrl}/Reviews/${itemId}`).pipe(
      map((reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return total / reviews.length;
      }),
    );
  }

  countRestaurantReviews(itemId: string): Observable<number> {
    return this.http
      .get<any[]>(`${this.apiUrl}/ReviewItems/${itemId}`)
      .pipe(map((reviews) => reviews.length));
  }
}

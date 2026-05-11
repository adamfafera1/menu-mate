import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { API_CONFIG } from '../config/api.config';

@Component({
  selector: 'app-review-item',
  standalone: true,
  imports: [
    InputTextModule,
    IftaLabelModule,
    FormsModule,
    RatingModule,
    AvatarModule,
  ],
  templateUrl: './review-item.component.html',
  styleUrl: './review-item.component.css',
})
export class ReviewItemComponent implements OnChanges {
  reviews: any[] = [];
  restaurantRating: number = 0;
  @Input() urlID: string | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['urlID'] && this.urlID) {
      this.fetchReviews();
    }
  }

  private fetchReviews() {
    if (!this.urlID) {
      console.error('No item ID provided');
      return;
    }

    console.log('Fetching reviews for item:', this.urlID);

    fetch(`${API_CONFIG.baseUrl}/ReviewItems/${this.urlID}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        return response.json();
      })
      .then((data) => {
        this.reviews = data;
        this.calculateAverageRating();
        console.log('Reviews loaded:', this.reviews);
      })
      .catch((error) => {
        console.error('Error fetching reviews:', error);
      });
  }

  calculateAverageRating(): number {
    if (this.reviews.length === 0) {
      this.restaurantRating = 0;
      return 0;
    }
    const total = this.reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0,
    );
    this.restaurantRating = total / this.reviews.length;
    return this.restaurantRating;
  }
}

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { API_CONFIG } from '../../../core/config/api.config';
import { RatingItemService } from '../../../core/services/rating-item.service';

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

  constructor(private ratingItemService: RatingItemService) {}

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

    this.ratingItemService.getReviewsByItemId(this.urlID).subscribe({
      next: (data) => {
        this.reviews = data;
        this.calculateAverageRating();
        console.log('Reviews loaded:', this.reviews);
      },
      error: (error) => {
        console.error('Error fetching reviews:', error);
      }
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

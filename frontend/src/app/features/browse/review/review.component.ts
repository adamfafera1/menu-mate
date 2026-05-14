import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ActivatedRoute } from '@angular/router';
import { API_CONFIG } from '../../../core/config/api.config';
import { RatingServiceService } from '../../../core/services/rating-service.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    InputTextModule,
    IftaLabelModule,
    FormsModule,
    RatingModule,
    AvatarModule,
  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
})
export class ReviewComponent {
  reviews: any[] = [];
  restaurantRating: number = 0;
  urlID: string | null = null;

  constructor(private route: ActivatedRoute, private ratingService: RatingServiceService) {}

  ngOnInit() {
    this.urlID = this.route.snapshot.paramMap.get('id');

    if (this.urlID) {
      this.ratingService.getReviews(this.urlID).subscribe({
        next: (data) => {
          this.reviews = data;
          this.calculateAverageRating();
          console.log(this.reviews);
        },
        error: (error) => {
          console.error('Error fetching reviews:', error);
        }
      });
    }
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

  countReviews(): number {
    return 0;
  }
}

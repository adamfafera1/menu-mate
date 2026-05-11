import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ActivatedRoute } from '@angular/router';
import { API_CONFIG } from '../config/api.config';

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

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.urlID = this.route.snapshot.paramMap.get('id');

    fetch(`${API_CONFIG.baseUrl}/Reviews/${this.urlID}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch items data');
        }
        return response.json();
      })
      .then((data) => {
        this.reviews = data;
        this.calculateAverageRating();
        console.log(this.reviews);
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
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

  countReviews(): number {
    return 0;
  }
}

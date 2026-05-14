import { Component, OnInit } from '@angular/core';
import { TopSearchComponent } from '../top-search/top-search.component';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { MenuItemCardComponent } from '../menu-item-card/menu-item-card.component';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ReviewComponent } from '../review/review.component';
import { ProposeRestaurantEditComponent } from '../propose-restaurant-edit/propose-restaurant-edit.component';
import { ReviewRestaurantMakeComponent } from '../review-restaurant-make/review-restaurant-make.component';
import { API_CONFIG } from '../config/api.config';
import { RestaurantService } from '../services/restaurant.service';
import { RatingServiceService } from '../services/rating-service.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-restaurant-page',
  imports: [
    TopSearchComponent,
    ButtonModule,
    IconFieldModule,
    RatingModule,
    FormsModule,
    TableModule,
    AccordionModule,
    DialogModule,
    TextareaModule,
    MenuItemCardComponent,
    Toast,
    ReviewComponent,
    ProposeRestaurantEditComponent,
    ReviewRestaurantMakeComponent,
  ],
  templateUrl: './restaurant-page.component.html',
  styleUrl: './restaurant-page.component.css',
  providers: [MessageService],
})
export class RestaurantPageComponent implements OnInit {
  restaurants: any[] = [];
  selectedRestaurant: any;
  items: any[] = [];
  reviews: any[] = [];
  restaurantRating: number = 0;
  visibleReview: boolean = false;
  visibleAllReviews: boolean = false;
  visibleEdit: boolean = false;
  searchQuery: string = '';

  showReviewDialog() {
    this.visibleReview = true;
  }
  hideReviewDialog() {
    this.visibleReview = false;
  }

  showAllReviews() {
    this.visibleAllReviews = true;
  }
  hideAllReviews() {
    this.visibleAllReviews = false;
  }

  showEditDialog() {
    this.visibleEdit = true;
    console.log('Show edit = ', this.visibleEdit);
  }

  hideEditDialog() {
    this.visibleEdit = false;
    console.log('Show edit = ', this.visibleEdit);
  }

  onSearchQueryChange(query: string) {
    this.searchQuery = query;
  }

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private restaurantService: RestaurantService,
    private ratingService: RatingServiceService
  ) {}

  ngOnInit() {
    const urlID = this.route.snapshot.paramMap.get('id');

    if (!urlID) {
      console.error("Restaurant with this ID doesn't exist");
      return;
    }

    forkJoin({
      restaurant: this.restaurantService.getRestaurantById(urlID),
      reviews: this.ratingService.getReviews(urlID)
    }).subscribe({
      next: ({ restaurant, reviews }) => {
        this.selectedRestaurant = restaurant;
        this.reviews = reviews;
        this.updateAverageRating();
      },
      error: (error) => {
        console.error('Error fetching restaurant or reviews:', error);
      }
    });
  }

  updateAverageRating(): void {
    if (this.reviews.length === 0) {
      this.restaurantRating = 0;
    } else {
      const total = this.reviews.reduce(
        (sum, review) => sum + (review.rating || 0),
        0,
      );
      this.restaurantRating = parseFloat(
        (total / this.reviews.length).toFixed(2),
      );
    }
  }

  getImageUrl(path: string | undefined): string {
    if (!path) return 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500';
    if (path.startsWith('http')) return path;
    const serverUrl = API_CONFIG.baseUrl.replace('/api', '');
    return `${serverUrl}${path}`;
  }
}

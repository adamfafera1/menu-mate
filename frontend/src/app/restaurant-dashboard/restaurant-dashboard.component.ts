import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DrawerModule } from 'primeng/drawer';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RestaurantService } from '../services/restaurant.service';
import { RatingServiceService } from '../services/rating-service.service';
import { MediaService } from '../services/media.service';

@Component({
  selector: 'app-restaurant-dashboard',
  standalone: true,
  imports: [
    MenuModule,
    ButtonModule,
    DrawerModule,
    AvatarModule,
    SideMenuComponent,
    BadgeModule,
    CardModule,
    RouterLink,
  ],
  templateUrl: './restaurant-dashboard.component.html',
  styleUrl: './restaurant-dashboard.component.css',
})
export class RestaurantDashboardComponent {
  urlId: string | null = null;
  restaurant: any = null;
  rating: number = 0;
  reviewCount: number = 0;

  constructor(
    private restaurantSerivce: RestaurantService,
    private ratingService: RatingServiceService,
    private route: ActivatedRoute,
    public mediaService: MediaService
  ) {}

  ngOnInit() {
    this.urlId = this.route.snapshot.paramMap.get('id');
    if (this.urlId) {
      this.restaurantSerivce.getRestaurantById(this.urlId).subscribe({
        next: (restaurant) => {
          this.restaurant = restaurant;
        },
        error: (err) => {
          console.error('Failed to fetch restaurant: ', err);
          this.restaurant = null;
        },
      });

      this.ratingService.getRestaurantRating(this.urlId).subscribe({
        next: (rating) => {
          this.rating = rating;
        },
        error: (error) => {
          console.error('Failed to fetch rating: ', error);
          this.rating = 0;
        },
      });

      this.ratingService.countRestaurantReviews(this.urlId).subscribe({
        next: (reviewCount) => {
          this.reviewCount = reviewCount;
        },
        error: (err) => {
          console.error('Failed to fetch count of reivews: ', err);
          this.reviewCount = 0;
        },
      });
    }
  }

}

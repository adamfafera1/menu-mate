// frontend/src/app/features/dashboard/restaurant-dashboard/restaurant-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DrawerModule } from 'primeng/drawer';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.component';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { RatingServiceService } from '../../../core/services/rating-service.service';
import { MediaService } from '../../../core/services/media.service';
import { EditService } from '../../../core/services/edit.service';
import { CommonModule } from '@angular/common';

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
    CommonModule
  ],
  templateUrl: './restaurant-dashboard.component.html',
  styleUrl: './restaurant-dashboard.component.css',
})
export class RestaurantDashboardComponent implements OnInit {
  urlId: string | null = null;
  restaurant: any = null;
  rating: number = 0;
  reviewCount: number = 0;
  pendingRestaurantEditsCount: number = 0;
  pendingItemEditsCount: number = 0;

  constructor(
    private restaurantSerivce: RestaurantService,
    private ratingService: RatingServiceService,
    private route: ActivatedRoute,
    public mediaService: MediaService,
    private editService: EditService
  ) { }

  // Inicjalizacja komponentu - asynchroniczne pobranie danych o lokalu, ocenach i oczekujących modyfikacjach
  ngOnInit() {
    // Odczytanie identyfikatora restauracji z URL
    this.urlId = this.route.snapshot.paramMap.get('id');
    if (this.urlId) {
      // Pobranie profilu restauracji z API
      this.restaurantSerivce.getRestaurantById(this.urlId).subscribe({
        next: (restaurant) => {
          this.restaurant = restaurant;
        },
        error: (err) => {
          console.error('Failed to fetch restaurant: ', err);
          this.restaurant = null;
        },
      });

      // Pobranie średniej oceny punktowej restauracji z API
      this.ratingService.getRestaurantRating(this.urlId).subscribe({
        next: (rating) => {
          this.rating = rating;
        },
        error: (error) => {
          console.error('Failed to fetch rating: ', error);
          this.rating = 0;
        },
      });

      // Pobranie całkowitej liczby opinii o restauracji z API
      this.ratingService.countRestaurantReviews(this.urlId).subscribe({
        next: (reviewCount) => {
          this.reviewCount = reviewCount;
        },
        error: (err) => {
          console.error('Failed to fetch count of reivews: ', err);
          this.reviewCount = 0;
        },
      });

      // Pobranie z API liczby oczekujących propozycji poprawek profilu lokalu
      this.editService.getPendingRestaurantEditsCount(this.urlId).subscribe({
        next: (count) => this.pendingRestaurantEditsCount = count,
        error: (err) => console.error('Error fetching restaurant edits count', err)
      });

      // Pobranie z API liczby oczekujących propozycji edycji dań powiązanych z tym lokalem
      this.editService.getPendingItemEditsCountByRestaurant(this.urlId).subscribe({
        next: (count) => this.pendingItemEditsCount = count,
        error: (err) => console.error('Error fetching item edits count', err)
      });
    }
  }

}

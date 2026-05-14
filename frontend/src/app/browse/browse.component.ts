import { Component, OnInit } from '@angular/core';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { TopSearchComponent } from '../top-search/top-search.component';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RestaurantService } from '../services/restaurant.service';
import { RatingServiceService } from '../services/rating-service.service';
import { GeolocationService } from '../services/geolocation.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [RestaurantCardComponent, TopSearchComponent, CommonModule, ProgressSpinnerModule],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.css',
})
export class BrowseComponent implements OnInit {
  loading: boolean = true;
  restaurants: any[] = [];
  filteredRestaurants: any[] = [];

  private searchQuery: string = '';
  private selectedCuisine: string | null = null;
  private selectedLocation: { lat: number; lng: number } | null = null;
  private selectedRating: any = null;
  private readonly RADIUS_KM = 10;

  constructor(
    private restaurantService: RestaurantService,
    private ratingService: RatingServiceService,
    private geolocationService: GeolocationService
  ) {}

  ngOnInit() {
    forkJoin({
      restaurants: this.restaurantService.getRestaurants(),
      reviews: this.ratingService.getAllReviews()
    }).subscribe({
      next: ({ restaurants, reviews }) => {
        const ratingMap = this.ratingService.calculateAverageRatings(reviews);

        this.restaurants = restaurants.map((r: any) => {
          const entry = ratingMap.get(r.id);
          return {
            ...r,
            computedRating: entry ? entry.sum / entry.count : 0,
          };
        });

        this.filteredRestaurants = [...this.restaurants];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.loading = false;
      }
    });
  }



  applyFilters() {
    this.filteredRestaurants = this.restaurants.filter((r) => {
      const matchesName = r.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCuisine = !this.selectedCuisine || (r.cuisine ?? '').toLowerCase() === this.selectedCuisine.toLowerCase();
      const matchesLocation = !this.selectedLocation ||
        this.geolocationService.isWithinRadius(
          this.selectedLocation,
          { lat: r.latitude, lng: r.longitude },
          this.RADIUS_KM
        );
      const matchesRating = !this.selectedRating || (r.computedRating ?? 0) >= this.selectedRating.value;
      return matchesName && matchesCuisine && matchesLocation && matchesRating;
    });
  }

  onSearchQueryChange(query: string) {
    this.searchQuery = query;
    this.applyFilters();
  }

  onCuisineChange(cuisine: string | null) {
    this.selectedCuisine = cuisine;
    this.applyFilters();
  }

  onLocationChange(location: { lat: number; lng: number } | null) {
    this.selectedLocation = location;
    this.applyFilters();
  }

  onRatingChange(rating: any) {
    this.selectedRating = rating;
    this.applyFilters();
  }
}

import { Component, OnInit } from '@angular/core';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { TopSearchComponent } from '../top-search/top-search.component';
import { CommonModule } from '@angular/common';
import { API_CONFIG } from '../config/api.config';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [RestaurantCardComponent, TopSearchComponent, CommonModule],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.css',
})
export class BrowseComponent implements OnInit {
  visible: boolean = false;
  restaurants: any[] = [];
  filteredRestaurants: any[] = [];

  private searchQuery: string = '';
  private selectedCuisine: string | null = null;
  private selectedLocation: any = null;
  private selectedRating: any = null;

  ngOnInit() {
    Promise.all([
      fetch(`${API_CONFIG.baseUrl}/Restaurants`).then((r) => r.json()),
      fetch(`${API_CONFIG.baseUrl}/Reviews`).then((r) => r.json()),
    ])
      .then(([restaurants, reviews]) => {
        const ratingMap = new Map<string, { sum: number; count: number }>();
        for (const review of reviews) {
          const id = review.restaurantId;
          if (!ratingMap.has(id)) ratingMap.set(id, { sum: 0, count: 0 });
          const entry = ratingMap.get(id)!;
          entry.sum += review.rating;
          entry.count += 1;
        }

        this.restaurants = restaurants.map((r: any) => {
          const entry = ratingMap.get(r.id);
          return {
            ...r,
            computedRating: entry ? entry.sum / entry.count : 0,
          };
        });

        this.filteredRestaurants = [...this.restaurants];
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  applyFilters() {
    this.filteredRestaurants = this.restaurants.filter((r) => {
      const matchesName = r.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCuisine = !this.selectedCuisine || (r.cuisine ?? '').toLowerCase() === this.selectedCuisine.toLowerCase();
      const matchesLocation = !this.selectedLocation?.code || (r.location ?? '').toLowerCase().includes(this.selectedLocation.name.toLowerCase());
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

  onLocationChange(location: any) {
    this.selectedLocation = location;
    this.applyFilters();
  }

  onRatingChange(rating: any) {
    this.selectedRating = rating;
    this.applyFilters();
  }
}

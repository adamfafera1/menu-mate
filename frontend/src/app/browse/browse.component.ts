import { Component, OnInit } from '@angular/core';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { TopSearchComponent } from '../top-search/top-search.component';
import { CommonModule } from '@angular/common';
import { API_CONFIG } from '../config/api.config';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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
        this.loading = false;
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        this.loading = false;
      });
  }

  private haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  applyFilters() {
    this.filteredRestaurants = this.restaurants.filter((r) => {
      const matchesName = r.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCuisine = !this.selectedCuisine || (r.cuisine ?? '').toLowerCase() === this.selectedCuisine.toLowerCase();
      const matchesLocation = !this.selectedLocation ||
        (r.latitude != null && r.longitude != null &&
          this.haversineKm(this.selectedLocation.lat, this.selectedLocation.lng, r.latitude, r.longitude) <= this.RADIUS_KM);
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

// frontend/src/app/features/browse/browse/browse.component.ts
import { Component, OnInit } from '@angular/core';
import { RestaurantCardComponent } from '../../../shared/components/restaurant-card/restaurant-card.component';
import { TopSearchComponent } from '../../../shared/components/top-search/top-search.component';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { RatingServiceService } from '../../../core/services/rating-service.service';
import { GeolocationService } from '../../../core/services/geolocation.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [RestaurantCardComponent, TopSearchComponent, CommonModule, ProgressSpinnerModule],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.css',
})
// Komponent główny wyszukiwarki restauracji umożliwiający zaawansowane filtrowanie wyników
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
  ) { }

  // Inicjalizacja komponentu - asynchroniczne pobranie danych lokali oraz ocen, obliczenie średnich i przypisanie ich do obiektów
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

  // Zastosowanie kryteriów filtrowania (nazwa, kuchnia, odległość w promieniu 10 km oraz ocena) na liście lokali
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

  // Reakcja na zmianę frazy wyszukiwania w polu tekstowym
  onSearchQueryChange(query: string) {
    this.searchQuery = query;
    this.applyFilters();
  }

  // Reakcja na zmianę wybranego rodzaju kuchni w filtrach
  onCuisineChange(cuisine: string | null) {
    this.selectedCuisine = cuisine;
    this.applyFilters();
  }

  // Reakcja na zmianę lokalizacji użytkownika do obliczania odległości
  onLocationChange(location: { lat: number; lng: number } | null) {
    this.selectedLocation = location;
    this.applyFilters();
  }

  // Reakcja na zmianę filtru minimalnej oceny lokalu
  onRatingChange(rating: any) {
    this.selectedRating = rating;
    this.applyFilters();
  }
}

import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { MenubarModule } from 'primeng/menubar';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../services/restaurant.service';
import { debounceTime, distinctUntilChanged, filter, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { SharedModule } from 'primeng/api';
import { Rating } from 'primeng/rating';
import { AuthService } from '../services/auth.service';
import { API_CONFIG } from '../config/api.config';

@Component({
  selector: 'app-top-search',
  imports: [
    ToolbarModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    FloatLabelModule,
    BadgeModule,
    AvatarModule,
    MenubarModule,
    RouterLink,
    FormsModule,
    CommonModule,
    SelectModule,
    AutoCompleteModule,
    InputTextModule,
    SharedModule,
    Rating,
  ],
  templateUrl: './top-search.component.html',
  styleUrl: './top-search.component.css',
  providers: [RestaurantService, AuthService],
})
export class TopSearchComponent implements OnInit {
  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() locationChange = new EventEmitter<any>();
  @Output() cuisineChange = new EventEmitter<any>();
  @Output() ratingChange = new EventEmitter<any>();

  searchQuery: string = '';
  isBrowsePage: boolean = false;
  filteredRestaurants: any[] = [];
  locations: any[] = [];
  cuisines: any[] = [];
  ratings: any[] = [];
  locationQuery: string = '';
  locationSuggestions: any[] = [];
  selectedLocation: any = null;
  selectedCuisine: any = null;
  selectedRating: any = null;
  user: any = null;
  private searchSubject = new Subject<string>();

  constructor(
    private router: Router,
    private restaurantService: RestaurantService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.isBrowsePage = this.router.url === '/browse';

    // Update isBrowsePage status on every navigation end
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isBrowsePage = this.router.url === '/browse';
      });

    this.locations = [];

    this.cuisines = [
      { name: 'All Cuisines', code: null },
      { name: 'Italian', code: 'Italian' },
      { name: 'Japanese', code: 'Japanese' },
      { name: 'Chinese', code: 'Chinese' },
      { name: 'Mexican', code: 'Mexican' },
      { name: 'Indian', code: 'Indian' },
      { name: 'French', code: 'French' },
      { name: 'Thai', code: 'Thai' },
      { name: 'American', code: 'American' },
      { name: 'Mediterranean', code: 'Mediterranean' },
      { name: 'Greek', code: 'Greek' },
      { name: 'Spanish', code: 'Spanish' },
      { name: 'Korean', code: 'Korean' },
      { name: 'Vietnamese', code: 'Vietnamese' },
      { name: 'Middle Eastern', code: 'Middle Eastern' },
      { name: 'Other', code: 'Other' },
    ];

    this.ratings = [
      { name: '5 Stars', value: 5 },
      { name: '4+ Stars', value: 4 },
      { name: '3+ Stars', value: 3 },
      { name: '2+ Stars', value: 2 },
      { name: '1+ Star', value: 1 },
    ];

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        if (this.isBrowsePage) {
          this.filterRestaurants(query);
        }
        this.searchQueryChange.emit(query);
      });

    this.loadCurrentUser();
  }

  loadCurrentUser() {
    if (this.authService.isAuthenticated()) {
      const userFromToken = this.authService.getUserFromToken();
      if (userFromToken && userFromToken.id) {
        this.authService.getUserById(userFromToken.id).subscribe({
          next: (user) => {
            this.user = user;
          },
          error: (error) => {
            console.error('Failed to fetch user data', error);
          }
        });
      }
    }
  }

  onSearch() {
    this.searchSubject.next(this.searchQuery);
  }

  private formatAddress(address: any): string {
    const road = address?.road || address?.pedestrian || address?.path || address?.footway;
    const number = address?.house_number;
    const city = address?.city || address?.town || address?.village || address?.municipality || address?.county;
    const parts: string[] = [];
    if (road) parts.push(number ? `${road} ${number}` : road);
    if (city) parts.push(city);
    return parts.join(', ');
  }

  searchLocation(event: any) {
    const query = event.query?.trim();
    if (!query || query.length < 2) {
      this.locationSuggestions = [];
      return;
    }
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`;
    fetch(url, { headers: { 'Accept-Language': 'en' } })
      .then((r) => r.json())
      .then((results: any[]) => {
        const seen = new Set<string>();
        this.locationSuggestions = results
          .map((r) => ({
            label: this.formatAddress(r.address) || r.display_name,
            lat: +r.lat,
            lng: +r.lon,
          }))
          .filter((s) => {
            const key = s.label.split(',')[0].trim().toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
      })
      .catch(() => { this.locationSuggestions = []; });
  }

  onLocationSelect(event: any) {
    const place = event?.value ?? event;
    this.locationChange.emit({ lat: place.lat, lng: place.lng, label: place.label });
    if (this.isBrowsePage) {
      this.filterRestaurants(this.searchQuery);
    }
  }

  onLocationClear() {
    this.locationQuery = '';
    this.locationSuggestions = [];
    this.selectedLocation = null;
    this.locationChange.emit(null);
  }

  onLocationChange() {
    this.locationChange.emit(this.selectedLocation);
    if (this.isBrowsePage) {
      this.filterRestaurants(this.searchQuery);
    }
  }

  onRatingChange() {
    this.ratingChange.emit(this.selectedRating);
    if (this.isBrowsePage) {
      this.filterRestaurants(this.searchQuery);
    }
  }

  onCuisineChange() {
    this.cuisineChange.emit(this.selectedCuisine?.code ?? null);
    if (this.isBrowsePage) {
      this.filterRestaurants(this.searchQuery);
    }
  }

  filterRestaurants(query: string) {
    console.log('Filtering restaurants with query:', query);
    this.restaurantService.getRestaurants().subscribe((restaurants) => {
      this.filteredRestaurants = restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(query.toLowerCase()),
      );
    });
  }

  filterMenuItems() {
    console.log('Filtering menu items with query:', this.searchQuery);
  }

  getImageUrl(path: string | undefined): string {
    if (!path) return 'https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png';
    if (path.startsWith('http')) return path;
    const serverUrl = API_CONFIG.baseUrl.replace('/api', '');
    return `${serverUrl}${path}`;
  }
}

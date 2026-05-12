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
import { SharedModule } from 'primeng/api';
import { Rating } from 'primeng/rating';

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
    SharedModule,
    Rating,
  ],
  templateUrl: './top-search.component.html',
  styleUrl: './top-search.component.css',
  providers: [RestaurantService],
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
  selectedLocation: any = null;
  selectedCuisine: any = null;
  selectedRating: any = null;
  private searchSubject = new Subject<string>();

  constructor(
    private router: Router,
    private restaurantService: RestaurantService,
  ) {}

  ngOnInit() {
    this.isBrowsePage = this.router.url === '/browse';

    // Update isBrowsePage status on every navigation end
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isBrowsePage = this.router.url === '/browse';
      });

    this.locations = [
      { name: 'All Locations', code: null },
      { name: 'New York', code: 'NY' },
      { name: 'London', code: 'LDN' },
      { name: 'Paris', code: 'PRS' },
      { name: 'Tokyo', code: 'TKY' },
    ];

    this.cuisines = [
      { name: 'All Cuisines', code: null },
      { name: 'Italian', code: 'ITA' },
      { name: 'Chinese', code: 'CHN' },
      { name: 'Indian', code: 'IND' },
      { name: 'Mexican', code: 'MEX' },
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
  }

  onSearch() {
    this.searchSubject.next(this.searchQuery);
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
    this.cuisineChange.emit(this.selectedCuisine);
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
}

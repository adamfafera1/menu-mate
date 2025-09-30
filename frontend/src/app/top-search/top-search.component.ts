import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar'
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { MenubarModule } from 'primeng/menubar';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../services/restaurant.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-search',
  imports: [ToolbarModule, ButtonModule, IconFieldModule, InputIconModule, FloatLabelModule, BadgeModule, AvatarModule, MenubarModule, RouterLink, FormsModule, CommonModule],
  templateUrl: './top-search.component.html',
  styleUrl: './top-search.component.css',
  providers: [RestaurantService]
})
export class TopSearchComponent implements OnInit {
  @Output() searchQueryChange = new EventEmitter<string>();

  searchQuery: string = '';
  isBrowsePage: boolean = false;
  filteredRestaurants: any[] = [];
  private searchSubject = new Subject<string>();

  constructor(private router: Router, private restaurantService: RestaurantService) {}

  ngOnInit() {
    this.isBrowsePage = this.router.url === '/browse';

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (this.isBrowsePage) {
        this.filterRestaurants(query);
      }
      this.searchQueryChange.emit(query);
    });
  }

  onSearch() {
    this.searchSubject.next(this.searchQuery);
  }

  filterRestaurants(query: string) {
    console.log('Filtering menu items with query:', this.searchQuery);
    this.restaurantService.getRestaurants().subscribe(restaurants => {
      this.filteredRestaurants = restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(query.toLowerCase())
      );
    });
  }

  filterMenuItems() {
    console.log('Filtering menu items with query:', this.searchQuery);
  }
}

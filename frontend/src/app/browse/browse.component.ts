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
  reviews: any[] = [];
  rating: number = 0;

  ngOnInit() {
    fetch(`${API_CONFIG.baseUrl}/Restaurants`)
      .then((response) => response.json())
      .then((data) => {
        this.restaurants = data;
        this.filteredRestaurants = data;
        console.log(this.restaurants);
      })
      .catch((error) => {
        console.error('Error fetching restaurants:', error);
      });
  }

  onSearchQueryChange(query: string) {
    this.filteredRestaurants = this.restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(query.toLowerCase()),
    );
  }
}

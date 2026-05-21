// Path: frontend/src/app/features/browse/restaurant-page/restaurant-page.component.ts
import { Component, OnInit } from '@angular/core';
import { TopSearchComponent } from '../../../shared/components/top-search/top-search.component';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { MenuItemCardComponent } from '../../../shared/components/menu-item-card/menu-item-card.component';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ReviewComponent } from '../../browse/review/review.component';
import { ProposeRestaurantEditComponent } from '../propose-restaurant-edit/propose-restaurant-edit.component';
import { ReviewRestaurantMakeComponent } from '../review-restaurant-make/review-restaurant-make.component';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { RatingServiceService } from '../../../core/services/rating-service.service';
import { MediaService } from '../../../core/services/media.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-restaurant-page',
  imports: [
    TopSearchComponent,
    ButtonModule,
    IconFieldModule,
    RatingModule,
    FormsModule,
    TableModule,
    AccordionModule,
    DialogModule,
    TextareaModule,
    MenuItemCardComponent,
    Toast,
    ReviewComponent,
    ProposeRestaurantEditComponent,
    ReviewRestaurantMakeComponent,
  ],
  templateUrl: './restaurant-page.component.html',
  styleUrl: './restaurant-page.component.css',
})
// Komponent szczegółowy profilu restauracji, integrujący menu, opinie, dodawanie recenzji oraz zgłaszanie propozycji poprawek
export class RestaurantPageComponent implements OnInit {
  restaurants: any[] = [];
  selectedRestaurant: any;
  items: any[] = [];
  reviews: any[] = [];
  restaurantRating: number = 0;
  visibleReview: boolean = false;
  visibleAllReviews: boolean = false;
  visibleEdit: boolean = false;
  searchQuery: string = '';

  // Wyświetlenie okna dialogowego do dodawania opinii o restauracji
  showReviewDialog() {
    this.visibleReview = true;
  }
  // Ukrycie okna dialogowego do dodawania opinii
  hideReviewDialog() {
    this.visibleReview = false;
  }

  // Wyświetlenie listy wszystkich opinii o lokalu
  showAllReviews() {
    this.visibleAllReviews = true;
  }
  // Ukrycie listy opinii
  hideAllReviews() {
    this.visibleAllReviews = false;
  }

  // Wyświetlenie formularza zgłaszania propozycji poprawek danych lokalu
  showEditDialog() {
    this.visibleEdit = true;
    console.log('Show edit = ', this.visibleEdit);
  }

  // Ukrycie formularza poprawek
  hideEditDialog() {
    this.visibleEdit = false;
    console.log('Show edit = ', this.visibleEdit);
  }

  // Obsługa zmiany zapytania w polu wyszukiwania
  onSearchQueryChange(query: string) {
    this.searchQuery = query;
  }

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private restaurantService: RestaurantService,
    private ratingService: RatingServiceService,
    public mediaService: MediaService
  ) {}

  // Inicjalizacja komponentu - pobranie identyfikatora z trasy (URL) oraz równoległe załadowanie danych lokalu i jego opinii z API
  ngOnInit() {
    const urlID = this.route.snapshot.paramMap.get('id');

    if (!urlID) {
      console.error("Restaurant with this ID doesn't exist");
      return;
    }

    forkJoin({
      restaurant: this.restaurantService.getRestaurantById(urlID),
      reviews: this.ratingService.getReviews(urlID)
    }).subscribe({
      next: ({ restaurant, reviews }) => {
        this.selectedRestaurant = restaurant;
        this.reviews = reviews;
        this.updateAverageRating();
      },
      error: (error) => {
        console.error('Error fetching restaurant or reviews:', error);
      }
    });
  }

  // Przeliczenie średniej oceny restauracji na podstawie pobranych recenzji
  updateAverageRating(): void {
    if (this.reviews.length === 0) {
      this.restaurantRating = 0;
    } else {
      const total = this.reviews.reduce(
        (sum, review) => sum + (review.rating || 0),
        0,
      );
      this.restaurantRating = parseFloat(
        (total / this.reviews.length).toFixed(2),
      );
    }
  }
}

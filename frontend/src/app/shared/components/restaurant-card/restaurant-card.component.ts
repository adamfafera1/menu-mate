// frontend/src/app/shared/components/restaurant-card/restaurant-card.component.ts
import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { RatingServiceService } from '../../../core/services/rating-service.service';
import { MediaService } from '../../../core/services/media.service';

@Component({
  selector: 'app-restaurant-card',
  imports: [ButtonModule, CardModule, RatingModule, FormsModule],
  standalone: true,
  templateUrl: './restaurant-card.component.html',
  styleUrl: './restaurant-card.component.css'
})
// Komponent prezentujący skrócone informacje o restauracji w postaci wizytówki (karty)
export class RestaurantCardComponent {
  @Input() restaurant:any;
  @Input() rating: number = 0;

  constructor(private router: Router, private ratingService: RatingServiceService, public mediaService: MediaService) {}

  // Inicjalizacja komponentu - pobranie z serwisu średniej oceny danej restauracji
  ngOnInit(){
    if(this.restaurant?.id){
      this.ratingService.getRestaurantRating(this.restaurant.id).subscribe({
        next:(rating) => {
          this.rating = rating;
        },
        error: (error) => {
          console.error('Error fetching rating: ', error),
          this.rating = 0;
        }
      });
    }
  }

  // Przekierowanie użytkownika na dedykowaną stronę szczegółową restauracji
  goToRestaurant(): void {
    console.log("Clicked go to restaurant")
    if(this.restaurant && this.restaurant.id){
      this.router.navigate(['/restaurant', this.restaurant.id])
    }
  }
}

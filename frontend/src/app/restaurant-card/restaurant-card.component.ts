import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { RatingServiceService } from '../services/rating-service.service';
import { API_CONFIG } from '../config/api.config';

@Component({
  selector: 'app-restaurant-card',
  imports: [ButtonModule, CardModule, RatingModule, FormsModule],
  standalone: true,
  templateUrl: './restaurant-card.component.html',
  styleUrl: './restaurant-card.component.css'
})
export class RestaurantCardComponent {
  @Input() restaurant:any;
  @Input() rating: number = 0;

  constructor(private router: Router, private ratingService: RatingServiceService) {}

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
  goToRestaurant(): void {
    console.log("Clicked go to restaurant")
    if(this.restaurant && this.restaurant.id){
      this.router.navigate(['/restaurant', this.restaurant.id])
    }
  }

  getImageUrl(path: string | undefined): string {
    if (!path) return 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500';
    if (path.startsWith('http')) return path;
    const serverUrl = API_CONFIG.baseUrl.replace('/api', '');
    return `${serverUrl}${path}`;
  }
}

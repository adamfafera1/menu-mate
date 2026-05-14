import { Component } from '@angular/core';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.component';
import { ReviewComponent } from "../../browse/review/review.component";

@Component({
  selector: 'app-restaurant-dashboard-reviews',
  standalone: true,
  imports: [SideMenuComponent, ReviewComponent],
  templateUrl: './restaurant-dashboard-reviews.component.html',
  styleUrl: './restaurant-dashboard-reviews.component.css'
})
export class RestaurantDashboardReviewsComponent {

}

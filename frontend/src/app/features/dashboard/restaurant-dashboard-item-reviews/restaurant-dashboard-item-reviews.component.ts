import { Component } from '@angular/core';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.component';
import { CardModule } from 'primeng/card';
import { DashboardItemsComponentComponent } from "../dashboard-items-component/dashboard-items-component.component";

@Component({
  selector: 'app-restaurant-dashboard-item-reviews',
  standalone: true,
  imports: [SideMenuComponent, CardModule, DashboardItemsComponentComponent],
  templateUrl: './restaurant-dashboard-item-reviews.component.html',
  styleUrl: './restaurant-dashboard-item-reviews.component.css'
})
export class RestaurantDashboardItemReviewsComponent {

}

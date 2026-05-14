import { Component } from '@angular/core';
import { SideMenuComponent } from "../../../shared/components/side-menu/side-menu.component";
import { DashboardItemsComponentComponent } from "../dashboard-items-component/dashboard-items-component.component";

@Component({
  selector: 'app-restaurant-dashboard-items-self-manage',
  standalone: true,
  imports: [SideMenuComponent, DashboardItemsComponentComponent],
  templateUrl: './restaurant-dashboard-items-self-manage.component.html',
  styleUrl: './restaurant-dashboard-items-self-manage.component.css'
})
export class RestaurantDashboardItemsSelfManageComponent {

}

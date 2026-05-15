import { Component, OnInit } from '@angular/core';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.component';
import { DashboardItemsComponentComponent } from "../dashboard-items-component/dashboard-items-component.component";

@Component({
  selector: 'app-restaurant-dashboard-item-edits',
  standalone: true,
  imports: [SideMenuComponent, DashboardItemsComponentComponent],
  templateUrl: './restaurant-dashboard-item-edits.component.html',
  styleUrl: './restaurant-dashboard-item-edits.component.css'
})
export class RestaurantDashboardItemEditsComponent implements OnInit {
  
  ngOnInit(): void {
  }
}

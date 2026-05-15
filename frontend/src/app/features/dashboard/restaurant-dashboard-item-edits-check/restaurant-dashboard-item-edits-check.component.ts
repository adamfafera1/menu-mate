import { Component, OnInit } from '@angular/core';
import { DashboardItemEditsComponent } from "../dashboard-item-edits/dashboard-item-edits.component";
import { SideMenuComponent } from "../../../shared/components/side-menu/side-menu.component";
import { ActivatedRoute } from '@angular/router';
import { ItemService } from '../../../core/services/item.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-restaurant-dashboard-item-edits-check',
  standalone: true,
  imports: [CommonModule, DashboardItemEditsComponent, SideMenuComponent],
  templateUrl: './restaurant-dashboard-item-edits-check.component.html',
  styleUrl: './restaurant-dashboard-item-edits-check.component.css'
})
export class RestaurantDashboardItemEditsCheckComponent implements OnInit {

  itemName: string = '';

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.itemService.getItemById(id).subscribe({
        next: (item) => this.itemName = item.name,
        error: (err) => console.error('Error fetching item name:', err)
      });
    }
  }

}

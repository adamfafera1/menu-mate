import { Component, OnInit } from '@angular/core';
import { SideMenuComponent } from "../../../shared/components/side-menu/side-menu.component";
import { ReviewItemComponent } from "../../browse/review-item/review-item.component";
import { ActivatedRoute } from '@angular/router';
import { ItemService } from '../../../core/services/item.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-restaurant-dashboard-item-reviews-check',
  standalone: true,
  imports: [CommonModule, SideMenuComponent, ReviewItemComponent],
  templateUrl: './restaurant-dashboard-item-reviews-check.component.html',
  styleUrl: './restaurant-dashboard-item-reviews-check.component.css'
})
export class RestaurantDashboardItemReviewsCheckComponent implements OnInit {

  urlID: string | null = null;
  itemName: string = '';

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService
  ) {}

  ngOnInit() {
    this.urlID = this.route.snapshot.paramMap.get('id');
    if (this.urlID) {
      this.itemService.getItemById(this.urlID).subscribe({
        next: (item) => this.itemName = item.name,
        error: (err) => console.error('Error fetching item name:', err)
      });
    }
  }

}

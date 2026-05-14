import { Component } from '@angular/core';
import { SideMenuComponent } from "../../../shared/components/side-menu/side-menu.component";
import { ReviewComponent } from "../../browse/review/review.component";
import { ReviewItemComponent } from "../../browse/review-item/review-item.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-restaurant-dashboard-item-reviews-check',
  standalone: true,
  imports: [SideMenuComponent, ReviewItemComponent],
  templateUrl: './restaurant-dashboard-item-reviews-check.component.html',
  styleUrl: './restaurant-dashboard-item-reviews-check.component.css'
})
export class RestaurantDashboardItemReviewsCheckComponent {

  urlID : string | null = null;
  private route: ActivatedRoute;

  constructor(route : ActivatedRoute) {
    this.route = route;
  }

  ngOnInit() {
    this.urlID = this.route.snapshot.paramMap.get('id');
  }

}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantDashboardItemReviewsComponent } from './restaurant-dashboard-item-reviews.component';

describe('RestaurantDashboardItemReviewsComponent', () => {
  let component: RestaurantDashboardItemReviewsComponent;
  let fixture: ComponentFixture<RestaurantDashboardItemReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantDashboardItemReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantDashboardItemReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

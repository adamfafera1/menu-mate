import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantDashboardItemReviewsCheckComponent } from './restaurant-dashboard-item-reviews-check.component';

describe('RestaurantDashboardItemReviewsCheckComponent', () => {
  let component: RestaurantDashboardItemReviewsCheckComponent;
  let fixture: ComponentFixture<RestaurantDashboardItemReviewsCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantDashboardItemReviewsCheckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantDashboardItemReviewsCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

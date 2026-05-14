import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantDashboardReviewsComponent } from './restaurant-dashboard-reviews.component';

describe('RestaurantDashboardReviewsComponent', () => {
  let component: RestaurantDashboardReviewsComponent;
  let fixture: ComponentFixture<RestaurantDashboardReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantDashboardReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantDashboardReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

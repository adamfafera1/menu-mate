import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantDashboardRestaurantSelfManageComponent } from './restaurant-dashboard-restaurant-self-manage.component';

describe('RestaurantDashboardRestaurantSelfManageComponent', () => {
  let component: RestaurantDashboardRestaurantSelfManageComponent;
  let fixture: ComponentFixture<RestaurantDashboardRestaurantSelfManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantDashboardRestaurantSelfManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantDashboardRestaurantSelfManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantDashboardComponent } from './restaurant-dashboard.component';

describe('RestaurantDashboardComponent', () => {
  let component: RestaurantDashboardComponent;
  let fixture: ComponentFixture<RestaurantDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantDashboardAddItemComponent } from './restaurant-dashboard-add-item.component';

describe('RestaurantDashboardAddItemComponent', () => {
  let component: RestaurantDashboardAddItemComponent;
  let fixture: ComponentFixture<RestaurantDashboardAddItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantDashboardAddItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantDashboardAddItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

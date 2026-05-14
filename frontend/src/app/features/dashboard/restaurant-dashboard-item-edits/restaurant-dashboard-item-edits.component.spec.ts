import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantDashboardItemEditsComponent } from './restaurant-dashboard-item-edits.component';

describe('RestaurantDashboardItemEditsComponent', () => {
  let component: RestaurantDashboardItemEditsComponent;
  let fixture: ComponentFixture<RestaurantDashboardItemEditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantDashboardItemEditsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantDashboardItemEditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

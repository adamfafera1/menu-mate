import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantDashboardItemEditsCheckComponent } from './restaurant-dashboard-item-edits-check.component';

describe('RestaurantDashboardItemEditsCheckComponent', () => {
  let component: RestaurantDashboardItemEditsCheckComponent;
  let fixture: ComponentFixture<RestaurantDashboardItemEditsCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantDashboardItemEditsCheckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantDashboardItemEditsCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

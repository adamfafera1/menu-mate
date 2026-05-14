import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantDashboardEditsComponent } from './restaurant-dashboard-edits.component';

describe('RestaurantDashboardEditsComponent', () => {
  let component: RestaurantDashboardEditsComponent;
  let fixture: ComponentFixture<RestaurantDashboardEditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantDashboardEditsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantDashboardEditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

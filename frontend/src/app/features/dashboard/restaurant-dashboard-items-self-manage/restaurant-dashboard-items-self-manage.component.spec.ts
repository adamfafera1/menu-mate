import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantDashboardItemsSelfManageComponent } from './restaurant-dashboard-items-self-manage.component';

describe('RestaurantDashboardItemsSelfManageComponent', () => {
  let component: RestaurantDashboardItemsSelfManageComponent;
  let fixture: ComponentFixture<RestaurantDashboardItemsSelfManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantDashboardItemsSelfManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantDashboardItemsSelfManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

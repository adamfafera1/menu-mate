import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantDashboardItemsSelfManageItemComponent } from './restaurant-dashboard-items-self-manage-item.component';

describe('RestaurantDashboardItemsSelfManageItemComponent', () => {
  let component: RestaurantDashboardItemsSelfManageItemComponent;
  let fixture: ComponentFixture<RestaurantDashboardItemsSelfManageItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantDashboardItemsSelfManageItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantDashboardItemsSelfManageItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

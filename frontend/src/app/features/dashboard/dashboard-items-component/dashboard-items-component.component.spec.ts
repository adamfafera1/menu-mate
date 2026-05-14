import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardItemsComponentComponent } from './dashboard-items-component.component';

describe('DashboardItemsComponentComponent', () => {
  let component: DashboardItemsComponentComponent;
  let fixture: ComponentFixture<DashboardItemsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardItemsComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardItemsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

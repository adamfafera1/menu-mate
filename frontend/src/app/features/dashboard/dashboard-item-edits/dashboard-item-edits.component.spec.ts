import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardItemEditsComponent } from './dashboard-item-edits.component';

describe('DashboardItemEditsComponent', () => {
  let component: DashboardItemEditsComponent;
  let fixture: ComponentFixture<DashboardItemEditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardItemEditsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardItemEditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

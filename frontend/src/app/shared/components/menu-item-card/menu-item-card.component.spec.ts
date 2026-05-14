import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemCardComponent } from './menu-item-card.component';

describe('MenuItemCardComponent', () => {
  let component: MenuItemCardComponent;
  let fixture: ComponentFixture<MenuItemCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuItemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

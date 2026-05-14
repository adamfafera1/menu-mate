import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposeRestaurantEditComponent } from './propose-restaurant-edit.component';

describe('ProposeRestaurantEditComponent', () => {
  let component: ProposeRestaurantEditComponent;
  let fixture: ComponentFixture<ProposeRestaurantEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProposeRestaurantEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposeRestaurantEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

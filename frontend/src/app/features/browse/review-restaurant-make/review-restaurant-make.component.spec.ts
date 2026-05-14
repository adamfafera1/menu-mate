import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewRestaurantMakeComponent } from './review-restaurant-make.component';

describe('ReviewRestaurantMakeComponent', () => {
  let component: ReviewRestaurantMakeComponent;
  let fixture: ComponentFixture<ReviewRestaurantMakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewRestaurantMakeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewRestaurantMakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

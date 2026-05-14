import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewItemMakeComponent } from './review-item-make.component';

describe('ReviewItemMakeComponent', () => {
  let component: ReviewItemMakeComponent;
  let fixture: ComponentFixture<ReviewItemMakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewItemMakeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewItemMakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

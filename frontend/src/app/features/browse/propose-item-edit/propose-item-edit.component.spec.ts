import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposeItemEditComponent } from './propose-item-edit.component';

describe('ProposeItemEditComponent', () => {
  let component: ProposeItemEditComponent;
  let fixture: ComponentFixture<ProposeItemEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProposeItemEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposeItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

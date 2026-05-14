import { TestBed } from '@angular/core/testing';

import { RatingItemService } from '../rating-item.service';

describe('RatingItemService', () => {
  let service: RatingItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RatingItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed, inject } from '@angular/core/testing';

import { UserComparisonService } from './user-comparison.service';

describe('UserComparisonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserComparisonService]
    });
  });

  it('should be created', inject([UserComparisonService], (service: UserComparisonService) => {
    expect(service).toBeTruthy();
  }));
});

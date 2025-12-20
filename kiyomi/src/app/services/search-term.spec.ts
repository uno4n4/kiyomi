import { TestBed } from '@angular/core/testing';

import { SearchTerm } from './search-term';

describe('SearchTerm', () => {
  let service: SearchTerm;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchTerm);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { Searching } from './searching';

describe('Searching', () => {
  let service: Searching;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Searching);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

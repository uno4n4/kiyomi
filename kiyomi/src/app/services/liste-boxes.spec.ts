import { TestBed } from '@angular/core/testing';

import { ListeBoxes } from './liste-boxes';

describe('ListeBoxes', () => {
  let service: ListeBoxes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListeBoxes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

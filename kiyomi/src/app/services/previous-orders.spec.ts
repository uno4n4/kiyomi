import { TestBed } from '@angular/core/testing';

import { PreviousOrders } from './previous-orders';

describe('PreviousOrders', () => {
  let service: PreviousOrders;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreviousOrders);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

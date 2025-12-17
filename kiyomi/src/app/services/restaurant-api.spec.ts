import { TestBed } from '@angular/core/testing';

import { RestaurantApi } from './restaurant-api';

describe('RestaurantApi', () => {
  let service: RestaurantApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurantApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

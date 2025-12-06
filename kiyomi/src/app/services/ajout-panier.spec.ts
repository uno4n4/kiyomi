import { TestBed } from '@angular/core/testing';

import { AjoutPanier } from './ajout-panier';

describe('AjoutPanier', () => {
  let service: AjoutPanier;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AjoutPanier);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

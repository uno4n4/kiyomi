import { TestBed } from '@angular/core/testing';

import { AjoutNews } from './ajout-news';

describe('AjoutNews', () => {
  let service: AjoutNews;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AjoutNews);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

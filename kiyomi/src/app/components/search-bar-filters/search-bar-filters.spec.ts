import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarFilters } from './search-bar-filters';

describe('SearchBarFilters', () => {
  let component: SearchBarFilters;
  let fixture: ComponentFixture<SearchBarFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarFilters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBarFilters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Filtres } from './filtres';

describe('Filtres', () => {
  let component: Filtres;
  let fixture: ComponentFixture<Filtres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Filtres]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Filtres);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

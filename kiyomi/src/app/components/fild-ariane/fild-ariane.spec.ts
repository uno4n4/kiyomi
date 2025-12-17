import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FildAriane } from './fild-ariane';

describe('FildAriane', () => {
  let component: FildAriane;
  let fixture: ComponentFixture<FildAriane>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FildAriane]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FildAriane);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

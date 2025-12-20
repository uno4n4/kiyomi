import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mentionslegales } from './mentionslegales';

describe('Mentionslegales', () => {
  let component: Mentionslegales;
  let fixture: ComponentFixture<Mentionslegales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mentionslegales]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mentionslegales);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

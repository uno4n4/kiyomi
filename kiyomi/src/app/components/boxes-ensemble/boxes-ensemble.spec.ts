import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxesEnsemble } from './boxes-ensemble';

describe('BoxesEnsemble', () => {
  let component: BoxesEnsemble;
  let fixture: ComponentFixture<BoxesEnsemble>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxesEnsemble]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxesEnsemble);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

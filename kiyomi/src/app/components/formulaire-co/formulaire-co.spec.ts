import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireCo } from './formulaire-co';

describe('FormulaireCo', () => {
  let component: FormulaireCo;
  let fixture: ComponentFixture<FormulaireCo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulaireCo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaireCo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteUser } from './compte-user';

describe('CompteUser', () => {
  let component: CompteUser;
  let fixture: ComponentFixture<CompteUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompteUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompteUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

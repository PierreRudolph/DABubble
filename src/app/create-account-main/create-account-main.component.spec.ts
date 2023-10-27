import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountMainComponent } from './create-account-main.component';

describe('CreateAccountMainComponent', () => {
  let component: CreateAccountMainComponent;
  let fixture: ComponentFixture<CreateAccountMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAccountMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccountMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

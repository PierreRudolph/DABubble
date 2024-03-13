import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountMainComponent } from './create-account-main.component';
import { FormsModule } from '@angular/forms';
import { CreateAccountComponent } from '../create-account/create-account.component';

describe('CreateAccountMainComponent', () => {
  let component: CreateAccountMainComponent;
  let fixture: ComponentFixture<CreateAccountMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CreateAccountMainComponent, CreateAccountComponent]
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
